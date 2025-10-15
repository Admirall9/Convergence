# Functional Requirements Specification (FRS) — Convergence Platform

**Version:** 1.0  
**Date:** January 2025  
**Scope:** All core modules (Legal Repo, Budgets, Institutions & Hierarchy, Reviews, Awareness, AI Q&A, Admin/Moderation, ETL)  
**Target:** Enterprise production-ready (Morocco context)  

---

## 1. Overview — mapping from BRS → FRS

Each **Business Process** from the BRS is broken into functional capabilities (features) with user stories, UI modules, API endpoints, data interactions, validation and acceptance criteria. Focus on **deterministic behavior**, full auditing, provenance & human-in-the-loop where risk is high (legal answers, moderation).

---

## 2. Actors & Roles (FRS context)

Define permissions, capabilities and constraints.

* **AnonymousUser**: browse public content (laws, budgets, institution directory), read dashboards, search; no write access.
* **RegisteredUser**: all Anonymous plus submit reviews, flag content, take quizzes, save favorites, opt-in notifications.
* **VerifiedUser**: Registered but identity-verified (optional) — higher trust weight in reputation scoring and ability to submit certain official reports.
* **Moderator**: review flagged content, approve/reject reviews, manage hierarchy updates pending approvals.
* **InstitutionAdmin**: manage their Institution profile (bio, contacts), submit official documents for ingestion workflow (requires verification), view institution reports.
* **DataEngineer**: run ETL jobs, monitor ingestion pipelines, handle parsing exceptions.
* **SystemAdmin**: full admin rights — manage users/roles, system parameters, backups, emergency takedowns.

RBAC: implement Role table and Permission mapping. All endpoints that modify state require authentication + role check.

---

## 3. Functional Modules, Features, User Stories & Acceptance Criteria

### 3.1 Legal Repository (Bulletin Officiel ingestion & browsing)

**Objectives:** upload/ingest Gazette issues, parse laws & articles, provide authoritative browsing and source links.

**User stories**

* US-L1 (Citizen): As a citizen I can search laws by keyword, law number or date and read the official text with source metadata so I can verify legal content.
* US-L2 (DataEngineer): As a data engineer I can ingest a bulletin issue (PDF/HTML) and see ingestion logs/errors to ensure coverage.
* US-L3 (Official/InstitutionAdmin): As an official I can propose corrections to parsed law metadata (subject to data engineer review).

**UI Modules**

* Legal Home (browse recent issues)
* Law Detail Page (title, law number, issue, effective date, PDF link, article list, AI summary)
* Law Search (filters: date range, category, ministry, keywords)
* Ingestion Dashboard (ETL runs, status, errors)

**APIs (examples)**

* `GET /api/laws?q={query}&from={date}&to={date}&category={cat}&page=1` → list of laws (paginated)
* `GET /api/laws/{law_id}` → law details, articles, pdf_url, issue metadata
* `POST /api/etl/law-issues` (DataEngineer) → upload issue package (file/ref), returns job_id
* `GET /api/etl/jobs/{job_id}` → status, errors, parsed_record_count

**Data interactions**

* Store raw PDF (DataLake) and parsed canonical items: LawIssues → Laws → LawArticles.
* Each law record MUST include `source_url`, `pdf_path`, `issue_date`, `last_validated_by`, `ingestion_job_id`.

**Validation & Acceptance**

* On `GET /api/laws/{law_id}` the response must contain `source_url` and `pdf_path` and at least one `article` for law entries.
* ETL job should flag parsing confidence; any job with < 0.85 confidence for >5% of pages triggers manual review.

**Non-functional**

* Search latency < 300ms for common queries.
* Ingestion job retention logs: 1 year by default.

---

### 3.2 AI Legal Q&A (Retrieval + RAG pattern)

**Objectives:** allow question answering over the legal corpus while preventing hallucinations and ensuring provenance.

**User stories**

* US-AI1 (Citizen): Ask natural-language questions and receive concise answer + quoted legal excerpts + citation.
* US-AI2 (Moderator): Review AI-generated answers flagged as "uncertain" or "incorrect".

