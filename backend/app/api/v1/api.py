from fastapi import APIRouter

from app.api.v1.endpoints import auth, budget_ranges, contact_requests, health, leads, services, admin_contact_requests, faqs, plans, portfolio

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(health.router)
api_router.include_router(leads.router)
api_router.include_router(contact_requests.router)
api_router.include_router(services.router)
api_router.include_router(budget_ranges.router)
api_router.include_router(admin_contact_requests.router)
api_router.include_router(faqs.router)
api_router.include_router(plans.router)
api_router.include_router(portfolio.router)