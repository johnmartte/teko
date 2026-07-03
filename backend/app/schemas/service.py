from pydantic import BaseModel

class ServiceRead(BaseModel):
    id: int
    title: str
    slug: str
    type: str
    badge: str | None

    model_config = {
        "from_attributes": True
    }