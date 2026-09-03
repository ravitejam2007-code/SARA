import base64
from typing import Optional, List
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.model_registry import ModelRegistry
from app.schemas.model import ModelListResponse, ModelItemResponse
from app.models.schemas import (
    ModelMetadataSchema,
    ModelRegistrationRequest,
    ModelUpdateRequest,
    RouteRequest,
    RouteDecisionResponse,
)
from app.models.registry import ModelRegistryManager
from app.models.router import ModelRouter
from app.schemas.llm import (
    ChatRequest,
    ChatResponse,
    GenerateRequest,
    GenerateResponse,
    VisionResponse,
    LLMHealthResponse,
)
from app.services.llm_service import (
    check_llm_health,
    list_available_models,
    execute_chat,
    execute_generate,
    execute_vision,
)

router = APIRouter(prefix="/models", tags=["Model Registry & Automatic Model Router"])


@router.get("", response_model=List[ModelMetadataSchema])
def get_registered_models(
    enabled_only: bool = False,
    db: Session = Depends(get_db),
) -> List[ModelMetadataSchema]:
    """Retrieve full catalog of sovereign on-premise local models."""
    return ModelRegistryManager.list_models(db, enabled_only=enabled_only)


@router.get("/catalog", response_model=ModelListResponse)
async def get_legacy_catalog(db: Session = Depends(get_db)) -> ModelListResponse:
    """Legacy endpoint for UI compatibility."""
    models = ModelRegistryManager.list_models(db)
    return ModelListResponse(
        total=len(models),
        models=[
            ModelItemResponse(
                id=m.id,
                name=m.display_name,
                model_type="VISION" if m.vision_support else ("CODE" if m.coding_support else "LLM"),
                parameters="Local",
                context_window=f"{m.context_length} Tokens",
                status="ONLINE" if m.enabled else "OFFLINE",
                is_default=m.reasoning_support,
                latency_ms=14,
            )
            for m in models
        ],
    )


@router.post("/register", response_model=ModelMetadataSchema, status_code=status.HTTP_201_CREATED)
def register_model(
    req: ModelRegistrationRequest,
    db: Session = Depends(get_db),
) -> ModelMetadataSchema:
    """Register a new open-weight model into the sovereign registry."""
    try:
        return ModelRegistryManager.register_model(db, req)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.patch("/{model_id}", response_model=ModelMetadataSchema)
def update_model(
    model_id: str,
    req: ModelUpdateRequest,
    db: Session = Depends(get_db),
) -> ModelMetadataSchema:
    """Update metadata, capabilities, or enablement status for a registered model."""
    updated = ModelRegistryManager.update_model(db, model_id, req)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Model '{model_id}' not found.")
    return updated


@router.delete("/{model_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_model(
    model_id: str,
    db: Session = Depends(get_db),
):
    """Remove a model from the registry."""
    deleted = ModelRegistryManager.delete_model(db, model_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Model '{model_id}' not found.")
    return None


@router.post("/route", response_model=RouteDecisionResponse)
def route_task_to_model(
    req: RouteRequest,
    db: Session = Depends(get_db),
) -> RouteDecisionResponse:
    """
    Automatic Model Router: Classifies user prompt into capabilities
    (document, reasoning, coding, vision, spreadsheet) and selects the best
    enabled local model with audit logging and fallback protection.
    """
    return ModelRouter.route(db, req)


@router.get("/health", response_model=LLMHealthResponse)
async def get_model_health() -> LLMHealthResponse:
    """Verify local LLM provider connectivity, status, and loaded models."""
    return await check_llm_health()


@router.post("/chat", response_model=ChatResponse)
async def post_chat(req: ChatRequest) -> ChatResponse:
    """Execute multi-turn chat completion using strictly local sovereign inference."""
    return await execute_chat(req)


@router.post("/generate", response_model=GenerateResponse)
async def post_generate(req: GenerateRequest) -> GenerateResponse:
    """Execute single-turn raw prompt generation using strictly local sovereign inference."""
    return await execute_generate(req)


@router.post("/vision", response_model=VisionResponse)
async def post_vision(
    prompt: str = Form("Analyze this engineering image in detail."),
    model: Optional[str] = Form(None),
    file: UploadFile = File(...),
) -> VisionResponse:
    """Execute local multi-modal vision inspection on an uploaded image file."""
    file_bytes = await file.read()
    image_b64 = base64.b64encode(file_bytes).decode("utf-8")
    return await execute_vision(prompt=prompt, image_b64=image_b64, model=model)
