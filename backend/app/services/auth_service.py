from sqlalchemy.orm import Session

from app.repositories import admin_user_repository
from app.security.hashing import verify_password
from app.security.jwt import create_access_token


def login(db: Session, email: str, password: str):
    admin = admin_user_repository.get_by_email(db, email)

    if not admin:
        return None

    if not admin.is_active:
        return None

    if not verify_password(password, admin.password_hash):
        return None

    return create_access_token(subject=admin.email)
