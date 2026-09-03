from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.utils.logger import logger


def setup_cors(app: FastAPI) -> None:
    """Configure CORS for local and production frontend clients."""
    origins = settings.CORS_ORIGINS
    logger.info(f"Configuring CORS with origins: {origins}")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["X-Zenith-Request-ID", "Content-Disposition"],
    )
