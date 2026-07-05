from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.plan import PlanRead
from app.services import plan_service

router = APIRouter(
    prefix="/plans",
    tags=["Plans"],
)


@router.get("", response_model=list[PlanRead])
def get_plans(
    db: Session = Depends(get_db),
):
    return plan_service.get_active_plans(db)