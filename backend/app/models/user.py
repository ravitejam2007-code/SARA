from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.role import Role
    from app.models.file import FileRecord
    from app.models.agent_run import AgentRun


class User(Base, TimestampMixin):
    """User profile and authentication entity."""
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    callsign: Mapped[str] = mapped_column(String(100), nullable=False)
    clearance_level: Mapped[str] = mapped_column(String(100), default="LEVEL-2", nullable=False)
    terminal_id: Mapped[str] = mapped_column(String(100), default="NODE-DEFAULT-01", nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    role_id: Mapped[Optional[int]] = mapped_column(ForeignKey("roles.id"), nullable=True)
    role: Mapped[Optional["Role"]] = relationship("Role", back_populates="users")

    files: Mapped[List["FileRecord"]] = relationship("FileRecord", back_populates="uploaded_by")
    agent_runs: Mapped[List["AgentRun"]] = relationship("AgentRun", back_populates="user")

    def __repr__(self) -> str:
        return f"<User(id='{self.id}', username='{self.username}', role='{self.role.name if self.role else None}')>"
