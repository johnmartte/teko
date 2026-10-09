from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.email_message import EmailMessage
from app.repositories import email_message_repository, email_template_repository
from app.schemas.email_message import EmailPreviewRequest, EmailSendRequest
from app.services.email_renderer import render_email
from app.services import resend_client
from app.services.resend_client import ResendError


STATUS_BY_EVENT = {
    "email.sent": "sent",
    "email.delivered": "delivered",
    "email.delivery_delayed": "delivery_delayed",
    "email.opened": "opened",
    "email.clicked": "clicked",
    "email.bounced": "bounced",
    "email.complained": "complained",
    "email.failed": "failed",
}

# Los webhooks pueden llegar desordenados: un estado solo avanza, nunca retrocede.
STATUS_RANK = {
    "queued": 0,
    "sent": 1,
    "delivery_delayed": 2,
    "delivered": 3,
    "opened": 4,
    "clicked": 5,
}
TERMINAL_STATUSES = {"bounced", "complained", "failed"}


def _join_addresses(value) -> str:
    if value is None:
        return ""
    if isinstance(value, str):
        return value
    if isinstance(value, list):
        return ", ".join(str(item) for item in value if item)
    return str(value)


def _resolve_template(db: Session, template_id: int | None):
    if template_id is None:
        return None
    template = email_template_repository.get_by_id(db, template_id)
    if not template:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plantilla no encontrada")
    return template


def _thread_headers(db: Session, reply_to_email_id: int | None) -> dict[str, str] | None:
    if reply_to_email_id is None:
        return None
    original = email_message_repository.get_by_id(db, reply_to_email_id)
    if not original or not original.message_id:
        return None
    message_id = original.message_id.strip()
    if not message_id.startswith("<"):
        message_id = f"<{message_id}>"
    # Con estas cabeceras Gmail y Outlook muestran la respuesta en el mismo hilo.
    return {"In-Reply-To": message_id, "References": message_id}


def preview_email(db: Session, payload: EmailPreviewRequest) -> str:
    template = payload.template if payload.template is not None else _resolve_template(db, payload.template_id)
    document, _ = render_email(body=payload.body, subject=payload.subject, template=template)
    return document


def send_email(db: Session, admin, payload: EmailSendRequest) -> EmailMessage:
    if not settings.RESEND_FROM_EMAIL:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Falta configurar RESEND_FROM_EMAIL en el servidor",
        )

    sender = (
        f"{settings.RESEND_FROM_NAME} <{settings.RESEND_FROM_EMAIL}>"
        if settings.RESEND_FROM_NAME
        else settings.RESEND_FROM_EMAIL
    )

    template = _resolve_template(db, payload.template_id)
    html_body, text_body = render_email(body=payload.body, subject=payload.subject, template=template)

    recipients = [str(item) for item in payload.to]
    cc = [str(item) for item in payload.cc] if payload.cc else None
    bcc = [str(item) for item in payload.bcc] if payload.bcc else None

    try:
        result = resend_client.send_email(
            sender=sender,
            to=recipients,
            subject=payload.subject,
            html=html_body,
            text=text_body,
            cc=cc,
            bcc=bcc,
            headers=_thread_headers(db, payload.reply_to_email_id),
        )
    except ResendError as error:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(error),
        ) from error

    message = EmailMessage(
        direction="outbound",
        provider_id=result.get("id"),
        from_email=settings.RESEND_FROM_EMAIL,
        to_email=", ".join(recipients),
        cc=", ".join(cc) if cc else None,
        bcc=", ".join(bcc) if bcc else None,
        subject=payload.subject,
        text_body=payload.body,
        html_body=html_body,
        status="sent",
        is_read=True,
        sent_by_admin_id=admin.id,
    )

    return email_message_repository.create(db, message)


def handle_webhook_event(db: Session, event: dict) -> str:
    event_type = event.get("type")
    data = event.get("data") or {}

    if event_type == "email.received":
        return _store_received_email(db, data)

    new_status = STATUS_BY_EVENT.get(event_type)
    if not new_status:
        return "ignored"

    provider_id = data.get("email_id") or data.get("id")
    if not provider_id:
        return "ignored"

    message = email_message_repository.get_by_provider_id(db, provider_id)
    if not message:
        return "unknown"

    if message.status in TERMINAL_STATUSES:
        return "skipped"

    if new_status not in TERMINAL_STATUSES:
        current_rank = STATUS_RANK.get(message.status, -1)
        if STATUS_RANK.get(new_status, -1) <= current_rank:
            return "skipped"

    email_message_repository.set_status(db, message, new_status)
    return "updated"


def _store_received_email(db: Session, data: dict) -> str:
    provider_id = data.get("email_id") or data.get("id")

    if provider_id and email_message_repository.get_by_provider_id(db, provider_id):
        return "duplicate"

    content: dict = {}
    fetch_error: str | None = None

    if provider_id:
        try:
            content = resend_client.get_received_email(provider_id)
        except ResendError as error:
            # El correo llegó: se guarda con los metadatos aunque falte el cuerpo.
            fetch_error = f"No fue posible descargar el contenido: {error}"

    attachments = content.get("attachments") or data.get("attachments") or []

    message = EmailMessage(
        direction="inbound",
        provider_id=provider_id,
        message_id=content.get("message_id") or data.get("message_id"),
        from_email=_join_addresses(content.get("from") or data.get("from")) or "desconocido",
        to_email=_join_addresses(content.get("to") or data.get("to")),
        cc=_join_addresses(content.get("cc") or data.get("cc")) or None,
        bcc=_join_addresses(content.get("bcc") or data.get("bcc")) or None,
        reply_to=_join_addresses(content.get("reply_to")) or None,
        subject=content.get("subject") or data.get("subject"),
        text_body=content.get("text"),
        html_body=content.get("html"),
        status="received",
        error_message=fetch_error,
        is_read=False,
        has_attachments=bool(attachments),
    )

    email_message_repository.create(db, message)
    return "received"


def list_messages(db: Session, *, direction: str | None, search: str | None, limit: int, offset: int):
    return email_message_repository.list_messages(
        db,
        direction=direction,
        search=search,
        limit=limit,
        offset=offset,
    )


def get_message(db: Session, email_id: int) -> EmailMessage:
    message = email_message_repository.get_by_id(db, email_id)
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Correo no encontrado",
        )
    return message


def mark_read(db: Session, email_id: int, is_read: bool) -> EmailMessage:
    message = get_message(db, email_id)
    return email_message_repository.set_read(db, message, is_read)


def count_unread(db: Session) -> int:
    return email_message_repository.count_unread(db)
