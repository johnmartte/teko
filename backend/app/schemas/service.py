from pydantic import BaseModel


class ServiceCategoryRead(BaseModel):
    id: int
    name: str
    slug: str
    display_type: str

    model_config = {
        "from_attributes": True
    }


class ServiceRead(BaseModel):
    id: int
    title: str
    slug: str
    description: str | None
    type: str
    icon_key: str | None
    badge: str | None
    category: ServiceCategoryRead | None

    model_config = {
        "from_attributes": True
    }