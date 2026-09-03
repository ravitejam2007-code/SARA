import os
import pytest
from fastapi.testclient import TestClient


def test_create_inspection_task_and_approval_workflow(client: TestClient):
    """
    Test SIH Flagship Demo 1:
    Inspection Report -> Multimodal Analysis -> SOP Retrieval -> Calculation -> Human Approval -> Real Deliverables
    """
    # 1. Create task
    response = client.post(
        "/api/tasks",
        json={
            "prompt": "Analyze this inspection report, identify key findings, compare them with the applicable internal SOP, perform required calculations, and prepare an approval note.",
            "task_type": "inspection_analysis",
            "require_approval": True,
        },
    )
    assert response.status_code == 201
    task_data = response.json()
    task_id = task_data["id"]

    # Verify State Machine
    assert task_data["state"] == "APPROVAL_REQUIRED"
    assert task_data["approval_status"] == "PENDING"
    assert "SARA" in task_data["model_used"]

    # Verify Steps
    assert len(task_data["steps"]) >= 7
    step_names = [s["name"] for s in task_data["steps"]]
    assert any("Model Router" in s for s in step_names)
    assert any("Document Parsing" in s for s in step_names)
    assert any("OCR" in s for s in step_names)
    assert any("Knowledge" in s for s in step_names)
    assert any("Calculation" in s for s in step_names)
    assert any("Human Approval" in s for s in step_names)

    # Verify Evidence Chain (Section 14: Claim -> Evidence -> Source -> Calculation -> Status)
    assert len(task_data["evidence_chain"]) == 3
    claims = [e["claim"] for e in task_data["evidence_chain"]]
    assert any("vibration" in c.lower() for c in claims)
    assert any("exhaust" in c.lower() for c in claims)
    for e in task_data["evidence_chain"]:
        assert len(e["source"]) > 5
        assert len(e["evidence"]) > 5
        assert e["status"] in ["VERIFIED", "REQUIRES_REVIEW"]

    # Verify Certified Deliverables (Real DOCX, XLSX, PDF)
    assert len(task_data["deliverables"]) == 3
    doc_types = [d["file_type"] for d in task_data["deliverables"]]
    assert "DOCX" in doc_types
    assert "XLSX" in doc_types
    assert "PDF" in doc_types

    for d in task_data["deliverables"]:
        assert d["size_bytes"] > 500
        assert len(d["checksum_sha256"]) == 64
        assert d["verification_status"] == "VERIFIED"

    # 2. Test Deliverable Download
    docx_item = next(d for d in task_data["deliverables"] if d["file_type"] == "DOCX")
    dl_res = client.get(docx_item["download_url"])
    assert dl_res.status_code == 200
    assert len(dl_res.content) == docx_item["size_bytes"]

    # 3. Test Human Approval Gate (Section 18: Approve / Edit / Reject)
    approve_res = client.post(
        f"/api/tasks/{task_id}/approve",
        json={
            "action": "APPROVE",
            "comments": "Reviewed by Lead Plant Engineer. Vibration exceedance noted; authorize 85% de-rate and 48h boroscope inspection.",
        },
    )
    assert approve_res.status_code == 200
    approved_data = approve_res.json()
    assert approved_data["state"] == "COMPLETED"
    assert approved_data["approval_status"] == "APPROVED"
    assert "Lead Plant Engineer" in approved_data["approval_notes"]


def test_create_agentic_coding_task_sandbox(client: TestClient):
    """
    Test SIH Flagship Demo 2:
    Coding Request -> Coding Model -> Sandbox Execution (Zero Network) -> Tests -> Verified Deliverable
    """
    response = client.post(
        "/api/tasks",
        json={
            "prompt": "Create Python code to calculate the supplied engineering values and verify the result with automated tests.",
            "task_type": "agentic_coding",
            "require_approval": False,
        },
    )
    assert response.status_code == 201
    task_data = response.json()

    # Verify autonomous completion
    assert task_data["state"] == "COMPLETED"
    assert "Code" in task_data["model_used"] or "Coding" in task_data["model_used"] or "SARA" in task_data["model_used"]

    # Verify Sandbox Step Execution
    sb_step = next(s for s in task_data["steps"] if "Sandbox" in s["name"] or "code.execute_sandbox" == s.get("tool_used"))
    assert "5 passed" in sb_step["details"]
    assert "Zero network" in sb_step["details"]

    # Verify Deliverable Python Code File
    assert len(task_data["deliverables"]) >= 1
    code_deliv = task_data["deliverables"][0]
    assert code_deliv["file_type"] == "CODE"
    assert code_deliv["size_bytes"] > 100

    # Verify download
    dl_res = client.get(code_deliv["download_url"])
    assert dl_res.status_code == 200
    assert b"def detect_vibration_anomalies" in dl_res.content
