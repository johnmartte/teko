from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.admin_user import AdminUser
from app.models.plan import Plan
from app.models.portfolio import PortfolioCategory, PortfolioProject
from app.models.service import Service, ServiceCategory
from app.repositories import admin_catalog_repository as repository
from app.schemas.admin_catalog import PlanWrite
from app.security.hashing import hash_password


def _not_found(label: str):
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{label} no encontrado")


def _commit(db: Session, operation):
    try:
        return operation()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe un registro con esos datos o la relación no es válida",
        ) from exc


def list_entities(db: Session, model):
    return repository.list_entities(db, model)


def dashboard_stats(db: Session):
    return repository.dashboard_stats(db)


def _validate_relations(db: Session, model, values: dict):
    relation = None
    if model is Service and values.get("category_id") is not None:
        relation = (ServiceCategory, values["category_id"], "Categoría de servicio")
    elif model is PortfolioProject:
        relation = (PortfolioCategory, values.get("category_id"), "Categoría de portfolio")
    if relation and not repository.get_entity(db, relation[0], relation[1]):
        _not_found(relation[2])


def create_entity(db: Session, model, payload):
    values = payload.model_dump()
    _validate_relations(db, model, values)
    return _commit(db, lambda: repository.create_entity(db, model, values))


def update_entity(db: Session, model, entity_id: int, payload):
    entity = repository.get_entity(db, model, entity_id)
    if not entity:
        _not_found(model.__name__)
    values = payload.model_dump()
    _validate_relations(db, model, values)
    return _commit(db, lambda: repository.update_entity(db, entity, values))


def list_plans(db: Session):
    return repository.list_plans(db)


def create_plan(db: Session, payload: PlanWrite):
    values = payload.model_dump(exclude={"features"})
    features = [item.model_dump() for item in payload.features]
    return _commit(db, lambda: repository.create_plan(db, values, features))


def update_plan(db: Session, plan_id: int, payload: PlanWrite):
    plan = repository.get_entity(db, Plan, plan_id)
    if not plan:
        _not_found("Plan")
    values = payload.model_dump(exclude={"features"})
    features = [item.model_dump() for item in payload.features]
    return _commit(db, lambda: repository.update_plan(db, plan, values, features))


def create_admin(db: Session, payload):
    values = payload.model_dump(exclude={"password"})
    values["password_hash"] = hash_password(payload.password)
    return _commit(db, lambda: repository.create_entity(db, AdminUser, values))


def update_admin_status(db: Session, admin_id: int, is_active: bool, current_admin: AdminUser):
    admin = repository.get_entity(db, AdminUser, admin_id)
    if not admin:
        _not_found("Administrador")
    if not is_active and admin.id == current_admin.id:
        raise HTTPException(status_code=409, detail="No puedes desactivar tu propia cuenta")
    if not is_active and admin.is_active and repository.active_admin_count(db) <= 1:
        raise HTTPException(status_code=409, detail="Debe quedar al menos un administrador activo")
    return repository.update_entity(db, admin, {"is_active": is_active})
