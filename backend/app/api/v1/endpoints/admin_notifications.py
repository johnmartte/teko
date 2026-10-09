from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.admin_notification import AdminNotificationRead, AdminNotificationSummary
from app.security.dependencies import get_current_admin
from app.services import admin_notification_service

router = APIRouter(
    prefix="/admin/notifications",
    tags=["Admin - Notifications"],
)


@router.get("", response_model=list[AdminNotificationRead])
def list_notifications(limit: int = Query(default=30, ge=1, le=100), db: Session = Depends(get_db), current_admin=Depends(get_current_admin)):
    return admin_notification_service.list_for_admin(db, current_admin.id, limit)


@router.get("/unread-count", response_model=AdminNotificationSummary)
def unread_count(db: Session = Depends(get_db), current_admin=Depends(get_current_admin)):
    return AdminNotificationSummary(unread=admin_notification_service.unread_count(db, current_admin.id))


@router.post("/read-all", status_code=204)
def read_all(db: Session = Depends(get_db), current_admin=Depends(get_current_admin)):
    admin_notification_service.mark_all_read(db, current_admin.id)
    return Response(status_code=204)


@router.patch("/{notification_id}/read", status_code=204)
def read_one(notification_id: int, db: Session = Depends(get_db), current_admin=Depends(get_current_admin)):
    admin_notification_service.mark_read(db, current_admin.id, notification_id)
    return Response(status_code=204)
