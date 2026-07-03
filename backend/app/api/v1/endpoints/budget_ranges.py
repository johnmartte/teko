from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.budget_range import BudgetRangeRead
from app.services import budget_range_service

router = APIRouter(prefix="/budget-ranges", tags=["Budget Ranges"])


@router.get("", response_model=list[BudgetRangeRead])
def get_budget_ranges(db: Session = Depends(get_db)):
    return budget_range_service.get_active_budget_ranges(db)