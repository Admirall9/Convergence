"""
Legal Repository API endpoints for Convergence Platform.
Handles law ingestion, search, and AI-powered legal Q&A.
"""

from datetime import date
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session

from src.core.security import get_current_user
from src.db.models.security import Users
from src.db.models.legal import LawIssues, Laws, LawArticles, LawTags
from src.db.session import get_db
from src.schemas.legal import (
    LawCreate,
    LawDetail,
    LawSummary,
    LawSearchResponse,
    LawArticleDetail,
    LawTagCreate,
    LawTagResponse,
)
from src.services.legal_service import LegalService
from src.services.etl_service import ETLService

router = APIRouter(tags=["legal"])


@router.get("/laws", response_model=LawSearchResponse)
async def search_laws(
    q: Optional[str] = Query(None, description="Search query"),
    from_date: Optional[date] = Query(None, description="Start date filter"),
    to_date: Optional[date] = Query(None, description="End date filter"),
    category: Optional[str] = Query(None, description="Law category filter"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(25, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
) -> LawSearchResponse:
    """
    Search laws by keyword, date range, and category.
    Supports full-text search across law titles and content.
    """
    try:
        legal_service = LegalService(db)
        result = await legal_service.search_laws(
            query=q,
            from_date=from_date,
            to_date=to_date,
            category=category,
            page=page,
            page_size=page_size,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")


@router.get("/laws/{law_id}", response_model=LawDetail)
async def get_law_detail(
    law_id: int,
    db: Session = Depends(get_db),
) -> LawDetail:
    """
    Get detailed information about a specific law including all articles.
    """
    try:
        legal_service = LegalService(db)
        law = await legal_service.get_law_detail(law_id)
        if not law:
            raise HTTPException(status_code=404, detail="Law not found")
        return law
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve law: {str(e)}")


@router.get("/laws/{law_id}/articles", response_model=List[LawArticleDetail])
async def get_law_articles(
    law_id: int,
    db: Session = Depends(get_db),
) -> List[LawArticleDetail]:
    """
    Get all articles for a specific law.
    """
    try:
        legal_service = LegalService(db)
        articles = await legal_service.get_law_articles(law_id)
        return articles
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve articles: {str(e)}")


@router.post("/laws", response_model=LawSummary)
async def create_law(
    law_data: LawCreate,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> LawSummary:
    """
    Create a new law entry. Requires appropriate permissions.
    """
    try:
        # Check if user has permission to create laws
        if not await legal_service.user_can_create_laws(current_user):
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        
        legal_service = LegalService(db)
        law = await legal_service.create_law(law_data, current_user.UserID)
        return law
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create law: {str(e)}")


@router.get("/issues", response_model=List[dict])
async def get_law_issues(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(25, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
) -> List[dict]:
    """
    Get list of law issues (Bulletin Officiel issues).
    """
    try:
        legal_service = LegalService(db)
        issues = await legal_service.get_law_issues(page, page_size)
        return issues
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve issues: {str(e)}")


@router.get("/issues/{issue_id}/laws", response_model=List[LawSummary])
async def get_issue_laws(
    issue_id: int,
    db: Session = Depends(get_db),
) -> List[LawSummary]:
    """
    Get all laws from a specific issue.
    """
    try:
        legal_service = LegalService(db)
        laws = await legal_service.get_issue_laws(issue_id)
        return laws
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve issue laws: {str(e)}")


@router.post("/tags", response_model=LawTagResponse)
async def create_law_tag(
    tag_data: LawTagCreate,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> LawTagResponse:
    """
    Create a new tag for laws. Requires appropriate permissions.
    """
    try:
        legal_service = LegalService(db)
        tag = await legal_service.create_law_tag(tag_data, current_user.UserID)
        return tag
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create tag: {str(e)}")


@router.get("/tags", response_model=List[LawTagResponse])
async def get_law_tags(
    db: Session = Depends(get_db),
) -> List[LawTagResponse]:
    """
    Get all available law tags.
    """
    try:
        legal_service = LegalService(db)
        tags = await legal_service.get_law_tags()
        return tags
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve tags: {str(e)}")


@router.post("/etl/ingest", response_model=dict)
async def ingest_law_document(
    file: UploadFile = File(..., description="PDF or document file"),
    source_url: Optional[str] = Query(None, description="Source URL of the document"),
    issue_number: Optional[str] = Query(None, description="Issue number"),
    publication_date: Optional[date] = Query(None, description="Publication date"),
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    """
    Ingest a new law document (PDF) for processing.
    Requires data engineer or admin permissions.
    """
    try:
        # Check permissions
        if not await legal_service.user_can_ingest_documents(current_user):
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        
        etl_service = ETLService(db)
        job_id = await etl_service.ingest_law_document(
            file=file,
            source_url=source_url,
            issue_number=issue_number,
            publication_date=publication_date,
            user_id=current_user.UserID,
        )
        
        return {
            "job_id": job_id,
            "status": "accepted",
            "message": "Document ingestion started",
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {str(e)}")


@router.get("/etl/jobs/{job_id}", response_model=dict)
async def get_etl_job_status(
    job_id: str,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    """
    Get the status of an ETL ingestion job.
    """
    try:
        etl_service = ETLService(db)
        job_status = await etl_service.get_job_status(job_id, current_user.UserID)
        if not job_status:
            raise HTTPException(status_code=404, detail="Job not found")
        return job_status
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get job status: {str(e)}")


@router.get("/categories", response_model=List[str])
async def get_law_categories(
    db: Session = Depends(get_db),
) -> List[str]:
    """
    Get all available law categories.
    """
    try:
        legal_service = LegalService(db)
        categories = await legal_service.get_law_categories()
        return categories
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve categories: {str(e)}")


@router.get("/stats", response_model=dict)
async def get_legal_stats(
    db: Session = Depends(get_db),
) -> dict:
    """
    Get statistics about the legal repository.
    """
    try:
        legal_service = LegalService(db)
        stats = await legal_service.get_legal_statistics()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve statistics: {str(e)}")
