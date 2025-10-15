"""
Legal Service - Business logic for legal repository operations.
Handles law search, creation, and management.
"""

from datetime import date
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func, desc
from sqlalchemy.sql import text

from src.db.models.legal import LawIssues, Laws, LawArticles, LawTags
from src.db.models.security import Users
from src.schemas.legal import (
    LawCreate,
    LawDetail,
    LawSummary,
    LawSearchResponse,
    LawArticleDetail,
    LawTagCreate,
    LawTagResponse,
)


class LegalService:
    """Service class for legal repository operations."""
    
    def __init__(self, db: Session):
        self.db = db
    
    async def search_laws(
        self,
        query: Optional[str] = None,
        from_date: Optional[date] = None,
        to_date: Optional[date] = None,
        category: Optional[str] = None,
        page: int = 1,
        page_size: int = 25,
    ) -> LawSearchResponse:
        """
        Search laws with filters and pagination.
        """
        # Build base query
        base_query = self.db.query(Laws).join(LawIssues, Laws.IssueID == LawIssues.IssueID)
        
        # Apply filters
        if query:
            # Full-text search on title and summary
            search_condition = or_(
                Laws.Title.contains(query),
                Laws.Summary.contains(query),
                Laws.LawNumber.contains(query)
            )
            base_query = base_query.filter(search_condition)
        
        if from_date:
            base_query = base_query.filter(LawIssues.PublicationDate >= from_date)
        
        if to_date:
            base_query = base_query.filter(LawIssues.PublicationDate <= to_date)
        
        if category:
            base_query = base_query.filter(Laws.Category == category)
        
        # Get total count
        total = base_query.count()
        
        # Apply pagination and ordering
        laws = (
            base_query
            .order_by(desc(LawIssues.PublicationDate))
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )
        
        # Convert to response models
        law_summaries = []
        for law in laws:
            # Get the issue for this law
            issue = self.db.query(LawIssues).filter(LawIssues.IssueID == law.IssueID).first()
            law_summary = LawSummary(
                law_id=law.LawID,
                law_number=law.LawNumber,
                title=law.Title,
                issue_id=law.IssueID,
                publication_date=issue.PublicationDate if issue else None,
                pdf_url=issue.SourceURL if issue else None,
                category=law.Category,
                effective_date=law.EffectiveDate,
            )
            law_summaries.append(law_summary)
        
        return LawSearchResponse(
            total=total,
            page=page,
            page_size=page_size,
            items=law_summaries,
        )
    
    async def get_law_detail(self, law_id: int) -> Optional[LawDetail]:
        """
        Get detailed information about a specific law.
        """
        law = (
            self.db.query(Laws)
            .join(LawIssues, Laws.IssueID == LawIssues.IssueID)
            .filter(Laws.LawID == law_id)
            .first()
        )
        
        if not law:
            return None
        
        # Get articles for this law
        articles = (
            self.db.query(LawArticles)
            .filter(LawArticles.LawID == law_id)
            .order_by(LawArticles.ArticleNumber)
            .all()
        )
        
        # Get tags for this law
        tags = (
            self.db.query(LawTags)
            .filter(LawTags.LawID == law_id)
            .all()
        )
        
        # Convert articles to detail models
        article_details = []
        for article in articles:
            article_detail = LawArticleDetail(
                article_id=article.ArticleID,
                article_number=article.ArticleNumber,
                content=article.Content,
                keywords=article.Keywords,
            )
            article_details.append(article_detail)
        
        return LawDetail(
            law_id=law.LawID,
            law_number=law.LawNumber,
            title=law.Title,
            issue_id=law.IssueID,
            publication_date=law.issue.PublicationDate if law.issue else None,
            effective_date=law.EffectiveDate,
            pdf_url=law.issue.SourceURL if law.issue else None,
            summary=law.Summary,
            category=law.Category,
            articles=article_details,
            tags=[tag.TagName for tag in tags],
            provenance={
                "ingestion_job_id": law.issue.ETLJobId if law.issue else None,
                "source_url": law.issue.SourceURL if law.issue else None,
                "last_validated_at": law.issue.CreatedAt if law.issue else None,
            },
        )
    
    async def get_law_articles(self, law_id: int) -> List[LawArticleDetail]:
        """
        Get all articles for a specific law.
        """
        articles = (
            self.db.query(LawArticles)
            .filter(LawArticles.LawID == law_id)
            .order_by(LawArticles.ArticleNumber)
            .all()
        )
        
        article_details = []
        for article in articles:
            article_detail = LawArticleDetail(
                article_id=article.ArticleID,
                article_number=article.ArticleNumber,
                content=article.Content,
                keywords=article.Keywords,
            )
            article_details.append(article_detail)
        
        return article_details
    
    async def create_law(self, law_data: LawCreate, user_id: int) -> LawSummary:
        """
        Create a new law entry.
        """
        # Create law record
        law = Laws(
            IssueID=law_data.issue_id,
            LawNumber=law_data.law_number,
            Title=law_data.title,
            Category=law_data.category,
            EffectiveDate=law_data.effective_date,
            Summary=law_data.summary,
        )
        
        self.db.add(law)
        self.db.flush()  # Get the law ID
        
        # Create articles if provided
        if law_data.articles:
            for article_data in law_data.articles:
                article = LawArticles(
                    LawID=law.LawID,
                    ArticleNumber=article_data.article_number,
                    Content=article_data.content,
                    Keywords=article_data.keywords,
                )
                self.db.add(article)
        
        # Create tags if provided
        if law_data.tags:
            for tag_name in law_data.tags:
                tag = LawTags(
                    LawID=law.LawID,
                    TagName=tag_name,
                )
                self.db.add(tag)
        
        self.db.commit()
        self.db.refresh(law)
        
        # Get issue for response
        issue = self.db.query(LawIssues).filter(LawIssues.IssueID == law.IssueID).first()
        
        return LawSummary(
            law_id=law.LawID,
            law_number=law.LawNumber,
            title=law.Title,
            issue_id=law.IssueID,
            publication_date=issue.PublicationDate if issue else None,
            pdf_url=issue.SourceURL if issue else None,
            category=law.Category,
            effective_date=law.EffectiveDate,
        )
    
    async def get_law_issues(
        self, page: int = 1, page_size: int = 25
    ) -> List[Dict[str, Any]]:
        """
        Get list of law issues with pagination.
        """
        issues = (
            self.db.query(LawIssues)
            .order_by(desc(LawIssues.PublicationDate))
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )
        
        issue_list = []
        for issue in issues:
            # Count laws in this issue
            law_count = self.db.query(Laws).filter(Laws.IssueID == issue.IssueID).count()
            
            issue_dict = {
                "issue_id": issue.IssueID,
                "issue_number": issue.IssueNumber,
                "publication_date": issue.PublicationDate,
                "source_url": issue.SourceURL,
                "pdf_path": issue.PDFFilePath,
                "law_count": law_count,
                "created_at": issue.CreatedAt,
            }
            issue_list.append(issue_dict)
        
        return issue_list
    
    async def get_issue_laws(self, issue_id: int) -> List[LawSummary]:
        """
        Get all laws from a specific issue.
        """
        laws = (
            self.db.query(Laws)
            .join(LawIssues, Laws.IssueID == LawIssues.IssueID)
            .filter(Laws.IssueID == issue_id)
            .order_by(Laws.LawNumber)
            .all()
        )
        
        law_summaries = []
        for law in laws:
            law_summary = LawSummary(
                law_id=law.LawID,
                law_number=law.LawNumber,
                title=law.Title,
                issue_id=law.IssueID,
                publication_date=law.issue.PublicationDate if law.issue else None,
                pdf_url=law.issue.SourceURL if law.issue else None,
                category=law.Category,
                effective_date=law.EffectiveDate,
            )
            law_summaries.append(law_summary)
        
        return law_summaries
    
    async def create_law_tag(self, tag_data: LawTagCreate, user_id: int) -> LawTagResponse:
        """
        Create a new law tag.
        """
        tag = LawTags(
            LawID=tag_data.law_id,
            TagName=tag_data.tag_name,
        )
        
        self.db.add(tag)
        self.db.commit()
        self.db.refresh(tag)
        
        return LawTagResponse(
            tag_id=tag.TagID,
            law_id=tag.LawID,
            tag_name=tag.TagName,
        )
    
    async def get_law_tags(self) -> List[LawTagResponse]:
        """
        Get all available law tags.
        """
        tags = self.db.query(LawTags).all()
        
        tag_responses = []
        for tag in tags:
            tag_response = LawTagResponse(
                tag_id=tag.TagID,
                law_id=tag.LawID,
                tag_name=tag.TagName,
            )
            tag_responses.append(tag_response)
        
        return tag_responses
    
    async def get_law_categories(self) -> List[str]:
        """
        Get all available law categories.
        """
        categories = (
            self.db.query(Laws.Category)
            .filter(Laws.Category.isnot(None))
            .distinct()
            .all()
        )
        
        return [cat[0] for cat in categories if cat[0]]
    
    async def get_legal_statistics(self) -> Dict[str, Any]:
        """
        Get statistics about the legal repository.
        """
        # Total laws
        total_laws = self.db.query(Laws).count()
        
        # Total articles
        total_articles = self.db.query(LawArticles).count()
        
        # Total issues
        total_issues = self.db.query(LawIssues).count()
        
        # Laws by category
        category_stats = (
            self.db.query(Laws.Category, func.count(Laws.LawID))
            .filter(Laws.Category.isnot(None))
            .group_by(Laws.Category)
            .all()
        )
        
        # Recent laws (last 30 days)
        from datetime import datetime, timedelta
        thirty_days_ago = datetime.now() - timedelta(days=30)
        recent_laws = (
            self.db.query(Laws)
            .join(LawIssues, Laws.IssueID == LawIssues.IssueID)
            .filter(LawIssues.PublicationDate >= thirty_days_ago.date())
            .count()
        )
        
        return {
            "total_laws": total_laws,
            "total_articles": total_articles,
            "total_issues": total_issues,
            "recent_laws": recent_laws,
            "categories": {cat: count for cat, count in category_stats},
        }
    
    async def user_can_create_laws(self, user: Users) -> bool:
        """
        Check if user has permission to create laws.
        """
        # This would typically check user roles
        # For now, allow all authenticated users
        return True
    
    async def user_can_ingest_documents(self, user: Users) -> bool:
        """
        Check if user has permission to ingest documents.
        """
        # This would typically check for data engineer or admin role
        # For now, allow all authenticated users
        return True
