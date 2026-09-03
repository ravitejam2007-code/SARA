from fastapi.testclient import TestClient


def test_login_success(client: TestClient):
    """Test successful authentication with valid credentials."""
    response = client.post(
        "/api/auth/login",
        json={"username": "engineer", "password": "password123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["username"] == "engineer"
    assert data["user"]["role"] == "Engineer"


def test_login_invalid_password(client: TestClient):
    """Test authentication rejection with invalid password."""
    response = client.post(
        "/api/auth/login",
        json={"username": "engineer", "password": "wrongpassword!"},
    )
    assert response.status_code == 401
    assert "Invalid operator credentials" in response.json()["error"]


def test_login_nonexistent_user(client: TestClient):
    """Test authentication rejection with nonexistent user."""
    response = client.post(
        "/api/auth/login",
        json={"username": "nonexistent_operator", "password": "password123"},
    )
    assert response.status_code == 401


def test_get_me_authenticated(client: TestClient):
    """Test retrieving user profile with valid Bearer token."""
    login_resp = client.post(
        "/api/auth/login",
        json={"username": "admin", "password": "password123"},
    )
    token = login_resp.json()["access_token"]

    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "admin"
    assert data["role"] == "Admin"


def test_get_me_unauthorized(client: TestClient):
    """Test accessing /api/auth/me without token returns 401."""
    response = client.get("/api/auth/me")
    assert response.status_code == 401
