from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.schemas.mailbox import MailboxCreate, MailboxRead, MailboxUpdate, MailDomain, PlannerUser
from app.security.dependencies import get_current_admin
from app.services import mailbox_service

router = APIRouter(
    prefix="/admin/mailboxes",
    tags=["Admin - Mailboxes"],
)


@router.get("", response_model=list[MailboxRead])
def list_mailboxes(db: Session = Depends(get_db), current_admin=Depends(get_current_admin)):
    return mailbox_service.list_mailboxes(db)


@router.get("/domain", response_model=MailDomain)
def mail_domain(current_admin=Depends(get_current_admin)):
    return MailDomain(domain=settings.MAIL_DOMAIN)


@router.get("/planner-users", response_model=list[PlannerUser])
def planner_users(db: Session = Depends(get_db), current_admin=Depends(get_current_admin)):
    return mailbox_service.planner_users(db)


@router.post("", response_model=MailboxRead, status_code=201)
def create_mailbox(payload: MailboxCreate, db: Session = Depends(get_db), current_admin=Depends(get_current_admin)):
    return mailbox_service.create_mailbox(db, payload)


@router.patch("/{mailbox_id}", response_model=MailboxRead)
def update_mailbox(mailbox_id: int, payload: MailboxUpdate, db: Session = Depends(get_db), current_admin=Depends(get_current_admin)):
    return mailbox_service.update_mailbox(db, mailbox_id, payload)
