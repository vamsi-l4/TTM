from datetime import datetime, timedelta
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from .config import get_settings

settings = get_settings()

# IMPORTANT:
# passlib[bcrypt] needs a working bcrypt backend.
# In some Windows/Python setups, passlib may fail at runtime.
# This defensive setup makes registration work reliably.
try:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    # Probe hashing at startup-time so we fail fast with a clear error.
    # (Using a short password.)
    _ = pwd_context.hash("Test1234")
except Exception as exc:
    # Fall back to PBKDF2 if bcrypt backend is unavailable.
    # PBKDF2 is pure-Python in passlib and much more reliable.
    pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(subject: str, expires_delta: Optional[timedelta] = None) -> str:
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=settings.access_token_expire_minutes)
    )
    payload = {"sub": subject, "exp": expire}
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(
            token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm]
        )
        return payload
    except JWTError:
        return None

