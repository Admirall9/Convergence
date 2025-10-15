# Convergence Platform - Technical Specifications

**Version:** 1.0  
**Date:** January 2025  
**Project:** National Civic Intelligence Platform for Morocco  
**Scope:** Production-ready technical implementation guide  

---

## 🏗️ **System Architecture Overview**

The Convergence Platform follows a modular, microservices-ready architecture designed for enterprise-scale deployment in Morocco's government context. The system integrates multiple data sources, AI capabilities, and provides comprehensive transparency tools.

### **Core Architecture Principles**
- **Modular Design** - Loosely coupled components for scalability
- **API-First** - RESTful APIs with OpenAPI specifications
- **Data Provenance** - Complete audit trails and source tracking
- **Security by Design** - Multi-layer security with role-based access
- **Morocco-Specific** - Tailored for Arabic/French localization and local data sources

---

## 🔧 **Technical Stack**

### **Backend Infrastructure**
- **Framework:** FastAPI (Python 3.11+)
- **Database:** Microsoft SQL Server (Primary) + MongoDB (Raw Data)
- **Authentication:** JWT + OAuth2 with refresh tokens
- **API Documentation:** OpenAPI 3.0 with Swagger UI
- **ORM:** SQLAlchemy with Alembic migrations
- **Caching:** Redis (for session management and API caching)

### **Frontend Technology**
- **Framework:** React 18+ with TypeScript
- **Styling:** Tailwind CSS + Headless UI components
- **State Management:** Zustand or Redux Toolkit
- **Routing:** React Router v6
- **Internationalization:** react-i18next (Arabic RTL support)
- **Charts:** Recharts for data visualization

### **AI & Search Infrastructure**
- **AI Providers:** OpenAI GPT-4 / Anthropic Claude (configurable)
- **Vector Database:** Local FAISS or Milvus for semantic search
- **Embeddings:** Sentence Transformers (all-MiniLM-L6-v2)
- **Search Engine:** Full-text search with SQL Server + vector similarity

### **Data Processing**
- **ETL Framework:** Custom Python pipelines with pandas
- **PDF Processing:** pdfplumber + pytesseract (OCR fallback)
- **Document Storage:** Local filesystem + MongoDB for raw data
- **Job Queue:** Celery with Redis broker

### **Deployment & Operations**
- **Containerization:** Docker + Docker Compose
- **Orchestration:** Kubernetes (production) / Docker Swarm (staging)
- **Cloud Platform:** Azure (primary) / AWS (backup)
- **Monitoring:** Prometheus + Grafana + Jaeger tracing
- **Logging:** Structured logging with ELK stack

---

## 📊 **Database Architecture**

### **SQL Server Schema (Primary)**
Complete enterprise-grade relational database with 25+ tables covering:

#### **Core Domains:**
- **User & Security:** Users, Roles, UserRoles, AuditLogs
- **Government Hierarchy:** TerritorialAreas, Institutions, Officials, OfficialAssignments
- **Legal Repository:** LawIssues, Laws, LawArticles, LawTags
- **Budget & Economics:** Budgets, BudgetItems, BudgetPrograms, PublicContracts, Suppliers
- **Reviews & Moderation:** Reviews, ReviewFlags, ReviewModeration
- **Awareness & Education:** AwarenessTopics, AwarenessArticles, Quizzes, QuizQuestions, QuizResults
- **AI & Q&A:** AIQueries, AIAnswers, AIAnswerSources, AIUserFeedback
- **System Management:** Notifications, SystemParameters, DataSources, ErrorLogs, ETLJobs

#### **Key Features:**
- **Full-text indexing** on legal content and articles
- **Hierarchical relationships** with proper foreign key constraints
- **Audit logging** for all critical operations
- **Data versioning** for content management
- **Partitioning strategy** for large tables (by year/region)

### **MongoDB Collections (Raw Data)**
NoSQL storage for unstructured and semi-structured data:

```javascript
// Raw PDF Storage
law_raw_pdfs: {
  file_id: UUID,
  filename: String,
  source_url: String,
  ingested_at: Date,
  pdf_bytes: Binary,
  metadata: Object
}

// Parsed Content
law_parsed_raw: {
  job_id: String,
  pages: [{
    page_no: Number,
    text: String,
    confidence: Number,
    embedding_id: String
  }],
  created_at: Date
}

// Vector Embeddings
embeddings: {
  doc_id: String,
  content_type: String, // 'law_article', 'budget_item', etc.
  embedding: [Number], // 384-dimensional vector
  metadata: Object
}
```

---

## 🔌 **API Specifications**

### **Core API Endpoints**

