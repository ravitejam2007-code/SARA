from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Integer, BigInteger, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User


class FileRecord(Base, TimestampMixin):
    """Uploaded engineering documents and datasets."""
    __tablename__ = "files"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    filename: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    file_type: Mapped[str] = mapped_column(String(20), index=True, nullable=False)  # PDF, DOCX, XLSX, etc.
    size_bytes: Mapped[int] = mapped_column(BigInteger, nullable=False)
    checksum_sha256: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    storage_path: Mapped[str] = mapped_column(String(500), nullable=False)
    processing_status: Mapped[str] = mapped_column(String(50), default="PENDING", index=True, nullable=False)
    processing_progress: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    page_count: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    uploaded_by_id: Mapped[Optional[str]] = mapped_column(ForeignKey("users.id"), nullable=True)
    uploaded_by: Mapped[Optional["User"]] = relationship("User", back_populates="files")

    def __repr__(self) -> str:
        return f"<FileRecord(id='{self.id}', filename='{self.filename}', type='{self.file_type}')>"
