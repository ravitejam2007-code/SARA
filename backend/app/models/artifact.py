from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, BigInteger, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.agent_run import AgentRun


class Artifact(Base, TimestampMixin):
    """Certified deliverable artifact compiled by sovereign workflows."""
    __tablename__ = "artifacts"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    filename: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    file_type: Mapped[str] = mapped_column(String(20), index=True, nullable=False)  # DOCX, XLSX, PDF, etc.
    size_bytes: Mapped[int] = mapped_column(BigInteger, nullable=False)
    checksum_sha256: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    storage_path: Mapped[str] = mapped_column(String(500), nullable=False)
    hsm_attestation: Mapped[str] = mapped_column(String(100), default="HSM-YUBI-FIPS-LVL3", nullable=False)
    verification_status: Mapped[str] = mapped_column(String(50), default="VERIFIED", index=True, nullable=False)
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    agent_run_id: Mapped[Optional[str]] = mapped_column(ForeignKey("agent_runs.id"), nullable=True)
    agent_run: Mapped[Optional["AgentRun"]] = relationship("AgentRun", back_populates="artifacts")

    def __repr__(self) -> str:
        return f"<Artifact(id='{self.id}', filename='{self.filename}', status='{self.verification_status}')>"
