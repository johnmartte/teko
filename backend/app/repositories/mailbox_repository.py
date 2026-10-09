import re

from sqlalchemy import case, func, or_
from sqlalchemy.orm import Session

from app.models.email_message import EmailMessage
from app.models.mailbox import Mailbox, MailboxMessage, MailboxRequest

ADDRESS_RE = re.compile(r"[\w.+'-]+@[\w-]+(?:\.[\w-]+)+")


def extract_addresses(*fields: str | None) -> set[str]:
    """Saca las direcciones de campos como 'Ana <ana@x.com>, b@y.com'."""
    found: set[str] = set()
    for field in fields:
        if field:
            found.update(match.lower() for match in ADDRESS_RE.findall(field))
    return found


def list_all(db: Session) -> list[Mailbox]:
    return db.query(Mailbox).order_by(Mailbox.is_active.desc(), Mailbox.display_name).all()


def get_by_id(db: Session, mailbox_id: int) -> Mailbox | None:
    return db.query(Mailbox).filter(Mailbox.id == mailbox_id).first()


def get_by_address(db: Session, address: str) -> Mailbox | None:
    return db.query(Mailbox).filter(Mailbox.address == address.lower()).first()


def get_by_planner_user(db: Session, planner_user_id: str) -> Mailbox | None:
    return db.query(Mailbox).filter(Mailbox.planner_user_id == planner_user_id).first()


def active_by_addresses(db: Session, addresses: set[str]) -> list[Mailbox]:
    if not addresses:
        return []
    return db.query(Mailbox).filter(Mailbox.is_active.is_(True), Mailbox.address.in_(addresses)).all()


def save(db: Session, mailbox: Mailbox) -> Mailbox:
    db.add(mailbox)
    db.commit()
    db.refresh(mailbox)
    return mailbox


def link_message(db: Session, mailbox_id: int, email_message_id: int, *, is_read: bool) -> MailboxMessage:
    link = MailboxMessage(mailbox_id=mailbox_id, email_message_id=email_message_id, is_read=is_read)
    db.add(link)
    db.commit()
    db.refresh(link)
    return link


def counts(db: Session) -> dict[int, tuple[int, int]]:
    """Total y no leídos (solo entrantes) por buzón, sin tocar el contenido."""
    unread = func.sum(case(((MailboxMessage.is_read.is_(False)) & (EmailMessage.direction == "inbound"), 1), else_=0))
    rows = (
        db.query(MailboxMessage.mailbox_id, func.count(MailboxMessage.id), unread)
        .join(EmailMessage, EmailMessage.id == MailboxMessage.email_message_id)
        .group_by(MailboxMessage.mailbox_id)
        .all()
    )
    return {mailbox_id: (int(total or 0), int(unread_count or 0)) for mailbox_id, total, unread_count in rows}


def list_links(
    db: Session,
    mailbox_id: int,
    *,
    direction: str | None,
    search: str | None,
    limit: int,
    offset: int,
) -> list[MailboxMessage]:
    query = (
        db.query(MailboxMessage)
        .join(EmailMessage, EmailMessage.id == MailboxMessage.email_message_id)
        .filter(MailboxMessage.mailbox_id == mailbox_id)
    )
    if direction:
        query = query.filter(EmailMessage.direction == direction)
    if search:
        pattern = f"%{search}%"
        query = query.filter(or_(
            EmailMessage.from_email.ilike(pattern),
            EmailMessage.to_email.ilike(pattern),
            EmailMessage.subject.ilike(pattern),
            EmailMessage.text_body.ilike(pattern),
        ))
    return query.order_by(EmailMessage.created_at.desc()).offset(offset).limit(limit).all()


def get_link(db: Session, mailbox_id: int, email_message_id: int) -> MailboxMessage | None:
    return (
        db.query(MailboxMessage)
        .filter(MailboxMessage.mailbox_id == mailbox_id, MailboxMessage.email_message_id == email_message_id)
        .first()
    )


def count_unread(db: Session, mailbox_id: int) -> int:
    return (
        db.query(func.count(MailboxMessage.id))
        .join(EmailMessage, EmailMessage.id == MailboxMessage.email_message_id)
        .filter(MailboxMessage.mailbox_id == mailbox_id, MailboxMessage.is_read.is_(False), EmailMessage.direction == "inbound")
        .scalar()
        or 0
    )


def set_link_read(db: Session, link: MailboxMessage, is_read: bool) -> MailboxMessage:
    link.is_read = is_read
    db.add(link)
    db.commit()
    db.refresh(link)
    return link


# --- Solicitudes de correo --------------------------------------------------

def latest_request(db: Session, planner_user_id: str) -> MailboxRequest | None:
    return (
        db.query(MailboxRequest)
        .filter(MailboxRequest.planner_user_id == planner_user_id)
        .order_by(MailboxRequest.created_at.desc(), MailboxRequest.id.desc())
        .first()
    )


def pending_request(db: Session, planner_user_id: str) -> MailboxRequest | None:
    return (
        db.query(MailboxRequest)
        .filter(MailboxRequest.planner_user_id == planner_user_id, MailboxRequest.status == "pending")
        .first()
    )


def list_requests(db: Session, status: str | None) -> list[MailboxRequest]:
    query = db.query(MailboxRequest)
    if status:
        query = query.filter(MailboxRequest.status == status)
    return query.order_by(MailboxRequest.created_at.desc(), MailboxRequest.id.desc()).limit(200).all()


def get_request(db: Session, request_id: int) -> MailboxRequest | None:
    return db.query(MailboxRequest).filter(MailboxRequest.id == request_id).first()


def resolve_pending(db: Session, planner_user_id: str, status: str) -> None:
    db.query(MailboxRequest).filter(
        MailboxRequest.planner_user_id == planner_user_id,
        MailboxRequest.status == "pending",
    ).update({"status": status, "resolved_at": func.now()}, synchronize_session=False)
    db.commit()


def save_request(db: Session, request: MailboxRequest) -> MailboxRequest:
    db.add(request)
    db.commit()
    db.refresh(request)
    return request
