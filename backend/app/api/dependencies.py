from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.auth import get_current_user
from app.models.user import User


def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    return current_user
