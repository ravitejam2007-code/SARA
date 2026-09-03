from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.model_registry import ModelRegistry
from app.schemas.model import ModelListResponse, ModelItemResponse

router = APIRouter(prefix="/models", tags=["Model Registry"])


@router.get("", response_model=ModelListResponse)
def get_models(db: Session = Depends(get_db)) -> ModelListResponse:
    """Retrieve catalog of sovereign on-premise local models."""
    models = db.query(ModelRegistry).all()
    return ModelListResponse(
        total=len(models),
        models=[
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
            for m in models
        ],
    )
