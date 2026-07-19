from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_active_user
from app.models.user import User
from app.schemas.user import UserPublic

router = APIRouter()


@router.get('/me', response_model=UserPublic)
def read_current_user(current_user: User = Depends(get_current_active_user)) -> UserPublic:
    return UserPublic(id=current_user.id, name=current_user.name, email=current_user.email, role=current_user.role.value)