**UI Modules**

* Legal Assistant chat widget (sidebar on law pages)
* QA history for user (their previous queries & sources)
* AI Admin Console (monitoring accuracy, flagged answers)

**APIs**

* `POST /api/ai/query` {user_id, query_text, max_tokens?} → returns `{answer_text, confidence, sources:[{law_id, article_id, excerpt, match_score}], disclaimer}`
* `GET /api/ai/queries/{query_id}` → answer, feedback, audit trail
* `POST /api/ai/feedback` {answer_id, user_id, feedback_type, comment}

**Functional requirements**

* All answers MUST include at least one source with `law_id` and `article_id` shown verbatim (≤ 25 words excerpt if citing).
* Add mandatory standard disclaimer: "This is informational. Consult the official Bulletin Officiel or a licensed lawyer for legal advice."
* Confidence scoring: system must compute retrieval relevance and model confidence. Answers below a configurable threshold (e.g., 0.6) must be flagged and optionally route to human review.

**Data & Logging**

* Log full query, retrieved docs, model prompt, model output, timestamp, user_id, IP.
* Store per-answer `sources[]` and `retrieval_scores`.

**Acceptance**

* At least 95% of audited answers must correctly include the authoritative source excerpt for the audit sample.
* Flagging resolution time < 72 hours (moderator response).

**Non-functional**

* Response time target: ≤ 1.5 seconds for retrieval + model call (where model is local or cloud) under typical load.
* All model access under encrypted channels. PII removed from prompts.

---

### 3.3 Government Hierarchy & Official Directory

**Objectives:** maintain an authoritative tree of territorial areas and institutions, assign officials and roles, and expose profiles.

**User stories**

* US-H1 (Citizen): Browse country → region → province → commune → institutions and view officials with their tenure and institution.
* US-H2 (InstitutionAdmin): Update institution contact info and propose official assignment changes (subject to audit).

**UI Modules**

* Hierarchy navigator (tree & map)
* Institution page (metadata, budget links, officials)
* Official profile (photo, bio, assignments, reviews, documents)

**APIs**

* `GET /api/territories?type=region` → list regions
* `GET /api/institutions/{id}` → institution details, budgets, officials
* `POST /api/officials/{id}/assignments` (InstitutionAdmin/Moderator) → propose assignment
* `GET /api/officials/{official_id}` → profile, average_rating, reviews_count

**Functional**

* Use `TerritorialAreas` hierarchical table; allow geolocation fields for map rendering.
* Official assignments store start/end, role_id, institution_id, and `source_document_ref` (appointment decree link).

**Validation & Acceptance**

* Any assignment with `source_document_ref` must have a working URL or PDF stored.
* Directory update actions create an `AuditLogs` entry.

---

### 3.4 Budgets & Economic Transparency

**Objectives:** ingest budgets (national, CST, local), model programs/mission, budget items by nature & function, show dashboards and allow drilldown.

**User stories**

* US-B1 (Citizen): Compare the Health ministry budget between years and drill down to programs and line items.
* US-B2 (DataEngineer): Run ETL to fetch a ministry budget (PDF/CSV), map program codes and load normalized budget and items.
* US-B3 (Auditor): Run variance report between allocated vs. actual spending (once actuals ingested).

**UI Modules**

* Budget Explorer (year, ministry, program, nature)
* Budget Item detail (line, amount allocated, actual spending, source)
* Budget ingestion dashboard (ETL jobs, mapping errors)
* An "Explain this number" popover — plain-language, source citation, link to original document

**APIs**

* `GET /api/budgets?year=2025&institution_id=xx` → budget summary
* `GET /api/budgets/{budget_id}/items?program=yy` → items (paginated)
* `POST /api/etl/budgets` → upload file & start mapping job
* `GET /api/reports/variance?institution_id=xx&year=2024` → variance report

**Data**

* Budgets table with `budget_type`, `status`, `date_published`, `date_approved`.
* BudgetPrograms table for missions; BudgetItems with `nature_code` and `function_code`.
* Each BudgetItem must retain `source_page`, `pdf_path` or `source_url`.

