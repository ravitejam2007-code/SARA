from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.security import SecurityStatusResponse
from app.services.security_service import get_security_status

router = APIRouter(prefix="/security", tags=["Security & Sovereignty"])


@router.get("/status", response_model=SecurityStatusResponse)
def get_status(db: Session = Depends(get_db)) -> SecurityStatusResponse:
    """Retrieve verified on-premise sovereignty metrics and local enclave service telemetry."""
    return get_security_status(db)
