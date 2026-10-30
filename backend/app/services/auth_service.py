import secrets

from sqlalchemy.orm import Session

from app.models.admin_user import AdminUser
from app.repositories import admin_user_repository
from app.security.hashing import hash_password, verify_password
from app.security.jwt import create_access_token
from app.services import planner_client

# "Mantener sesión iniciada": el token dura 30 días en vez de ACCESS_TOKEN_EXPIRE_MINUTES.
REMEMBER_MINUTES = 60 * 24 * 30


class AccessDenied(Exception):
    """La cuenta existe pero no tiene acceso al CMS."""


def issue_token(admin: AdminUser, remember: bool = False) -> str:
    return create_access_token(subject=admin.email, minutes=REMEMBER_MINUTES if remember else None)


def login(db: Session, email: str, password: str, remember: bool = False):
    if planner_client.enabled():
        return _login_via_planner(db, email, password, remember)

    admin = admin_user_repository.get_by_email(db, email)

    if not admin:
        return None

    if not admin.is_active:
        return None

    if not verify_password(password, admin.password_hash):
        return None

    return issue_token(admin, remember)


def _login_via_planner(db: Session, email: str, password: str, remember: bool):
    result, remote = planner_client.verify_login(email, password)
    if result == "forbidden":
        raise AccessDenied()
    if result != "ok":
        return None

    admin = admin_user_repository.get_by_email(db, remote["email"])
    if not admin:
        # La contraseña real vive en el Planner; la local es aleatoria para que no sea un acceso alterno.
        admin = AdminUser(email=remote["email"], full_name=remote["name"], password_hash=hash_password(secrets.token_urlsafe(32)), role="admin", is_active=True)
        db.add(admin)
        db.commit()
        db.refresh(admin)
    elif not admin.is_active:
        return None

    return issue_token(admin, remember)