**Business rules**

* Sum(BudgetItems.AmountAllocated) for a Budget must equal Budget.TotalAmount or ETL must raise an integrity warning.
* When actual spending data is missing, show `N/A` and mark as `NotExecutedDataAvailable`.

**Acceptance**

* Drilldown must not lose provenance: every displayed number has a visible source link.
* ETL mapping success rate threshold configurable (default: 90%). Jobs below threshold open an operator ticket.

**Non-functional**

* Dashboards for typical queries load within 2s; heavy reports may be async (job + email notification).

---

### 3.5 Public Contracts & Supplier Registry

**Objectives:** capture procurement details, suppliers, amounts, contract lifecycle, and link to budgets.

**User stories**

* US-C1 (Citizen): Search public contracts by supplier or institution and view contract documents.
* US-C2 (Auditor): See link between contract award and related budget item.

**UI Modules**

* Contracts list/search
* Contract detail (supplier, amount, dates, status, documents)
* Supplier profile (contracts, TIN, country)

**APIs**

* `GET /api/contracts?institution_id=xx&year=2024` → results
* `GET /api/contracts/{contract_id}` → contract detail, pdfs
* `POST /api/contracts` (InstitutionAdmin/DataEngineer) → ingest contract metadata and attachments

**Functional**

* Contracts must reference `BudgetItem` or `BudgetID` when possible.
* Supplier TIN and validation status stored.

**Acceptance**

* Every contract displayed must include at least one source document (pdf_url or source_url) or be flagged.

---

### 3.6 Citizen Reviews & Moderation

**Objectives:** enable citizen evaluation while protecting against defamation & abuse.

**User stories**

* US-R1 (Citizen): Submit a rating and comment for an official; view my review history.
* US-R2 (Moderator): Review flagged reviews, see automated spam score & AI toxicity score, approve/reject.
* US-R3 (Citizen): Flag an abusive review and see its status.

**UI Modules**

* Review composer (on Official profile)
* Review list with sorting/filtering (most helpful, newest, highest/lowest)
* Moderator console (queue, spam score, AI-assist decision flags)

**APIs**

* `POST /api/reviews` {official_id, user_id, rating, comment} → creates review (status=Pending or AutoApproved depending on heuristics)
* `GET /api/reviews?official_id=xx` → list (only approved for public view)
* `POST /api/reviews/{id}/flag` → create ReviewFlag
* `POST /api/moderation/reviews/{id}/decision` → Moderator approve/reject

**Workflow & Rules**

* New review sent through auto-filter:
  * run profanity check, spam score, sentiment analysis.
  * If score < threshold → auto-publish; else → moderation queue.
* Flagging by users increments `FlagCount`. After X flags or AI toxicity above threshold -> auto-hide until moderator checks.

**Audit**

* All moderation actions stored in `ReviewModeration` table with moderator id and reason.

**Acceptance**

* Average moderation turnaround <= 24 hours for high-severity flags.
* False positive/negative moderation rates tracked and below targets.

---

### 3.7 Awareness Hub & Micro-Learning

**Objectives:** create, publish, and track rights/obligations educational content with quizzes and badges.

**User stories**

* US-A1 (Citizen): Complete a quiz about voting rights and receive a badge.
* US-A2 (ContentAuthor): Draft content and submit for QC before publishing.

**UI Modules**

* Awareness Home (topics)
* Topic page (articles + quizzes)
* Quiz runner and results
* User badges & progress

**APIs**

* `GET /api/awareness/topics`
* `GET /api/awareness/topics/{id}/articles`
* `POST /api/awareness/quizzes/{id}/submit` → returns score and badge info

**Functional**

* Track user progress (`QuizResults`) for personalization and reporting.
* Support multimedia assets stored in DataLake.

**Acceptance**

* Quiz scoring must be deterministic and auditable.
* Badges awarded only when score >= configured threshold.

---

### 3.8 Notifications & Subscriptions

**Objectives:** let users subscribe to alerts (new law in region, budget published, official change).

**User stories**

* US-N1 (Citizen): Subscribe to budget updates for my region.
* US-N2 (InstitutionAdmin): Notify followers of a new institutional report.

