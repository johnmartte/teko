from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class LeadCreate(BaseModel):
    email: EmailStr
    source: str = Field(default="unknown", max_length=100)


class LeadRead(BaseModel):
    id: int
    email: EmailStr
    source: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }