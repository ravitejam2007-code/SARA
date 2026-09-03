from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse, UserResponse
from app.services.auth_service import (
    authenticate_user,
    generate_auth_token,
    get_current_user,
    build_user_response,
)
from app.services.audit_service import record_audit_event

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
def login(
    credentials: LoginRequest,
    db: Session = Depends(get_db),
) -> TokenResponse:
    """Authenticate with username and password, issuing a signed JWT access token."""
    user = authenticate_user(db, credentials.username, credentials.password)
    if not user:
        # Record failed auth audit event
        record_audit_event(
            db,
            actor=credentials.username,
            action="AUTHENTICATION_FAILED",
            resource="/api/v1/auth/login",
            status="REJECTED",
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid operator credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Record successful auth audit event
    record_audit_event(
        db,
        actor=user.username,
        action="OPERATOR_AUTHENTICATED",
        resource="/api/v1/auth/login",
        status="CONFIRMED",
    )

    return generate_auth_token(user)


@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user),
) -> UserResponse:
    """Retrieve identity and RBAC clearance of the currently authenticated operator."""
    return build_user_response(current_user)
