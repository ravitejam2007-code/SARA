from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


class ChatMessage(BaseModel):
    role: str = Field(..., description="Message author role: user, assistant, system")
    content: str = Field(..., description="Message text body")


class ChatRequest(BaseModel):
    model: Optional[str] = Field(None, description="Local model name (e.g., llama3.2:3b, zenith-70b)")
    messages: List[ChatMessage] = Field(..., min_length=1, description="Sequential dialogue turns")
    temperature: Optional[float] = Field(0.2, ge=0.0, le=1.0, description="Sampling temperature")
    max_tokens: Optional[int] = Field(2048, ge=1, le=131072, description="Maximum token generation limit")
    stream: Optional[bool] = Field(False, description="Streaming toggle")


class ChatResponse(BaseModel):
    model: str
    message: ChatMessage
    done: bool = True
    total_duration_ms: float
    prompt_tokens: Optional[int] = None
    completion_tokens: Optional[int] = None


class GenerateRequest(BaseModel):
    model: Optional[str] = Field(None, description="Local model name")
    prompt: str = Field(..., min_length=1, description="Raw prompt text")
    temperature: Optional[float] = Field(0.2, ge=0.0, le=1.0)
    max_tokens: Optional[int] = Field(2048, ge=1)


class GenerateResponse(BaseModel):
    model: str
    response: str
    done: bool = True
    total_duration_ms: float


class VisionRequest(BaseModel):
    model: Optional[str] = Field(None, description="Local vision model name (e.g. llava:7b)")
    prompt: str = Field("Analyze this engineering image in detail.", description="Vision analysis instruction")
    image_base64: Optional[str] = Field(None, description="Base64-encoded image data")


class VisionResponse(BaseModel):
    model: str
    analysis: str
    status: str = "COMPLETED"
    total_duration_ms: float


class LLMHealthResponse(BaseModel):
    status: str  # ONLINE, OFFLINE, DEGRADED
    provider: str  # ollama, vllm
    version: Optional[str] = None
    base_url: str
    active_models_count: int
    latency_ms: float
    message: Optional[str] = None
