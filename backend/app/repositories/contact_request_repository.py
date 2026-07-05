from sqlalchemy.orm import Session

from app.models.contact_request import ContactRequest
from app.schemas.contact_request import ContactRequestCreate
from app.models.budget_range import BudgetRange
from app.models.lead import Lead
from app.models.service import Service


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


def get_contact_requests_for_admin(db: Session):
    return (
        db.query(
            ContactRequest.id.label("id"),
            ContactRequest.name.label("name"),
            Lead.email.label("email"),
            ContactRequest.company.label("company"),
            Service.title.label("service"),
            BudgetRange.label.label("budget"),
            ContactRequest.status.label("status"),
            ContactRequest.created_at.label("created_at"),
        )
        .join(Lead, ContactRequest.lead_id == Lead.id)
        .outerjoin(Service, ContactRequest.service_id == Service.id)
        .outerjoin(BudgetRange, ContactRequest.budget_range_id == BudgetRange.id)
        .order_by(ContactRequest.created_at.desc())
        .all()
    )
    
def get_contact_request_by_id(db: Session, contact_request_id: int):
    return (
        db.query(ContactRequest)
        .filter(ContactRequest.id == contact_request_id)
        .first()
    )


def update_contact_request_status(
    db: Session,
    contact_request: ContactRequest,
    status: str,
):
    contact_request.status = status

    db.add(contact_request)
    db.commit()
    db.refresh(contact_request)

    return contact_request    