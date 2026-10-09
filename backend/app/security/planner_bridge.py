import hmac
from dataclasses import dataclass
from urllib.parse import unquote

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.services import mailbox_service


@dataclass(frozen=True)
class PlannerIdentity:
    user_id: str
    name: str
    email: str
    role: str


def get_planner_identity(
    x_service_key: str | None = Header(default=None),
    x_planner_user_id: str | None = Header(default=None),
    x_planner_user_name: str | None = Header(default=None),
    x_planner_user_email: str | None = Header(default=None),
    x_planner_user_role: str | None = Header(default=None),
) -> PlannerIdentity:
    """Solo el servidor del Planner conoce la clave; el usuario lo identifica su sesión."""
    if not settings.PLANNER_BRIDGE_KEY:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Falta configurar PLANNER_BRIDGE_KEY en el servidor")
    if not x_service_key or not hmac.compare_digest(x_service_key, settings.PLANNER_BRIDGE_KEY):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Clave de servicio inválida")
    if not x_planner_user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Falta el usuario del Planner")
    # El Planner manda nombre y correo codificados para que viajen acentos en la cabecera.
    return PlannerIdentity(
        user_id=x_planner_user_id,
        name=unquote(x_planner_user_name or "").strip(),
        email=unquote(x_planner_user_email or "").strip(),
        role=(x_planner_user_role or "").strip().lower(),
    )


def get_planner_mailbox(identity: PlannerIdentity = Depends(get_planner_identity), db: Session = Depends(get_db)):
    return mailbox_service.own_mailbox(db, identity.user_id)
