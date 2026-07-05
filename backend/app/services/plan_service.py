from sqlalchemy.orm import Session

from app.repositories import plan_repository


def get_active_plans(db: Session):
    return plan_repository.get_active_plans(db)