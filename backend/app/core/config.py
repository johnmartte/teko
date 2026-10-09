import json
from typing import Annotated

from pydantic import field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "TEKO API"
    API_V1_PREFIX: str = "/api/v1"
    ENVIRONMENT: str = "development"

    DATABASE_URL: str = "postgresql+psycopg://postgres:postgres@localhost:5432/teko"

    SECRET_KEY: str = "dev-secret-change-me"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    RESEND_API_URL: str = "https://api.resend.com"
    RESEND_API_KEY: str = ""
    RESEND_WEBHOOK_SECRET: str = ""
    RESEND_FROM_EMAIL: str = ""
    RESEND_FROM_NAME: str = "TEKO"

    # Puente con TEKO Planner. Son dos claves distintas a propósito:
    # PLANNER_BRIDGE_KEY la presenta el servidor del Planner al llamar a /planner/mail;
    # PLANNER_API_KEY la presenta este backend al pedirle empleados a Laravel.
    PLANNER_API_URL: str = "https://teko-planner-bk-production.up.railway.app/api"
    PLANNER_API_KEY: str = ""
    PLANNER_BRIDGE_KEY: str = ""
    # Dirección pública del Planner; se enlaza en el aviso de correo habilitado.
    PLANNER_APP_URL: str = "https://tplanner.teko.do"

    @property
    def MAIL_DOMAIN(self) -> str:
        return self.RESEND_FROM_EMAIL.rsplit("@", 1)[-1].lower() if "@" in self.RESEND_FROM_EMAIL else ""

    BACKEND_CORS_ORIGINS: Annotated[list[str], NoDecode] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://teko-eight.vercel.app",
    ]

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, value):
        if isinstance(value, str):
            if value.lstrip().startswith("["):
                return json.loads(value)
            value = [origin.strip() for origin in value.split(",") if origin.strip()]
        if "*" in value:
            raise ValueError('BACKEND_CORS_ORIGINS no puede contener "*" con credenciales habilitadas')
        return value

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )


settings = Settings()
