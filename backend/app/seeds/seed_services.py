from app.db.session import SessionLocal
from app.models.service import Service, ServiceCategory


def seed_services():
    db = SessionLocal()

    try:
        categories_data = [
            {
                "name": "Diseño & Branding",
                "slug": "diseno-branding",
                "display_type": "section",
                "sort_order": 1,
            },
            {
                "name": "Desarrollo Web & Software",
                "slug": "desarrollo-web-software",
                "display_type": "section",
                "sort_order": 2,
            },
            {
                "name": "Infraestructura & Cloud",
                "slug": "infraestructura-cloud",
                "display_type": "section",
                "sort_order": 3,
            },
            {
                "name": "Microservicios",
                "slug": "microservicios",
                "display_type": "microservice",
                "sort_order": 4,
            },
        ]

        categories_by_slug = {}

        for category_data in categories_data:
            category = (
                db.query(ServiceCategory)
                .filter(ServiceCategory.slug == category_data["slug"])
                .first()
            )

            if not category:
                category = ServiceCategory(**category_data)
                db.add(category)
                db.flush()

            categories_by_slug[category.slug] = category

        services_data = [
            {
                "category_slug": "diseno-branding",
                "title": "Identidad Visual Completa",
                "slug": "identidad-visual-completa",
                "description": "- Logo, paleta de colores y tipografía corporativa\n- Brand guidelines y design system completo\n- Variantes para uso digital e impresión",
                "type": "service",
                "icon_key": "palette",
                "badge": "Branding",
                "sort_order": 1,
            },
            {
                "category_slug": "diseno-branding",
                "title": "Diseño de Interfaces",
                "slug": "diseno-de-interfaces",
                "description": "- Wireframes, prototipos y flujos de usuario\n- Diseño de apps web y móviles en Figma\n- Testing de usabilidad",
                "type": "service",
                "icon_key": "layers",
                "badge": "UI / UX",
                "sort_order": 2,
            },
            {
                "category_slug": "desarrollo-web-software",
                "title": "Desarrollo Web",
                "slug": "desarrollo-web",
                "description": "- Sitios y landing pages con React / Next.js\n- Aplicaciones web a medida\n- E-commerce y tiendas online",
                "type": "service",
                "icon_key": "code",
                "badge": "Dev",
                "sort_order": 1,
            },
            {
                "category_slug": "desarrollo-web-software",
                "title": "Integraciones & APIs",
                "slug": "integraciones-apis",
                "description": "- Integración con plataformas externas\n- Automatizaciones de flujo de trabajo\n- Conexión a pagos, CRMs y ERPs",
                "type": "service",
                "icon_key": "plug",
                "badge": "API",
                "sort_order": 2,
            },
            {
                "category_slug": "microservicios",
                "title": "Menú Digital QR",
                "slug": "menu-digital-qr",
                "description": "Menú interactivo vía QR para restaurantes, cafeterías y food trucks.",
                "type": "microservice",
                "icon_key": "qr_code",
                "badge": "Microservicio",
                "starting_price": 149,
                "currency": "USD",
                "sort_order": 1,
            },
            {
                "category_slug": "microservicios",
                "title": "Landing Page Única",
                "slug": "landing-page-unica",
                "description": "Página web rápida con dominio y hosting incluido por 1 año.",
                "type": "microservice",
                "icon_key": "globe",
                "badge": "Microservicio",
                "starting_price": 349,
                "currency": "USD",
                "sort_order": 2,
            },
        ]

        for service_data in services_data:
            category_slug = service_data.pop("category_slug")
            category = categories_by_slug[category_slug]

            service = (
                db.query(Service)
                .filter(Service.slug == service_data["slug"])
                .first()
            )

            if not service:
                service = Service(
                    category_id=category.id,
                    **service_data,
                )
                db.add(service)

        db.commit()
        print("Services seed completed.")

    finally:
        db.close()


if __name__ == "__main__":
    seed_services()