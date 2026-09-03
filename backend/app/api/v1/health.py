from datetime import datetime, timezone
from fastapi import APIRouter
from app.config import settings
from app.db.session import check_db_connection
from app.schemas.common import HealthResponse

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=HealthResponse)
def get_health() -> HealthResponse:
    """Check health and connectivity of Zenith AI sovereign backend."""
    db_connected = check_db_connection()
    return HealthResponse(
        status="healthy" if db_connected else "degraded",
        project=settings.PROJECT_NAME,
        version=settings.VERSION,
        database="connected" if db_connected else "unavailable",
        environment=settings.ENVIRONMENT,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
