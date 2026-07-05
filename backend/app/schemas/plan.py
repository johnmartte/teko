from decimal import Decimal

from pydantic import BaseModel


class PlanFeatureRead(BaseModel):
    id: int
    text: str
    sort_order: int

    model_config = {
        "from_attributes": True
    }


class PlanRead(BaseModel):
    id: int
    name: str
    slug: str
    tagline: str | None
    currency: str
    monthly_price: Decimal | None
    project_price: Decimal | None
    project_price_label: str | None
    is_highlighted: bool
    features: list[PlanFeatureRead]

    model_config = {
        "from_attributes": True
    }