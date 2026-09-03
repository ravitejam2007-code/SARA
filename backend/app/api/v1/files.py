from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File, Query, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.schemas.file import FileResponse, FileListResponse
from app.services.file_service import save_uploaded_file, list_files, to_file_response
from app.services.auth_service import security_bearer, get_current_user
from app.services.audit_service import record_audit_event

router = APIRouter(prefix="/files", tags=["Documents & Files"])


@router.post("/upload", response_model=FileResponse, status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    # Optional auth: Allow uploads if logged in, or anonymous system uploads in dev
    credentials=Depends(security_bearer),
) -> FileResponse:
    """Ingest an industrial engineering document into sovereign storage and calculate SHA-256."""
    current_user: Optional[User] = None
    if credentials:
        try:
            current_user = get_current_user(credentials, db)
        except Exception:
            pass

    file_record = await save_uploaded_file(db, file, current_user)

    # Record audit log
    record_audit_event(
        db,
        actor=current_user.username if current_user else "SYSTEM_INGEST",
        action="DOCUMENT_INGESTED",
        resource=f"{file_record.id} // {file_record.filename}",
        status="CONFIRMED",
        metadata_payload=f'{{"sha256": "{file_record.checksum_sha256}", "size_bytes": {file_record.size_bytes}}}',
    )

    return to_file_response(file_record)


@router.get("", response_model=FileListResponse)
def get_files(
    search: Optional[str] = Query(None, description="Search query across filename and summary"),
    file_type: Optional[str] = Query(None, description="Filter by file extension: PDF, DOCX, etc."),
    status: Optional[str] = Query(None, description="Filter by processing status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
) -> FileListResponse:
    """Query ingested engineering documents with optional search, filtering, and pagination."""
    total, records = list_files(db, search, file_type, status, skip, limit)
    return FileListResponse(
        total=total,
        files=[to_file_response(r) for r in records],
    )
