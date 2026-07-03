from sqlalchemy.orm import Session

from app.repositories import lead_repository
from app.schemas.lead import LeadCreate


def create_lead(db: Session, lead_in: LeadCreate):
    existing_lead = lead_repository.get_lead_by_email(
        db=db,
        email=str(lead_in.email),
    )

    if existing_lead:
        return existing_lead

    return lead_repository.create_lead(db=db, lead_in=lead_in)