from typing import List
from pydantic import BaseModel, ConfigDict


class ModelItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    model_type: str
    parameters: str
    context_window: str
    status: str
    is_default: bool
    latency_ms: int


class ModelListResponse(BaseModel):
    total: int
    models: List[ModelItemResponse]
