from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from app.schemas.email_template import EmailTemplateBase


class EmailMessageListItem(BaseModel):
    id: int
    direction: str
    from_email: str
    to_email: str
    subject: str | None
    snippet: str
    status: str
    is_read: bool
    has_attachments: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class EmailMessageDetail(EmailMessageListItem):
    cc: str | None
    bcc: str | None
    reply_to: str | None
    text_body: str | None
    html_body: str | None
    message_id: str | None
    provider_id: str | None
    error_message: str | None
    updated_at: datetime

    model_config = {"from_attributes": True}


class EmailSendRequest(BaseModel):
    to: list[EmailStr] = Field(min_length=1, max_length=50)
    subject: str = Field(min_length=1, max_length=500)
    body: str = Field(min_length=1, max_length=100_000)
    cc: list[EmailStr] | None = Field(default=None, max_length=50)
    bcc: list[EmailStr] | None = Field(default=None, max_length=50)
    template_id: int | None = None
    reply_to_email_id: int | None = None


class EmailPreviewRequest(BaseModel):
    subject: str | None = Field(default=None, max_length=500)
    body: str = Field(default="", max_length=100_000)
    template_id: int | None = None
    template: EmailTemplateBase | None = None


class EmailPreview(BaseModel):
    html: str


class EmailReadUpdate(BaseModel):
    is_read: bool = True


class EmailInboxSummary(BaseModel):
    unread: int
