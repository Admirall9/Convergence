from typing import Any, Dict, Optional
import os
import httpx


DEFAULT_BASE = "https://openspending.org/api/3"


async def fetch_spending_data(year: int, region: Optional[str] = None, ministry: Optional[str] = None) -> Dict[str, Any]:
    base_url = os.getenv("OPENSPENDING_API_URL", DEFAULT_BASE)
    # Using cofog-example for demo
    url = f"{base_url}/cubes/cofog-example/aggregate"
    params: Dict[str, Any] = {"drilldown": "cofog1", "cut": f"year:{year}"}

    # Future: extend cuts for region/ministry when dataset supports
    async with httpx.AsyncClient(timeout=20.0) as client:
        resp = await client.get(url, params=params)
        resp.raise_for_status()
        return resp.json()


