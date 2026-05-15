from datetime import datetime
from typing import List
from pydantic import BaseModel


class TaskBase(BaseModel):
    title: str
    description: str | None = ""
    due_date: datetime | None = None
    priority: str | None = "medium"
    status: str | None = "pending"
    project_id: int
    assignee_id: int | None = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    due_date: datetime | None = None
    priority: str | None = None
    status: str | None = None
    assignee_id: int | None = None


class TaskRead(TaskBase):
    id: int
    creator_id: int
    created_at: datetime

    class Config:
        orm_mode = True


class CommentCreate(BaseModel):
    task_id: int
    content: str


class CommentRead(BaseModel):
    id: int
    task_id: int
    author_id: int
    content: str
    created_at: datetime

    class Config:
        orm_mode = True
