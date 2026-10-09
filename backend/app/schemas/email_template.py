from datetime import datetime

from pydantic import BaseModel, Field

HEX_COLOR = r"^#[0-9a-fA-F]{6}$"
HTTP_URL = r"^https?://[^\s\"'<>]+$"


class SocialLink(BaseModel):
    label: str = Field(min_length=1, max_length=40)
    url: str = Field(pattern=HTTP_URL, max_length=500)


class EmailTemplateBase(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    logo_url: str | None = Field(default=None, pattern=HTTP_URL, max_length=500)
    header_background: str = Field(default="#080a0f", pattern=HEX_COLOR)
    accent_color: str = Field(default="#1ec4ff", pattern=HEX_COLOR)
    signature: str | None = Field(default=None, max_length=2_000)
    footer_text: str | None = Field(default=None, max_length=2_000)
    social_links: list[SocialLink] = Field(default_factory=list, max_length=8)


class EmailTemplateCreate(EmailTemplateBase):
    is_default: bool = False


class EmailTemplateUpdate(EmailTemplateBase):
    is_default: bool = False


class EmailTemplateRead(EmailTemplateBase):
    id: int
    is_default: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
