from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.mailbox import Mailbox, MailboxRequest
from app.repositories import email_message_repository, mailbox_repository
from app.schemas.email_message import EmailMessageDetail, EmailMessageListItem, EmailPreviewRequest, EmailSendRequest
from app.services.email_renderer import render_email
from app.schemas.mailbox import MailboxCreate, MailboxRead, MailboxRequestRead, MailboxUpdate, OwnMailAccess, OwnMailbox, PlannerUser
from app.services import admin_notification_service, email_service, planner_client
from app.services.planner_client import PlannerError


def _require_domain() -> str:
    domain = settings.MAIL_DOMAIN
    if not domain:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Falta configurar RESEND_FROM_EMAIL en el servidor")
    return domain


def _read(mailbox: Mailbox, counts: dict[int, tuple[int, int]]) -> MailboxRead:
    total, unread = counts.get(mailbox.id, (0, 0))
    return MailboxRead.model_validate(mailbox).model_copy(update={"total_messages": total, "unread_messages": unread})


# --- Administración (CMS) ---------------------------------------------------

def list_mailboxes(db: Session) -> list[MailboxRead]:
    counts = mailbox_repository.counts(db)
    return [_read(mailbox, counts) for mailbox in mailbox_repository.list_all(db)]


def planner_users(db: Session) -> list[PlannerUser]:
    try:
        raw_users = planner_client.list_staff_users()
    except PlannerError as error:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(error)) from error

    by_user = {mailbox.planner_user_id: mailbox.address for mailbox in mailbox_repository.list_all(db)}
    users = []
    for raw in raw_users:
        user_id = str(raw.get("id", ""))
        if not user_id:
            continue
        users.append(PlannerUser(
            id=user_id,
            name=raw.get("name") or raw.get("email", ""),
            email=raw.get("email", ""),
            role=raw.get("role", "staff"),
            job_title=raw.get("job_title"),
            mailbox_address=by_user.get(user_id),
        ))
    return users


def create_mailbox(db: Session, payload: MailboxCreate) -> MailboxRead:
    domain = _require_domain()
    address = f"{payload.local_part.lower()}@{domain}"

    if address == settings.RESEND_FROM_EMAIL.lower():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Esa es la dirección general del CMS")
    if mailbox_repository.get_by_address(db, address):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"{address} ya existe")
    if mailbox_repository.get_by_planner_user(db, payload.planner_user_id):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Ese empleado ya tiene un correo")

    employee = next((user for user in planner_users(db) if user.id == payload.planner_user_id), None)
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ese empleado no existe en el Planner")

    mailbox = Mailbox(
        address=address,
        display_name=payload.display_name.strip(),
        signature=payload.signature or None,
        is_active=True,
        planner_user_id=employee.id,
        planner_user_name=employee.name,
        planner_user_email=employee.email,
    )
    mailbox = mailbox_repository.save(db, mailbox)
    mailbox_repository.resolve_pending(db, mailbox.planner_user_id, "approved")
    return _read(mailbox, {})


def update_mailbox(db: Session, mailbox_id: int, payload: MailboxUpdate) -> MailboxRead:
    mailbox = mailbox_repository.get_by_id(db, mailbox_id)
    if not mailbox:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Buzón no encontrado")
    changes = payload.model_dump(exclude_unset=True)
    if "display_name" in changes and changes["display_name"]:
        mailbox.display_name = changes["display_name"].strip()
    if "signature" in changes:
        mailbox.signature = changes["signature"] or None
    if "is_active" in changes and changes["is_active"] is not None:
        mailbox.is_active = changes["is_active"]
    mailbox = mailbox_repository.save(db, mailbox)
    if mailbox.is_active:
        mailbox_repository.resolve_pending(db, mailbox.planner_user_id, "approved")
    return _read(mailbox, mailbox_repository.counts(db))


def _request_read(db: Session, request: MailboxRequest) -> MailboxRequestRead:
    mailbox = mailbox_repository.get_by_planner_user(db, request.planner_user_id)
    return MailboxRequestRead.model_validate(request).model_copy(update={
        "mailbox_id": mailbox.id if mailbox else None,
        "mailbox_address": mailbox.address if mailbox else None,
    })


def list_requests(db: Session, status_filter: str | None) -> list[MailboxRequestRead]:
    return [_request_read(db, request) for request in mailbox_repository.list_requests(db, status_filter)]


def dismiss_request(db: Session, request_id: int) -> MailboxRequestRead:
    request = mailbox_repository.get_request(db, request_id)
    if not request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Solicitud no encontrada")
    if request.status != "pending":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Esa solicitud ya fue atendida")
    mailbox_repository.resolve_pending(db, request.planner_user_id, "dismissed")
    db.refresh(request)
    return _request_read(db, request)


# --- Bandeja del empleado (Planner) -----------------------------------------

