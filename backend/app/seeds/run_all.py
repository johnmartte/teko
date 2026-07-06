from app.seeds.seed_budget_ranges import seed_budget_ranges
from app.seeds.seed_faqs import seed_faqs
from app.seeds.seed_plans import seed_plans
from app.seeds.seed_portfolio import seed_portfolio
from app.seeds.seed_services import seed_services


def run_all_seeds():
    seed_services()
    seed_budget_ranges()
    seed_faqs()
    seed_plans()
    seed_portfolio()

    print("All seeds completed successfully.")


if __name__ == "__main__":
    run_all_seeds()