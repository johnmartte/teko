from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.admin_user import AdminUser
from app.models.budget_range import BudgetRange
from app.models.faq import FAQ
from app.models.portfolio import PortfolioCategory, PortfolioProject
from app.models.service import Service, ServiceCategory
from app.schemas.admin_catalog import (
    AdminUserCreate, AdminUserStatusUpdate, BudgetRangeAdmin, BudgetRangeWrite,
    DashboardStats, FAQAdmin, FAQWrite, PlanAdmin, PlanWrite,
    PortfolioCategoryAdmin, PortfolioCategoryWrite, PortfolioProjectAdmin,
    PortfolioProjectWrite, ServiceAdmin, ServiceCategoryAdmin,
    ServiceCategoryWrite, ServiceWrite,
)
from app.schemas.admin_user import AdminUserRead
from app.security.dependencies import get_current_admin
from app.services import admin_catalog_service as service

router = APIRouter(prefix="/admin", tags=["Admin - Catalog"], dependencies=[Depends(get_current_admin)])


@router.get("/dashboard", response_model=DashboardStats)
def dashboard(db: Session = Depends(get_db)):
    return service.dashboard_stats(db)


def crud_routes(path, model, write_schema, read_schema):
    @router.get(path, response_model=list[read_schema])
    def list_items(db: Session = Depends(get_db)):
        return service.list_entities(db, model)

    @router.post(path, response_model=read_schema, status_code=201)
    def create_item(payload: write_schema, db: Session = Depends(get_db)):
        return service.create_entity(db, model, payload)

    @router.put(f"{path}/{{entity_id}}", response_model=read_schema)
    def update_item(entity_id: int, payload: write_schema, db: Session = Depends(get_db)):
        return service.update_entity(db, model, entity_id, payload)


crud_routes("/service-categories", ServiceCategory, ServiceCategoryWrite, ServiceCategoryAdmin)
crud_routes("/services", Service, ServiceWrite, ServiceAdmin)
crud_routes("/faqs", FAQ, FAQWrite, FAQAdmin)
crud_routes("/budget-ranges", BudgetRange, BudgetRangeWrite, BudgetRangeAdmin)
crud_routes("/portfolio-categories", PortfolioCategory, PortfolioCategoryWrite, PortfolioCategoryAdmin)
crud_routes("/portfolio-projects", PortfolioProject, PortfolioProjectWrite, PortfolioProjectAdmin)


@router.get("/plans", response_model=list[PlanAdmin])
def list_plans(db: Session = Depends(get_db)):
    return service.list_plans(db)


@router.post("/plans", response_model=PlanAdmin, status_code=201)
def create_plan(payload: PlanWrite, db: Session = Depends(get_db)):
    return service.create_plan(db, payload)


@router.put("/plans/{plan_id}", response_model=PlanAdmin)
def update_plan(plan_id: int, payload: PlanWrite, db: Session = Depends(get_db)):
    return service.update_plan(db, plan_id, payload)


@router.get("/admin-users", response_model=list[AdminUserRead])
def list_admins(db: Session = Depends(get_db)):
    return service.list_entities(db, AdminUser)


@router.post("/admin-users", response_model=AdminUserRead, status_code=201)
def create_admin(payload: AdminUserCreate, db: Session = Depends(get_db)):
    return service.create_admin(db, payload)


@router.patch("/admin-users/{admin_id}/status", response_model=AdminUserRead)
def update_admin_status(admin_id: int, payload: AdminUserStatusUpdate, db: Session = Depends(get_db), current_admin: AdminUser = Depends(get_current_admin)):
    return service.update_admin_status(db, admin_id, payload.is_active, current_admin)
