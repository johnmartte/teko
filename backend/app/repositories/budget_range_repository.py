from sqlalchemy.orm import Session

from app.models.budget_range import BudgetRange


def get_active_budget_ranges(db: Session):
    return (
        db.query(BudgetRange)
        .filter(BudgetRange.is_active.is_(True))
        .order_by(BudgetRange.sort_order)
        .all()
    )