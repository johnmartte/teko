from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class AdminPasskey(Base):
    __tablename__ = "admin_passkeys"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    admin_user_id: Mapped[int] = mapped_column(ForeignKey("admin_users.id", ondelete="CASCADE"), index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(80), nullable=False)
    credential_id: Mapped[str] = mapped_column(String(512), unique=True, index=True, nullable=False)
    public_key: Mapped[str] = mapped_column(Text, nullable=False)  # base64url de la clave pública COSE
    sign_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    last_used_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
