from datetime import datetime

from pydantic import BaseModel, Field

# Parte local de la dirección: letras, números y . _ - entre ellas (john.marte, ana_p).
LOCAL_PART = r"^[a-z0-9]+(?:[._-][a-z0-9]+)*$"


class MailboxCreate(BaseModel):
    local_part: str = Field(min_length=1, max_length=64, pattern=LOCAL_PART)
    display_name: str = Field(min_length=1, max_length=150)
    signature: str | None = Field(default=None, max_length=2_000)
    planner_user_id: str = Field(min_length=1, max_length=64)


class MailboxUpdate(BaseModel):
    display_name: str | None = Field(default=None, min_length=1, max_length=150)
    signature: str | None = Field(default=None, max_length=2_000)
    is_active: bool | None = None


class MailboxRead(BaseModel):
    id: int
    address: str
    display_name: str
    signature: str | None
    is_active: bool
    planner_user_id: str
    planner_user_name: str
    planner_user_email: str
    created_at: datetime
    updated_at: datetime
    total_messages: int = 0
    unread_messages: int = 0
    # Solo al habilitar: si se pudo enviar el aviso al correo personal del empleado.
    notice_sent: bool | None = None

    model_config = {"from_attributes": True}


class PlannerUser(BaseModel):
    id: str
    name: str
    email: str
    role: str
    job_title: str | None = None
    mailbox_address: str | None = None


class MailDomain(BaseModel):
    domain: str


class OwnMailbox(BaseModel):
    address: str
    display_name: str
    signature: str | None
    unread: int


class OwnMailboxUpdate(BaseModel):
    signature: str | None = Field(default=None, max_length=2_000)


class MailboxRequestRead(BaseModel):
    id: int
    planner_user_id: str
    planner_user_name: str
    planner_user_email: str
    status: str
    created_at: datetime
    resolved_at: datetime | None
    # Buzón que ya existe para ese empleado (deshabilitado), para ofrecer "Habilitar".
    mailbox_id: int | None = None
    mailbox_address: str | None = None

    model_config = {"from_attributes": True}


class MailboxRequestUpdate(BaseModel):
    status: str = Field(pattern="^dismissed$")


class OwnMailAccess(BaseModel):
    enabled: bool
    address: str | None = None
    request_status: str | None = None
    requested_at: datetime | None = None
