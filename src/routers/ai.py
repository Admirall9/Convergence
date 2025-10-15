"""
AI Q&A API endpoints for Convergence Platform.
Handles legal question answering with ChatGPT/Claude integration.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from src.core.security import get_current_user
from src.db.models.security import Users
from src.db.session import get_db
from src.schemas.legal import (
    AIQueryRequest,
    AIResponse,
    AIFeedbackRequest,
    AIFeedbackResponse,
)
from src.services.ai_service import AIService

router = APIRouter(tags=["ai"])


@router.post("/query", response_model=AIResponse)
async def submit_ai_query(
    query_request: AIQueryRequest,
    current_user: Optional[Users] = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> AIResponse:
    """
    Submit a legal question to the AI assistant.
    Uses RAG (Retrieval-Augmented Generation) to provide accurate answers with citations.
    """
    try:
        ai_service = AIService(db)
        response = await ai_service.process_legal_query(
            query_request=query_request,
            user_id=current_user.UserID if current_user else None,
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI query failed: {str(e)}")


@router.get("/queries/{query_id}", response_model=dict)
async def get_query_details(
    query_id: str,
    current_user: Optional[Users] = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    """
    Get details of a specific AI query including answer and sources.
    """
    try:
        ai_service = AIService(db)
        
        # Get query details
        from src.db.models.ai import AIQueries, AIAnswers, AIAnswerSources
        from sqlalchemy.orm import joinedload
        
        query = (
            db.query(AIQueries)
            .options(joinedload(AIQueries.answers))
            .filter(AIQueries.QueryID == query_id)
            .first()
        )
        
        if not query:
            raise HTTPException(status_code=404, detail="Query not found")
        
        # Check if user can access this query (own query or admin)
        if current_user and query.UserID != current_user.UserID:
            # Check if user is admin (simplified check)
            if not hasattr(current_user, 'is_admin') or not current_user.is_admin:
                raise HTTPException(status_code=403, detail="Access denied")
        
        # Get answer and sources
        answer = db.query(AIAnswers).filter(AIAnswers.QueryID == query.QueryID).first()
        sources = []
        
        if answer:
            source_records = (
                db.query(AIAnswerSources)
                .filter(AIAnswerSources.AnswerID == answer.AnswerID)
                .all()
            )
            
            for source in source_records:
                sources.append({
                    "law_id": source.LawID,
                    "article_id": source.ArticleID,
                    "excerpt": source.Excerpt,
                    "relevance_score": source.RelevanceScore,
                })
        
        return {
            "query_id": query.QueryID,
            "query_text": query.QueryText,
            "query_date": query.QueryDate,
            "user_id": query.UserID,
            "answer": {
                "answer_text": answer.AnswerText if answer else None,
                "confidence": answer.ConfidenceScore if answer else None,
                "answer_date": answer.AnswerDate if answer else None,
                "sources": sources,
            } if answer else None,
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get query details: {str(e)}")


@router.post("/feedback", response_model=dict)
async def submit_feedback(
    feedback_request: AIFeedbackRequest,
    current_user: Optional[Users] = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    """
    Submit feedback on an AI response.
    Helps improve the AI system's accuracy and relevance.
    """
    try:
        ai_service = AIService(db)
        result = await ai_service.submit_feedback(
            feedback_request=feedback_request,
            user_id=current_user.UserID if current_user else None,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to submit feedback: {str(e)}")


@router.get("/history", response_model=dict)
async def get_query_history(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    current_user: Optional[Users] = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    """
    Get user's AI query history.
    Requires authentication.
    """
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    try:
        ai_service = AIService(db)
        history = await ai_service.get_query_history(
            user_id=current_user.UserID,
            page=page,
            page_size=page_size,
        )
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get query history: {str(e)}")


@router.get("/stats", response_model=dict)
async def get_ai_statistics(
    current_user: Optional[Users] = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    """
    Get AI service statistics.
    Public endpoint for system monitoring.
    """
    try:
        ai_service = AIService(db)
        stats = await ai_service.get_ai_statistics()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get AI statistics: {str(e)}")


@router.get("/providers", response_model=dict)
async def get_available_providers() -> dict:
    """
    Get available AI providers and their status.
    """
    try:
        from src.core.settings import settings
        
        providers = {
            "current_provider": settings.ai_provider,
            "available_providers": ["openai", "anthropic"],
            "openai": {
                "name": "OpenAI GPT-4",
                "status": "available" if settings.openai_api_key else "not_configured",
                "models": ["gpt-4", "gpt-3.5-turbo"],
            },
            "anthropic": {
                "name": "Anthropic Claude",
                "status": "available" if settings.anthropic_api_key else "not_configured",
                "models": ["claude-3-sonnet-20240229", "claude-3-haiku-20240307"],
            },
        }
        
        return providers
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get provider info: {str(e)}")


@router.post("/test", response_model=dict)
async def test_ai_connection(
    current_user: Optional[Users] = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    """
    Test AI provider connection and basic functionality.
    Requires authentication.
    """
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    try:
        ai_service = AIService(db)
        
        # Test with a simple query
        test_query = AIQueryRequest(
            query="What is the purpose of this legal database?",
            max_sources=3,
        )
        
        response = await ai_service.process_legal_query(
            query_request=test_query,
            user_id=current_user.UserID,
        )
        
        return {
            "status": "success",
            "provider": ai_service.provider,
            "test_query": test_query.query,
            "response_received": bool(response.answer_text),
            "confidence": response.confidence,
            "sources_count": len(response.sources),
        }
        
    except Exception as e:
        return {
            "status": "error",
            "provider": getattr(ai_service, 'provider', 'unknown'),
            "error": str(e),
        }


@router.get("/vector/stats", response_model=dict)
async def get_vector_stats(
    current_user: Optional[Users] = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    """
    Get vector database statistics.
    Requires authentication.
    """
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    try:
        from src.services.vector_service import VectorService
        
        vector_service = VectorService()
        stats = await vector_service.get_index_stats()
        
        return {
            "vector_service_available": vector_service.is_available(),
            "index_stats": stats,
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get vector stats: {str(e)}")


@router.post("/vector/rebuild", response_model=dict)
async def rebuild_vector_index(
    current_user: Optional[Users] = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    """
    Rebuild the vector index with all legal documents.
    Requires admin permissions.
    """
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    # Check admin permissions (simplified)
    if not hasattr(current_user, 'is_admin') or not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin permissions required")
    
    try:
        from src.services.vector_service import VectorService
        from src.db.models.legal import Laws, LawArticles
        
        vector_service = VectorService()
        
        if not vector_service.is_available():
            raise HTTPException(status_code=503, detail="Vector service not available")
        
        # Get all laws and articles
        laws = db.query(Laws).all()
        articles = db.query(LawArticles).all()
        
        # Prepare documents for indexing
        documents = []
        
        # Add law titles and summaries
        for law in laws:
            if law.Title:
                documents.append({
                    'id': f"law_{law.LawID}",
                    'text': f"{law.Title}. {law.Summary or ''}",
                    'type': 'law',
                    'law_id': law.LawID,
                    'title': law.Title,
                })
        
        # Add article content
        for article in articles:
            if article.Content:
                documents.append({
                    'id': f"article_{article.ArticleID}",
                    'text': article.Content,
                    'type': 'law_article',
                    'law_id': article.LawID,
                    'article_id': article.ArticleID,
                    'title': f"Article {article.ArticleNumber}",
                })
        
        # Rebuild index
        success = await vector_service.rebuild_index(documents)
        
        if success:
            return {
                "status": "success",
                "message": "Vector index rebuilt successfully",
                "documents_indexed": len(documents),
                "laws_count": len(laws),
                "articles_count": len(articles),
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to rebuild vector index")
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to rebuild vector index: {str(e)}")