def own_mailbox(db: Session, planner_user_id: str) -> Mailbox:
    mailbox = mailbox_repository.get_by_planner_user(db, planner_user_id)
    if not mailbox or not mailbox.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="mailbox_not_enabled")
    return mailbox


def own_summary(db: Session, mailbox: Mailbox) -> OwnMailbox:
    return OwnMailbox(address=mailbox.address, display_name=mailbox.display_name, signature=mailbox.signature, unread=mailbox_repository.count_unread(db, mailbox.id))


def update_own_signature(db: Session, mailbox: Mailbox, signature: str | None) -> OwnMailbox:
    mailbox.signature = signature or None
    return own_summary(db, mailbox_repository.save(db, mailbox))


def list_own_messages(db: Session, mailbox: Mailbox, *, direction: str | None, search: str | None, limit: int, offset: int) -> list[EmailMessageListItem]:
    links = mailbox_repository.list_links(db, mailbox.id, direction=direction, search=search, limit=limit, offset=offset)
    return [EmailMessageListItem.model_validate(link.message).model_copy(update={"is_read": link.is_read}) for link in links]


def _own_link(db: Session, mailbox: Mailbox, email_id: int):
    link = mailbox_repository.get_link(db, mailbox.id, email_id)
    if not link:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Correo no encontrado")
    return link


def get_own_message(db: Session, mailbox: Mailbox, email_id: int) -> EmailMessageDetail:
    link = _own_link(db, mailbox, email_id)
    return EmailMessageDetail.model_validate(link.message).model_copy(update={"is_read": link.is_read})


def mark_own_read(db: Session, mailbox: Mailbox, email_id: int, is_read: bool) -> EmailMessageDetail:
    link = mailbox_repository.set_link_read(db, _own_link(db, mailbox, email_id), is_read)
    return EmailMessageDetail.model_validate(link.message).model_copy(update={"is_read": link.is_read})


def send_from_mailbox(db: Session, mailbox: Mailbox, payload: EmailSendRequest) -> EmailMessageDetail:
    reply_original = None
    if payload.reply_to_email_id is not None:
        reply_original = _own_link(db, mailbox, payload.reply_to_email_id).message

    base_template = email_service.resolve_template(db, payload.template_id)
    template = email_service.with_signature(base_template, mailbox.signature)
    if base_template is None and mailbox.signature:
        payload = payload.model_copy(update={"body": f"{payload.body.rstrip()}\n\n{mailbox.signature}"})
    message = email_service.deliver_email(
        db,
        payload=payload,
        sender_address=mailbox.address,
        sender_name=mailbox.display_name,
        template=template,
        reply_original=reply_original,
        is_general=False,
        admin_id=None,
    )
    mailbox_repository.link_message(db, mailbox.id, message.id, is_read=True)
    return EmailMessageDetail.model_validate(email_message_repository.get_by_id(db, message.id))


def preview_for_mailbox(db: Session, mailbox: Mailbox, payload: EmailPreviewRequest) -> str:
    base_template = email_service.resolve_template(db, payload.template_id)
    body = payload.body
    if base_template is None and mailbox.signature:
        body = f"{body.rstrip()}\n\n{mailbox.signature}"
    document, _ = render_email(body=body, subject=payload.subject, template=email_service.with_signature(base_template, mailbox.signature))
    return document


# --- Solicitud de correo institucional (Planner) -----------------------------

def own_access(db: Session, planner_user_id: str) -> OwnMailAccess:
    mailbox = mailbox_repository.get_by_planner_user(db, planner_user_id)
    if mailbox and mailbox.is_active:
        return OwnMailAccess(enabled=True, address=mailbox.address)
    request = mailbox_repository.latest_request(db, planner_user_id)
    return OwnMailAccess(
        enabled=False,
        request_status=request.status if request else None,
        requested_at=request.created_at if request else None,
    )


def request_mailbox(db: Session, *, planner_user_id: str, name: str, email: str, role: str) -> OwnMailAccess:
    if role == "client":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="El correo institucional es solo para el equipo de TEKO")
    mailbox = mailbox_repository.get_by_planner_user(db, planner_user_id)
    if mailbox and mailbox.is_active:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Tu correo ya está habilitado")

    # Pedirlo dos veces no vuelve a avisar: la solicitud pendiente sigue en pie.
    if not mailbox_repository.pending_request(db, planner_user_id):
        display = name or email or f"Usuario {planner_user_id}"
        request = mailbox_repository.save_request(db, MailboxRequest(
            planner_user_id=planner_user_id,
            planner_user_name=display,
            planner_user_email=email,
            status="pending",
        ))
        verb = "rehabilite" if mailbox else "habilite"
        admin_notification_service.notify_admins(
            db,
            kind="mailbox_request",
            title=f"{display} solicita que se le {verb} su correo institucional",
            body=email or None,
            module="mailboxes",
            ref_id=request.id,
        )
    return own_access(db, planner_user_id)
