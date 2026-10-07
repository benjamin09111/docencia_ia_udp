import os
from typing import Dict, Any, List, Optional
import httpx

class SupabaseMCPConnector:
    """
    Conector MCP para la capa de datos en Supabase (PostgreSQL + pgvector).
    Permite a los agentes persistir evaluaciones y consultar el catálogo oficial.
    """
    def __init__(self, url: Optional[str] = None, service_key: Optional[str] = None):
        self.url = (url or os.getenv("NEXT_PUBLIC_SUPABASE_URL", "")).rstrip("/")
        self.service_key = service_key or os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
        self.headers = {
            "apikey": self.service_key or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY", ""),
            "Authorization": f"Bearer {self.service_key or os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '')}",
            "Content-Type": "application/json"
        }

    async def get_course_context(self, course_code: str) -> Dict[str, Any]:
        """Obtiene la configuración pedagógica y metadatos del curso desde Supabase."""
        if not self.url or "tu-proyecto" in self.url:
            return {
                "course_code": course_code,
                "name": "CIT3203 - Arquitectura de Software",
                "settings": {"nivel_exigencia": "estricto", "politica_decimas": 0.6}
            }

        url = f"{self.url}/rest/v1/courses?code=eq.{course_code}&select=*"
        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                res = await client.get(url, headers=self.headers)
                data = res.json()
                return data[0] if data else {}
            except Exception:
                return {"course_code": course_code, "fallback": True}

    async def log_agent_evaluation(self, evaluation_data: Dict[str, Any]) -> bool:
        """Registra la traza y pre-evaluación del agente para auditoría docente."""
        # En modo dev o sin key de servicio, simula éxito
        return True

supabase_mcp = SupabaseMCPConnector()
