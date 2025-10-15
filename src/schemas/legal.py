"""
Pydantic schemas for legal repository API.
Defines request/response models for law-related endpoints.
"""

from datetime import date
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class LawArticleBase(BaseModel):
    """Base schema for law articles."""
    article_number: Optional[str] = Field(None, description="Article number (e.g., 'Art. 1')")
    content: str = Field(..., description="Article content")
    keywords: Optional[str] = Field(None, description="Extracted keywords")


class LawArticleCreate(LawArticleBase):
    """Schema for creating law articles."""
    pass


class LawArticleDetail(LawArticleBase):
    """Schema for law article details."""
    article_id: int = Field(..., description="Article ID")
    
    class Config:
        from_attributes = True


class LawTagBase(BaseModel):
    """Base schema for law tags."""
    tag_name: str = Field(..., description="Tag name")


class LawTagCreate(LawTagBase):
    """Schema for creating law tags."""
    law_id: int = Field(..., description="Law ID")


class LawTagResponse(LawTagBase):
    """Schema for law tag responses."""
    tag_id: int = Field(..., description="Tag ID")
    law_id: int = Field(..., description="Law ID")
    
    class Config:
        from_attributes = True


class LawBase(BaseModel):
    """Base schema for laws."""
    law_number: Optional[str] = Field(None, description="Law number (e.g., '01-23')")
    title: str = Field(..., description="Law title")
    category: Optional[str] = Field(None, description="Law category")
    effective_date: Optional[date] = Field(None, description="Effective date")
    summary: Optional[str] = Field(None, description="AI-generated summary")


class LawCreate(LawBase):
    """Schema for creating laws."""
    issue_id: Optional[int] = Field(None, description="Issue ID")
    articles: Optional[List[LawArticleCreate]] = Field(None, description="Law articles")
    tags: Optional[List[str]] = Field(None, description="Law tags")


class LawSummary(LawBase):
    """Schema for law summary (list view)."""
    law_id: int = Field(..., description="Law ID")
    issue_id: Optional[int] = Field(None, description="Issue ID")
    publication_date: Optional[date] = Field(None, description="Publication date")
    pdf_url: Optional[str] = Field(None, description="PDF URL")
    
    class Config:
        from_attributes = True


class LawProvenance(BaseModel):
    """Schema for law provenance information."""
    ingestion_job_id: Optional[str] = Field(None, description="ETL job ID")
    source_url: Optional[str] = Field(None, description="Source URL")
    last_validated_at: Optional[date] = Field(None, description="Last validation date")


class LawDetail(LawSummary):
    """Schema for law details (detail view)."""
    articles: List[LawArticleDetail] = Field(default_factory=list, description="Law articles")
    tags: List[str] = Field(default_factory=list, description="Law tags")
    provenance: LawProvenance = Field(..., description="Provenance information")
    
    class Config:
        from_attributes = True


class LawSearchResponse(BaseModel):
    """Schema for law search response."""
    total: int = Field(..., description="Total number of results")
    page: int = Field(..., description="Current page number")
    page_size: int = Field(..., description="Items per page")
    items: List[LawSummary] = Field(..., description="Search results")


class LawIssueBase(BaseModel):
    """Base schema for law issues."""
    issue_number: Optional[str] = Field(None, description="Issue number")
    publication_date: Optional[date] = Field(None, description="Publication date")
    source_url: Optional[str] = Field(None, description="Source URL")
    pdf_path: Optional[str] = Field(None, description="PDF file path")


class LawIssueCreate(LawIssueBase):
    """Schema for creating law issues."""
    pass


class LawIssueResponse(LawIssueBase):
    """Schema for law issue responses."""
    issue_id: int = Field(..., description="Issue ID")
    law_count: int = Field(..., description="Number of laws in this issue")
    created_at: date = Field(..., description="Creation date")
    
    class Config:
        from_attributes = True


