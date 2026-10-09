from datetime import datetime

from sqlalchemy import JSON, Boolean, DateTime, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class EmailTemplate(Base):
    __tablename__ = "email_templates"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    is_default: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    logo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    header_background: Mapped[str] = mapped_column(String(7), nullable=False, default="#080a0f")
    accent_color: Mapped[str] = mapped_column(String(7), nullable=False, default="#1ec4ff")

    # Cabecera de la ocasión: etiqueta, antetítulo, titular y botón.
    occasion: Mapped[str | None] = mapped_column(String(40), nullable=True)
    kicker: Mapped[str | None] = mapped_column(String(80), nullable=True)
    headline: Mapped[str | None] = mapped_column(String(160), nullable=True)
    button_label: Mapped[str | None] = mapped_column(String(40), nullable=True)
    button_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    signature: Mapped[str | None] = mapped_column(Text, nullable=True)
    signature_style: Mapped[str] = mapped_column(String(12), nullable=False, default="texto")
    signature_card: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    footer_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    social_links: Mapped[list] = mapped_column(JSON, nullable=False, default=list)

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
