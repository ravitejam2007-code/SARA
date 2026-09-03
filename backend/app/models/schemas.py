from typing import List, Optional, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field, ConfigDict


class CapabilityType(str, Enum):
    DOCUMENT = "document"
    REASONING = "reasoning"
    CODING = "coding"
    VISION = "vision"
    SPREADSHEET = "spreadsheet"
    GENERAL = "general"


class ModelMetadataSchema(BaseModel):
    """Full metadata contract for registered sovereign models."""
    model_config = ConfigDict(from_attributes=True)

    id: str = Field(..., description="Unique model identifier (e.g. qwen2.5-coder-7b)")
    display_name: str = Field(..., description="Human-readable display name")
    provider: str = Field("ollama", description="Local inference provider: ollama, vllm, llama.cpp")
    local_endpoint: str = Field("http://127.0.0.1:11434", description="Local on-premise loopback URL")
    model_name: str = Field(..., description="Underlying provider model tag (e.g. llama3.2:3b)")
    capabilities: List[str] = Field(default_factory=list, description="Supported task capabilities")
    context_length: int = Field(131072, description="Maximum context window in tokens")
    vision_support: bool = Field(False, description="Whether model supports image/vision inputs")
    coding_support: bool = Field(False, description="Whether model is specialized for code/PLC")
    reasoning_support: bool = Field(True, description="Whether model supports deep logical reasoning")
    enabled: bool = Field(True, description="Administrative availability toggle")


class ModelRegistrationRequest(BaseModel):
    id: str = Field(..., min_length=2, max_length=64)
    display_name: str = Field(..., min_length=2, max_length=100)
    provider: str = Field("ollama", min_length=2, max_length=50)
    local_endpoint: str = Field("http://127.0.0.1:11434")
    model_name: str = Field(..., min_length=1, max_length=100)
    capabilities: List[str] = Field(default=["reasoning"])
    context_length: Optional[int] = Field(131072, ge=1024)
    vision_support: Optional[bool] = False
    coding_support: Optional[bool] = False
    reasoning_support: Optional[bool] = True
    enabled: Optional[bool] = True


class ModelUpdateRequest(BaseModel):
    display_name: Optional[str] = None
    provider: Optional[str] = None
    local_endpoint: Optional[str] = None
    model_name: Optional[str] = None
    capabilities: Optional[List[str]] = None
    context_length: Optional[int] = None
    vision_support: Optional[bool] = None
    coding_support: Optional[bool] = None
    reasoning_support: Optional[bool] = None
    enabled: Optional[bool] = None


class RouteRequest(BaseModel):
    prompt: str = Field(..., min_length=1, description="Task prompt or user query")
    has_image: Optional[bool] = Field(False, description="Indicates image/drawing attachment")
    has_table: Optional[bool] = Field(False, description="Indicates spreadsheet/tabular data")
    file_extension: Optional[str] = Field(None, description="Extension of input file (e.g. pdf, docx, xlsx, png)")
    explicit_capability: Optional[str] = Field(None, description="Optional override capability")


class RouteDecisionResponse(BaseModel):
    selected_model: ModelMetadataSchema
    capability: str
    reason: str
    fallback_used: bool = False
    provider: str
    confidence: float = 0.98
