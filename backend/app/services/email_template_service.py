from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.email_template import EmailTemplate
from app.repositories import email_template_repository
from app.schemas.email_template import EmailTemplateCreate, EmailTemplateUpdate


def list_templates(db: Session) -> list[EmailTemplate]:
    return email_template_repository.list_templates(db)


def get_template(db: Session, template_id: int) -> EmailTemplate:
    template = email_template_repository.get_by_id(db, template_id)
    if not template:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plantilla no encontrada")
    return template


def _apply(template: EmailTemplate, payload: EmailTemplateCreate | EmailTemplateUpdate) -> None:
    data = payload.model_dump()
    data["social_links"] = [link.model_dump() for link in payload.social_links]
    for key, value in data.items():
        setattr(template, key, value)


def create_template(db: Session, payload: EmailTemplateCreate) -> EmailTemplate:
    template = EmailTemplate()
    _apply(template, payload)
    if payload.is_default:
        email_template_repository.clear_default(db)
    return email_template_repository.save(db, template)


def update_template(db: Session, template_id: int, payload: EmailTemplateUpdate) -> EmailTemplate:
    template = get_template(db, template_id)
    _apply(template, payload)
    if payload.is_default:
        email_template_repository.clear_default(db, except_id=template.id)
    return email_template_repository.save(db, template)


def delete_template(db: Session, template_id: int) -> None:
    email_template_repository.delete(db, get_template(db, template_id))
