import html
import re
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class EmailMessage(Base):
    __tablename__ = "email_messages"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    direction: Mapped[str] = mapped_column(String(10), nullable=False, index=True)

    provider_id: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        unique=True,
        index=True,
    )

    message_id: Mapped[str | None] = mapped_column(String(500), nullable=True)

    from_email: Mapped[str] = mapped_column(String(320), nullable=False)
    to_email: Mapped[str] = mapped_column(Text, nullable=False)
    cc: Mapped[str | None] = mapped_column(Text, nullable=True)
    bcc: Mapped[str | None] = mapped_column(Text, nullable=True)
    reply_to: Mapped[str | None] = mapped_column(String(320), nullable=True)

    subject: Mapped[str | None] = mapped_column(String(500), nullable=True)
    text_body: Mapped[str | None] = mapped_column(Text, nullable=True)
    html_body: Mapped[str | None] = mapped_column(Text, nullable=True)

    status: Mapped[str] = mapped_column(String(30), nullable=False, default="received")
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)

    is_read: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    # False cuando el correo pertenece solo a buzones de empleados: el CMS no lo muestra.
    is_general: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, index=True)
    has_attachments: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    sent_by_admin_id: Mapped[int | None] = mapped_column(
        ForeignKey("admin_users.id"),
        nullable=True,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    sent_by = relationship("AdminUser")

    @property
    def snippet(self) -> str:
        if self.text_body:
            source = self.text_body.replace("**", "")
        else:
            source = re.sub(r"<(style|script|head)[^>]*>.*?</\1>", " ", self.html_body or "", flags=re.S | re.I)
            source = html.unescape(re.sub(r"<[^>]+>", " ", source))
        return " ".join(source.split())[:180]
