from app.db.session import SessionLocal
from app.models.budget_range import BudgetRange


def seed_budget_ranges():
    db = SessionLocal()

    try:
        budget_ranges = [
            {
                "label": "Menos de US$1,000",
                "min_amount": None,
                "max_amount": 1000,
                "currency": "USD",
                "sort_order": 1,
            },
            {
                "label": "US$1,000 - US$5,000",
                "min_amount": 1000,
                "max_amount": 5000,
                "currency": "USD",
                "sort_order": 2,
            },
            {
                "label": "US$5,000 - US$10,000",
                "min_amount": 5000,
                "max_amount": 10000,
                "currency": "USD",
                "sort_order": 3,
            },
            {
                "label": "Más de US$10,000",
                "min_amount": 10000,
                "max_amount": None,
                "currency": "USD",
                "sort_order": 4,
            },
            {
                "label": "Aún no lo sé",
                "min_amount": None,
                "max_amount": None,
                "currency": "USD",
                "sort_order": 5,
            },
        ]

        for item in budget_ranges:
            exists = (
                db.query(BudgetRange)
                .filter(BudgetRange.label == item["label"])
                .first()
            )

            if not exists:
                db.add(BudgetRange(**item))

        db.commit()
        print("Budget ranges seeded successfully.")

    finally:
        db.close()


if __name__ == "__main__":
    seed_budget_ranges()