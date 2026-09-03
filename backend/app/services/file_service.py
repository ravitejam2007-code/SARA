import hashlib
import uuid
from typing import List, Optional, Tuple
from pathlib import Path
from fastapi import UploadFile
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.file import FileRecord
from app.models.user import User
from app.schemas.file import FileResponse
from app.config import settings
from app.utils.logger import logger


def format_file_size(size_bytes: int) -> str:
    """Format bytes into human-readable size string."""
    for unit in ["B", "KB", "MB", "GB", "TB"]:
        if size_bytes < 1024.0:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.1f} PB"


def to_file_response(record: FileRecord) -> FileResponse:
    return FileResponse(
        id=record.id,
        filename=record.filename,
        file_type=record.file_type,
        size_bytes=record.size_bytes,
        formatted_size=format_file_size(record.size_bytes),
        checksum_sha256=record.checksum_sha256,
        processing_status=record.processing_status,
        processing_progress=record.processing_progress,
        uploaded_by=record.uploaded_by.name if record.uploaded_by else "System",
        uploaded_at=record.created_at,
        page_count=record.page_count,
        summary=record.summary,
    )


async def save_uploaded_file(
    db: Session,
    upload_file: UploadFile,
    current_user: Optional[User] = None,
) -> FileRecord:
    """Stream incoming upload file, calculate SHA-256, write to storage, and persist DB record."""
    file_id = f"DOC-{uuid.uuid4().hex[:8].upper()}"
    filename = upload_file.filename or "unnamed_document"
    ext = filename.split(".")[-1].upper() if "." in filename else "TXT"

    # Destination path in storage directory
    safe_filename = f"{file_id}_{filename}"
    dest_path = settings.storage_path / safe_filename

    sha256_hash = hashlib.sha256()
    bytes_written = 0

    with open(dest_path, "wb") as buffer:
        while chunk := await upload_file.read(1024 * 1024):  # 1MB chunks
            buffer.write(chunk)
            sha256_hash.update(chunk)
            bytes_written += len(chunk)

    checksum = sha256_hash.hexdigest()

    file_record = FileRecord(
        id=file_id,
        filename=filename,
        file_type=ext,
        size_bytes=bytes_written,
        checksum_sha256=checksum,
        storage_path=str(dest_path),
        processing_status="COMPLETED",
        processing_progress=100,
        uploaded_by_id=current_user.id if current_user else None,
        summary=f"Ingested {ext} document '{filename}' ({format_file_size(bytes_written)}).",
    )

    db.add(file_record)
    db.commit()
    db.refresh(file_record)

    logger.info(f"File successfully ingested: {file_id} ({filename}) - {checksum[:12]}...")
    return file_record


def list_files(
    db: Session,
    search: Optional[str] = None,
    file_type: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
) -> Tuple[int, List[FileRecord]]:
    """Query files with optional filtering and pagination."""
    query = db.query(FileRecord)

    if search:
        s = f"%{search.lower()}%"
        query = query.filter(
            (FileRecord.filename.ilike(s)) | (FileRecord.summary.ilike(s))
        )

    if file_type and file_type.upper() != "ALL":
        query = query.filter(FileRecord.file_type == file_type.upper())

    if status and status.upper() != "ALL":
        query = query.filter(FileRecord.processing_status == status.upper())

    total = query.count()
    records = query.order_by(desc(FileRecord.created_at)).offset(skip).limit(limit).all()
    return total, records
