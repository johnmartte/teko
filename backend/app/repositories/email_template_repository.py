from sqlalchemy.orm import Session

from app.models.email_template import EmailTemplate


def list_templates(db: Session) -> list[EmailTemplate]:
    return db.query(EmailTemplate).order_by(EmailTemplate.is_default.desc(), EmailTemplate.name).all()


def get_by_id(db: Session, template_id: int) -> EmailTemplate | None:
    return db.query(EmailTemplate).filter(EmailTemplate.id == template_id).first()


def clear_default(db: Session, except_id: int | None = None) -> None:
    query = db.query(EmailTemplate).filter(EmailTemplate.is_default.is_(True))
    if except_id is not None:
        query = query.filter(EmailTemplate.id != except_id)
    query.update({EmailTemplate.is_default: False}, synchronize_session=False)


def save(db: Session, template: EmailTemplate) -> EmailTemplate:
    db.add(template)
    db.commit()
    db.refresh(template)
    return template


def delete(db: Session, template: EmailTemplate) -> None:
    db.delete(template)
    db.commit()
