from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.contact_request import ContactRequestCreate, ContactRequestRead
from app.services import contact_request_service

router = APIRouter(prefix="/contact-requests", tags=["Contact Requests"])


@router.post(
    "",
    response_model=ContactRequestRead,
    status_code=status.HTTP_201_CREATED,
)
def create_contact_request(
    contact_in: ContactRequestCreate,
    db: Session = Depends(get_db),
):
    return contact_request_service.create_contact_request(
        db=db,
        contact_in=contact_in,
    )