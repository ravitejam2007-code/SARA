from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class EvidenceItem(BaseModel):
    claim: str = Field(..., description="High-level engineering finding or conclusion")
    source: str = Field(..., description="Internal document source, section and page")
    evidence: str = Field(..., description="Direct verbatim text extract or sensor value")
    calculation: Optional[str] = Field(None, description="Applied formula and numerical calculation")
    status: str = Field("VERIFIED", description="Verification flag: VERIFIED / REQUIRES_REVIEW")


class TaskStepResponse(BaseModel):
    step_number: int
    name: str
    state: str  # REQUESTED, PLANNING, ROUTING, EXECUTING, OBSERVING, VERIFYING, APPROVAL_REQUIRED, COMPLETED
    details: str
    tool_used: Optional[str] = None
    elapsed_ms: int = 0
    timestamp: str


class TaskCreateRequest(BaseModel):
    prompt: str = Field(..., description="User instruction or engineering request")
    task_type: Optional[str] = Field("inspection_analysis", description="inspection_analysis, agentic_coding, drawing_analysis, general")
    document_id: Optional[str] = Field(None, description="Referenced document or uploaded file ID")
    target_format: Optional[str] = Field("DOCX", description="Preferred output format: DOCX, XLSX, PPTX, PDF, CODE")
    require_approval: bool = Field(True, description="Enforce human approval gate before final deliverable")


class TaskApprovalRequest(BaseModel):
    action: str = Field(..., description="APPROVE, EDIT, or REJECT")
    comments: Optional[str] = Field(None, description="Human reviewer rationale or signoff comments")
    modifications: Optional[Dict[str, Any]] = Field(None, description="Optional manual field overrides")


class DeliverableItemResponse(BaseModel):
    id: str
    filename: str
    file_type: str
    size_bytes: int
    checksum_sha256: str
    verification_status: str
    summary: Optional[str] = None
    created_at: str
    download_url: str


class TaskResponse(BaseModel):
    id: str
    title: str
    prompt: str
    state: str
    model_used: str
    capability: str
    routing_reason: str
    created_at: str
    completed_at: Optional[str] = None
    elapsed_ms: int = 0
    steps: List[TaskStepResponse] = []
    evidence_chain: List[EvidenceItem] = []
    approval_status: str = "PENDING"  # PENDING, APPROVED, REJECTED
    approval_notes: Optional[str] = None
    deliverables: List[DeliverableItemResponse] = []
