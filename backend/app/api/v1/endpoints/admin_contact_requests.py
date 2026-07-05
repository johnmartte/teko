from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.admin_contact_request import AdminContactRequestListItem
from app.security.dependencies import get_current_admin
from app.services import contact_request_service

from app.schemas.admin_contact_request import (
    AdminContactRequestListItem,
    ContactRequestStatusUpdate,
)
from app.schemas.contact_request import ContactRequestRead

router = APIRouter(
    prefix="/admin/contact-requests",
    tags=["Admin - Contact Requests"],
)


@router.get("", response_model=list[AdminContactRequestListItem])
def list_contact_requests(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return contact_request_service.get_contact_requests_for_admin(db)

@router.patch("/{contact_request_id}/status", response_model=ContactRequestRead)
def update_contact_request_status(
    contact_request_id: int,
    status_in: ContactRequestStatusUpdate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return contact_request_service.update_contact_request_status(
        db=db,
        contact_request_id=contact_request_id,
        new_status=status_in.status,
    )