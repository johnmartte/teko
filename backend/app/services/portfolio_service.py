from sqlalchemy.orm import Session

from app.repositories import portfolio_repository


def get_active_categories(db: Session):
    return portfolio_repository.get_active_categories(db)


def get_active_projects(db: Session):
    return portfolio_repository.get_active_projects(db)