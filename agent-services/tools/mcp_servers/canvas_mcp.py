import os
from typing import Dict, Any, List, Optional
import httpx

class CanvasMCPConnector:
    """
    Conector MCP (Model Context Protocol) para interacción con Canvas LMS UDP.
    Permite a los agentes consultar asignaturas, tareas y entregas de estudiantes.
    """
    def __init__(self, base_url: Optional[str] = None, token: Optional[str] = None):
        self.base_url = (base_url or os.getenv("CANVAS_BASE_URL", "https://udp.instructure.com")).rstrip("/")
        self.token = token or os.getenv("CANVAS_API_TOKEN", "")
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }

    async def get_course_assignments(self, course_id: str) -> List[Dict[str, Any]]:
        """Recupera la lista de tareas y evaluaciones oficiales de un curso en Canvas."""
        if not self.token or self.token.startswith("tu_"):
            # Mock resiliente para desarrollo offline y pruebas de compañeros
            return [
                {"id": 101, "name": "Solemne 1", "points_possible": 100, "due_at": "2026-10-15T23:59:00Z"},
                {"id": 102, "name": "Taller Ayudantía 1 (Décimas)", "points_possible": 100, "due_at": "2026-10-08T23:59:00Z"}
            ]

        url = f"{self.base_url}/api/v1/courses/{course_id}/assignments"
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.get(url, headers=self.headers)
            res.raise_for_status()
            return res.json()

    async def get_submission(self, course_id: str, assignment_id: str, user_id: str) -> Dict[str, Any]:
        """Obtiene la entrega y archivos adjuntos de un estudiante."""
        if not self.token or self.token.startswith("tu_"):
            return {
                "user_id": user_id,
                "assignment_id": assignment_id,
                "body": "Solución del estudiante implementando arquitectura en microservicios.",
                "submitted_at": "2026-10-06T18:00:00Z",
                "attachments": []
            }

        url = f"{self.base_url}/api/v1/courses/{course_id}/assignments/{assignment_id}/submissions/{user_id}"
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.get(url, headers=self.headers)
            res.raise_for_status()
            return res.json()

canvas_mcp = CanvasMCPConnector()
