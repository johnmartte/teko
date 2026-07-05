from sqlalchemy.orm import Session

from app.repositories import faq_repository


def get_active_faqs(db: Session):
    return faq_repository.get_active_faqs(db)