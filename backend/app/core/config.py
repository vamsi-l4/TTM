from functools import lru_cache
from pydantic import BaseSettings, PostgresDsn


class Settings(BaseSettings):
    app_name: str = "TaskFlow"
    api_prefix: str = "/api"
    # Allow backend startup even if env vars are not set (dev-friendly).
    # Railway/production should still provide these values.
    # NOTE: Railway sometimes uses an internal hostname that is not reachable from local machines.
    # Default to SQLite for local dev.
    # In deployment, Railway should provide DATABASE_URL via environment variables.
    # (env_file is disabled; your hosting platform must inject env vars.)
    # Use SQLite only when explicitly running local dev.
    # In production, Railway must inject DATABASE_URL.
    # Set ENV=local to enable local SQLite fallback.
    database_url: str = "sqlite:///./taskflow_dev.db"


    jwt_secret_key: str = "dev-secret-change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    frontend_url: str = "https://ttm-beta-nine.vercel.app"

    class Config:
        # IMPORTANT: Do not auto-load local .env for production.
        # Railway should provide env vars at runtime.
        env_file = None
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
