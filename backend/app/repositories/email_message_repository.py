from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from app.models.email_message import EmailMessage


def create(db: Session, email: EmailMessage) -> EmailMessage:
    db.add(email)
    db.commit()
    db.refresh(email)
    return email


def get_by_id(db: Session, email_id: int) -> EmailMessage | None:
    return db.query(EmailMessage).filter(EmailMessage.id == email_id).first()


def get_by_provider_id(db: Session, provider_id: str) -> EmailMessage | None:
    return db.query(EmailMessage).filter(EmailMessage.provider_id == provider_id).first()


def list_messages(
    db: Session,
    *,
    direction: str | None = None,
    search: str | None = None,
    limit: int = 100,
    offset: int = 0,
) -> list[EmailMessage]:
    query = db.query(EmailMessage)

    if direction:
        query = query.filter(EmailMessage.direction == direction)

    if search:
        pattern = f"%{search}%"
        query = query.filter(
            or_(
                EmailMessage.from_email.ilike(pattern),
                EmailMessage.to_email.ilike(pattern),
                EmailMessage.subject.ilike(pattern),
                EmailMessage.text_body.ilike(pattern),
            )
        )

    return (
        query.order_by(EmailMessage.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )


def count_unread(db: Session) -> int:
    return (
        db.query(func.count(EmailMessage.id))
        .filter(EmailMessage.direction == "inbound", EmailMessage.is_read.is_(False))
        .scalar()
        or 0
    )


def set_read(db: Session, email: EmailMessage, is_read: bool) -> EmailMessage:
    email.is_read = is_read
    db.add(email)
    db.commit()
    db.refresh(email)
    return email


def set_status(db: Session, email: EmailMessage, status: str) -> EmailMessage:
    email.status = status
    db.add(email)
    db.commit()
    db.refresh(email)
    return email
