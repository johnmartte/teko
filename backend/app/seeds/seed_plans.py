from app.db.session import SessionLocal
from app.models.plan import Plan, PlanFeature


def seed_plans():
    db = SessionLocal()

    try:
        plans = [
            {
                "name": "Starter",
                "slug": "starter",
                "tagline": "Ideal para pequeños proyectos.",
                "currency": "USD",
                "monthly_price": None,
                "project_price": 499,
                "project_price_label": "Desde",
                "is_highlighted": False,
                "sort_order": 1,
                "features": [
                    "Landing Page",
                    "Diseño Responsivo",
                    "Formulario de Contacto",
                    "SEO Básico",
                ],
            },
            {
                "name": "Professional",
                "slug": "professional",
                "tagline": "La mejor opción para empresas.",
                "currency": "USD",
                "monthly_price": None,
                "project_price": 1499,
                "project_price_label": "Desde",
                "is_highlighted": True,
                "sort_order": 2,
                "features": [
                    "Sitio Web Completo",
                    "Panel Administrativo",
                    "API Personalizada",
                    "Base de Datos",
                    "SEO Avanzado",
                ],
            },
            {
                "name": "Enterprise",
                "slug": "enterprise",
                "tagline": "Soluciones a la medida.",
                "currency": "USD",
                "monthly_price": None,
                "project_price": None,
                "project_price_label": "Cotización",
                "is_highlighted": False,
                "sort_order": 3,
                "features": [
                    "Arquitectura Personalizada",
                    "Integraciones",
                    "Escalabilidad",
                    "Soporte Prioritario",
                ],
            },
        ]

        for item in plans:

            exists = (
                db.query(Plan)
                .filter(Plan.slug == item["slug"])
                .first()
            )

            if exists:
                continue

            features = item.pop("features")

            plan = Plan(**item)

            db.add(plan)
            db.flush()

            for index, feature in enumerate(features, start=1):
                db.add(
                    PlanFeature(
                        plan_id=plan.id,
                        text=feature,
                        sort_order=index,
                    )
                )

        db.commit()

        print("Plans seeded successfully.")

    finally:
        db.close()


if __name__ == "__main__":
    seed_plans()