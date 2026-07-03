from pydantic import BaseModel, EmailStr


class AdminUserRead(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: str
    is_active: bool

    model_config = {
        "from_attributes": True,
    }