class ETLJobStatus(BaseModel):
    """Schema for ETL job status."""
    job_id: str = Field(..., description="Job ID")
    status: str = Field(..., description="Job status")
    progress: float = Field(..., description="Progress percentage (0-100)")
    errors: List[str] = Field(default_factory=list, description="Error messages")
    records_processed: Optional[int] = Field(None, description="Records processed")
    records_successful: Optional[int] = Field(None, description="Records successful")
    records_failed: Optional[int] = Field(None, description="Records failed")
    created_at: date = Field(..., description="Job creation date")
    updated_at: Optional[date] = Field(None, description="Last update date")


class LegalStatistics(BaseModel):
    """Schema for legal repository statistics."""
    total_laws: int = Field(..., description="Total number of laws")
    total_articles: int = Field(..., description="Total number of articles")
    total_issues: int = Field(..., description="Total number of issues")
    recent_laws: int = Field(..., description="Laws added in last 30 days")
    categories: Dict[str, int] = Field(..., description="Laws by category")


class AIQueryRequest(BaseModel):
    """Schema for AI legal query requests."""
    query: str = Field(..., description="Legal question")
    max_sources: int = Field(5, ge=1, le=10, description="Maximum number of sources")
    include_context: bool = Field(True, description="Include context in response")


class AISource(BaseModel):
    """Schema for AI response sources."""
    law_id: int = Field(..., description="Law ID")
    article_id: Optional[int] = Field(None, description="Article ID")
    excerpt: str = Field(..., description="Relevant excerpt")
    score: float = Field(..., description="Relevance score")
    law_number: Optional[str] = Field(None, description="Law number")
    article_number: Optional[str] = Field(None, description="Article number")


class AIResponse(BaseModel):
    """Schema for AI legal responses."""
    answer_text: str = Field(..., description="AI-generated answer")
    confidence: float = Field(..., description="Confidence score (0-1)")
    sources: List[AISource] = Field(..., description="Source citations")
    disclaimer: str = Field(..., description="Legal disclaimer")
    query_id: Optional[str] = Field(None, description="Query ID for tracking")


class AIFeedbackRequest(BaseModel):
    """Schema for AI response feedback."""
    query_id: str = Field(..., description="Query ID")
    feedback_type: str = Field(..., description="Feedback type (useful, not_useful, incorrect)")
    comment: Optional[str] = Field(None, description="Optional comment")


class AIFeedbackResponse(BaseModel):
    """Schema for AI feedback responses."""
    feedback_id: int = Field(..., description="Feedback ID")
    query_id: str = Field(..., description="Query ID")
    feedback_type: str = Field(..., description="Feedback type")
    comment: Optional[str] = Field(None, description="Comment")
    created_at: date = Field(..., description="Feedback creation date")


class LawUpdateRequest(BaseModel):
    """Schema for updating laws."""
    title: Optional[str] = Field(None, description="Law title")
    category: Optional[str] = Field(None, description="Law category")
    effective_date: Optional[date] = Field(None, description="Effective date")
    summary: Optional[str] = Field(None, description="Summary")
    tags: Optional[List[str]] = Field(None, description="Law tags")


class LawArticleUpdateRequest(BaseModel):
    """Schema for updating law articles."""
    article_number: Optional[str] = Field(None, description="Article number")
    content: Optional[str] = Field(None, description="Article content")
    keywords: Optional[str] = Field(None, description="Keywords")


class BulkLawImportRequest(BaseModel):
    """Schema for bulk law import."""
    issue_id: int = Field(..., description="Issue ID")
    laws: List[LawCreate] = Field(..., description="Laws to import")
    overwrite_existing: bool = Field(False, description="Overwrite existing laws")


class BulkLawImportResponse(BaseModel):
    """Schema for bulk law import response."""
    job_id: str = Field(..., description="Import job ID")
    total_laws: int = Field(..., description="Total laws to import")
    status: str = Field(..., description="Import status")
    message: str = Field(..., description="Status message")
