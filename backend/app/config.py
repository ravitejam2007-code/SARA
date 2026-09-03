from pathlib import Path
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Zenith AI — Sovereign Industrial AI Workbench"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    # CORS Origins (comma-separated in .env)
    CORS_ORIGINS: Union[str, List[str]] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        return v

    # Database Configuration (PostgreSQL primary with SQLite fallback)
    DATABASE_URL: str = "sqlite:///./zenith_dev.db"

    # Security & JWT Tokens
    SECRET_KEY: str = "zenith_sovereign_dev_secret_key_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480  # 8 hours

    # Storage Path
    STORAGE_DIR: str = "./storage"

    # Local LLM Infrastructure (Ollama / vLLM on-premise)
    OLLAMA_BASE_URL: str = "http://127.0.0.1:11434"
    DEFAULT_LLM_MODEL: str = "llama3.2:3b"
    DEFAULT_VISION_MODEL: str = "llava:7b"
    LLM_TIMEOUT_SECONDS: float = 60.0
    LLM_PROVIDER: str = "ollama"

    @property
    def storage_path(self) -> Path:
        p = Path(self.STORAGE_DIR)
        p.mkdir(parents=True, exist_ok=True)
        return p

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
