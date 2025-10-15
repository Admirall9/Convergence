from typing import Optional
from pydantic import BaseModel, Field


class ETLRunResponse(BaseModel):
    status: str = Field(..., description="Status of the ETL run")
    processed_pdfs: int = Field(..., description="Number of PDFs processed")
    csv_output_dir: str = Field(..., description="Directory where CSVs were stored")
    message: Optional[str] = Field(None, description="Optional message")


