from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class InstitutionCreate(BaseModel):
    code: str = Field(max_length=50)
    name: str = Field(max_length=255)
    type: str = Field(max_length=50)
    parent_id: Optional[int] = None


class InstitutionOut(BaseModel):
    id: int
    code: str
    name: str
    type: str
    parent_id: Optional[int] | None

    class Config:
        from_attributes = True


class OfficialCreate(BaseModel):
    person_name: str
    institution_id: int


class OfficialOut(BaseModel):
    id: int
    person_name: str
    institution_id: int

    class Config:
        from_attributes = True


class TenureCreate(BaseModel):
    official_id: int
    role: str
    start_date: datetime
    end_date: Optional[datetime] = None


class TenureOut(BaseModel):
    id: int
    official_id: int
    role: str
    start_date: datetime
    end_date: Optional[datetime] | None

    class Config:
        from_attributes = True


