from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.utils.logger import logger
from app.schemas.task import (
    TaskCreateRequest,
    TaskResponse,
    TaskApprovalRequest,
)
from app.services.agent_service import AgentWorkflowOrchestrator

router = APIRouter(prefix="/tasks", tags=["Agent Tasks & Human Approval"])


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_agent_task(
    req: TaskCreateRequest,
    db: Session = Depends(get_db),
) -> TaskResponse:
    """
    Submit a confidential task to the Sovereign Agent Runtime.
    Automatically selects specialized local open-weight model, executes
    controlled tools, performs evidence-first verification, and holds at human approval gate.
    """
    return AgentWorkflowOrchestrator.create_task(db=db, req=req)


@router.get("", response_model=List[TaskResponse])
def list_tasks(
    db: Session = Depends(get_db),
) -> List[TaskResponse]:
    """Retrieve all historical and active agent task executions."""
    return AgentWorkflowOrchestrator.list_tasks(db)


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: str,
    db: Session = Depends(get_db),
) -> TaskResponse:
    """Retrieve detailed state machine telemetry, evidence chain, and deliverables for a task."""
    task = AgentWorkflowOrchestrator.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Task '{task_id}' not found.")
    return task


@router.post("/{task_id}/approve", response_model=TaskResponse)
def approve_task(
    task_id: str,
    req: TaskApprovalRequest,
    db: Session = Depends(get_db),
) -> TaskResponse:
    """
    Human Approval Checkpoint.
    Allows an authorized Engineer or Manager to formally APPROVE, EDIT, or REJECT
    an AI-drafted deliverable before official organizational release.
    """
    try:
        return AgentWorkflowOrchestrator.handle_approval(db, task_id, req)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.post("/{task_id}/reject", response_model=TaskResponse)
def reject_task(
    task_id: str,
    req: Optional[TaskApprovalRequest] = None,
    db: Session = Depends(get_db),
) -> TaskResponse:
    """Reject an AI deliverable and mandate re-evaluation."""
    approval_req = req or TaskApprovalRequest(action="REJECT", comments="Rejected by reviewer.")
    approval_req.action = "REJECT"
    try:
        return AgentWorkflowOrchestrator.handle_approval(db, task_id, approval_req)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
