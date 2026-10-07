from core.models import AgentChatRequest, AgentChatResponse
from agents.root import root_agent

class ActivityDesignerWorker:
    """
    Worker Nivel 5: Diseñador de Actividades y Ayudantías.
    Especializado en diseñar talleres pedagógicos, dinámicas activas CREA y ejercicios pre-solemne.
    """
    def __init__(self):
        self.role_name = "activity_designer"

    def design_activity(self, prompt: str, course_id: str = "course:cit3203") -> AgentChatResponse:
        req = AgentChatRequest(
            message=prompt,
            node_id=course_id,
            worker_role=self.role_name
        )
        return root_agent.process_request(req)

activity_designer_worker = ActivityDesignerWorker()
