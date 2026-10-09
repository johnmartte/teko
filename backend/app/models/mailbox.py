from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Mailbox(Base):
    """Dirección de correo de un empleado del Planner (p. ej. john.marte@teko.do)."""

    __tablename__ = "mailboxes"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    address: Mapped[str] = mapped_column(String(320), nullable=False, unique=True, index=True)
    display_name: Mapped[str] = mapped_column(String(150), nullable=False)
    signature: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    planner_user_id: Mapped[str] = mapped_column(String(64), nullable=False, unique=True, index=True)
    planner_user_name: Mapped[str] = mapped_column(String(200), nullable=False)
    planner_user_email: Mapped[str] = mapped_column(String(320), nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class MailboxMessage(Base):
    """Une un correo con el buzón que lo ve. El estado de leído es por buzón."""

    __tablename__ = "mailbox_messages"
    __table_args__ = (UniqueConstraint("mailbox_id", "email_message_id", name="uq_mailbox_message"),)

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    mailbox_id: Mapped[int] = mapped_column(ForeignKey("mailboxes.id", ondelete="CASCADE"), nullable=False, index=True)
    email_message_id: Mapped[int] = mapped_column(ForeignKey("email_messages.id", ondelete="CASCADE"), nullable=False, index=True)
    is_read: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    message = relationship("EmailMessage")


class MailboxRequest(Base):
    """Un empleado del Planner pide su correo institucional desde la Bandeja."""

    __tablename__ = "mailbox_requests"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    planner_user_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    planner_user_name: Mapped[str] = mapped_column(String(200), nullable=False)
    planner_user_email: Mapped[str] = mapped_column(String(320), nullable=False)
    # pending → approved (se creó o habilitó su buzón) | dismissed (un admin la descartó)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending", index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
