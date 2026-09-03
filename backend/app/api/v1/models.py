import base64
from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.model_registry import ModelRegistry
from app.schemas.model import ModelListResponse, ModelItemResponse
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

router = APIRouter(prefix="/models", tags=["Local LLM & Model Registry"])


@router.get("", response_model=ModelListResponse)
async def get_models(db: Session = Depends(get_db)) -> ModelListResponse:
    """
    Retrieve catalog of sovereign on-premise local models.
    Combines registered database profiles with live models detected in the local inference engine.
    """
    db_models = db.query(ModelRegistry).all()
    models_response = [
        ModelItemResponse(
            id=m.id,
            name=m.name,
            model_type=m.model_type,
            parameters=m.parameters,
            context_window=m.context_window,
            status=m.status,
            is_default=m.is_default,
            latency_ms=m.latency_ms,
        )
        for m in db_models
    ]

    # Dynamically discover local models from inference provider (e.g. Ollama tags)
    live_models = await list_available_models()
    existing_names = {m.name for m in models_response}

    for live in live_models:
        name = live.get("name")
        if name and name not in existing_names:
            models_response.append(
                ModelItemResponse(
                    id=f"ollama-{name.replace(':', '-')}",
                    name=name,
                    model_type="VISION" if "vision" in name.lower() or "llava" in name.lower() else "LLM",
                    parameters=live.get("details", {}).get("parameter_size", "Local"),
                    context_window="128k Tokens",
                    status="ONLINE",
                    is_default=False,
                    latency_ms=18,
                )
            )

    return ModelListResponse(
        total=len(models_response),
        models=models_response,
    )


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
    """
    Execute local multi-modal vision inspection on an uploaded image file.
    Image is encoded in memory and passed directly to local vision model (e.g. llava).
    """
    file_bytes = await file.read()
    image_b64 = base64.b64encode(file_bytes).decode("utf-8")
    return await execute_vision(prompt=prompt, image_b64=image_b64, model=model)
