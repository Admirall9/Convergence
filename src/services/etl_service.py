"""
ETL Service - Data ingestion and processing for Convergence Platform.
Handles document processing, parsing, and data transformation.
"""

import asyncio
import json
import logging
import uuid
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional, List
from fastapi import UploadFile
from sqlalchemy.orm import Session

from src.core.settings import settings
from src.db.models.legal import LawIssues, Laws, LawArticles
from src.db.models.system import ETLJobs
from src.services.vector_service import VectorService

logger = logging.getLogger(__name__)


class ETLService:
    """Service class for ETL (Extract, Transform, Load) operations."""
    
    def __init__(self, db: Session):
        self.db = db
        self.vector_service = VectorService()
        self.data_dir = Path("data")
        self.raw_dir = self.data_dir / "raw"
        self.raw_dir.mkdir(parents=True, exist_ok=True)
    
    async def ingest_law_document(
        self,
        file: UploadFile,
        source_url: Optional[str] = None,
        issue_number: Optional[str] = None,
        publication_date: Optional[datetime] = None,
        user_id: Optional[int] = None,
    ) -> str:
        """
        Ingest a law document (PDF) for processing.
        
        Args:
            file: Uploaded file
            source_url: Source URL of the document
            issue_number: Issue number
            publication_date: Publication date
            user_id: User ID who initiated the ingestion
            
        Returns:
            str: Job ID for tracking
        """
        job_id = str(uuid.uuid4())
        
        try:
            # Create ETL job record
            job = ETLJobs(
                JobID=job_id,
                SourceURL=source_url or "",
                FilePath="",  # Will be updated after file save
                Status="started",
                PagesParsed=0,
                Errors=0,
                CreatedAt=datetime.utcnow(),
            )
            self.db.add(job)
            self.db.commit()
            
            # Save uploaded file
            file_path = self.raw_dir / f"{job_id}_{file.filename}"
            with open(file_path, "wb") as f:
                content = await file.read()
                f.write(content)
            
            # Update job with file path
            job.FilePath = str(file_path)
            self.db.commit()
            
            # Start processing in background
            asyncio.create_task(self._process_law_document(
                job_id=job_id,
                file_path=file_path,
                source_url=source_url,
                issue_number=issue_number,
                publication_date=publication_date,
                user_id=user_id,
            ))
            
            logger.info(f"Started law document ingestion: {job_id}")
            return job_id
            
        except Exception as e:
            logger.error(f"Failed to start law document ingestion: {str(e)}")
            # Update job status
            job = self.db.query(ETLJobs).filter(ETLJobs.JobID == job_id).first()
            if job:
                job.Status = "failed"
                job.Errors = 1
                self.db.commit()
            raise
    
    async def _process_law_document(
        self,
        job_id: str,
        file_path: Path,
        source_url: Optional[str],
        issue_number: Optional[str],
        publication_date: Optional[datetime],
        user_id: Optional[int],
    ):
        """
        Process a law document in the background.
        """
        try:
            # Update job status
            job = self.db.query(ETLJobs).filter(ETLJobs.JobID == job_id).first()
            if not job:
                return
            
            job.Status = "processing"
            self.db.commit()
            
            # Extract text from PDF
            pages = await self._extract_text_from_pdf(file_path)
            
            if not pages:
                raise Exception("No text could be extracted from the document")
            
            # Update job with page count
            job.PagesParsed = len(pages)
            self.db.commit()
            
            # Parse laws from text
            laws = await self._parse_laws_from_text(pages, issue_number)
            
            if not laws:
                raise Exception("No laws could be parsed from the document")
            
            # Create law issue record
            issue = LawIssues(
                IssueNumber=issue_number or f"auto-{job_id}",
                PublicationDate=publication_date.date() if publication_date else None,
                SourceURL=source_url,
                PDFFilePath=str(file_path),
                ETLJobId=job_id,
                CreatedAt=datetime.utcnow(),
            )
            self.db.add(issue)
            self.db.flush()
            
            # Create law records
            documents_for_vector = []
            for law_data in laws:
                law = Laws(
                    IssueID=issue.IssueID,
                    LawNumber=law_data.get("law_number"),
                    Title=law_data.get("title", "Unknown Law"),
                    Category=law_data.get("category"),
                    EffectiveDate=law_data.get("effective_date"),
                    Summary=law_data.get("summary"),
                    CreatedAt=datetime.utcnow(),
                )
                self.db.add(law)
                self.db.flush()
                
                # Create articles
                for article_data in law_data.get("articles", []):
                    article = LawArticles(
                        LawID=law.LawID,
                        ArticleNumber=article_data.get("article_number"),
                        Content=article_data.get("content", ""),
                        Keywords=article_data.get("keywords"),
                    )
                    self.db.add(article)
                    
                    # Prepare for vector indexing
                    if article_data.get("content"):
                        documents_for_vector.append({
                            'id': f"article_{article.ArticleID}",
                            'text': article_data.get("content"),
                            'type': 'law_article',
                            'law_id': law.LawID,
                            'article_id': article.ArticleID,
                            'title': f"Article {article_data.get('article_number', '')}",
                        })
                
                # Add law title to vector index
                if law.Title:
                    documents_for_vector.append({
                        'id': f"law_{law.LawID}",
                        'text': f"{law.Title}. {law.Summary or ''}",
                        'type': 'law',
                        'law_id': law.LawID,
                        'title': law.Title,
                    })
            
            # Commit all database changes
            self.db.commit()
            
            # Add to vector index
            if documents_for_vector and self.vector_service.is_available():
                await self.vector_service.add_documents(documents_for_vector)
            
            # Update job status
            job.Status = "completed"
            job.Errors = 0
            self.db.commit()
            
            logger.info(f"Completed law document processing: {job_id}, laws: {len(laws)}")
            
        except Exception as e:
            logger.error(f"Failed to process law document {job_id}: {str(e)}")
            # Update job status
            job = self.db.query(ETLJobs).filter(ETLJobs.JobID == job_id).first()
            if job:
                job.Status = "failed"
                job.Errors = 1
                self.db.commit()
    
    async def _extract_text_from_pdf(self, file_path: Path) -> List[Dict[str, Any]]:
        """
        Extract text from PDF file.
        """
        try:
            import pdfplumber
            import pytesseract
            from PIL import Image
            
            pages = []
            
            with pdfplumber.open(file_path) as pdf:
                for i, page in enumerate(pdf.pages):
                    try:
                        # Try to extract text directly
                        text = page.extract_text() or ""
                        confidence = 0.9 if len(text.strip()) > 50 else 0.4
                        
                        # If confidence is low, try OCR
                        if confidence < 0.6:
                            try:
                                # Convert page to image
                                im = page.to_image(resolution=200).original
                                ocr_text = pytesseract.image_to_string(Image.fromarray(im))
                                text = (text + "\n" + ocr_text).strip()
                                confidence = 0.75 if len(ocr_text.strip()) > 20 else confidence
                            except Exception as ocr_error:
                                logger.warning(f"OCR failed for page {i+1}: {str(ocr_error)}")
                        
                        pages.append({
                            "page_no": i + 1,
                            "text": text,
                            "confidence": confidence,
                        })
                        
                    except Exception as page_error:
                        logger.warning(f"Failed to process page {i+1}: {str(page_error)}")
                        pages.append({
                            "page_no": i + 1,
                            "text": "",
                            "confidence": 0.0,
                        })
            
            return pages
            
        except ImportError:
            logger.error("PDF processing libraries not available. Install pdfplumber and pytesseract.")
            return []
        except Exception as e:
            logger.error(f"Failed to extract text from PDF: {str(e)}")
            return []
    
    async def _parse_laws_from_text(
        self, 
        pages: List[Dict[str, Any]], 
        issue_number: Optional[str]
    ) -> List[Dict[str, Any]]:
        """
        Parse laws from extracted text using heuristic rules.
        """
        laws = []
        current_law = None
        
        for page in pages:
            lines = [line.strip() for line in page["text"].splitlines() if line.strip()]
            
            for line in lines:
                # Detect law headers
                if any(keyword in line.lower() for keyword in ["loi", "décret", "arrêté", "law", "decree"]):
                    # Save previous law
                    if current_law:
                        laws.append(current_law)
                    
                    # Start new law
                    current_law = {
                        "title": line,
                        "law_number": self._extract_law_number(line),
                        "category": self._categorize_law(line),
                        "articles": [],
                        "summary": None,
                        "effective_date": None,
                    }
                
                # Detect articles
                elif line.lower().startswith("article") or line.lower().startswith("art"):
                    if current_law is None:
                        # Create anonymous law for orphaned articles
                        current_law = {
                            "title": "Unknown Law (Auto-generated)",
                            "law_number": None,
                            "category": "Unknown",
                            "articles": [],
                            "summary": None,
                            "effective_date": None,
                        }
                    
                    # Parse article
                    article_data = self._parse_article(line)
                    if article_data:
                        current_law["articles"].append(article_data)
                
                # Add content to last article
                elif current_law and current_law["articles"]:
                    current_law["articles"][-1]["content"] += " " + line
        
        # Add final law
        if current_law:
            laws.append(current_law)
        
        return laws
    
    def _extract_law_number(self, title: str) -> Optional[str]:
        """Extract law number from title."""
        import re
        
        # Look for patterns like "Loi n° 01-23" or "Décret n° 2-23-123"
        patterns = [
            r"n°\s*(\d+-\d+)",
            r"n°\s*(\d+-\d+-\d+)",
            r"(\d+-\d+)",
        ]
        
        for pattern in patterns:
            match = re.search(pattern, title)
            if match:
                return match.group(1)
        
        return None
    
    def _categorize_law(self, title: str) -> str:
        """Categorize law based on title keywords."""
        title_lower = title.lower()
        
        categories = {
            "Labor": ["travail", "emploi", "labor", "employment"],
            "Tax": ["fiscal", "tax", "impôt", "taxation"],
            "Health": ["santé", "health", "médical", "medical"],
            "Education": ["éducation", "education", "enseignement", "teaching"],
            "Environment": ["environnement", "environment", "écologie", "ecology"],
            "Finance": ["finances", "finance", "budget", "monétaire", "monetary"],
            "Administration": ["administration", "fonction publique", "public service"],
            "Justice": ["justice", "judiciaire", "judicial", "cour", "court"],
        }
        
        for category, keywords in categories.items():
            if any(keyword in title_lower for keyword in keywords):
                return category
        
        return "General"
    
    def _parse_article(self, line: str) -> Optional[Dict[str, Any]]:
        """Parse article from text line."""
        import re
        
        # Extract article number
        article_match = re.match(r"article\s+(\d+[a-z]?)", line.lower())
        if not article_match:
            return None
        
        article_number = article_match.group(1)
        
        # Extract content (everything after "Article X")
        content_match = re.search(r"article\s+\d+[a-z]?\s+(.+)", line, re.IGNORECASE)
        content = content_match.group(1) if content_match else ""
        
        return {
            "article_number": f"Art. {article_number}",
            "content": content,
            "keywords": None,
        }
    
    async def get_job_status(self, job_id: str, user_id: Optional[int] = None) -> Optional[Dict[str, Any]]:
        """
        Get ETL job status.
        """
        try:
            job = self.db.query(ETLJobs).filter(ETLJobs.JobID == job_id).first()
            
            if not job:
                return None
            
            # Get related data counts
            laws_count = 0
            articles_count = 0
            
            if job.Status == "completed":
                # Count created laws and articles
                issue = self.db.query(LawIssues).filter(LawIssues.ETLJobId == job_id).first()
                if issue:
                    laws_count = self.db.query(Laws).filter(Laws.IssueID == issue.IssueID).count()
                    articles_count = self.db.query(LawArticles).join(Laws).filter(
                        Laws.IssueID == issue.IssueID
                    ).count()
            
            return {
                "job_id": job.JobID,
                "status": job.Status,
                "progress": 100 if job.Status == "completed" else (50 if job.Status == "processing" else 0),
                "errors": job.Errors,
                "pages_parsed": job.PagesParsed,
                "laws_created": laws_count,
                "articles_created": articles_count,
                "source_url": job.SourceURL,
                "file_path": job.FilePath,
                "created_at": job.CreatedAt,
                "updated_at": job.CreatedAt,  # TODO: Add updated_at field
            }
            
        except Exception as e:
            logger.error(f"Failed to get job status: {str(e)}")
            return None
    
    async def get_job_list(
        self, 
        page: int = 1, 
        page_size: int = 20,
        status: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Get list of ETL jobs with pagination.
        """
        try:
            query = self.db.query(ETLJobs)
            
            if status:
                query = query.filter(ETLJobs.Status == status)
            
            total = query.count()
            
            jobs = (
                query
                .order_by(ETLJobs.CreatedAt.desc())
                .offset((page - 1) * page_size)
                .limit(page_size)
                .all()
            )
            
            job_list = []
            for job in jobs:
                job_data = {
                    "job_id": job.JobID,
                    "status": job.Status,
                    "pages_parsed": job.PagesParsed,
                    "errors": job.Errors,
                    "source_url": job.SourceURL,
                    "created_at": job.CreatedAt,
                }
                job_list.append(job_data)
            
            return {
                "jobs": job_list,
                "total": total,
                "page": page,
                "page_size": page_size,
            }
            
        except Exception as e:
            logger.error(f"Failed to get job list: {str(e)}")
            return {"jobs": [], "total": 0, "page": page, "page_size": page_size}
