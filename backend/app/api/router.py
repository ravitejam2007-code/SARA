from fastapi import APIRouter
from app.api.v1 import api_v1_router
from app.api.v1.health import router as health_router
from app.api.v1.auth import router as auth_router
from app.api.v1.files import router as files_router
from app.api.v1.models import router as models_router
from app.api.v1.security import router as security_router
from app.api.v1.audit import router as audit_router

api_router = APIRouter(prefix="/api")

# 1. Mount Versioned V1 Router (/api/v1/...)
api_router.include_router(api_v1_router)

# 2. Mount Direct Alias Endpoints (/api/health, /api/auth, /api/files, etc.)
api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(files_router)
api_router.include_router(models_router)
api_router.include_router(security_router)
api_router.include_router(audit_router)

__all__ = ["api_router"]