**UI Modules**

* Notification settings (email, in-app)
* Notification center (unread/read list)

**APIs**

* `POST /api/subscriptions` {user_id, subscription_type, params}
* `GET /api/notifications?user_id=xx`
* `POST /api/notifications/send` (SystemAdmin/automated job)

**Functional**

* Notifications are queued and delivered via configured channels (email or in-app). Rate-limit alerts.

**Acceptance**

* Delivery rate metrics tracked, >95% delivery to endpoints with functioning contact info.

---

## 4. Data Validation, Provenance & Auditing (across modules)

* **Provenance metadata** for every ingested item: `source_url`, `pdf_path`, `issue_date`, `ingestion_job_id`, `last_verified_at`, `verified_by_user_id`.
* **AuditLogs** entry for all writes/updates/deletes of critical tables (Laws, Budgets, Officials, Contracts).
* **Versioning:** content tables (LawArticles, AwarenessArticles, Budgets) should support versioning (previous_version_id or a separate Version table).
* **ETL Job Logging:** store job_id, input file, mapping rules used, parse_confidence per page/record.
* **Data Quality Score** per dataset (0-100). Display to admins & optionally to public.

---

## 5. API Design Guidelines (common)

* Use RESTful URLs, JSON body, consistent paging (`page`, `page_size`) and filtering.
* Use standard HTTP codes (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 500 Internal).
* Return consistent error payload:

```json
{ "error": { "code": "ETL_PARSE_ERROR", "message": "Missing program code in line 34", "job_id": 12345 } }
```

* Version APIs via `api/v1/` and plan non-breaking deprecation strategy.
* All write endpoints require JWT + role check. Include `X-Request-ID` for tracing.
* Include `ETag` / `If-None-Match` for caching heavy GETs.

---

## 6. Security & Privacy Functional Requirements

* Authentication: OAuth2 / JWT with refresh tokens. MFA for moderators and system admins.
* Passwords: hashed (bcrypt/argon2).
* Data in transit: TLS minimum 1.2.
* Sensitive PII: store encrypted at rest (DB-level column encryption) and pseudonymize for analytics.
* Rate limiting: per-IP and per-user quotas for AI queries, search, and writes.
* Data retention: logs retained X days (configurable), legal text retained indefinitely.
* Access control: row-level access controls for InstitutionAdmin (can manage only their Institution).
* Moderation traceability: store who made moderation decisions and why.

---

## 7. Non-Functional & Operational Requirements (FRS-specific)

* **Performance:** UI pages ≤ 2s; API median latency ≤ 250ms for simple GETs; search ≤ 300ms. Heavy queries are async.
* **Availability:** 99.8% SLA target; maintenance windows announced.
* **Scalability:** design services to scale horizontally; DB partitioning by year/region for large tables (Budgets, LawArticles).
* **Observability:** centralized logs, metrics (Prometheus/Grafana), and distributed tracing (Jaeger).
* **Backup & Recovery:** daily backups of DB and weekly full backups; RTO < 4 hours for core services.
* **Localization:** full support for Arabic (UTF-8), French; correct RTL support in UI.
* **Accessibility:** WCAG 2.1 AA compliance.

---

## 8. Acceptance Criteria & Test Cases (per major feature)

(Only a representative subset — full QA plan recommended)

**Legal Ingestion**

* Given a new Bulletin PDF, when ingested, then `LawIssues` record is created and every Law has `source_url` and at least one Article.
* Parse confidence per page stored.

**AI Q&A**

* Given a query that the retrieval finds exact article, then the response includes excerpt, article_id and `confidence >= 0.6`.
* Queries with no retrieval match return "No direct source found. Here are related laws: [links]" and route to human review if user requests.

**Budget Drilldown**

* Given budget with 3 program entries, drilldown displays sums that match Budget.TotalAmount or shows a reconciliation warning.

**Review Moderation**

* Given a review with profanity, auto-block and put into moderation queue flagged with reason.

**Hierarchy Integrity**

