from fastapi import APIRouter

from app.api.v1.endpoints import admin_catalog, admin_contact_requests, admin_email_templates, admin_emails, admin_mailboxes, auth, budget_ranges, contact_requests, faqs, health, leads, planner_mail, plans, portfolio, services, webhooks

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(health.router)
api_router.include_router(leads.router)
api_router.include_router(contact_requests.router)
api_router.include_router(services.router)
api_router.include_router(budget_ranges.router)
api_router.include_router(admin_contact_requests.router)
api_router.include_router(admin_catalog.router)
api_router.include_router(faqs.router)
api_router.include_router(plans.router)
api_router.include_router(portfolio.router)
api_router.include_router(admin_emails.router)
api_router.include_router(admin_email_templates.router)
api_router.include_router(admin_mailboxes.router)
api_router.include_router(planner_mail.router)
api_router.include_router(webhooks.router)
