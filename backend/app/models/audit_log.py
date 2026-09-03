from datetime import datetime
from typing import Optional
from sqlalchemy import String, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base, utc_now


class AuditLog(Base):
    """Immutable Write-Once-Read-Many (WORM) cryptographic audit record."""
    __tablename__ = "audit_logs"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False, index=True)
    actor: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    action: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    resource: Mapped[str] = mapped_column(String(255), nullable=False)
    enclave_id: Mapped[str] = mapped_column(String(100), default="ENCLAVE-NODE-SEC-01", nullable=False)
    sha256_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="CONFIRMED", index=True, nullable=False)
    ip_or_interface: Mapped[str] = mapped_column(String(100), default="mTLS-NODE-LOCAL", nullable=False)
    metadata_payload: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    def __repr__(self) -> str:
        return f"<AuditLog(id='{self.id}', actor='{self.actor}', action='{self.action}')>"
