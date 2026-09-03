from sqlalchemy import String, Boolean, Integer
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base, TimestampMixin


class ModelRegistry(Base, TimestampMixin):
    """Local on-premise model repository specification."""
    __tablename__ = "model_registry"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    model_type: Mapped[str] = mapped_column(String(50), nullable=False)  # LLM, VISION, OCR, CODE
    parameters: Mapped[str] = mapped_column(String(50), nullable=False)  # 70B, 13B, 7B
    context_window: Mapped[str] = mapped_column(String(50), default="128k Tokens", nullable=False)
    local_path: Mapped[str] = mapped_column(String(500), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="ONLINE", nullable=False)
    is_default: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    latency_ms: Mapped[int] = mapped_column(Integer, default=14, nullable=False)

    def __repr__(self) -> str:
        return f"<ModelRegistry(name='{self.name}', status='{self.status}')>"
