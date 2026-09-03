from fastapi import APIRouter
from app.api.v1.health import router as health_router
from app.api.v1.auth import router as auth_router
from app.api.v1.files import router as files_router
from app.api.v1.models import router as models_router
from app.api.v1.security import router as security_router
from app.api.v1.audit import router as audit_router
from app.api.v1.tasks import router as tasks_router
from app.api.v1.deliverables import router as deliverables_router

api_v1_router = APIRouter(prefix="/v1")
api_v1_router.include_router(health_router)
api_v1_router.include_router(auth_router)
api_v1_router.include_router(files_router)
api_v1_router.include_router(models_router)
api_v1_router.include_router(security_router)
api_v1_router.include_router(audit_router)
api_v1_router.include_router(tasks_router)
api_v1_router.include_router(deliverables_router)

__all__ = ["api_v1_router"]
