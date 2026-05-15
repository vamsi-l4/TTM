from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ..core.config import get_settings
from ..core.dependencies import get_db
from ..core.security import create_access_token
from ..db import crud
from ..schemas.token import Token
from ..schemas.user import UserCreate, UserRead

settings = get_settings()
router = APIRouter()


@router.post("/register", response_model=UserRead)
def register(user_create: UserCreate, db: Session = Depends(get_db)):
    existing = crud.get_user_by_email(db, user_create.email)
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    user = crud.create_user(db, user_create)
    return user


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password", headers={"WWW-Authenticate": "Bearer"})
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(subject=user.email, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}
