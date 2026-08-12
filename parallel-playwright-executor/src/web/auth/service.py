"""JWT authentication — login, register, token verification."""

import os
from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from web.db.models import UserModel


_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.environ.get("WEB_JWT_SECRET", "")
if not SECRET_KEY:
    raise RuntimeError("WEB_JWT_SECRET environment variable must be set")
ALGORITHM = "HS256"
TOKEN_EXPIRE_HOURS = int(os.environ.get("WEB_JWT_EXPIRE_HOURS", "24"))


def hash_password(password: str) -> str:
    return _pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return _pwd_context.verify(plain, hashed)


def create_access_token(data: dict[str, Any], expires_hours: int = TOKEN_EXPIRE_HOURS) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=expires_hours)
    to_encode["exp"] = expire
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict[str, Any] | None:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


async def register_user(
    db: AsyncSession,
    username: str,
    email: str,
    password: str,
    is_admin: bool = False,
) -> UserModel:
    """Register a new user. Raises ValueError if username/email exists."""
    existing = await db.execute(
        select(UserModel).where(
            (UserModel.username == username) | (UserModel.email == email)
        )
    )
    if existing.scalar_one_or_none():
        raise ValueError("Username or email already exists")

    user = UserModel(
        username=username,
        email=email,
        hashed_password=hash_password(password),
        is_admin=is_admin,
    )
    db.add(user)
    await db.flush()
    return user


async def authenticate_user(
    db: AsyncSession,
    username: str,
    password: str,
) -> UserModel | None:
    """Authenticate user by username + password."""
    result = await db.execute(
        select(UserModel).where(UserModel.username == username)
    )
    user = result.scalar_one_or_none()
    if not user or not user.is_active:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


async def get_user_by_id(db: AsyncSession, user_id: int) -> UserModel | None:
    result = await db.execute(
        select(UserModel).where(UserModel.id == user_id)
    )
    return result.scalar_one_or_none()
