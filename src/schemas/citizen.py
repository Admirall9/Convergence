from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)


class UserOut(BaseModel):
    id: int
    email: EmailStr
    is_active: bool

    class Config:
        from_attributes = True


class ReviewCreate(BaseModel):
    official_id: int
    rating: int = Field(ge=1, le=5)
    content: str = Field(max_length=2000)


class ReviewOut(BaseModel):
    id: int
    user_id: int
    official_id: int
    rating: int
    content: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


