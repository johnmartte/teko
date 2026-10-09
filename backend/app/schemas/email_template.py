from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, model_validator

HEX_COLOR = r"^#[0-9a-fA-F]{6}$"
HTTP_URL = r"^https?://[^\s\"'<>]+$"
LOOSE_EMAIL = r"^[^\s@\"'<>]+@[^\s@\"'<>]+\.[^\s@\"'<>]{2,}$"

SignatureStyle = Literal["texto", "completa", "oscura", "compacta"]


class SocialLink(BaseModel):
    label: str = Field(min_length=1, max_length=40)
    url: str = Field(pattern=HTTP_URL, max_length=500)


class SignatureCard(BaseModel):
    name: str = Field(default="", max_length=80)
    title: str | None = Field(default=None, max_length=80)
    phone: str | None = Field(default=None, max_length=40)
    email: str | None = Field(default=None, pattern=LOOSE_EMAIL, max_length=120)
    website: str | None = Field(default=None, pattern=HTTP_URL, max_length=200)
    address: str | None = Field(default=None, max_length=160)
    tagline: str | None = Field(default=None, max_length=80)


class EmailTemplateBase(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    logo_url: str | None = Field(default=None, pattern=HTTP_URL, max_length=500)
    header_background: str = Field(default="#080a0f", pattern=HEX_COLOR)
    accent_color: str = Field(default="#1ec4ff", pattern=HEX_COLOR)
    occasion: str | None = Field(default=None, max_length=40)
    kicker: str | None = Field(default=None, max_length=80)
    headline: str | None = Field(default=None, max_length=160)
    button_label: str | None = Field(default=None, max_length=40)
    button_url: str | None = Field(default=None, pattern=HTTP_URL, max_length=500)
    signature: str | None = Field(default=None, max_length=2_000)
    signature_style: SignatureStyle = "texto"
    signature_card: SignatureCard | None = None
    footer_text: str | None = Field(default=None, max_length=2_000)
    social_links: list[SocialLink] = Field(default_factory=list, max_length=8)

    @model_validator(mode="after")
    def _check_pairs(self):
        if bool(self.button_label and self.button_label.strip()) != bool(self.button_url):
            raise ValueError("El botón necesita texto y URL, o ninguno de los dos.")
        if self.signature_style != "texto" and not (self.signature_card and self.signature_card.name.strip()):
            raise ValueError("La firma necesita al menos un nombre.")
        return self


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
