## Convergence – Process Flow (ETL → DB → API → Dashboard)

```mermaid
flowchart LR
  subgraph Sources
    S1[Gazette PDFs/HTML]
    S2[Budget CSV/XLSX]
    S3[User Reviews]
  end

  subgraph ETL
    E1[Ingest Gazette]
    E2[Parse Budget]
    E3[Moderation Queue]
  end

  S1 --> E1 -->|JobRun & SourceFile| DB[(SQL Server OLTP)]
  S2 --> E2 -->|Normalized Lines| DB
  S3 --> E3 -->|Approved Reviews| DB

  subgraph API
    A1[FastAPI Services]
  end

  DB <---> A1

  subgraph Dashboards
    D1[Transparency KPIs]
    D2[Governance Index]
  end

  A1 --> D1
  A1 --> D2
```

Key controls:
- Every ETL step records `JobRun` and `SourceFile` with checksums and timestamps.
- Validation gates (schema, referential). Failed items quarantined for review.
- Observability: logs with correlation IDs; metrics on throughput and failures.


