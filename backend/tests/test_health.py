from fastapi.testclient import TestClient


def test_health_endpoint(client: TestClient):
    """Verify GET /api/health returns healthy status and metadata."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["version"] == "1.0.0"
    assert data["database"] == "connected"
    assert "timestamp" in data


def test_health_v1_endpoint(client: TestClient):
    """Verify GET /api/v1/health returns healthy status."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_root_endpoint(client: TestClient):
    """Verify root GET / returns project metadata."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["sovereignty"] == "ENFORCED"
