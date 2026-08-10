from sqlalchemy import func
from sqlalchemy.orm import Session, selectinload

from app.models.admin_user import AdminUser
from app.models.contact_request import ContactRequest
from app.models.faq import FAQ
from app.models.plan import Plan, PlanFeature
from app.models.portfolio import PortfolioCategory, PortfolioProject
from app.models.service import Service


def list_entities(db: Session, model, *, options=()):
    query = db.query(model)
    for option in options:
        query = query.options(option)
    order_column = getattr(model, "sort_order", model.id)
    return query.order_by(order_column, model.id).all()


def get_entity(db: Session, model, entity_id: int):
    return db.query(model).filter(model.id == entity_id).first()


def create_entity(db: Session, model, values: dict):
    entity = model(**values)
    db.add(entity)
    db.commit()
    db.refresh(entity)
    return entity


def update_entity(db: Session, entity, values: dict):
    for key, value in values.items():
        setattr(entity, key, value)
    db.add(entity)
    db.commit()
    db.refresh(entity)
    return entity


def list_plans(db: Session):
    return list_entities(db, Plan, options=(selectinload(Plan.features),))


def create_plan(db: Session, values: dict, features: list[dict]):
    plan = Plan(**values)
    plan.features = [PlanFeature(**feature) for feature in features]
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan


def update_plan(db: Session, plan: Plan, values: dict, features: list[dict]):
    for key, value in values.items():
        setattr(plan, key, value)
    plan.features = [PlanFeature(**feature) for feature in features]
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan


def dashboard_stats(db: Session):
    count = lambda model, *filters: db.query(func.count(model.id)).filter(*filters).scalar() or 0
    return {
        "contact_requests": count(ContactRequest),
        "new_requests": count(ContactRequest, ContactRequest.status == "new"),
        "qualified_requests": count(ContactRequest, ContactRequest.status == "qualified"),
        "active_services": count(Service, Service.is_active.is_(True)),
        "active_projects": count(PortfolioProject, PortfolioProject.is_active.is_(True)),
        "active_faqs": count(FAQ, FAQ.is_active.is_(True)),
        "active_plans": count(Plan, Plan.is_active.is_(True)),
    }


def active_admin_count(db: Session) -> int:
    return db.query(func.count(AdminUser.id)).filter(AdminUser.is_active.is_(True)).scalar() or 0
