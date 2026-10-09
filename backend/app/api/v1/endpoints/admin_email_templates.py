from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.email_template import EmailTemplateCreate, EmailTemplateRead, EmailTemplateUpdate
from app.security.dependencies import get_current_admin
from app.services import email_template_service

router = APIRouter(
    prefix="/admin/email-templates",
    tags=["Admin - Email templates"],
)


@router.get("", response_model=list[EmailTemplateRead])
def list_templates(db: Session = Depends(get_db), current_admin=Depends(get_current_admin)):
    return email_template_service.list_templates(db)


@router.post("", response_model=EmailTemplateRead, status_code=201)
def create_template(
    payload: EmailTemplateCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return email_template_service.create_template(db, payload)


@router.put("/{template_id}", response_model=EmailTemplateRead)
def update_template(
    template_id: int,
    payload: EmailTemplateUpdate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return email_template_service.update_template(db, template_id, payload)


@router.delete("/{template_id}", status_code=204)
def delete_template(
    template_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    email_template_service.delete_template(db, template_id)
    return Response(status_code=204)
