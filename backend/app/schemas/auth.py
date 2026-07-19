from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class RegisterRequest(BaseModel):
    model_config = ConfigDict(extra='forbid')

    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    role: str = Field(default='citizen')

    @field_validator('role')
    @classmethod
    def validate_role(cls, value: str) -> str:
        allowed = {'citizen', 'municipal_officer', 'admin'}
        if value not in allowed:
            raise ValueError('role must be one of citizen, municipal_officer, admin')
        return value


class LoginRequest(BaseModel):
    model_config = ConfigDict(extra='forbid')

    email: EmailStr
    password: str = Field(..., min_length=1)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    created_at: str
