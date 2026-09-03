from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class AuditLogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    timestamp: datetime
    actor: str
    action: str
    resource: str
    enclave_id: str
    sha256_hash: str
    status: str
    ip_or_interface: str
    metadata_payload: Optional[str] = None


class AuditLogListResponse(BaseModel):
    total: int
    logs: List[AuditLogResponse]
