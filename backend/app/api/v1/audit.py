from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.audit import AuditLogListResponse
from app.services.audit_service import list_audit_logs, to_audit_log_response

router = APIRouter(prefix="/audit", tags=["Cryptographic Audit"])


@router.get("/logs", response_model=AuditLogListResponse)
def get_audit_logs(
    search: Optional[str] = Query(None, description="Search by actor, action, resource, or SHA-256"),
    status: Optional[str] = Query(None, description="Filter by status (CONFIRMED, REJECTED, etc.)"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
) -> AuditLogListResponse:
    """Retrieve immutable cryptographic WORM audit ledger entries."""
    total, records = list_audit_logs(db, search, status, skip, limit)
    return AuditLogListResponse(
        total=total,
        logs=[to_audit_log_response(r) for r in records],
    )
