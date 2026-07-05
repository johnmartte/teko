from datetime import datetime
from decimal import Decimal

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Plan(Base):
    __tablename__ = "plans"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    name: Mapped[str] = mapped_column(String(120), nullable=False)
    slug: Mapped[str] = mapped_column(String(150), unique=True, index=True, nullable=False)
    tagline: Mapped[str | None] = mapped_column(Text, nullable=True)

    currency: Mapped[str] = mapped_column(String(10), nullable=False, default="USD")

    monthly_price: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)
    project_price: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)
    project_price_label: Mapped[str | None] = mapped_column(String(100), nullable=True)

    is_highlighted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    features: Mapped[list["PlanFeature"]] = relationship(
        back_populates="plan",
        cascade="all, delete-orphan",
    )


class PlanFeature(Base):
    __tablename__ = "plan_features"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    plan_id: Mapped[int] = mapped_column(
        ForeignKey("plans.id"),
        nullable=False,
        index=True,
    )

    text: Mapped[str] = mapped_column(String(300), nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    plan: Mapped[Plan] = relationship(back_populates="features")