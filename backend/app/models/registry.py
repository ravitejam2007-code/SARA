from typing import List, Optional, Dict
from sqlalchemy.orm import Session
from app.models.model_registry import ModelRegistry
from app.models.schemas import (
    ModelMetadataSchema,
    ModelRegistrationRequest,
    ModelUpdateRequest,
    CapabilityType,
)
from app.utils.logger import logger


def entity_to_schema(entity: ModelRegistry) -> ModelMetadataSchema:
    return ModelMetadataSchema(
        id=entity.id,
        display_name=entity.display_name,
        provider=entity.provider,
        local_endpoint=entity.local_endpoint,
        model_name=entity.model_name,
        capabilities=entity.capabilities,
        context_length=entity.context_length,
        vision_support=entity.vision_support,
        coding_support=entity.coding_support,
        reasoning_support=entity.reasoning_support,
        enabled=entity.enabled,
    )


class ModelRegistryManager:
    """
    Sovereign Model Registry Abstraction.
    Allows adding, updating, and removing open-weight models dynamically without code changes.
    """

    @staticmethod
    def get_model(db: Session, model_id: str) -> Optional[ModelMetadataSchema]:
        """Fetch a specific registered model by unique ID."""
        entity = db.query(ModelRegistry).filter(ModelRegistry.id == model_id).first()
        return entity_to_schema(entity) if entity else None

    @staticmethod
    def list_models(db: Session, enabled_only: bool = False) -> List[ModelMetadataSchema]:
        """List all models registered in the on-premise catalog."""
        query = db.query(ModelRegistry)
        if enabled_only:
            query = query.filter(ModelRegistry.enabled == True)
        entities = query.all()
        return [entity_to_schema(e) for e in entities]

    @staticmethod
    def register_model(db: Session, data: ModelRegistrationRequest) -> ModelMetadataSchema:
        """Register a new open-weight model into the sovereign registry."""
        existing = db.query(ModelRegistry).filter(
            (ModelRegistry.id == data.id) | (ModelRegistry.display_name == data.display_name)
        ).first()

        if existing:
            raise ValueError(f"Model with ID '{data.id}' or display name '{data.display_name}' already exists.")

        entity = ModelRegistry(
            id=data.id,
            display_name=data.display_name,
            provider=data.provider,
            local_endpoint=data.local_endpoint,
            model_name=data.model_name,
            capabilities_csv=",".join(data.capabilities),
            context_length=data.context_length or 131072,
            vision_support=bool(data.vision_support),
            coding_support=bool(data.coding_support),
            reasoning_support=bool(data.reasoning_support),
            enabled=data.enabled if data.enabled is not None else True,
            model_type="VISION" if data.vision_support else ("CODE" if data.coding_support else "LLM"),
            parameters="Local",
            context_window=f"{data.context_length or 131072} Tokens",
            status="ONLINE",
            is_default=False,
            latency_ms=14,
        )

        db.add(entity)
        db.commit()
        db.refresh(entity)
        logger.info(f"Successfully registered model: {entity.id} ({entity.display_name}) [{entity.provider}]")
        return entity_to_schema(entity)

    @staticmethod
    def update_model(db: Session, model_id: str, data: ModelUpdateRequest) -> Optional[ModelMetadataSchema]:
        """Update metadata or toggle enablement for a registered model."""
        entity = db.query(ModelRegistry).filter(ModelRegistry.id == model_id).first()
        if not entity:
            return None

        if data.display_name is not None:
            entity.display_name = data.display_name
        if data.provider is not None:
            entity.provider = data.provider
        if data.local_endpoint is not None:
            entity.local_endpoint = data.local_endpoint
        if data.model_name is not None:
            entity.model_name = data.model_name
        if data.capabilities is not None:
            entity.capabilities_csv = ",".join(data.capabilities)
        if data.context_length is not None:
            entity.context_length = data.context_length
        if data.vision_support is not None:
            entity.vision_support = data.vision_support
        if data.coding_support is not None:
            entity.coding_support = data.coding_support
        if data.reasoning_support is not None:
            entity.reasoning_support = data.reasoning_support
        if data.enabled is not None:
            entity.enabled = data.enabled

        db.commit()
        db.refresh(entity)
        logger.info(f"Updated model {model_id}: enabled={entity.enabled}")
        return entity_to_schema(entity)

    @staticmethod
    def delete_model(db: Session, model_id: str) -> bool:
        """Remove a model from the registry."""
        entity = db.query(ModelRegistry).filter(ModelRegistry.id == model_id).first()
        if not entity:
            return False

        db.delete(entity)
        db.commit()
        logger.info(f"Deregistered model: {model_id}")
        return True

    @staticmethod
    def find_best_model_for_capability(
        db: Session,
        capability: str,
    ) -> Optional[ModelMetadataSchema]:
        """
        Query enabled local models matching the capability.
        Returns the highest-priority enabled model, or None if unavailable.
        """
        cap_lower = capability.lower().strip()
        enabled_models = db.query(ModelRegistry).filter(ModelRegistry.enabled == True).all()

        # 1. Exact match on capability flags
        for m in enabled_models:
            if cap_lower == "vision" and m.vision_support:
                return entity_to_schema(m)
            if cap_lower == "coding" and m.coding_support:
                return entity_to_schema(m)

        # 2. Check capabilities CSV list
        for m in enabled_models:
            if cap_lower in m.capabilities:
                return entity_to_schema(m)

        # 3. Check reasoning support for general/document/spreadsheet
        if cap_lower in ["reasoning", "document", "spreadsheet", "general"]:
            for m in enabled_models:
                if m.reasoning_support:
                    return entity_to_schema(m)

        return None
