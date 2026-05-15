from datetime import datetime
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    name: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    name: str | None = None
    role: str | None = None


class UserRead(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        orm_mode = True