#### **Legal Repository**
```yaml
GET /api/v1/laws
  - Search laws by keyword, date range, category
  - Pagination and filtering support
  - Returns: LawSummary objects with metadata

GET /api/v1/laws/{law_id}
  - Detailed law information with articles
  - Includes provenance and source links
  - Returns: LawDetail with full content

POST /api/v1/etl/law-issues
  - Upload new bulletin issues for processing
  - Returns: ETL job ID for tracking
  - Requires: DataEngineer role
```

#### **Budget & Economics**
```yaml
GET /api/v1/budgets
  - List budgets by year, institution, type
  - Aggregated financial data
  - Returns: BudgetSummary with totals

GET /api/v1/budgets/{budget_id}/items
  - Detailed budget line items
  - Drill-down capability with source links
  - Returns: Paginated BudgetItem list

POST /api/v1/etl/budgets
  - Ingest budget documents (PDF/Excel)
  - Automated mapping and validation
  - Returns: Processing job status
```

#### **Government Hierarchy**
```yaml
GET /api/v1/territories
  - Hierarchical territorial structure
  - Regions → Provinces → Communes
  - Returns: Nested territorial tree

GET /api/v1/institutions/{id}
  - Institution details with officials
  - Budget links and performance metrics
  - Returns: InstitutionProfile object

GET /api/v1/officials/{id}
  - Official profile with assignments
  - Review history and ratings
  - Returns: OfficialProfile with reviews
```

#### **AI Q&A System**
```yaml
POST /api/v1/ai/query
  - Submit legal questions for AI processing
  - RAG-based retrieval with source citations
  - Returns: Answer with confidence and sources

GET /api/v1/ai/queries/{query_id}
  - Retrieve query history and feedback
  - Audit trail for quality assurance
  - Returns: QueryDetail with full context

POST /api/v1/ai/feedback
  - User feedback on AI responses
  - Quality improvement data collection
  - Returns: Feedback confirmation
```

#### **Reviews & Moderation**
```yaml
POST /api/v1/reviews
  - Submit citizen reviews of officials
  - Automated content filtering
  - Returns: Review with moderation status

POST /api/v1/reviews/{id}/flag
  - Flag inappropriate content
  - Community moderation support
  - Returns: Flag confirmation

POST /api/v1/moderation/reviews/{id}/decision
  - Moderator decision on flagged content
  - Structured decision with reasoning
  - Returns: Moderation result
```

### **Authentication & Authorization**
```yaml
POST /api/v1/auth/register
  - User registration with email verification
  - Role assignment (Citizen by default)
  - Returns: User profile with JWT token

POST /api/v1/auth/login
  - OAuth2 password flow
  - JWT token with refresh capability
  - Returns: Access and refresh tokens

POST /api/v1/auth/refresh
  - Token refresh mechanism
  - Secure token rotation
  - Returns: New access token
```

---

## 🤖 **AI Integration Architecture**

### **Multi-Provider AI Adapter**
Configurable AI service supporting multiple providers:

```python
class AIAdapter:
    def __init__(self, provider: str = "openai"):
        self.provider = provider
        self.client = self._initialize_client()
    
    async def query(self, question: str, context_docs: List[Dict]) -> AIResponse:
        # RAG pipeline: retrieval → prompt building → AI call → response parsing
        pass
```

### **RAG (Retrieval-Augmented Generation) Pipeline**
1. **Query Processing** - Natural language question analysis
2. **Vector Search** - Semantic similarity search in legal corpus
3. **Context Building** - Relevant law articles and budget data retrieval
4. **Prompt Engineering** - Structured prompt with citations and disclaimers
5. **AI Processing** - Provider-specific API calls (OpenAI/Anthropic)
6. **Response Validation** - Confidence scoring and source verification
7. **Audit Logging** - Complete interaction tracking

### **Safety & Compliance Features**
- **Confidence Thresholds** - Automatic human review for low-confidence responses
- **Source Verification** - Mandatory citation requirements
- **Legal Disclaimers** - Standard warnings about AI-generated content
- **Audit Trails** - Complete logging for regulatory compliance
- **Rate Limiting** - Per-user and per-IP quotas to prevent abuse

---

## 🔍 **Search & Discovery**

### **Multi-Modal Search**
- **Full-Text Search** - SQL Server full-text indexing on legal content
- **Semantic Search** - Vector similarity for conceptual queries
- **Faceted Search** - Filter by date, category, institution, region
- **Fuzzy Matching** - Typo tolerance and partial word matching

