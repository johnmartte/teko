from sqlalchemy.orm import Session, joinedload

from app.models.portfolio import PortfolioCategory, PortfolioProject


def get_active_categories(db: Session):
    return (
        db.query(PortfolioCategory)
        .filter(PortfolioCategory.is_active.is_(True))
        .order_by(PortfolioCategory.sort_order)
        .all()
    )


def get_active_projects(db: Session):
    return (
        db.query(PortfolioProject)
        .options(joinedload(PortfolioProject.category))
        .join(PortfolioCategory)
        .filter(
            PortfolioProject.is_active.is_(True),
            PortfolioCategory.is_active.is_(True),
        )
        .order_by(PortfolioProject.sort_order)
        .all()
    )