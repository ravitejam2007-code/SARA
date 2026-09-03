import io
import pytest
from fastapi.testclient import TestClient
from app.models.ollama_client import OllamaClient, ModelNotFoundException, ProviderTimeoutException


def test_predictive_maintenance_prompt(client: TestClient):
    """
    Requirement 11:
    Test local-model inference on prompt: 'Explain predictive maintenance in simple language.'
    """
    response = client.post(
        "/api/models/chat",
        json={
            "model": "llama3.2:3b",
            "messages": [
                {
                    "role": "user",
                    "content": "Explain predictive maintenance in simple language.",
                }
            ],
            "temperature": 0.2,
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert "model" in data
    assert "message" in data
    assert data["message"]["role"] == "assistant"

    content = data["message"]["content"].lower()
    # Verify core conceptual keywords expected in predictive maintenance explanation
    assert any(term in content for term in ["sensor", "wear", "break", "fix", "health", "machine", "maintenance"])
    assert "total_duration_ms" in data


def test_generate_predictive_maintenance(client: TestClient):
    """Test raw generation endpoint on predictive maintenance."""
    response = client.post(
        "/api/models/generate",
        json={
            "model": "llama3.2:3b",
            "prompt": "Explain predictive maintenance in simple language.",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert len(data["response"]) > 20


def test_vision_endpoint(client: TestClient):
    """
    Requirement 12:
    Test vision interface that accepts: image file/path and text prompt.
    """
    # 1. Create a synthetic 1x1 PNG byte stream
    # Minimal valid 1x1 transparent PNG binary bytes
    synthetic_png = (
        b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06"
        b"\x00\x00\x00\x1f\x15c4\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01"
        b"\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82"
    )

    response = client.post(
        "/api/models/vision",
        data={
            "prompt": "Inspect turbine blade root fillet for micro-cracks and thermal erosion.",
            "model": "llava:7b",
        },
        files={"file": ("turbine_blade_sample.png", io.BytesIO(synthetic_png), "image/png")},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "COMPLETED"
    assert "analysis" in data
    assert len(data["analysis"]) > 20
    assert "total_duration_ms" in data


def test_models_health_endpoint(client: TestClient):
    """Verify GET /api/models/health returns local status and provider metadata."""
    response = client.get("/api/models/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["ONLINE", "OFFLINE", "DEGRADED"]
    assert data["provider"] in ["ollama", "LocalOpenWeightEngine", "open-weight-local"]
    assert "base_url" in data
    assert "latency_ms" in data


def test_list_models_includes_local(client: TestClient):
    """Verify GET /api/models lists local models without external cloud dependencies."""
    response = client.get("/api/models")
    assert response.status_code == 200
    data = response.json()
    models = data if isinstance(data, list) else data.get("models", [])
    assert len(models) >= 1
    model_names = [m.get("display_name") or m.get("name") for m in models]
    assert any("70B" in name or "llama" in name.lower() or "SARA" in name for name in model_names)


@pytest.mark.asyncio
async def test_ollama_client_network_isolation():
    """
    Requirement 15 & 13:
    Verify that inference traffic is directed strictly to the local Ollama endpoint
    and never attempts to call external cloud providers.
    """
    client = OllamaClient(base_url="http://127.0.0.1:11434")

    # Assert loopback/internal IP restriction
    assert "127.0.0.1" in client.base_url or "localhost" in client.base_url

    # Check that client methods generate local requests
    health = await client.health_check()
    assert health["provider"] == "ollama"
    assert "127.0.0.1" in health["base_url"] or "localhost" in health["base_url"]


@pytest.mark.asyncio
async def test_ollama_client_direct_chat():
    """Directly test OllamaClient.chat() provider implementation."""
    client = OllamaClient()
    result = await client.chat(
        messages=[{"role": "user", "content": "Explain predictive maintenance in simple language."}],
        model="llama3.2:3b",
    )
    assert result["done"] is True
    assert "message" in result
    assert "maintenance" in result["message"]["content"].lower()
