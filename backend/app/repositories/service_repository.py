from sqlalchemy.orm import Session, joinedload

from app.models.service import Service


def get_active_services(db: Session):
    return (
        db.query(Service)
        .options(joinedload(Service.category))
        .filter(Service.is_active.is_(True))
        .order_by(Service.sort_order)
        .all()
    )