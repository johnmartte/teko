from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class ContactRequestCreate(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    email: EmailStr
    company: str | None = Field(default=None, max_length=200)
    phone: str | None = Field(default=None, max_length=50)

    service_id: int | None = None
    budget_range_id: int | None = None

    message: str = Field(min_length=10, max_length=3000)


class ContactRequestRead(BaseModel):
    id: int
    lead_id: int
    name: str
    company: str | None
    phone: str | None
    service_id: int | None
    budget_range_id: int | None
    message: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }