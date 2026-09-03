from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.config import settings
from app.api import api_router
from app.middleware import setup_cors, RequestTracingMiddleware
from app.db.session import SessionLocal
from app.db.init_db import init_db
from app.utils.logger import logger


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan context for startup and shutdown procedures."""
    logger.info("Initializing Zenith AI sovereign backend...")

    # Ensure storage directory exists
    _ = settings.storage_path

    # Initialize database tables and seeds
    db = SessionLocal()
    try:
        init_db(db)
    except Exception as e:
        logger.error(f"Database initialization error on startup: {e}", exc_info=True)
    finally:
        db.close()

    logger.info(f"Zenith AI Backend v{settings.VERSION} online. Listening on {settings.HOST}:{settings.PORT}")
    yield
    logger.info("Zenith AI Backend shutting down gracefully.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="On-premise confidential AI workbench and sovereign reasoning gateway.",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# 1. Setup CORS
setup_cors(app)

# 2. Add Request Tracing & Structured Latency Middleware
app.add_middleware(RequestTracingMiddleware)

# 3. Mount Routers
app.include_router(api_router)


# 4. Exception Handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail,
            "status_code": exc.status_code,
            "path": request.url.path,
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    errors = []
    for err in exc.errors():
        loc = " -> ".join([str(l) for l in err.get("loc", [])])
        msg = err.get("msg", "Validation error")
        errors.append(f"{loc}: {msg}")

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error": "Request validation failed",
            "details": errors,
            "path": request.url.path,
        },
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.error(f"Unhandled server exception on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": "Internal enclave error occurred",
            "status_code": 500,
            "path": request.url.path,
        },
    )


@app.get("/", tags=["Root"])
def root_status() -> dict:
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "health": "/api/health",
        "sovereignty": "ENFORCED",
    }
