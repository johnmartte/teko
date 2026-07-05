from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.faq import FAQRead
from app.services import faq_service

router = APIRouter(
    prefix="/faqs",
    tags=["FAQs"],
)


@router.get("", response_model=list[FAQRead])
def get_faqs(
    db: Session = Depends(get_db),
):
    return faq_service.get_active_faqs(db)