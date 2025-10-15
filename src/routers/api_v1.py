from fastapi import APIRouter

from src.routers.gov import router as gov_router
from src.routers.citizen import router as citizen_router
from src.routers.legal import router as legal_router
from src.routers.ai import router as ai_router
from src.modules.budget.router import router as budget_router
from src.modules.budget_etl.router import router as budget_etl_router


api_router = APIRouter()
api_router.include_router(gov_router, prefix="/gov", tags=["gov"])
api_router.include_router(citizen_router, prefix="/citizen", tags=["citizen"])
api_router.include_router(legal_router, prefix="/legal", tags=["legal"])
api_router.include_router(ai_router, prefix="/ai", tags=["ai"])
api_router.include_router(budget_router)
api_router.include_router(budget_etl_router)


