## Convergence – Logical Data Model (Conceptual)

### Conceptual Entities (by domain)
- Governance: Institution, Official, Role, Tenure, PerformanceMetric
- Citizen: User, Profile, Reputation, Review, Report, Badge
- Economic: BudgetDocument, BudgetLine, Contract, Supplier, Project, AuditReport, Indicator
- Legal: GazetteIssue, LawDocument, Article, Amendment, LegalTopic, ReferenceLink
- System: JobRun, SourceFile, LogEvent, Notification, Role, Permission, APIKey

### Relationships (Mermaid ER, conceptual)
```mermaid
erDiagram
  Institution ||--o{ Official : employs
  Official ||--o{ Tenure : has
  Tenure }o--|| Role : covers
  Official ||--o{ Review : receives
  User ||--o{ Review : writes
  Review }o--o{ Report : may_be

  BudgetDocument ||--o{ BudgetLine : contains
  BudgetLine }o--o{ Contract : may_link
  Contract }o--|| Supplier : awarded_to
  BudgetLine }o--o{ Project : funds

  GazetteIssue ||--o{ LawDocument : includes
  LawDocument ||--o{ Article : comprises
  Article }o--o{ Amendment : modified_by
  LawDocument }o--o{ LegalTopic : categorized_as

  JobRun ||--o{ SourceFile : processes
  User }o--o{ Role : assigned
  Role }o--o{ Permission : grants
```

Notes:
- Multiplicities are indicative; details refined during LDM→PDM transition.
- System roles/permissions distinct from domain `Role` (official role); name carefully in PDM.


