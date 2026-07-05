from datetime import datetime
from pydantic import BaseModel, Field
from pydantic import BaseModel


class AdminContactRequestListItem(BaseModel):
    id: int
    name: str
    email: str
    company: str | None
    service: str | None
    budget: str | None
    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
    
class ContactRequestStatusUpdate(BaseModel):
    status: str = Field(pattern="^(new|contacted|qualified|closed|discarded)$")