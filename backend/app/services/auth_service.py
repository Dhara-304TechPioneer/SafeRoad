from sqlalchemy.orm import Session

from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.user import User, UserRole


class AuthService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def register_user(self, name: str, email: str, password: str, role: str) -> tuple[User, str]:
        existing_user = self.db.query(User).filter(User.email == email).first()
        if existing_user is not None:
            raise ValueError('Email already registered')

        user = User(
            name=name,
            email=email,
            password_hash=get_password_hash(password),
            role=UserRole(role),
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        token = create_access_token(user.id)
        return user, token

    def authenticate_user(self, email: str, password: str) -> tuple[User, str] | None:
        user = self.db.query(User).filter(User.email == email).first()
        if not user or not verify_password(password, user.password_hash):
            return None
        token = create_access_token(user.id)
        return user, token
