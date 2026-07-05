from sqlalchemy.orm import Session

from app.models.faq import FAQ


def get_active_faqs(db: Session):
    return (
        db.query(FAQ)
        .filter(FAQ.is_active.is_(True))
        .order_by(FAQ.sort_order)
        .all()
    )