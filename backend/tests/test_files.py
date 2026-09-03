import io
from fastapi.testclient import TestClient


def test_file_upload_and_list(client: TestClient):
    """Test uploading a file and retrieving it from the files list."""
    # 1. Login to get token
    login_resp = client.post(
        "/api/auth/login",
        json={"username": "engineer", "password": "password123"},
    )
    token = login_resp.json()["access_token"]

    # 2. Upload dummy engineering document
    file_content = b"SECTION 1: ISO 1982 Gas Turbine Temperature Limits. 1100C Max."
    response = client.post(
        "/api/files/upload",
        files={"file": ("ISO_1982_Spec.pdf", io.BytesIO(file_content), "application/pdf")},
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 201
    file_data = response.json()
    assert file_data["filename"] == "ISO_1982_Spec.pdf"
    assert file_data["file_type"] == "PDF"
    assert file_data["size_bytes"] == len(file_content)
    assert len(file_data["checksum_sha256"]) == 64

    # 3. Retrieve files list
    list_resp = client.get("/api/files")
    assert list_resp.status_code == 200
    list_data = list_resp.json()
    assert list_data["total"] >= 1
    assert any(f["filename"] == "ISO_1982_Spec.pdf" for f in list_data["files"])


def test_models_endpoint(client: TestClient):
    """Test GET /api/models retrieves registered local models."""
    response = client.get("/api/models")
    assert response.status_code == 200
    data = response.json()
    models = data if isinstance(data, list) else data.get("models", [])
    assert len(models) >= 1
    assert any("SARA" in (m.get("display_name") or m.get("name", "")) for m in models)


def test_security_status_endpoint(client: TestClient):
    """Test GET /api/security/status returns sovereignty metrics."""
    response = client.get("/api/security/status")
    assert response.status_code == 200
    data = response.json()
    assert "sovereignty" in data
    assert data["sovereignty"]["external_api_calls"]["value"] == 0
    assert len(data["services"]) >= 5


def test_audit_logs_endpoint(client: TestClient):
    """Test GET /api/audit/logs returns ledger entries."""
    response = client.get("/api/audit/logs")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
