from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.admin_notification import AdminNotification
from app.repositories import admin_notification_repository
from app.schemas.admin_notification import AdminNotificationRead


def notify_admins(db: Session, *, kind: str, title: str, body: str | None = None, module: str | None = None, ref_id: int | None = None) -> AdminNotification:
    """Un aviso compartido: lo ven todos los administradores y cada uno lo marca leído."""
    return admin_notification_repository.create(db, AdminNotification(kind=kind, title=title, body=body, module=module, ref_id=ref_id))


def list_for_admin(db: Session, admin_id: int, limit: int) -> list[AdminNotificationRead]:
    return [
        AdminNotificationRead.model_validate(notification).model_copy(update={"is_read": is_read})
        for notification, is_read in admin_notification_repository.list_for_admin(db, admin_id, limit)
    ]


def unread_count(db: Session, admin_id: int) -> int:
    return admin_notification_repository.count_unread(db, admin_id)


def mark_read(db: Session, admin_id: int, notification_id: int) -> None:
    if not admin_notification_repository.get(db, notification_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Aviso no encontrado")
    admin_notification_repository.mark_read(db, admin_id, [notification_id])


def mark_all_read(db: Session, admin_id: int) -> None:
    admin_notification_repository.mark_read(db, admin_id, admin_notification_repository.unread_ids(db, admin_id))
