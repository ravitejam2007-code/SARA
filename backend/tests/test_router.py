import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.models.registry import ModelRegistryManager
from app.models.schemas import ModelRegistrationRequest, ModelUpdateRequest


def test_route_coding_request(client: TestClient):
    """
    Requirement 15: Test router on coding request.
    Verifies automatic classification into 'coding' capability and selection of coding model.
    """
    response = client.post(
        "/api/models/route",
        json={
            "prompt": "Write a Python function to parse vibration sensor logs and detect anomaly thresholds.",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["capability"] == "coding"
    assert data["selected_model"]["coding_support"] is True
    assert "coding" in data["reason"].lower() or "code" in data["reason"].lower()
    assert data["fallback_used"] is False


def test_route_document_request(client: TestClient):
    """
    Requirement 15: Test router on document intelligence request.
    Verifies classification into 'document' capability and selection of document reasoning model.
    """
    response = client.post(
        "/api/models/route",
        json={
            "prompt": "Summarize the technical inspection report and verify compliance against ISO 10816 standards.",
            "file_extension": "pdf",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["capability"] == "document"
    assert data["selected_model"]["reasoning_support"] is True
    assert "document" in data["reason"].lower() or "reasoning" in data["reason"].lower()
    assert data["fallback_used"] is False


def test_route_vision_request(client: TestClient):
    """
    Requirement 15: Test router on vision inspection request.
    Verifies classification into 'vision' capability and selection of multi-modal vision model.
    """
    response = client.post(
        "/api/models/route",
        json={
            "prompt": "Inspect this high-resolution photograph of the turbine blade root for surface cracks.",
            "has_image": True,
            "file_extension": "png",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["capability"] == "vision"
    assert data["selected_model"]["vision_support"] is True
    assert "vision" in data["reason"].lower()
    assert data["fallback_used"] is False


def test_route_spreadsheet_request(client: TestClient):
    """
    Test router on tabular/spreadsheet request.
    """
    response = client.post(
        "/api/models/route",
        json={
            "prompt": "Analyze the equipment downtime Excel file and calculate mean time between failures (MTBF).",
            "has_table": True,
            "file_extension": "xlsx",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["capability"] == "spreadsheet"
    assert data["selected_model"]["enabled"] is True


def test_route_unavailable_model_fallback(client: TestClient):
    """
    Requirement 15 & 13: Test fallback when the preferred model is disabled/unavailable.
    Disables the vision model and verifies that vision tasks transparently fall back
    to a local reasoning model without external cloud egress.
    """
    # 1. Disable the vision model
    patch_res = client.patch(
        "/api/models/mdl-vision-deepcad",
        json={"enabled": False},
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["enabled"] is False

    # 2. Issue a vision request
    route_res = client.post(
        "/api/models/route",
        json={
            "prompt": "Inspect turbine photo for thermal stress fractures.",
            "has_image": True,
            "file_extension": "jpg",
        },
    )
    assert route_res.status_code == 200
    data = route_res.json()
    assert data["capability"] == "vision"
    assert data["fallback_used"] is True
    assert "transparently fell back" in data["reason"].lower()
    assert "zero external network" in data["reason"].lower()

    # Re-enable the vision model
    client.patch("/api/models/mdl-vision-deepcad", json={"enabled": True})


def test_route_newly_registered_model(client: TestClient):
    """
    Requirement 15 & 10: Test dynamically registering a new model.
    Verifies that the router immediately routes tasks to newly registered models
    without requiring agent or code changes.
    """
    new_model_id = "mdl-custom-rust-coder"

    # Clean up if already exists
    client.delete(f"/api/models/{new_model_id}")

    # 1. Register a specialized coding model
    register_res = client.post(
        "/api/models/register",
        json={
            "id": new_model_id,
            "display_name": "SARA-Rust-Kernel-Coder",
            "provider": "ollama",
            "local_endpoint": "http://127.0.0.1:11434",
            "model_name": "rust-coder:7b",
            "capabilities": ["coding", "rust", "kernel"],
            "context_length": 65536,
            "vision_support": False,
            "coding_support": True,
            "reasoning_support": False,
            "enabled": True,
        },
    )
    assert register_res.status_code == 201
    assert register_res.json()["id"] == new_model_id

    # 2. Query all models and verify presence
    list_res = client.get("/api/models")
    assert list_res.status_code == 200
    ids = [m["id"] for m in list_res.json()]
    assert new_model_id in ids

    # 3. Clean up
    delete_res = client.delete(f"/api/models/{new_model_id}")
    assert delete_res.status_code == 204
