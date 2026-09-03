from typing import List
from sqlalchemy import String, Boolean, Integer
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base, TimestampMixin


class ModelRegistry(Base, TimestampMixin):
    """Local on-premise model repository specification with full metadata."""
    __tablename__ = "model_registry"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    display_name: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    provider: Mapped[str] = mapped_column(String(50), default="ollama", nullable=False)
    local_endpoint: Mapped[str] = mapped_column(String(255), default="http://127.0.0.1:11434", nullable=False)
    model_name: Mapped[str] = mapped_column(String(100), nullable=False)
    capabilities_csv: Mapped[str] = mapped_column(String(255), default="reasoning", nullable=False)
    context_length: Mapped[int] = mapped_column(Integer, default=131072, nullable=False)
    vision_support: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    coding_support: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    reasoning_support: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Backward-compatibility helpers
    model_type: Mapped[str] = mapped_column(String(50), default="LLM", nullable=False)
    parameters: Mapped[str] = mapped_column(String(50), default="7B", nullable=False)
    context_window: Mapped[str] = mapped_column(String(50), default="128k Tokens", nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="ONLINE", nullable=False)
    is_default: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    latency_ms: Mapped[int] = mapped_column(Integer, default=14, nullable=False)

    @property
    def name(self) -> str:
        return self.display_name

    @name.setter
    def name(self, value: str):
        self.display_name = value

    @property
    def capabilities(self) -> List[str]:
        return [c.strip() for c in self.capabilities_csv.split(",") if c.strip()]

    @capabilities.setter
    def capabilities(self, value: List[str]):
        self.capabilities_csv = ",".join(value)

    def __repr__(self) -> str:
        return f"<ModelRegistry(id='{self.id}', name='{self.display_name}', provider='{self.provider}', enabled={self.enabled})>"
