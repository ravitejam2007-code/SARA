from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class FileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    filename: str
    file_type: str
    size_bytes: int
    formatted_size: str
    checksum_sha256: str
    processing_status: str
    processing_progress: int
    uploaded_by: Optional[str] = None
    uploaded_at: datetime
    page_count: Optional[int] = None
    summary: Optional[str] = None


class FileListResponse(BaseModel):
    total: int
    files: List[FileResponse]
