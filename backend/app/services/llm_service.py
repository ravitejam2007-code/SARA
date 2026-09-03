from typing import List, Dict, Any, Optional
from fastapi import HTTPException, status
from app.config import settings
from app.models.ollama_client import (
    BaseLLMProvider,
    OllamaClient,
    ModelNotFoundException,
    ProviderTimeoutException,
    ProviderUnavailableException,
    LLMException,
)
from app.schemas.llm import (
    ChatRequest,
    ChatResponse,
    ChatMessage,
    GenerateRequest,
    GenerateResponse,
    VisionResponse,
    LLMHealthResponse,
)
from app.utils.logger import logger

# Global provider instance singleton
_default_provider: Optional[BaseLLMProvider] = None


def get_llm_provider() -> BaseLLMProvider:
    """Factory retrieving configured local inference provider."""
    global _default_provider
    if _default_provider is None:
        provider_name = settings.LLM_PROVIDER.lower()
        if provider_name == "ollama":
            logger.info(f"Initializing local Ollama provider at {settings.OLLAMA_BASE_URL}")
            _default_provider = OllamaClient(
                base_url=settings.OLLAMA_BASE_URL,
                default_model=settings.DEFAULT_LLM_MODEL,
                default_vision_model=settings.DEFAULT_VISION_MODEL,
                timeout_seconds=settings.LLM_TIMEOUT_SECONDS,
                allow_offline_fallback=True,
            )
        else:
            # Future vLLM / llama.cpp provider hook
            logger.info(f"Using Ollama provider as standard local gateway for '{provider_name}'")
            _default_provider = OllamaClient()

    return _default_provider


async def check_llm_health() -> LLMHealthResponse:
    """Query local LLM health and connectivity."""
    provider = get_llm_provider()
    try:
        health_info = await provider.health_check()
        return LLMHealthResponse(**health_info)
    except Exception as e:
        logger.error(f"Failed to check LLM provider health: {e}")
        return LLMHealthResponse(
            status="OFFLINE",
            provider=settings.LLM_PROVIDER,
            version=None,
            base_url=settings.OLLAMA_BASE_URL,
            active_models_count=0,
            latency_ms=999.0,
            message=str(e),
        )


async def list_available_models() -> List[Dict[str, Any]]:
    """Retrieve catalog of local on-premise models."""
    provider = get_llm_provider()
    try:
        return await provider.list_models()
    except Exception as e:
        logger.error(f"Error fetching model list from provider: {e}")
        return []


async def execute_chat(req: ChatRequest) -> ChatResponse:
    """Execute multi-turn chat completion through the local LLM provider."""
    provider = get_llm_provider()
    messages_payload = [{"role": m.role, "content": m.content} for m in req.messages]
    options = {"temperature": req.temperature}

    try:
        result = await provider.chat(
            messages=messages_payload,
            model=req.model,
            options=options,
        )
        return ChatResponse(
            model=result["model"],
            message=ChatMessage(**result["message"]),
            done=result.get("done", True),
            total_duration_ms=result["total_duration_ms"],
            prompt_tokens=result.get("prompt_tokens"),
            completion_tokens=result.get("completion_tokens"),
        )
    except ModelNotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except ProviderTimeoutException as e:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail=str(e),
        )
    except ProviderUnavailableException as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(e),
        )
    except LLMException as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )


async def execute_generate(req: GenerateRequest) -> GenerateResponse:
    """Execute raw text completion through the local LLM provider."""
    provider = get_llm_provider()
    options = {"temperature": req.temperature}

    try:
        result = await provider.generate(
            prompt=req.prompt,
            model=req.model,
            options=options,
        )
        return GenerateResponse(
            model=result["model"],
            response=result["response"],
            done=result.get("done", True),
            total_duration_ms=result["total_duration_ms"],
        )
    except ModelNotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ProviderTimeoutException as e:
        raise HTTPException(status_code=status.HTTP_504_GATEWAY_TIMEOUT, detail=str(e))
    except ProviderUnavailableException as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e))
    except LLMException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


async def execute_vision(
    prompt: str,
    image_b64: str,
    model: Optional[str] = None,
) -> VisionResponse:
    """Execute multi-modal vision prompt through local vision model."""
    provider = get_llm_provider()

    try:
        result = await provider.vision(
            prompt=prompt,
            image_bytes_or_b64=image_b64,
            model=model,
        )
        return VisionResponse(
            model=result["model"],
            analysis=result["analysis"],
            status=result.get("status", "COMPLETED"),
            total_duration_ms=result["total_duration_ms"],
        )
    except ModelNotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ProviderTimeoutException as e:
        raise HTTPException(status_code=status.HTTP_504_GATEWAY_TIMEOUT, detail=str(e))
    except ProviderUnavailableException as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e))
    except LLMException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
