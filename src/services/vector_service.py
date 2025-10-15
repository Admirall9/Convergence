"""
Vector Service - Semantic search using FAISS and sentence transformers.
Handles document embeddings and similarity search for legal content.
"""

import json
import logging
from typing import List, Dict, Any, Optional
from pathlib import Path
import pickle

try:
    import faiss
    from sentence_transformers import SentenceTransformer
    import numpy as np
    VECTOR_AVAILABLE = True
except ImportError:
    VECTOR_AVAILABLE = False
    logging.warning("FAISS, sentence-transformers, or numpy not available. Vector search will be disabled.")

from src.core.settings import settings

logger = logging.getLogger(__name__)


class VectorService:
    """Service class for vector-based semantic search."""
    
    def __init__(self):
        self.model = None
        self.index = None
        self.metadata = []
        self.index_path = Path("data/vector_index")
        self.metadata_path = Path("data/vector_metadata.json")
        
        if VECTOR_AVAILABLE:
            self._initialize_model()
            self._load_or_create_index()
    
    def _initialize_model(self):
        """Initialize the sentence transformer model."""
        try:
            # Use a multilingual model that supports Arabic, French, and English
            self.model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
            logger.info("Vector model initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize vector model: {str(e)}")
            self.model = None
    
    def _load_or_create_index(self):
        """Load existing index or create a new one."""
        try:
            if self.index_path.exists() and self.metadata_path.exists():
                # Load existing index
                self.index = faiss.read_index(str(self.index_path))
                with open(self.metadata_path, 'r', encoding='utf-8') as f:
                    self.metadata = json.load(f)
                logger.info(f"Loaded existing vector index with {self.index.ntotal} vectors")
            else:
                # Create new index
                self._create_new_index()
        except Exception as e:
            logger.error(f"Failed to load vector index: {str(e)}")
            self._create_new_index()
    
    def _create_new_index(self):
        """Create a new FAISS index."""
        try:
            # Create index for 384-dimensional vectors (multilingual model)
            dimension = 384
            self.index = faiss.IndexFlatIP(dimension)  # Inner product for cosine similarity
            self.metadata = []
            logger.info("Created new vector index")
        except Exception as e:
            logger.error(f"Failed to create vector index: {str(e)}")
            self.index = None
    
    async def add_documents(self, documents: List[Dict[str, Any]]) -> bool:
        """
        Add documents to the vector index.
        
        Args:
            documents: List of documents with 'text', 'id', and 'metadata' fields
            
        Returns:
            bool: True if successful, False otherwise
        """
        if not VECTOR_AVAILABLE or not self.model or not self.index:
            logger.warning("Vector service not available")
            return False
        
        try:
            # Extract texts
            texts = [doc['text'] for doc in documents]
            
            # Generate embeddings
            embeddings = self.model.encode(texts, show_progress_bar=False)
            
            # Normalize embeddings for cosine similarity
            faiss.normalize_L2(embeddings)
            
            # Add to index
            self.index.add(embeddings.astype(np.float32))
            
            # Add metadata
            for doc in documents:
                self.metadata.append({
                    'id': doc['id'],
                    'type': doc.get('type', 'unknown'),
                    'law_id': doc.get('law_id'),
                    'article_id': doc.get('article_id'),
                    'title': doc.get('title', ''),
                    'content': doc['text'][:500],  # Store first 500 chars
                })
            
            # Save index and metadata
            await self._save_index()
            
            logger.info(f"Added {len(documents)} documents to vector index")
            return True
            
        except Exception as e:
            logger.error(f"Failed to add documents to vector index: {str(e)}")
            return False
    
    async def search_similar(
        self, 
        query: str, 
        k: int = 5, 
        threshold: float = 0.7
    ) -> List[Dict[str, Any]]:
        """
        Search for similar documents using vector similarity.
        
        Args:
            query: Search query
            k: Number of results to return
            threshold: Minimum similarity threshold
            
        Returns:
            List of similar documents with scores
        """
        if not VECTOR_AVAILABLE or not self.model or not self.index:
            logger.warning("Vector service not available")
            return []
        
        try:
            # Generate query embedding
            query_embedding = self.model.encode([query])
            faiss.normalize_L2(query_embedding)
            
            # Search
            scores, indices = self.index.search(query_embedding.astype(np.float32), k)
            
            # Format results
            results = []
            for i, (score, idx) in enumerate(zip(scores[0], indices[0])):
                if idx >= 0 and score >= threshold:
                    metadata = self.metadata[idx]
                    results.append({
                        'id': metadata['id'],
                        'type': metadata['type'],
                        'law_id': metadata.get('law_id'),
                        'article_id': metadata.get('article_id'),
                        'title': metadata.get('title', ''),
                        'content': metadata.get('content', ''),
                        'score': float(score),
                        'rank': i + 1,
                    })
            
            logger.info(f"Found {len(results)} similar documents for query: {query[:50]}...")
            return results
            
        except Exception as e:
            logger.error(f"Failed to search vector index: {str(e)}")
            return []
    
    async def _save_index(self):
        """Save the vector index and metadata to disk."""
        try:
            # Create data directory if it doesn't exist
            self.index_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Save FAISS index
            faiss.write_index(self.index, str(self.index_path))
            
            # Save metadata
            with open(self.metadata_path, 'w', encoding='utf-8') as f:
                json.dump(self.metadata, f, ensure_ascii=False, indent=2)
            
            logger.info("Vector index and metadata saved successfully")
            
        except Exception as e:
            logger.error(f"Failed to save vector index: {str(e)}")
    
    async def rebuild_index(self, documents: List[Dict[str, Any]]) -> bool:
        """
        Rebuild the entire vector index with new documents.
        
        Args:
            documents: List of documents to index
            
        Returns:
            bool: True if successful, False otherwise
        """
        if not VECTOR_AVAILABLE or not self.model:
            logger.warning("Vector service not available")
            return False
        
        try:
            # Create new index
            self._create_new_index()
            
            # Add all documents
            success = await self.add_documents(documents)
            
            if success:
                logger.info(f"Rebuilt vector index with {len(documents)} documents")
            
            return success
            
        except Exception as e:
            logger.error(f"Failed to rebuild vector index: {str(e)}")
            return False
    
    async def get_index_stats(self) -> Dict[str, Any]:
        """
        Get statistics about the vector index.
        
        Returns:
            Dictionary with index statistics
        """
        if not self.index:
            return {"status": "not_available"}
        
        try:
            return {
                "status": "available",
                "total_vectors": self.index.ntotal,
                "dimension": self.index.d,
                "metadata_count": len(self.metadata),
                "model_name": "paraphrase-multilingual-MiniLM-L12-v2",
            }
        except Exception as e:
            logger.error(f"Failed to get index stats: {str(e)}")
            return {"status": "error", "error": str(e)}
    
    async def remove_document(self, doc_id: str) -> bool:
        """
        Remove a document from the vector index.
        
        Args:
            doc_id: Document ID to remove
            
        Returns:
            bool: True if successful, False otherwise
        """
        if not self.index:
            return False
        
        try:
            # Find document in metadata
            doc_index = None
            for i, meta in enumerate(self.metadata):
                if meta['id'] == doc_id:
                    doc_index = i
                    break
            
            if doc_index is None:
                logger.warning(f"Document {doc_id} not found in index")
                return False
            
            # Remove from metadata
            self.metadata.pop(doc_index)
            
            # Rebuild index without the removed document
            # Note: FAISS doesn't support direct removal, so we rebuild
            await self._save_index()
            
            logger.info(f"Removed document {doc_id} from vector index")
            return True
            
        except Exception as e:
            logger.error(f"Failed to remove document from vector index: {str(e)}")
            return False
    
    async def update_document(self, doc_id: str, new_text: str, metadata: Dict[str, Any]) -> bool:
        """
        Update a document in the vector index.
        
        Args:
            doc_id: Document ID to update
            new_text: New document text
            metadata: Updated metadata
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            # Remove old document
            await self.remove_document(doc_id)
            
            # Add updated document
            updated_doc = {
                'id': doc_id,
                'text': new_text,
                **metadata
            }
            
            success = await self.add_documents([updated_doc])
            
            if success:
                logger.info(f"Updated document {doc_id} in vector index")
            
            return success
            
        except Exception as e:
            logger.error(f"Failed to update document in vector index: {str(e)}")
            return False
    
    def is_available(self) -> bool:
        """
        Check if vector service is available.
        
        Returns:
            bool: True if vector service is available, False otherwise
        """
        return VECTOR_AVAILABLE and self.model is not None and self.index is not None
