from datetime import datetime
from typing import List
from pydantic import BaseModel


class ProjectBase(BaseModel):
    title: str
    description: str | None = ""
    status: str | None = "planning"
    due_date: datetime | None = None


class ProjectCreate(ProjectBase):
    member_ids: List[int] = []


class ProjectUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: str | None = None
    due_date: datetime | None = None
    member_ids: List[int] | None = None


class ProjectRead(ProjectBase):
    id: int
    owner_id: int
    members: List[dict] = []
    created_at: datetime

    class Config:
        orm_mode = True