### **Search Architecture**
```python
class SearchService:
    def __init__(self):
        self.vector_db = FAISSIndex()
        self.fulltext_db = SQLServerConnection()
        self.embedder = SentenceTransformer()
    
    async def search(self, query: str, filters: Dict) -> SearchResults:
        # Hybrid search: combine vector and full-text results
        vector_results = await self.vector_search(query)
        text_results = await self.fulltext_search(query, filters)
        return self.merge_and_rank_results(vector_results, text_results)
```

---

## 📱 **Frontend Architecture**

### **Component Architecture**
Modular React components organized by domain:

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── legal/           # Legal repository components
│   ├── budget/          # Budget visualization components
│   ├── reviews/         # Review and rating components
│   ├── ai-chat/         # AI Q&A interface
│   └── moderation/      # Admin and moderation tools
├── pages/
│   ├── LegalHome        # Law browsing and search
│   ├── BudgetExplorer   # Budget data visualization
│   ├── OfficialProfile  # Official information and reviews
│   ├── ModeratorConsole # Content moderation interface
│   └── AIChatWidget     # Legal Q&A chat interface
└── services/
    ├── api/             # API client services
    ├── auth/            # Authentication management
    └── i18n/            # Internationalization
```

### **State Management**
```typescript
// Zustand store example
interface AppState {
  user: User | null;
  legalData: LegalData;
  budgetData: BudgetData;
  aiChat: ChatState;
  ui: UIState;
}

const useAppStore = create<AppState>((set, get) => ({
  // State management logic
}));
```

### **Internationalization**
- **Languages:** Arabic (RTL), French, English
- **Implementation:** react-i18next with proper RTL support
- **Content Management:** Dynamic content loading with fallbacks
- **Date/Number Formatting:** Locale-specific formatting

---

## 🔒 **Security Architecture**

### **Authentication & Authorization**
- **JWT Tokens** - Stateless authentication with refresh tokens
- **Role-Based Access Control** - Granular permissions system
- **Multi-Factor Authentication** - Required for admin roles
- **Session Management** - Secure session handling with Redis

### **Data Protection**
- **Encryption at Rest** - SQL Server Always Encrypted for PII
- **Encryption in Transit** - TLS 1.3 for all communications
- **Data Masking** - PII protection in logs and exports
- **Audit Logging** - Comprehensive activity tracking

### **API Security**
- **Rate Limiting** - Per-user and per-IP quotas
- **Input Validation** - Comprehensive request validation
- **SQL Injection Prevention** - Parameterized queries only
- **CORS Configuration** - Strict cross-origin policies

---

## 📊 **Data Processing & ETL**

### **ETL Pipeline Architecture**
```python
class ETLPipeline:
    def __init__(self, source_type: str):
        self.source_type = source_type
        self.parser = self._get_parser()
        self.validator = DataValidator()
        self.storage = DataStorage()
    
    async def process(self, source_url: str) -> ETLJob:
        # 1. Download and store raw data
        # 2. Parse and extract structured data
        # 3. Validate data quality and integrity
        # 4. Store in SQL Server with audit trail
        # 5. Generate embeddings for search
        # 6. Update data quality metrics
        pass
```

### **Data Quality Framework**
- **Validation Rules** - Business logic validation
- **Confidence Scoring** - Parsing quality metrics
- **Error Handling** - Graceful failure with retry logic
- **Data Lineage** - Complete source-to-destination tracking
- **Quality Metrics** - Automated quality assessment

### **Supported Data Sources**
- **Bulletin Officiel** - PDF parsing with OCR fallback
- **Budget Documents** - Excel/CSV processing with mapping
- **Government APIs** - Real-time data integration
- **Manual Uploads** - Admin interface for data entry

---

## 🚀 **Deployment Architecture**

### **Container Strategy**
```dockerfile
# Multi-stage build for optimized images
FROM python:3.11-slim as builder
# Build dependencies and application

FROM python:3.11-slim as runtime
# Runtime dependencies and application
```

### **Kubernetes Deployment**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: convergence-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: convergence-api
  template:
    spec:
      containers:
      - name: api
        image: convergence/api:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
```

### **Environment Configuration**
- **Development** - Local Docker Compose setup
- **Staging** - Kubernetes cluster with test data
- **Production** - High-availability Azure deployment
- **Disaster Recovery** - Multi-region backup strategy

---

## 📈 **Monitoring & Observability**

### **Application Monitoring**
- **Health Checks** - Endpoint monitoring and alerting
- **Performance Metrics** - Response times and throughput
- **Error Tracking** - Exception monitoring and alerting
- **Business Metrics** - User engagement and system usage

