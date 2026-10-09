from datetime import datetime

from pydantic import BaseModel


class AdminNotificationRead(BaseModel):
    id: int
    kind: str
    title: str
    body: str | None
    module: str | None
    ref_id: int | None
    created_at: datetime
    is_read: bool = False

    model_config = {"from_attributes": True}


class AdminNotificationSummary(BaseModel):
    unread: int
