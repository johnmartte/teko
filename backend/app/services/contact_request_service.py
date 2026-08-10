from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.repositories import contact_request_repository, lead_repository
from app.schemas.contact_request import ContactRequestCreate
from app.schemas.lead import LeadCreate
from app.repositories import contact_request_repository


def create_contact_request(db: Session, contact_in: ContactRequestCreate):
    existing_lead = lead_repository.get_lead_by_email(
        db=db,
        email=str(contact_in.email),
    )

    if existing_lead:
        lead = existing_lead
    else:
        lead = lead_repository.create_lead(
            db=db,
            lead_in=LeadCreate(
                email=contact_in.email,
                source="contact_form",
            ),
        )

    return contact_request_repository.create_contact_request(
        db=db,
        contact_in=contact_in,
        lead_id=lead.id,
    )
    
def get_contact_requests_for_admin(db):
    return contact_request_repository.get_contact_requests_for_admin(db)    


def get_contact_request_detail(db: Session, contact_request_id: int):
    contact_request = contact_request_repository.get_contact_request_detail(db, contact_request_id)
    if not contact_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Solicitud de contacto no encontrada",
        )
    return contact_request

def update_contact_request_status(db, contact_request_id: int, new_status: str):
    contact_request = contact_request_repository.get_contact_request_by_id(
        db=db,
        contact_request_id=contact_request_id,
    )

    if not contact_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Solicitud de contacto no encontrada",
        )

    return contact_request_repository.update_contact_request_status(
        db=db,
        contact_request=contact_request,
        status=new_status,
    )
