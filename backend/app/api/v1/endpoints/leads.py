from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.lead import LeadCreate, LeadRead
from app.services import lead_service

router = APIRouter(prefix="/leads", tags=["Leads"])


@router.post("", response_model=LeadRead, status_code=status.HTTP_201_CREATED)
def create_lead(
    lead_in: LeadCreate,
    db: Session = Depends(get_db),
):
    return lead_service.create_lead(db=db, lead_in=lead_in)