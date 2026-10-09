from sqlalchemy import and_, func
from sqlalchemy.orm import Session

from app.models.admin_notification import AdminNotification, AdminNotificationRead


def create(db: Session, notification: AdminNotification) -> AdminNotification:
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


def _read_join(admin_id: int):
    return and_(AdminNotificationRead.notification_id == AdminNotification.id, AdminNotificationRead.admin_id == admin_id)


def list_for_admin(db: Session, admin_id: int, limit: int) -> list[tuple[AdminNotification, bool]]:
    rows = (
        db.query(AdminNotification, AdminNotificationRead.id)
        .outerjoin(AdminNotificationRead, _read_join(admin_id))
        .order_by(AdminNotification.created_at.desc(), AdminNotification.id.desc())
        .limit(limit)
        .all()
    )
    return [(notification, read_id is not None) for notification, read_id in rows]


def count_unread(db: Session, admin_id: int) -> int:
    return (
        db.query(func.count(AdminNotification.id))
        .outerjoin(AdminNotificationRead, _read_join(admin_id))
        .filter(AdminNotificationRead.id.is_(None))
        .scalar()
        or 0
    )


def get(db: Session, notification_id: int) -> AdminNotification | None:
    return db.query(AdminNotification).filter(AdminNotification.id == notification_id).first()


def mark_read(db: Session, admin_id: int, notification_ids: list[int]) -> None:
    if not notification_ids:
        return
    already = {
        row[0]
        for row in db.query(AdminNotificationRead.notification_id)
        .filter(AdminNotificationRead.admin_id == admin_id, AdminNotificationRead.notification_id.in_(notification_ids))
        .all()
    }
    for notification_id in notification_ids:
        if notification_id not in already:
            db.add(AdminNotificationRead(notification_id=notification_id, admin_id=admin_id))
    db.commit()


def unread_ids(db: Session, admin_id: int) -> list[int]:
    rows = (
        db.query(AdminNotification.id)
        .outerjoin(AdminNotificationRead, _read_join(admin_id))
        .filter(AdminNotificationRead.id.is_(None))
        .all()
    )
    return [row[0] for row in rows]
