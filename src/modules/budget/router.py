from fastapi import APIRouter, Query, HTTPException

from .service import fetch_spending_data


router = APIRouter(prefix="/api/spending", tags=["Spending"])


@router.get("/aggregate")
async def get_spending(
    year: int = Query(2024, ge=2000, le=2100),
    region: str | None = Query(None),
    ministry: str | None = Query(None),
):
    try:
        return await fetch_spending_data(year=year, region=region, ministry=ministry)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"OpenSpending error: {e}")


