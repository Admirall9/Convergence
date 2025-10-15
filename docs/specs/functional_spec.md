## Convergence – Functional Specification (v0)

Scope: MVP across GOV.MGT, ECO, LAW, CIT; CORE services baseline. All endpoints will eventually be versioned under `/api/v1`.

### Actors
- Citizen (anonymous, authenticated)
- Moderator
- Admin
- ETL Worker (service account)

### Feature Matrix (selected MVP)

1) Official Directory (GOV.MGT)
- Use cases:
  - Create/Update `Institution`, `Official`, `Tenure`
  - Browse hierarchy by level/region
  - View `Official` profile with reviews and metrics
- Inputs: Institution metadata, person profile, role, dates; pagination/filter params
- Outputs: JSON with entities; errors on validation/uniqueness
- Rules: Tenure dates non-overlapping per official/role; Institution codes unique

2) Citizen Reviews (CIT)
- Use cases:
  - Create/Edit/Delete Review (owner)
  - Report Review (abuse)
  - Moderate Review (approve/reject)
- Inputs: rating (1–5), text (limits), target official, reporter reason
- Outputs: review id, status, moderation decision
- Rules: anti-spam throttling; profanity filter; audit trail for moderation

3) Budget Management (ECO)
- Use cases:
  - Upload Budget Document (CSV/XLSX)
  - Parse to `BudgetLine`; link to Institution
  - Query by year, chapter, region
- Inputs: file upload, mapping config; filters
- Outputs: parse report, normalized lines, KPIs
- Rules: schema validation; maintain `SourceFile` and `JobRun` with checksum

4) Legal Repository (LAW)
- Use cases:
  - Ingest Gazette Issue (PDF/HTML)
  - Extract Law Documents, Articles
  - Full-text index (future)
- Inputs: source URL/file, publication date
- Outputs: stored issue, extracted docs
- Rules: legal provenance mandatory (source, date)

### API Contracts (sketch)
- Directory
  - POST `/api/v1/institutions` – create
  - GET `/api/v1/institutions` – list (filters: type, region, parent)
  - POST `/api/v1/officials` – create official
  - POST `/api/v1/tenures` – create tenure
- Reviews
  - POST `/api/v1/reviews` – create
  - POST `/api/v1/reviews/{id}/report` – report
  - POST `/api/v1/reviews/{id}/moderate` – approve/reject (moderator)
- Budget
  - POST `/api/v1/budgets/upload` – file upload
  - GET `/api/v1/budgets/lines` – query
- Legal
  - POST `/api/v1/gazette/issues` – ingest
  - GET `/api/v1/laws` – list/search (future full-text)

### Data Interactions
- Write paths: OLTP (SQL Server), transactional integrity per request
- Read paths: OLTP; later cached or read models for dashboards
- ETL: background jobs populate domain tables; lineage via `JobRun` and `SourceFile`

### Validation & Errors
- Request validation via Pydantic models; 400 on invalid
- 401/403 for auth/permission failures; 404 if not found; 409 on conflict

### Non-Functional Per Feature
- Timeouts: 15s for standard API; uploads 120s
- Rate limiting: user-level and IP-level (future gateway)
- Audit: Admin/moderation actions stored as `LogEvent`


