from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError

from .core.config import get_settings
from .db.session import engine
from .db.base import Base
from .api import auth, users, projects, tasks, dashboard

settings = get_settings()

app = FastAPI(title=settings.app_name, docs_url="/api/docs", openapi_url="/api/openapi.json")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=f"{settings.api_prefix}/auth", tags=["Auth"])
app.include_router(users.router, prefix=f"{settings.api_prefix}/users", tags=["Users"])
app.include_router(projects.router, prefix=f"{settings.api_prefix}/projects", tags=["Projects"])
app.include_router(tasks.router, prefix=f"{settings.api_prefix}/tasks", tags=["Tasks"])
app.include_router(dashboard.router, prefix=f"{settings.api_prefix}/dashboard", tags=["Dashboard"])


@app.on_event("startup")
def startup_event():
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully")
    except SQLAlchemyError as exc:
        print("Unable to initialize database", exc)
