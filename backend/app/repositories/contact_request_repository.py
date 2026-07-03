from sqlalchemy.orm import Session

from app.models.contact_request import ContactRequest
from app.schemas.contact_request import ContactRequestCreate


def create_contact_request(
    db: Session,
    contact_in: ContactRequestCreate,
    lead_id: int,
) -> ContactRequest:
    contact_request = ContactRequest(
        lead_id=lead_id,
        name=contact_in.name,
        company=contact_in.company,
        phone=contact_in.phone,
        service_id=contact_in.service_id,
        budget_range_id=contact_in.budget_range_id,
        message=contact_in.message,
    )

    db.add(contact_request)
    db.commit()
    db.refresh(contact_request)

    return contact_request