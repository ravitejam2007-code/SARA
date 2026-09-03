import time
import uuid
from typing import Callable
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from app.utils.logger import logger


class RequestTracingMiddleware(BaseHTTPMiddleware):
    """Logs incoming requests, injects X-Zenith-Request-ID, and measures latency."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        request_id = request.headers.get("X-Zenith-Request-ID") or f"req-{uuid.uuid4().hex[:8]}"
        start_time = time.perf_counter()

        logger.info(
            f"--> [{request_id}] {request.method} {request.url.path} "
            f"from {request.client.host if request.client else 'unknown'}"
        )

        try:
            response: Response = await call_next(request)
            elapsed_ms = (time.perf_counter() - start_time) * 1000.0

            response.headers["X-Zenith-Request-ID"] = request_id
            response.headers["X-Response-Time-Ms"] = f"{elapsed_ms:.2f}"

            logger.info(
                f"<-- [{request_id}] {request.method} {request.url.path} "
                f"status={response.status_code} elapsed={elapsed_ms:.2f}ms"
            )
            return response
        except Exception as exc:
            elapsed_ms = (time.perf_counter() - start_time) * 1000.0
            logger.error(
                f"<-- [{request_id}] {request.method} {request.url.path} "
                f"FAILED with unhandled exception: {exc} ({elapsed_ms:.2f}ms)",
                exc_info=True,
            )
            raise exc
