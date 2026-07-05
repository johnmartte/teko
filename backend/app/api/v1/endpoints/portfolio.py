from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.portfolio import PortfolioCategoryRead, PortfolioProjectRead
from app.services import portfolio_service

router = APIRouter(
    prefix="/portfolio",
    tags=["Portfolio"],
)


@router.get("/categories", response_model=list[PortfolioCategoryRead])
def get_portfolio_categories(
    db: Session = Depends(get_db),
):
    return portfolio_service.get_active_categories(db)


@router.get("", response_model=list[PortfolioProjectRead])
def get_portfolio_projects(
    db: Session = Depends(get_db),
):
    return portfolio_service.get_active_projects(db)