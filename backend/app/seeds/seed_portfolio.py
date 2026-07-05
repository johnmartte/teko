from app.db.session import SessionLocal
from app.models.portfolio import PortfolioCategory, PortfolioProject


def seed_portfolio():
    db = SessionLocal()

    try:
        categories = [
            {"name": "Web", "slug": "web", "sort_order": 1},
            {"name": "Mobile", "slug": "mobile", "sort_order": 2},
            {"name": "Branding", "slug": "branding", "sort_order": 3},
            {"name": "Sistemas", "slug": "sistemas", "sort_order": 4},
        ]

        categories_by_slug = {}

        for item in categories:
            category = (
                db.query(PortfolioCategory)
                .filter(PortfolioCategory.slug == item["slug"])
                .first()
            )

            if not category:
                category = PortfolioCategory(**item)
                db.add(category)
                db.flush()

            categories_by_slug[category.slug] = category

        projects = [
            {
                "category_slug": "web",
                "title": "Plataforma de citas médicas",
                "slug": "plataforma-citas-medicas",
                "short_description": "Sistema de agendamiento online con recordatorios automáticos.",
                "image_url": "/portafolio/citas-medicas-light.png",
                "client_name": "HealthCare LATAM",
                "year": 2026,
                "is_featured": True,
                "sort_order": 1,
            },
            {
                "category_slug": "mobile",
                "title": "App de delivery gastronómico",
                "slug": "app-delivery-gastronomico",
                "short_description": "Aplicación móvil con tracking en tiempo real y pagos integrados.",
                "image_url": "/portafolio/delivery-light.png",
                "client_name": "FoodExpress",
                "year": 2026,
                "is_featured": True,
                "sort_order": 2,
            },
            {
                "category_slug": "branding",
                "title": "Identidad visual para fintech",
                "slug": "identidad-visual-fintech",
                "short_description": "Rebrand completo con logo, design system y guía de marca.",
                "image_url": "/portafolio/identidad-fintech-light.png",
                "client_name": "PayFlow",
                "year": 2026,
                "is_featured": False,
                "sort_order": 3,
            },
            {
                "category_slug": "sistemas",
                "title": "CRM empresarial a medida",
                "slug": "crm-empresarial-medida",
                "short_description": "Panel para gestión de clientes, pipelines y automatización comercial.",
                "image_url": "/portafolio/crm-light.png",
                "client_name": "VentasPro",
                "year": 2026,
                "is_featured": False,
                "sort_order": 4,
            },
        ]

        for item in projects:
            category_slug = item.pop("category_slug")
            category = categories_by_slug[category_slug]

            exists = (
                db.query(PortfolioProject)
                .filter(PortfolioProject.slug == item["slug"])
                .first()
            )

            if not exists:
                db.add(
                    PortfolioProject(
                        category_id=category.id,
                        **item,
                    )
                )

        db.commit()
        print("Portfolio seeded successfully.")

    finally:
        db.close()


if __name__ == "__main__":
    seed_portfolio()