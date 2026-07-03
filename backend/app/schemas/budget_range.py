from decimal import Decimal

from pydantic import BaseModel


class BudgetRangeRead(BaseModel):
    id: int
    label: str
    min_amount: Decimal | None
    max_amount: Decimal | None
    currency: str

    model_config = {
        "from_attributes": True
    }