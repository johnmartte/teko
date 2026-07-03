from sqlalchemy.orm import Session

from app.models.lead import Lead
from app.schemas.lead import LeadCreate


def get_lead_by_email(db: Session, email: str) -> Lead | None:
    return db.query(Lead).filter(Lead.email == email).first()


def create_lead(db: Session, lead_in: LeadCreate) -> Lead:
    lead = Lead(
        email=lead_in.email,
        source=lead_in.source,
    )

    db.add(lead)
    db.commit()
    db.refresh(lead)

    return lead