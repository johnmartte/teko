from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.service import ServiceRead
from app.services import service_service

router = APIRouter(prefix="/services", tags=["Services"])


@router.get("", response_model=list[ServiceRead])
def get_services(db: Session = Depends(get_db)):
    return service_service.get_active_services(db)