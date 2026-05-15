from functools import lru_cache
from pydantic import BaseSettings, PostgresDsn


class Settings(BaseSettings):
    app_name: str = "TaskFlow"
    api_prefix: str = "/api"
    database_url: PostgresDsn
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    frontend_url: str = "http://localhost:5173"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
