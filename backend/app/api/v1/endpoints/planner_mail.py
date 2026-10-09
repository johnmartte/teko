from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.mailbox import Mailbox
from app.schemas.email_message import (
    EmailInboxSummary,
    EmailMessageDetail,
    EmailMessageListItem,
    EmailPreview,
    EmailPreviewRequest,
    EmailReadUpdate,
    EmailSendRequest,
)
from app.schemas.email_template import EmailTemplateRead
from app.schemas.mailbox import OwnMailAccess, OwnMailbox, OwnMailboxUpdate
from app.security.planner_bridge import PlannerIdentity, get_planner_identity, get_planner_mailbox
from app.services import email_template_service, mailbox_service
from app.repositories import mailbox_repository

# Bandeja de los empleados en TEKO Planner. Cada ruta trabaja solo sobre el
# buzón del empleado que identifica el servidor del Planner.
router = APIRouter(
    prefix="/planner/mail",
    tags=["Planner - Bandeja"],
)


@router.get("/access", response_model=OwnMailAccess)
def access(db: Session = Depends(get_db), identity: PlannerIdentity = Depends(get_planner_identity)):
    return mailbox_service.own_access(db, identity.user_id)


@router.post("/request", response_model=OwnMailAccess)
def request_mailbox(db: Session = Depends(get_db), identity: PlannerIdentity = Depends(get_planner_identity)):
    return mailbox_service.request_mailbox(db, planner_user_id=identity.user_id, name=identity.name, email=identity.email, role=identity.role)


@router.get("/mailbox", response_model=OwnMailbox)
def mailbox(db: Session = Depends(get_db), box: Mailbox = Depends(get_planner_mailbox)):
    return mailbox_service.own_summary(db, box)


@router.patch("/mailbox", response_model=OwnMailbox)
def update_signature(payload: OwnMailboxUpdate, db: Session = Depends(get_db), box: Mailbox = Depends(get_planner_mailbox)):
    return mailbox_service.update_own_signature(db, box, payload.signature)


@router.get("/unread-count", response_model=EmailInboxSummary)
def unread_count(db: Session = Depends(get_db), box: Mailbox = Depends(get_planner_mailbox)):
    return EmailInboxSummary(unread=mailbox_repository.count_unread(db, box.id))


@router.get("/templates", response_model=list[EmailTemplateRead])
def templates(db: Session = Depends(get_db), box: Mailbox = Depends(get_planner_mailbox)):
    return email_template_service.list_templates(db)


@router.get("/messages", response_model=list[EmailMessageListItem])
def list_messages(
    direction: str | None = Query(default=None, pattern="^(inbound|outbound)$"),
    search: str | None = Query(default=None, max_length=200),
    limit: int = Query(default=100, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    box: Mailbox = Depends(get_planner_mailbox),
):
    return mailbox_service.list_own_messages(db, box, direction=direction, search=search, limit=limit, offset=offset)


@router.post("/messages/preview", response_model=EmailPreview)
def preview(payload: EmailPreviewRequest, db: Session = Depends(get_db), box: Mailbox = Depends(get_planner_mailbox)):
    return EmailPreview(html=mailbox_service.preview_for_mailbox(db, box, payload))


@router.get("/messages/{email_id}", response_model=EmailMessageDetail)
def get_message(email_id: int, db: Session = Depends(get_db), box: Mailbox = Depends(get_planner_mailbox)):
    return mailbox_service.get_own_message(db, box, email_id)


@router.patch("/messages/{email_id}/read", response_model=EmailMessageDetail)
def mark_read(email_id: int, payload: EmailReadUpdate, db: Session = Depends(get_db), box: Mailbox = Depends(get_planner_mailbox)):
    return mailbox_service.mark_own_read(db, box, email_id, payload.is_read)


@router.post("/messages", response_model=EmailMessageDetail, status_code=201)
def send(payload: EmailSendRequest, db: Session = Depends(get_db), box: Mailbox = Depends(get_planner_mailbox)):
    return mailbox_service.send_from_mailbox(db, box, payload)
