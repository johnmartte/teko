from sqlalchemy.orm import Session

from app.repositories import service_repository


def get_active_services(db: Session):
    return service_repository.get_active_services(db)