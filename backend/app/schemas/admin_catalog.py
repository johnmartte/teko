from datetime import datetime
from decimal import Decimal

from typing import Literal

from pydantic import BaseModel, EmailStr, Field, model_validator


class AdminBase(BaseModel):
    model_config = {"from_attributes": True}


class ServiceCategoryWrite(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    slug: str = Field(min_length=2, max_length=180, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    display_type: str = Field(default="section", max_length=50)
    sort_order: int = 0
    is_active: bool = True


class ServiceCategoryAdmin(ServiceCategoryWrite, AdminBase):
    id: int


class ServiceWrite(BaseModel):
    category_id: int | None = None
    title: str = Field(min_length=2, max_length=200)
    slug: str = Field(min_length=2, max_length=220, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    description: str | None = None
    type: str = Field(default="service", pattern="^(service|microservice)$")
    icon_key: str | None = Field(default=None, max_length=100)
    badge: str | None = Field(default=None, max_length=80)
    starting_price: Decimal | None = Field(default=None, ge=0)
    price_suffix: str | None = Field(default=None, max_length=30)
    currency: str = Field(default="USD", min_length=3, max_length=10)
    sort_order: int = 0
    is_active: bool = True


class ServiceAdmin(ServiceWrite, AdminBase):
    id: int


class FAQWrite(BaseModel):
    question: str = Field(min_length=3, max_length=300)
    answer: str = Field(min_length=3)
    sort_order: int = 0
    is_active: bool = True


class FAQAdmin(FAQWrite, AdminBase):
    id: int


class PlanFeatureWrite(BaseModel):
    text: str = Field(min_length=1, max_length=300)
    sort_order: int = 0


class PlanWrite(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    slug: str = Field(min_length=2, max_length=150, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    tagline: str | None = None
    currency: str = Field(default="USD", min_length=3, max_length=10)
    monthly_price: Decimal | None = Field(default=None, ge=0)
    project_price: Decimal | None = Field(default=None, ge=0)
    project_price_label: str | None = Field(default=None, max_length=100)
    is_highlighted: bool = False
    sort_order: int = 0
    is_active: bool = True
    features: list[PlanFeatureWrite] = Field(default_factory=list)


class PlanFeatureAdmin(PlanFeatureWrite, AdminBase):
    id: int


class PlanAdmin(PlanWrite, AdminBase):
    id: int
    features: list[PlanFeatureAdmin]


class BudgetRangeWrite(BaseModel):
    label: str = Field(min_length=1, max_length=100)
    min_amount: Decimal | None = Field(default=None, ge=0)
    max_amount: Decimal | None = Field(default=None, ge=0)
    currency: str = Field(default="USD", min_length=3, max_length=10)
    sort_order: int = 0
    is_active: bool = True

    @model_validator(mode="after")
    def validate_amounts(self):
        if self.min_amount is not None and self.max_amount is not None and self.min_amount > self.max_amount:
            raise ValueError("El monto mínimo no puede ser mayor que el monto máximo")
        return self


class BudgetRangeAdmin(BudgetRangeWrite, AdminBase):
    id: int


class PortfolioCategoryWrite(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    slug: str = Field(min_length=2, max_length=150, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    sort_order: int = 0
    is_active: bool = True


class PortfolioCategoryAdmin(PortfolioCategoryWrite, AdminBase):
    id: int


class PortfolioProjectWrite(BaseModel):
    category_id: int
    title: str = Field(min_length=2, max_length=200)
    slug: str = Field(min_length=2, max_length=220, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    short_description: str = Field(min_length=3)
    metric: str | None = Field(default=None, max_length=100)
    image_url: str | None = Field(default=None, max_length=500)
    image_light_url: str | None = Field(default=None, max_length=500)
    image_dark_url: str | None = Field(default=None, max_length=500)
    project_url: str | None = Field(default=None, max_length=500)
    github_url: str | None = Field(default=None, max_length=500)
    client_name: str | None = Field(default=None, max_length=150)
    year: int | None = Field(default=None, ge=1900, le=2200)
    is_featured: bool = False
    is_active: bool = True
    sort_order: int = 0


class PortfolioProjectAdmin(PortfolioProjectWrite, AdminBase):
    id: int


class AdminUserCreate(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2, max_length=150)
    password: str = Field(min_length=8, max_length=128)
    role: Literal["admin"] = "admin"


class AdminUserStatusUpdate(BaseModel):
    is_active: bool


class DashboardStats(BaseModel):
    contact_requests: int
    new_requests: int
    qualified_requests: int
    active_services: int
    active_projects: int
    active_faqs: int
    active_plans: int


class ContactRequestDetail(BaseModel):
    id: int
    name: str
    email: EmailStr
    company: str | None
    phone: str | None
    service: str | None
    budget: str | None
    message: str
    status: str
    created_at: datetime
    updated_at: datetime
