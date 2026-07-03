from sqlalchemy.orm import Session

from app.repositories import contact_request_repository, lead_repository
from app.schemas.contact_request import ContactRequestCreate
from app.schemas.lead import LeadCreate


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