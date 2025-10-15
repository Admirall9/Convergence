from fastapi import APIRouter

from src.core.settings import settings
from src.db.session import db_healthcheck


router = APIRouter()


@router.get("", summary="Service health")
def health():
    return {"status": "ok", "app": settings.app_name, "env": settings.app_env}


@router.get("/db", summary="Database connectivity")
def health_db():
    ok = False
    try:
        ok = db_healthcheck()
    except Exception:  # intentionally return false on failure without leaking details
        ok = False
    return {"status": "ok" if ok else "error"}


