import hashlib
import uuid
from datetime import datetime, timezone
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.audit_log import AuditLog
from app.schemas.audit import AuditLogResponse
from app.utils.logger import logger


def to_audit_log_response(log: AuditLog) -> AuditLogResponse:
    return AuditLogResponse(
        id=log.id,
        timestamp=log.timestamp,
        actor=log.actor,
        action=log.action,
        resource=log.resource,
        enclave_id=log.enclave_id,
        sha256_hash=log.sha256_hash,
        status=log.status,
        ip_or_interface=log.ip_or_interface,
        metadata_payload=log.metadata_payload,
    )


def list_audit_logs(
    db: Session,
    search: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
) -> Tuple[int, List[AuditLog]]:
    """Query audit logs with optional search and pagination."""
    query = db.query(AuditLog)

    if search:
        s = f"%{search.lower()}%"
        query = query.filter(
            (AuditLog.actor.ilike(s))
            | (AuditLog.action.ilike(s))
            | (AuditLog.resource.ilike(s))
            | (AuditLog.sha256_hash.ilike(s))
        )

    if status and status.upper() != "ALL":
        query = query.filter(AuditLog.status == status.upper())

    total = query.count()
    records = query.order_by(desc(AuditLog.timestamp)).offset(skip).limit(limit).all()
    return total, records


def record_audit_event(
    db: Session,
    actor: str,
    action: str,
    resource: str,
    enclave_id: str = "ENCLAVE-TITAN-X8",
    status: str = "CONFIRMED",
    ip_or_interface: str = "mTLS-NODE-LOCAL",
    metadata_payload: Optional[str] = None,
) -> AuditLog:
    """Commit an immutable cryptographic WORM audit ledger entry."""
    now = datetime.now(timezone.utc)
    raw_signature = f"{now.isoformat()}|{actor}|{action}|{resource}|{enclave_id}|{status}"
    sha256_hash = hashlib.sha256(raw_signature.encode("utf-8")).hexdigest()

    log_entry = AuditLog(
        id=f"LOG-{uuid.uuid4().hex[:8].upper()}",
        timestamp=now,
        actor=actor,
        action=action,
        resource=resource,
        enclave_id=enclave_id,
        sha256_hash=sha256_hash,
        status=status,
        ip_or_interface=ip_or_interface,
        metadata_payload=metadata_payload,
    )

    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)
    logger.info(f"Audit log recorded: {log_entry.id} - {actor} -> {action}")
    return log_entry
