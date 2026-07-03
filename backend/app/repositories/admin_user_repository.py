from sqlalchemy.orm import Session

from app.models.admin_user import AdminUser


def get_by_email(db: Session, email: str):
    return (
        db.query(AdminUser)
        .filter(AdminUser.email == email)
        .first()
    )