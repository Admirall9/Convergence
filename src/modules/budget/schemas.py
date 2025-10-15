from typing import Any, Optional
from pydantic import BaseModel, Field


class SpendingAggregateRequest(BaseModel):
    year: int = Field(2024, description="Year to filter on")
    region: Optional[str] = Field(None, description="Region filter")
    ministry: Optional[str] = Field(None, description="Ministry filter")


class SpendingAggregateResponse(BaseModel):
    data: Any


