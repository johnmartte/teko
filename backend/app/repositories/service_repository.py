from sqlalchemy.orm import Session

from app.models.service import Service


def get_active_services(db: Session):
    return (
        db.query(Service)
        .filter(Service.is_active.is_(True))
        .order_by(Service.sort_order)
        .all()
    )