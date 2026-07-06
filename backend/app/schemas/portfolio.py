from pydantic import BaseModel


class PortfolioCategoryRead(BaseModel):
    id: int
    name: str
    slug: str

    model_config = {
        "from_attributes": True
    }


class PortfolioProjectRead(BaseModel):
    id: int
    title: str
    slug: str
    short_description: str

    metric: str | None

    image_url: str | None
    image_light_url: str | None
    image_dark_url: str | None

    project_url: str | None
    github_url: str | None

    client_name: str | None
    year: int | None

    is_featured: bool

    category: PortfolioCategoryRead

    model_config = {
        "from_attributes": True
    }