### **Infrastructure Monitoring**
- **Resource Usage** - CPU, memory, disk, network
- **Database Performance** - Query performance and connection pools
- **Cache Performance** - Redis hit rates and latency
- **External Dependencies** - API response times and availability

### **Logging Strategy**
```python
# Structured logging with correlation IDs
import structlog

logger = structlog.get_logger()

async def process_request(request_id: str, user_id: int):
    logger.info("request_started", 
                request_id=request_id, 
                user_id=user_id,
                endpoint=request.endpoint)
    # Process request with full audit trail
```

---

## 🔧 **Development & Operations**

### **CI/CD Pipeline**
```yaml
# GitHub Actions workflow
name: Deploy Convergence Platform
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: |
          poetry install
          poetry run pytest
          poetry run mypy src/
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to staging
        run: kubectl apply -f k8s/
```

### **Code Quality Standards**
- **Type Checking** - MyPy for Python, TypeScript for React
- **Code Formatting** - Black (Python), Prettier (TypeScript)
- **Linting** - Ruff (Python), ESLint (TypeScript)
- **Testing** - pytest (Python), Jest (TypeScript)
- **Coverage** - Minimum 80% code coverage requirement

### **Database Management**
- **Migrations** - Alembic for schema evolution
- **Backups** - Automated daily backups with point-in-time recovery
- **Performance** - Query optimization and indexing strategy
- **Monitoring** - Database performance and health metrics

---

## 🌐 **Integration Points**

### **Government Data Sources**
- **Finance.gov.ma** - Budget and financial data APIs
- **Bulletin Officiel** - Legal document RSS feeds and PDFs
- **HCP.gov.ma** - Statistical and geographic data
- **Local Government APIs** - Regional and municipal data

### **External Services**
- **OpenAI API** - GPT-4 for legal Q&A
- **Anthropic API** - Claude for alternative AI responses
- **Email Services** - Transactional email delivery
- **SMS Services** - Notification delivery (future)

### **Third-Party Integrations**
- **Payment Processing** - For premium features (future)
- **Social Media APIs** - Content sharing capabilities
- **Analytics Services** - User behavior tracking
- **CDN Services** - Static asset delivery

---

## 📋 **Compliance & Governance**

### **Data Protection Compliance**
- **GDPR Alignment** - Data subject rights and privacy protection
- **Moroccan Data Laws** - Local privacy regulation compliance
- **Data Retention** - Automated data lifecycle management
- **Consent Management** - User consent tracking and management

### **Audit & Compliance**
- **Financial Audits** - Budget data accuracy and integrity
- **Security Audits** - Regular penetration testing and vulnerability assessments
- **Access Audits** - User access review and certification
- **Data Quality Audits** - Regular data accuracy assessments

### **Governance Framework**
- **Change Management** - Structured change approval process
- **Incident Response** - Security and operational incident procedures
- **Business Continuity** - Disaster recovery and backup procedures
- **Risk Management** - Regular risk assessment and mitigation

---

## 🎯 **Performance Targets**

### **Response Time Requirements**
- **API Endpoints** - <250ms median response time
- **Search Queries** - <300ms for common searches
- **Page Load Times** - <2s for typical user interactions
- **AI Responses** - <1.5s for legal Q&A queries

### **Scalability Targets**
- **Concurrent Users** - 10,000+ simultaneous users
- **Data Volume** - 1M+ legal documents, 100M+ budget items
- **Storage Capacity** - 10TB+ raw document storage
- **Processing Capacity** - 1000+ ETL jobs per day

### **Availability Requirements**
- **System Uptime** - 99.8% availability SLA
- **Data Backup** - Daily automated backups with 30-day retention
- **Recovery Time** - <4 hours RTO for critical services
- **Recovery Point** - <1 hour RPO for critical data

---

## 📞 **Support & Maintenance**

### **Technical Support**
- **Help Desk** - 24/7 technical support for critical issues
- **Documentation** - Comprehensive user and admin guides
- **Training** - User and administrator training programs
- **Community** - User community and knowledge sharing

### **Maintenance Windows**
- **Planned Maintenance** - Monthly maintenance windows with advance notice
- **Emergency Maintenance** - Immediate response for critical issues
- **Update Deployment** - Rolling updates with zero-downtime deployment
- **Security Patches** - Immediate deployment for security vulnerabilities

---

**Document Control:**
- **Version:** 1.0
- **Last Updated:** January 2025
- **Next Review:** February 2025
- **Approval Status:** Technical Review Pending

---

*This technical specification serves as the comprehensive guide for implementing the Convergence Platform. It will be updated regularly to reflect architectural decisions and implementation progress.*
