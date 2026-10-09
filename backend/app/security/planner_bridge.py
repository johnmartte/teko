import hmac

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.services import mailbox_service


def get_planner_mailbox(
    x_service_key: str | None = Header(default=None),
    x_planner_user_id: str | None = Header(default=None),
    db: Session = Depends(get_db),
):
    """Solo el servidor del Planner conoce la clave; el usuario lo identifica su sesión."""
    if not settings.PLANNER_BRIDGE_KEY:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Falta configurar PLANNER_BRIDGE_KEY en el servidor")
    if not x_service_key or not hmac.compare_digest(x_service_key, settings.PLANNER_BRIDGE_KEY):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Clave de servicio inválida")
    if not x_planner_user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Falta el usuario del Planner")
    return mailbox_service.own_mailbox(db, x_planner_user_id)
