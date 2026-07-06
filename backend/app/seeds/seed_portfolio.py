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
                "short_description": "Sistema de agendamiento online con integración a calendarios y recordatorios automáticos.",
                "metric": "+40% conversión",
                "image_url": "/portafolio/citas-medicas-light.png",
                "image_light_url": "/portafolio/citas-medicas-light.png",
                "image_dark_url": "/portafolio/citas-medicas-dark.png",
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
                "metric": "50k+ descargas",
                "image_url": "/portafolio/delivery-light.png",
                "image_light_url": "/portafolio/delivery-light.png",
                "image_dark_url": "/portafolio/delivery-dark.png",
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
                "metric": "Brand kit completo",
                "image_url": "/portafolio/identidad-fintech-light.png",
                "image_light_url": "/portafolio/identidad-fintech-light.png",
                "image_dark_url": "/portafolio/identidad-fintech-dark.png",
                "client_name": "PayFlow",
                "year": 2026,
                "is_featured": False,
                "sort_order": 3,
            },
            {
                "category_slug": "sistemas",
                "title": "CRM empresarial a medida",
                "slug": "crm-empresarial-medida",
                "short_description": "Panel de gestión de clientes, pipelines y automatización de seguimientos.",
                "metric": "-60% tiempo operativo",
                "image_url": "/portafolio/crm-light.png",
                "image_light_url": "/portafolio/crm-light.png",
                "image_dark_url": "/portafolio/crm-dark.png",
                "client_name": "VentasPro",
                "year": 2026,
                "is_featured": False,
                "sort_order": 4,
            },
            
                        {
                "category_slug": "web",
                "title": "E-commerce de moda",
                "slug": "ecommerce-moda",
                "short_description": "Tienda online con catálogo dinámico, pagos y gestión de inventario.",
                "metric": "+220% ventas online",
                "image_url": "/portafolio/ecommerce-light.png",
                "image_light_url": "/portafolio/ecommerce-light.png",
                "image_dark_url": "/portafolio/ecommerce-dark.png",
                "client_name": "Urban Style",
                "year": 2026,
                "is_featured": False,
                "sort_order": 5,
            },
            {
                "category_slug": "mobile",
                "title": "App de reservas de barbería",
                "slug": "app-reservas-barberia",
                "short_description": "Reservas por WhatsApp, panel de profesionales y recordatorios automáticos.",
                "metric": "3min tiempo de reserva",
                "image_url": "/portafolio/barberia-light.png",
                "image_light_url": "/portafolio/barberia-light.png",
                "image_dark_url": "/portafolio/barberia-dark.png",
                "client_name": "BarberNow",
                "year": 2026,
                "is_featured": False,
                "sort_order": 6,
            },
            {
                "category_slug": "web",
                "title": "Landing page SaaS B2B",
                "slug": "landing-page-saas-b2b",
                "short_description": "Landing de alta conversión con animaciones, A/B testing y analítica integrada.",
                "metric": "+180% leads calificados",
                "image_url": "/portafolio/landing-light.png",
                "image_light_url": "/portafolio/landing-light.png",
                "image_dark_url": "/portafolio/landing-dark.png",
                "client_name": "Cloudify",
                "year": 2026,
                "is_featured": False,
                "sort_order": 7,
            },
            {
                "category_slug": "sistemas",
                "title": "Sistema de facturación fiscal",
                "slug": "sistema-facturacion-fiscal",
                "short_description": "Generación de facturas electrónicas con validación y envío automático.",
                "metric": "10k+ facturas/mes",
                "image_url": "/portafolio/factura-light.png",
                "image_light_url": "/portafolio/factura-light.png",
                "image_dark_url": "/portafolio/factura-dark.png",
                "client_name": "ContaFiscal",
                "year": 2026,
                "is_featured": False,
                "sort_order": 8,
            },
            {
                "category_slug": "branding",
                "title": "Branding — Agencia creativa",
                "slug": "branding-agencia-creativa",
                "short_description": "Nueva identidad visual con paleta moderna, tipografía editorial y aplicaciones.",
                "metric": "Design system v1.0",
                "image_url": "/portafolio/branding-light.png",
                "image_light_url": "/portafolio/branding-light.png",
                "image_dark_url": "/portafolio/branding-dark.png",
                "client_name": "Neon Studio",
                "year": 2026,
                "is_featured": False,
                "sort_order": 9,
            },
        ]

        for item in projects:
            category_slug = item.pop("category_slug")
            category = categories_by_slug[category_slug]

            project = (
                db.query(PortfolioProject)
                .filter(PortfolioProject.slug == item["slug"])
                .first()
            )

            if project:
                project.category_id = category.id

                for key, value in item.items():
                    setattr(project, key, value)
            else:
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