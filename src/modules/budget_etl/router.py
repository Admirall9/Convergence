from fastapi import APIRouter, HTTPException

from .etl_service import etl_process
from .schemas import ETLRunResponse


router = APIRouter(prefix="/api/budget_etl", tags=["Budget ETL"])


@router.post("/run", response_model=ETLRunResponse)
async def run_etl():
    try:
        processed = etl_process()
        return ETLRunResponse(
            status="ok",
            processed_pdfs=processed,
            csv_output_dir=r"D:\LLM_Models\Convergence\Data_Sourcing\csvs",
            message="ETL completed",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ETL failed: {e}")


