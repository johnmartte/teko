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

            if category:
                for key, value in category_data.items():
                    setattr(category, key, value)
            else:
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
                "category_slug": "diseno-branding",
                "title": "Landing Pages & Sitios Web",
                "slug": "landing-pages-sitios-web",
                "description": "- Diseño visual orientado a conversión\n- Maquetas Figma listas para desarrollo\n- Responsive y mobile-first",
                "type": "service",
                "icon_key": "globe",
                "badge": "Web",
                "sort_order": 3,
            },
            {
                "category_slug": "diseno-branding",
                "title": "Presentaciones & Pitch Decks",
                "slug": "presentaciones-pitch-decks",
                "description": "- Pitch para inversionistas y clientes\n- Catálogos y portafolios digitales\n- Presentaciones de marca corporativa",
                "type": "service",
                "icon_key": "presentation",
                "badge": "Pitch",
                "sort_order": 4,
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
                "category_slug": "desarrollo-web-software",
                "title": "Mantenimiento & Soporte",
                "slug": "mantenimiento-soporte",
                "description": "- Actualizaciones y correcciones continuas\n- Monitoreo de rendimiento\n- Soporte técnico mensual",
                "type": "service",
                "icon_key": "wrench",
                "badge": "Ops",
                "sort_order": 3,
            },
            {
                "category_slug": "infraestructura-cloud",
                "title": "Servidores & Hosting",
                "slug": "servidores-hosting",
                "description": "- AWS, Vercel, DigitalOcean, Cloudflare\n- Configuración de dominios, DNS y SSL\n- Seguridad y respaldos automáticos",
                "type": "service",
                "icon_key": "cloud",
                "badge": "Cloud",
                "sort_order": 1,
            },
            {
                "category_slug": "infraestructura-cloud",
                "title": "DevOps & Automatización",
                "slug": "devops-automatizacion",
                "description": "- Pipelines de deployment automáticos\n- Control de versiones y ambientes\n- Monitoreo y alertas en tiempo real",
                "type": "service",
                "icon_key": "git_branch",
                "badge": "CI/CD",
                "sort_order": 2,
            },
            {
                "category_slug": "infraestructura-cloud",
                "title": "Consultoría Tecnológica",
                "slug": "consultoria-tecnologica",
                "description": "- Auditoría tecnológica de productos existentes\n- Arquitectura de software para startups\n- Selección de stack tecnológico",
                "type": "service",
                "icon_key": "message_square",
                "badge": "Consult",
                "sort_order": 3,
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
                "title": "Badges & Certificados",
                "slug": "badges-certificados",
                "description": "Badges digitales con validación QR para cursos, eventos y diplomas.",
                "type": "microservice",
                "icon_key": "award",
                "badge": "Microservicio",
                "sort_order": 2,
            },
            {
                "category_slug": "microservicios",
                "title": "Flyers & Redes Sociales",
                "slug": "flyers-redes-sociales",
                "description": "Pack mensual de piezas gráficas para Instagram, Facebook y WhatsApp.",
                "type": "microservice",
                "icon_key": "image",
                "badge": "Microservicio",
                "sort_order": 3,
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
                "sort_order": 4,
            },
            {
                "category_slug": "microservicios",
                "title": "Sistema de Facturación",
                "slug": "sistema-facturacion",
                "description": "Genera cotizaciones y facturas PDF profesionales en segundos.",
                "type": "microservice",
                "icon_key": "file_text",
                "badge": "Microservicio",
                "sort_order": 5,
            },
            {
                "category_slug": "microservicios",
                "title": "Formulario de Pedidos",
                "slug": "formulario-pedidos",
                "description": "Página de pedidos o reservas online conectada a WhatsApp o email.",
                "type": "microservice",
                "icon_key": "clipboard_list",
                "badge": "Microservicio",
                "sort_order": 6,
            },
            {
                "category_slug": "microservicios",
                "title": "Link de Cobro",
                "slug": "link-cobro",
                "description": "Página de pago personalizada para transferencia o tarjeta.",
                "type": "microservice",
                "icon_key": "credit_card",
                "badge": "Microservicio",
                "sort_order": 7,
            },
            {
                "category_slug": "microservicios",
                "title": "CRM Básico",
                "slug": "crm-basico",
                "description": "Panel para gestionar contactos, clientes y seguimientos.",
                "type": "microservice",
                "icon_key": "users",
                "badge": "Microservicio",
                "sort_order": 8,
            },
            {
                "category_slug": "microservicios",
                "title": "Chatbot WhatsApp",
                "slug": "chatbot-whatsapp",
                "description": "Flujos de atención al cliente automatizados 24/7.",
                "type": "microservice",
                "icon_key": "message_circle",
                "badge": "Microservicio",
                "sort_order": 9,
            },
            {
                "category_slug": "microservicios",
                "title": "Notificaciones Auto.",
                "slug": "notificaciones-auto",
                "description": "Recordatorios de citas, pagos o entregas por WhatsApp.",
                "type": "microservice",
                "icon_key": "bell",
                "badge": "Microservicio",
                "sort_order": 10,
            },
            {
                "category_slug": "microservicios",
                "title": "Tarjeta Digital NFC",
                "slug": "tarjeta-digital-nfc",
                "description": "Tarjeta de presentación digital con NFC y QR personalizado.",
                "type": "microservice",
                "icon_key": "nfc_card",
                "badge": "Microservicio",
                "sort_order": 11,
            },
            {
                "category_slug": "microservicios",
                "title": "Kit Redes Sociales",
                "slug": "kit-redes-sociales",
                "description": "Plantillas de portadas, stories, highlights y posts editables.",
                "type": "microservice",
                "icon_key": "layout_grid",
                "badge": "Microservicio",
                "sort_order": 12,
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

            if service:
                service.category_id = category.id

                for key, value in service_data.items():
                    setattr(service, key, value)
            else:
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