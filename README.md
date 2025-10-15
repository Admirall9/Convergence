## Convergence Backend (FastAPI + SQL Server)

Enterprise-ready FastAPI service targeting Microsoft SQL Server on Windows.

### Prerequisites (Windows)
- Python 3.10–3.12 (64-bit)
- Microsoft ODBC Driver 18 for SQL Server
  - Download from Microsoft and install. Ensure the driver name is "ODBC Driver 18 for SQL Server".
- Local SQL Server instance accessible at `localhost` (or update `.env`).
- PowerShell execution policy allowing running local scripts: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

### Setup
1. Copy `.env.example` to `.env` and set values

SQLSERVER_HOST=localhost
SQLSERVER_PORT=1433
SQLSERVER_DB=Convergence
SQLSERVER_USER=sa
SQLSERVER_PASSWORD=AdmiraL!1997*02   # use the one you set in SSMS
SQL_ENCRYPT=no
2. Create a virtualenv and install deps

```powershell
./scripts/create-venv.ps1
```

3. One-command dev (backend + frontend)

```powershell
./scripts/dev.ps1
```

Backend: `http://127.0.0.1:8000/docs` | Frontend: `http://127.0.0.1:5173`

4. (Optional) Run the API only

```powershell
./scripts/run.ps1
```

The API will start on `http://127.0.0.1:8000`. Open `http://127.0.0.1:8000/docs` for Swagger UI.

### Health Checks
- `GET /health` – app and version
- `GET /health/db` – verifies DB connectivity with `SELECT 1` (requires valid DB credentials)

### Configuration
Environment variables (via `.env`):
- `APP_NAME` – service name
- `APP_ENV` – `development` | `staging` | `production`
- `APP_HOST` – bind host
- `APP_PORT` – bind port
- `LOG_LEVEL` – `INFO` (default), `DEBUG`, `WARNING`, `ERROR`
- `SQLSERVER_HOST`, `SQLSERVER_PORT`, `SQLSERVER_DB`, `SQLSERVER_USER`, `SQLSERVER_PASSWORD`
- `SQL_ENCRYPT` – `yes` or `no` (default `no` for local). For local dev, we use `TrustServerCertificate=yes`.

### Migrations (Alembic)
Alembic is not yet initialized. After the first run, initialize:

```powershell
poetry run alembic init alembic
```

Then edit `alembic/env.py` to import the SQLAlchemy `engine` from `src/db/session.py` and proceed with revisions.

### Testing
```powershell
poetry run pytest -q
```


