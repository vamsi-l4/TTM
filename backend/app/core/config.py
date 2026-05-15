from functools import lru_cache
from pydantic import BaseSettings, PostgresDsn


class Settings(BaseSettings):
    app_name: str = "TaskFlow"
    api_prefix: str = "/api"
    # Allow backend startup even if env vars are not set (dev-friendly).
    # Railway/production should still provide these values.
    database_url: PostgresDsn = "postgresql+psycopg://postgres:nHUUgtqtLZbAojJeVrWvQctdENOpXmLc@postgres.railway.internal:5432/railway"
    jwt_secret_key: str = "dev-secret-change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    frontend_url: str = "http://localhost:5173"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
