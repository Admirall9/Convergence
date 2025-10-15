"""
AI Service - Business logic for AI-powered legal Q&A.
Handles ChatGPT/Claude integration with RAG (Retrieval-Augmented Generation).
"""

import asyncio
import json
import logging
from datetime import datetime
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session

from src.core.settings import settings
from src.db.models.legal import Laws, LawArticles
from src.db.models.ai import AIQueries, AIAnswers, AIAnswerSources, AIUserFeedback
from src.schemas.legal import AIQueryRequest, AIResponse, AISource, AIFeedbackRequest
# VectorService import removed - using external AI only

logger = logging.getLogger(__name__)


class AIService:
    """Service class for AI-powered legal Q&A operations."""
    
    def __init__(self, db: Session):
        self.db = db
        # Disable vector service for external AI only
        self.vector_service = None
        self.provider = settings.ai_provider
        self.client = self._initialize_client()
    
    def _initialize_client(self):
        """Initialize AI provider client."""
        if self.provider == "openai":
            try:
                import openai
                return openai.AsyncOpenAI(api_key=settings.openai_api_key)
            except ImportError:
                logger.error("OpenAI library not installed")
                return None
        elif self.provider == "anthropic":
            try:
                import anthropic
                return anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)
            except ImportError:
                logger.error("Anthropic library not installed")
                return None
        else:
            logger.error(f"Unsupported AI provider: {self.provider}")
            return None
    
    async def process_legal_query(
        self, 
        query_request: AIQueryRequest, 
        user_id: Optional[int] = None
    ) -> AIResponse:
        """
        Process a legal query using RAG (Retrieval-Augmented Generation).
        """
        try:
            # 1. Store the query
            query_record = AIQueries(
                UserID=user_id,
                QueryText=query_request.query,
                QueryDate=datetime.utcnow(),
            )
            self.db.add(query_record)
            self.db.flush()
            
            # 2. Retrieve relevant context using vector search
            context_docs = await self._retrieve_context(
                query_request.query, 
                max_sources=query_request.max_sources
            )
            
            if not context_docs:
                return await self._create_no_context_response(query_record.QueryID)
            
            # 3. Build structured prompt with context
            prompt = self._build_rag_prompt(query_request.query, context_docs)
            
            # 4. Call AI provider
            ai_response = await self._call_ai_provider(prompt)
            
            # 5. Validate and process response
            validated_response = self._validate_response(ai_response, context_docs)
            
            # 6. Store the answer
            answer_record = AIAnswers(
                QueryID=query_record.QueryID,
                AnswerText=validated_response.answer_text,
                ConfidenceScore=validated_response.confidence,
                DisclaimerAdded=True,
                AnswerDate=datetime.utcnow(),
            )
            self.db.add(answer_record)
            self.db.flush()
            
            # 7. Store source citations
            for source in validated_response.sources:
                source_record = AIAnswerSources(
                    AnswerID=answer_record.AnswerID,
                    LawID=source.law_id,
                    ArticleID=source.article_id,
                    Excerpt=source.excerpt,
                    RelevanceScore=source.score,
                )
                self.db.add(source_record)
            
            self.db.commit()
            
            # 8. Return response with query ID
            validated_response.query_id = str(query_record.QueryID)
            return validated_response
            
        except Exception as e:
            logger.error(f"Error processing legal query: {str(e)}")
            self.db.rollback()
            raise
    
    async def _retrieve_context(self, query: str, max_sources: int = 5) -> List[Dict[str, Any]]:
        """
        Retrieve relevant legal context using simple text search (no vector search).
        """
        try:
            # Simple text search instead of vector search
            # Search in law articles for relevant content
            articles = (
                self.db.query(LawArticles)
                .join(Laws, LawArticles.LawID == Laws.LawID)
                .filter(
                    LawArticles.Content.contains(query) |
                    Laws.Title.contains(query) |
                    Laws.LawNumber.contains(query)
                )
                .limit(max_sources)
                .all()
            )
            
            context_docs = []
            for article in articles:
                law = self.db.query(Laws).filter(Laws.LawID == article.LawID).first()
                if law:
                    context_docs.append({
                        'law_id': law.LawID,
                        'law_number': law.LawNumber,
                        'law_title': law.Title,
                        'article_id': article.ArticleID,
                        'article_number': article.ArticleNumber,
                        'content': article.Content,
                        'relevance_score': 0.8,  # Default score for text match
                    })
            
            return context_docs
            
        except Exception as e:
            logger.error(f"Error retrieving context: {str(e)}")
            return []
    
    def _build_rag_prompt(self, query: str, context_docs: List[Dict[str, Any]]) -> str:
        """
        Build a structured prompt with retrieved context.
        """
        context_text = ""
        for i, doc in enumerate(context_docs, 1):
            context_text += f"""
Source {i}:
Law: {doc['law_number']} - {doc['law_title']}
Article: {doc['article_number']}
Content: {doc['content'][:500]}...
Relevance: {doc['relevance_score']:.2f}

"""
        
        prompt = f"""You are a legal assistant for Moroccan law. Answer the user's question based ONLY on the provided legal sources. 

IMPORTANT RULES:
1. Only use information from the provided sources
2. Always cite the specific law number and article number
3. Include relevant excerpts from the sources
4. If the question cannot be answered from the sources, say so clearly
5. Add a disclaimer that this is informational and not legal advice
6. Respond in the same language as the question (Arabic, French, or English)

SOURCES:
{context_text}

QUESTION: {query}

ANSWER:"""
        
        return prompt
    
    async def _call_ai_provider(self, prompt: str) -> Dict[str, Any]:
        """
        Call the configured AI provider.
        """
        if not self.client:
            raise Exception("AI client not initialized")
        
        try:
            if self.provider == "openai":
                response = await self.client.chat.completions.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": "You are a helpful legal assistant for Moroccan law."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=1000,
                    temperature=0.1,
                )
                return {
                    "answer": response.choices[0].message.content,
                    "confidence": 0.8,  # Default confidence
                }
            
            elif self.provider == "anthropic":
                response = await self.client.messages.create(
                    model="claude-3-sonnet-20240229",
                    max_tokens=1000,
                    temperature=0.1,
                    messages=[
                        {"role": "user", "content": prompt}
                    ],
                )
                return {
                    "answer": response.content[0].text,
                    "confidence": 0.8,  # Default confidence
                }
            
            else:
                raise Exception(f"Unsupported provider: {self.provider}")
                
        except Exception as e:
            logger.error(f"Error calling AI provider: {str(e)}")
            raise
    
    def _validate_response(
        self, 
        ai_response: Dict[str, Any], 
        context_docs: List[Dict[str, Any]]
    ) -> AIResponse:
        """
        Validate and format the AI response.
        """
        answer_text = ai_response.get("answer", "I cannot provide an answer based on the available sources.")
        confidence = ai_response.get("confidence", 0.5)
        
        # Extract sources from the answer
        sources = []
        for doc in context_docs:
            source = AISource(
                law_id=doc['law_id'],
                article_id=doc.get('article_id'),
                excerpt=doc['content'][:200] + "..." if len(doc['content']) > 200 else doc['content'],
                score=doc['relevance_score'],
                law_number=doc['law_number'],
                article_number=doc['article_number'],
            )
            sources.append(source)
        
        # Add disclaimer
        disclaimer = "هذه المعلومات لأغراض إعلامية فقط. استشر النشرة الرسمية أو محامياً مرخصاً للحصول على المشورة القانونية. / Cette information est à des fins informatives uniquement. Consultez le Bulletin Officiel ou un avocat agréé pour des conseils juridiques. / This information is for informational purposes only. Consult the Official Bulletin or a licensed lawyer for legal advice."
        
        return AIResponse(
            answer_text=answer_text,
            confidence=confidence,
            sources=sources,
            disclaimer=disclaimer,
        )
    
    async def _create_no_context_response(self, query_id: int) -> AIResponse:
        """
        Create a response when no relevant context is found.
        """
        answer_text = "لم أتمكن من العثور على مصادر قانونية ذات صلة بهذا السؤال. يرجى إعادة صياغة السؤال أو البحث في قاعدة البيانات القانونية. / Je n'ai pas pu trouver de sources juridiques pertinentes pour cette question. Veuillez reformuler la question ou rechercher dans la base de données juridique. / I could not find relevant legal sources for this question. Please rephrase the question or search the legal database."
        
        return AIResponse(
            answer_text=answer_text,
            confidence=0.1,
            sources=[],
            disclaimer="هذه المعلومات لأغراض إعلامية فقط. استشر النشرة الرسمية أو محامياً مرخصاً للحصول على المشورة القانونية. / Cette information est à des fins informatives uniquement. Consultez le Bulletin Officiel ou un avocat agréé pour des conseils juridiques. / This information is for informational purposes only. Consult the Official Bulletin or a licensed lawyer for legal advice.",
            query_id=str(query_id),
        )
    
    async def submit_feedback(
        self, 
        feedback_request: AIFeedbackRequest, 
        user_id: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Submit feedback on an AI response.
        """
        try:
            # Find the query
            query = self.db.query(AIQueries).filter(
                AIQueries.QueryID == feedback_request.query_id
            ).first()
            
            if not query:
                raise Exception("Query not found")
            
            # Find the answer
            answer = self.db.query(AIAnswers).filter(
                AIAnswers.QueryID == query.QueryID
            ).first()
            
            if not answer:
                raise Exception("Answer not found")
            
            # Create feedback record
            feedback = AIUserFeedback(
                AnswerID=answer.AnswerID,
                UserID=user_id,
                FeedbackType=feedback_request.feedback_type,
                Comment=feedback_request.comment,
                FeedbackDate=datetime.utcnow(),
            )
            
            self.db.add(feedback)
            self.db.commit()
            
            return {
                "feedback_id": feedback.FeedbackID,
                "status": "submitted",
                "message": "Feedback submitted successfully",
            }
            
        except Exception as e:
            logger.error(f"Error submitting feedback: {str(e)}")
            self.db.rollback()
            raise
    
    async def get_query_history(
        self, 
        user_id: int, 
        page: int = 1, 
        page_size: int = 20
    ) -> Dict[str, Any]:
        """
        Get user's query history.
        """
        try:
            queries = (
                self.db.query(AIQueries)
                .filter(AIQueries.UserID == user_id)
                .order_by(AIQueries.QueryDate.desc())
                .offset((page - 1) * page_size)
                .limit(page_size)
                .all()
            )
            
            query_list = []
            for query in queries:
                # Get the answer
                answer = self.db.query(AIAnswers).filter(
                    AIAnswers.QueryID == query.QueryID
                ).first()
                
                query_data = {
                    "query_id": query.QueryID,
                    "query_text": query.QueryText,
                    "query_date": query.QueryDate,
                    "answer": answer.AnswerText if answer else None,
                    "confidence": answer.ConfidenceScore if answer else None,
                }
                query_list.append(query_data)
            
            return {
                "queries": query_list,
                "page": page,
                "page_size": page_size,
            }
            
        except Exception as e:
            logger.error(f"Error getting query history: {str(e)}")
            raise
    
    async def get_ai_statistics(self) -> Dict[str, Any]:
        """
        Get AI service statistics.
        """
        try:
            # Total queries
            total_queries = self.db.query(AIQueries).count()
            
            # Total answers
            total_answers = self.db.query(AIAnswers).count()
            
            # Average confidence
            avg_confidence = self.db.query(AIAnswers.ConfidenceScore).all()
            avg_confidence = sum(c[0] for c in avg_confidence) / len(avg_confidence) if avg_confidence else 0
            
            # Feedback statistics
            feedback_stats = (
                self.db.query(AIUserFeedback.FeedbackType, AIUserFeedback.FeedbackID)
                .all()
            )
            
            feedback_counts = {}
            for feedback_type, _ in feedback_stats:
                feedback_counts[feedback_type] = feedback_counts.get(feedback_type, 0) + 1
            
            return {
                "total_queries": total_queries,
                "total_answers": total_answers,
                "average_confidence": round(avg_confidence, 2),
                "feedback_counts": feedback_counts,
            }
            
        except Exception as e:
            logger.error(f"Error getting AI statistics: {str(e)}")
            raise
