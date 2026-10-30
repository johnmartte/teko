from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.auth import TokenResponse
from app.services.planner_client import PlannerError
from app.services import auth_service
from app.schemas.admin_user import AdminUserRead
from app.security.dependencies import get_current_admin

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    remember: bool = False,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    try:
        token = auth_service.login(
            db=db,
            email=form_data.username,
            password=form_data.password,
            remember=remember,
        )
    except auth_service.AccessDenied:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Tu cuenta no tiene acceso al CMS")
    except PlannerError:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="No fue posible verificar tu cuenta con TEKO Planner")

    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas",
        )

    return TokenResponse(
        access_token=token,
    )
    
@router.get("/me", response_model=AdminUserRead)
def get_me(current_admin = Depends(get_current_admin)):
    return current_admin    