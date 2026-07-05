from pydantic import BaseModel


class FAQRead(BaseModel):
    id: int
    question: str
    answer: str

    model_config = {
        "from_attributes": True
    }