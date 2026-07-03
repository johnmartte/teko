from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.auth import TokenResponse
from app.services import auth_service
from app.schemas.admin_user import AdminUserRead
from app.security.dependencies import get_current_admin

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    token = auth_service.login(
        db=db,
        email=form_data.username,
        password=form_data.password,
    )

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