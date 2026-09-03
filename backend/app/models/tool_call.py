from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Integer, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.agent_run import AgentRun


class ToolCall(Base, TimestampMixin):
    """Discrete sovereign tool invocation within an agent execution."""
    __tablename__ = "tool_calls"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    tool_name: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    input_payload: Mapped[str] = mapped_column(Text, nullable=False)
    output_payload: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="RUNNING", nullable=False)
    elapsed_ms: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    agent_run_id: Mapped[Optional[str]] = mapped_column(ForeignKey("agent_runs.id"), nullable=True)
    agent_run: Mapped[Optional["AgentRun"]] = relationship("AgentRun", back_populates="tool_calls")

    def __repr__(self) -> str:
        return f"<ToolCall(id='{self.id}', tool='{self.tool_name}', status='{self.status}')>"
