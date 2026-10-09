from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class AdminNotification(Base):
    """Aviso que ven todos los administradores del CMS."""

    __tablename__ = "admin_notifications"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    kind: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    body: Mapped[str | None] = mapped_column(Text, nullable=True)
    # Módulo del CMS que abre el aviso (p. ej. "mailboxes") y el registro al que apunta.
    module: Mapped[str | None] = mapped_column(String(50), nullable=True)
    ref_id: Mapped[int | None] = mapped_column(nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)


class AdminNotificationRead(Base):
    """Cada administrador marca sus avisos como leídos por separado."""

    __tablename__ = "admin_notification_reads"
    __table_args__ = (UniqueConstraint("notification_id", "admin_id", name="uq_notification_admin"),)

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    notification_id: Mapped[int] = mapped_column(ForeignKey("admin_notifications.id", ondelete="CASCADE"), nullable=False, index=True)
    admin_id: Mapped[int] = mapped_column(ForeignKey("admin_users.id", ondelete="CASCADE"), nullable=False, index=True)
    read_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
