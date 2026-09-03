from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models.user import User
from app.db.session import get_db
from app.utils.security import verify_password, decode_access_token, create_access_token
from app.schemas.auth import UserResponse, TokenResponse
from app.config import settings

security_bearer = HTTPBearer(auto_error=False)


def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
    """Verify user credentials against database records."""
    user = db.query(User).filter(
        (User.username == username.lower().strip()) | (User.email == username.lower().strip())
    ).first()

    if not user:
        return None

    if not verify_password(password, user.hashed_password):
        return None

    return user


def build_user_response(user: User) -> UserResponse:
    return UserResponse(
        id=user.id,
        username=user.username,
        name=user.name,
        email=user.email,
        callsign=user.callsign,
        role=user.role.name if user.role else "Engineer",
        clearance_level=user.clearance_level,
        terminal_id=user.terminal_id,
        is_active=user.is_active,
    )


def generate_auth_token(user: User) -> TokenResponse:
    token_data = {
        "sub": user.id,
        "username": user.username,
        "role": user.role.name if user.role else "Engineer",
    }
    access_token = create_access_token(token_data)
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=build_user_response(user),
    )


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer),
    db: Session = Depends(get_db),
) -> User:
    """Dependency that resolves the current authenticated user from Bearer token."""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_access_token(credentials.credentials)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload["sub"]
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account inactive or not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user
