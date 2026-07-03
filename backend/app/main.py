from fastapi import FastAPI

from app.api.v1.api import api_router
from app.core.config import settings
from app.core.cors import setup_cors


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version="0.1.0",
    )

    setup_cors(app)
    app.include_router(api_router, prefix=settings.API_V1_PREFIX)

    @app.get("/")
    def root():
        return {
            "success": True,
            "message": "TEKO API funcionando, ESTA VIVAAAAAAAAAAAAAAAAAAAAAAAA",
            "environment": settings.ENVIRONMENT,
        }

    return app


app = create_app()