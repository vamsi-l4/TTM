from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..core.dependencies import get_db, get_current_admin_user, get_current_active_user
from ..db import crud
from ..schemas.user import UserRead, UserUpdate

router = APIRouter()


@router.get("/me", response_model=UserRead)
def read_current_user(current_user=Depends(get_current_active_user)):
    return current_user


@router.get("/", response_model=List[UserRead])
def list_users(skip: int = 0, limit: int = 50, db: Session = Depends(get_db), _: str = Depends(get_current_admin_user)):
    return crud.get_users(db, skip=skip, limit=limit)


@router.patch("/{user_id}", response_model=UserRead)
def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db), _: str = Depends(get_current_admin_user)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if user_update.role:
        user = crud.update_user_role(db, user, user_update.role)
    return user
