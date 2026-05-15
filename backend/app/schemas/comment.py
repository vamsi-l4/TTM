from datetime import datetime
from pydantic import BaseModel


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

