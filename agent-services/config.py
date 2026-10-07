import os
from pydantic import BaseModel, Field

# Intento de carga con pydantic-settings, con fallback a BaseModel y os.getenv
try:
    from pydantic_settings import BaseSettings
    _BaseClass = BaseSettings
except ImportError:
    _BaseClass = BaseModel

class AgentSettings(_BaseClass):
    """
    Configuración central y securizada para el microservicio de agentes UDP.
    """
    app_name: str = Field(default_factory=lambda: os.getenv("APP_NAME", "Docencia IA UDP - Agent Services"))
    environment: str = Field(default_factory=lambda: os.getenv("ENVIRONMENT", "development"))
    host: str = Field(default_factory=lambda: os.getenv("HOST", "0.0.0.0"))
    port: int = Field(default_factory=lambda: int(os.getenv("PORT", "8080")))
    
    # Proveedores de LLM
    gemini_api_key: str = Field(default_factory=lambda: os.getenv("GEMINI_API_KEY", ""))
    default_frontier_model: str = Field(default_factory=lambda: os.getenv("DEFAULT_FRONTIER_MODEL", "gemini-2.5-flash"))
    default_worker_model: str = Field(default_factory=lambda: os.getenv("DEFAULT_WORKER_MODEL", "gemini-2.5-flash"))
    
    # Presupuestos y límites agénticos
    max_steps_per_turn: int = Field(default_factory=lambda: int(os.getenv("MAX_STEPS_PER_TURN", "5")))
    max_tokens_budget: int = Field(default_factory=lambda: int(os.getenv("MAX_TOKENS_BUDGET", "4000")))
    
    # Integración Supabase
    supabase_url: str = Field(default_factory=lambda: os.getenv("NEXT_PUBLIC_SUPABASE_URL", ""))
    supabase_service_role_key: str = Field(default_factory=lambda: os.getenv("SUPABASE_SERVICE_ROLE_KEY", ""))

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = AgentSettings()
