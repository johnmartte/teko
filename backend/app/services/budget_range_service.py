from sqlalchemy.orm import Session

from app.repositories import budget_range_repository


def get_active_budget_ranges(db: Session):
    return budget_range_repository.get_active_budget_ranges(db)