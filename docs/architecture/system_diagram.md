## Convergence – System Architecture Diagram

```mermaid
flowchart TB
  subgraph Presentation
    Web[Web Portal]
    Mobile[Mobile]
    Moderator[Moderator Console]
    APIClient[3rd-party Clients]
  end

  subgraph Gateway
    APIGW[API Gateway / Reverse Proxy]
  end

  subgraph AppLayer[Application Services (FastAPI)]
    DirSvc[DirectoryService]
    RevSvc[ReviewService]
    BudSvc[BudgetService]
    LawInj[LegalIngestionService]
    LawQA[LegalQASvc]
    AuthSvc[AuthService]
    Notif[NotificationSvc]
  end

  subgraph Workers[Background Workers]
    ETL[ETL Scheduler/Jobs]
    Index[Indexer]
  end

  subgraph Data
    SQL[(SQL Server OLTP)]
    Search[(Search/Vector Index - future)]
    DW[(Data Warehouse - future)]
    Lake[(Data Lake - future)]
  end

  subgraph Observability
    Logs[Structured Logs]
    Traces[Tracing]
    Metrics[Metrics]
  end

  Web --> APIGW --> DirSvc
  Mobile --> APIGW --> RevSvc
  Moderator --> APIGW --> AuthSvc
  APIClient --> APIGW --> BudSvc

  DirSvc --> SQL
  RevSvc --> SQL
  BudSvc --> SQL
  LawInj --> SQL
  LawQA --> Search

  ETL --> SQL
  Index --> Search

  DirSvc -.-> Logs
  RevSvc -.-> Logs
  BudSvc -.-> Logs
  LawInj -.-> Logs
  AuthSvc -.-> Logs
  ETL -.-> Logs
  Index -.-> Logs
```


