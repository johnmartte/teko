import json
import logging
from datetime import datetime, timedelta, timezone
from urllib.parse import urlparse

from fastapi import APIRouter, Depends, HTTPException, Request, status
from jose import JWTError, jwt
from pydantic import BaseModel
from sqlalchemy.orm import Session
from webauthn import (
    generate_authentication_options,
    generate_registration_options,
    options_to_json,
    verify_authentication_response,
    verify_registration_response,
)
from webauthn.helpers import base64url_to_bytes, bytes_to_base64url
from webauthn.helpers.structs import (
    AuthenticatorSelectionCriteria,
    PublicKeyCredentialDescriptor,
    ResidentKeyRequirement,
    UserVerificationRequirement,
)

from app.core.config import settings
from app.db.session import get_db
from app.models.admin_passkey import AdminPasskey
from app.models.admin_user import AdminUser
from app.schemas.auth import TokenResponse
from app.security.dependencies import get_current_admin
from app.security.jwt import ALGORITHM
from app.services import auth_service, planner_client

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["Passkeys"])

CHALLENGE_TTL = timedelta(minutes=5)


class RegisterBody(BaseModel):
    token: str
    name: str
    credential: dict


class LoginBody(BaseModel):
    token: str
    credential: dict
    remember: bool = False


def _origin(request: Request) -> tuple[str, str]:
    """(origin, rp_id): el RP ID es el dominio del FRONTEND, y solo se acepta si está en CORS."""
    origin = (request.headers.get("origin") or "").rstrip("/")
    host = urlparse(origin).hostname
    if not host or origin not in settings.BACKEND_CORS_ORIGINS:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Origen no permitido")
    return origin, host


def _sign(challenge: bytes, purpose: str, admin_id: int | None = None) -> str:
    payload = {"ch": bytes_to_base64url(challenge), "pur": purpose, "exp": datetime.now(timezone.utc) + CHALLENGE_TTL}
    if admin_id is not None:
        payload["adm"] = admin_id
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=ALGORITHM)


def _challenge(token: str, purpose: str, admin_id: int | None = None) -> bytes:
    # shortcut: el reto va firmado en un JWT de 5 min (sin tabla de retos); el contador del passkey frena clones.
    try:
        data = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "El reto expiró. Inténtalo de nuevo.")
    if data.get("pur") != purpose or data.get("adm") != admin_id:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Reto inválido.")
    return base64url_to_bytes(data["ch"])


def _present(p: AdminPasskey) -> dict:
    return {"id": p.id, "name": p.name, "last_used_at": p.last_used_at, "created_at": p.created_at}


@router.post("/passkeys/options")
def registration_options(request: Request, admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    _, rp_id = _origin(request)
    existing = db.query(AdminPasskey).filter(AdminPasskey.admin_user_id == admin.id).all()
    options = generate_registration_options(
        rp_id=rp_id,
        rp_name="TEKO CMS",
        user_id=str(admin.id).encode(),
        user_name=admin.email,
        user_display_name=admin.full_name,
        authenticator_selection=AuthenticatorSelectionCriteria(
            resident_key=ResidentKeyRequirement.REQUIRED,
            user_verification=UserVerificationRequirement.PREFERRED,
        ),
        exclude_credentials=[PublicKeyCredentialDescriptor(id=base64url_to_bytes(p.credential_id)) for p in existing],
    )
    return {"token": _sign(options.challenge, "reg", admin.id), "options": json.loads(options_to_json(options))}


@router.post("/passkeys", status_code=status.HTTP_201_CREATED)
def register(body: RegisterBody, request: Request, admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    origin, rp_id = _origin(request)
    try:
        verified = verify_registration_response(
            credential=body.credential,
            expected_challenge=_challenge(body.token, "reg", admin.id),
            expected_rp_id=rp_id,
            expected_origin=origin,
        )
    except HTTPException:
        raise
    except Exception as error:
        logger.warning("Passkey registration failed: %s", error)
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "No se pudo registrar el passkey.")
    passkey = AdminPasskey(
        admin_user_id=admin.id,
        name=body.name.strip()[:80] or "Dispositivo",
        credential_id=bytes_to_base64url(verified.credential_id),
        public_key=bytes_to_base64url(verified.credential_public_key),
        sign_count=verified.sign_count,
    )
    db.add(passkey)
    db.commit()
    db.refresh(passkey)
    return _present(passkey)


@router.get("/passkeys")
def list_passkeys(admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    rows = db.query(AdminPasskey).filter(AdminPasskey.admin_user_id == admin.id).order_by(AdminPasskey.id.desc()).all()
    return [_present(p) for p in rows]


@router.delete("/passkeys/{passkey_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_passkey(passkey_id: int, admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    row = db.query(AdminPasskey).filter(AdminPasskey.id == passkey_id, AdminPasskey.admin_user_id == admin.id).first()
    if not row:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Passkey no encontrado")
    db.delete(row)
    db.commit()


@router.post("/passkey/login-options")
def login_options(request: Request):
    _, rp_id = _origin(request)
    options = generate_authentication_options(rp_id=rp_id, user_verification=UserVerificationRequirement.PREFERRED)  # descubribles
    return {"token": _sign(options.challenge, "login"), "options": json.loads(options_to_json(options))}


@router.post("/passkey/login", response_model=TokenResponse)
def login(body: LoginBody, request: Request, db: Session = Depends(get_db)):
    origin, rp_id = _origin(request)
    invalid = HTTPException(status.HTTP_401_UNAUTHORIZED, "No se pudo iniciar sesión con el passkey.")
    challenge = _challenge(body.token, "login")
    passkey = db.query(AdminPasskey).filter(AdminPasskey.credential_id == str(body.credential.get("id", ""))).first()
    if not passkey:
        raise invalid
    try:
        verified = verify_authentication_response(
            credential=body.credential,
            expected_challenge=challenge,
            expected_rp_id=rp_id,
            expected_origin=origin,
            credential_public_key=base64url_to_bytes(passkey.public_key),
            credential_current_sign_count=passkey.sign_count,
        )
    except Exception as error:
        logger.warning("Passkey login failed: %s", error)
        raise invalid

    admin = db.get(AdminUser, passkey.admin_user_id)
    if not admin or not admin.is_active:
        raise invalid
    # Un passkey no salta el control de acceso: el Planner decide si la cuenta sigue habilitada.
    if planner_client.enabled():
        try:
            allowed = planner_client.has_cms_access(admin.email)
        except planner_client.PlannerError:
            raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "No fue posible verificar tu cuenta con TEKO Planner")
        if not allowed:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Tu cuenta no tiene acceso al CMS")

    passkey.sign_count = verified.new_sign_count
    passkey.last_used_at = datetime.now(timezone.utc)
    db.commit()
    return TokenResponse(access_token=auth_service.issue_token(admin, body.remember))
