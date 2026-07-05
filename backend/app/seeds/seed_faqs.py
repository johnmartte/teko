from app.db.session import SessionLocal
from app.models.faq import FAQ


def seed_faqs():
    db = SessionLocal()

    try:
        faqs = [
            {
                "question": "¿Cuánto tarda un proyecto?",
                "answer": "Depende del alcance, pero la mayoría de los proyectos se entregan entre 2 y 8 semanas.",
                "sort_order": 1,
            },
            {
                "question": "¿Trabajan con clientes internacionales?",
                "answer": "Sí. Trabajamos con empresas y emprendedores de cualquier país.",
                "sort_order": 2,
            },
            {
                "question": "¿Qué tecnologías utilizan?",
                "answer": "Trabajamos con React, Next.js, Python, FastAPI, PostgreSQL, Docker y servicios Cloud modernos.",
                "sort_order": 3,
            },
            {
                "question": "¿Ofrecen soporte después de la entrega?",
                "answer": "Sí. Todos nuestros proyectos incluyen un período inicial de soporte y mantenimiento.",
                "sort_order": 4,
            },
            {
                "question": "¿Cómo se solicita una cotización?",
                "answer": "Solo debes completar el formulario de contacto y nos pondremos en comunicación contigo.",
                "sort_order": 5,
            },
        ]

        for item in faqs:
            exists = (
                db.query(FAQ)
                .filter(FAQ.question == item["question"])
                .first()
            )

            if not exists:
                db.add(FAQ(**item))

        db.commit()

        print("FAQs seeded successfully.")

    finally:
        db.close()


if __name__ == "__main__":
    seed_faqs()