from sqlalchemy.orm import Session, selectinload

from app.models.plan import Plan


def get_active_plans(db: Session):
    return (
        db.query(Plan)
        .options(selectinload(Plan.features))
        .filter(Plan.is_active.is_(True))
        .order_by(Plan.sort_order)
        .all()
    )