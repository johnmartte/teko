from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.email_message import (
    EmailInboxSummary,
    EmailMessageDetail,
    EmailMessageListItem,
    EmailReadUpdate,
    EmailSendRequest,
)
from app.security.dependencies import get_current_admin
from app.services import email_service

router = APIRouter(
    prefix="/admin/emails",
    tags=["Admin - Emails"],
)


@router.get("", response_model=list[EmailMessageListItem])
def list_emails(
    direction: str | None = Query(default=None, pattern="^(inbound|outbound)$"),
    search: str | None = Query(default=None, max_length=200),
    limit: int = Query(default=100, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return email_service.list_messages(
        db,
        direction=direction,
        search=search,
        limit=limit,
        offset=offset,
    )


@router.get("/unread-count", response_model=EmailInboxSummary)
def unread_count(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return EmailInboxSummary(unread=email_service.count_unread(db))


@router.get("/{email_id}", response_model=EmailMessageDetail)
def get_email(
    email_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return email_service.get_message(db, email_id)


@router.post("", response_model=EmailMessageDetail, status_code=201)
def send_email(
    payload: EmailSendRequest,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return email_service.send_email(db, current_admin, payload)


@router.patch("/{email_id}/read", response_model=EmailMessageDetail)
def mark_email_read(
    email_id: int,
    payload: EmailReadUpdate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return email_service.mark_read(db, email_id, payload.is_read)