* Given insertion of a Commune under an incorrect Province, system rejects and requires `ParentAreaID` correction; hierarchy constrained by `Type` rules.

---

## 9. Data Contracts (Examples)

**Law (GET /api/laws/{id})**

```json
{
  "law_id": 2345,
  "law_number": "01-23",
  "title": "Law on Public Procurement",
  "issue_id": 202301,
  "publication_date": "2023-06-12",
  "effective_date": "2023-07-01",
  "pdf_url": "https://.../01-23.pdf",
  "summary": "Short AI-generated summary",
  "articles": [
    { "article_id": 10001, "article_number": "Art. 1", "content": "...." }
  ],
  "provenance": {
    "ingestion_job_id": 9876,
    "source_url": "https://bulletinofficiel.ma/issue/202301",
    "last_validated_by": 12,
    "last_validated_at": "2024-02-20T10:00:00Z"
  }
}
```

**Budget (GET /api/budgets?institution_id=xx)**

```json
{
 "budget_id": 456,
 "year": 2025,
 "institution_id": 12,
 "budget_type": "Budget Général",
 "total_amount": 1200000000.00,
 "programs":[
   { "program_id": 1, "program_name":"Primary Healthcare", "allocated":500000000.00 }
 ]
}
```

---

## 10. Integration & ETL Flows (functional)

* **Law ingestion flow:**

  1. Scheduler / manual upload downloads PDF from official source.
  2. Save raw PDF to DataLake + create `ETLJob`.
  3. Parse via OCR/Text-parser → extract `LawIssues`, `Laws`, `LawArticles`.
  4. Validate parsing (checksum, structure).
  5. Index into search & embeddings store (for AI).
  6. Publish (status: Draft → Verified → Published).

* **Budget ingestion flow:**

  1. Retrieve budget file (CSV/PDF/Excel).
  2. Map columns to `BudgetItems` via mapping rules (manual mapping UI if needed).
  3. Run aggregation checks and sum validations.
  4. Publish and trigger dashboard refresh.

All job runs create `AuditLogs` and `DataSources` updates.

---

## 11. Prioritization & Roadmap (MVP → v1 → future)

**MVP (deliverable in first 8–12 weeks)**

* Legal repository ingestion for last 2 years (searchable)
* Institution & Territorial hierarchy + Official directory
* Basic Budgets ingestion for 1 ministry + budget explorer UI
* Reviews with moderation pipeline (auto filters + moderation queue)
* AI Q&A in limited mode (retrieval-only responses with direct citations)
* Authentication & basic RBAC

**v1 (next 3–6 months)**

* Full budgets & contracts ingestion across ministries
* RAG-based AI with confidence thresholds + human escalation
* Awareness hub + quizzes + badges
* Advanced reporting & analytics

**Future**

* Mobile apps, real-time integration with government APIs, fraud/anomaly detection models, public APIs for researchers.

---

## 12. Deliverables for Implementation Team (immediately actionable)

1. API spec (OpenAPI / Swagger) for endpoints listed above — generate from this FRS.
2. DB DDL + migrations for revised Moroccan schema (we already prepared earlier).
3. ETL job templates (Python) for law and budget ingestion.
4. Frontend component map (React) for UI modules: LegalHome, LawDetail, BudgetExplorer, OfficialProfile, ReviewComposer, ModeratorConsole, AIChatWidget.
5. QA test cases & acceptance tests derived from Acceptances section.
6. Security checklist & compliance mapping.

---

## 13. Next Steps

Pick one or multiple and I'll produce them now:

* A. Full **OpenAPI spec** (YAML/JSON) for the core endpoints (laws, budgets, officials, reviews, AI).
* B. **Detailed Moderator Console UI** wireframe + component list and interactions.
* C. **ETL job templates** (Python) for Bulletin Officiel ingestion with parsing pipeline (schema → parsed).
* D. **SQL DDL** (complete `CREATE TABLE` scripts) with constraints & indexes for the Moroccan-aligned schema.

---

**Document Control:**
- **Author:** Convergence Platform Team
- **Review Cycle:** Monthly during development
- **Next Review:** February 2025
- **Status:** Ready for Implementation
