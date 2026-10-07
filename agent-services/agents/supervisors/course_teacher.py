from typing import Optional
from core.models import AgentChatRequest, AgentChatResponse, PedagogicalSettings
from agents.root import root_agent

class CourseTeacherAgent:
    """
    Supervisor Nivel 4: Agente Docente de Asignatura ("El Mini-Yo del Profesor").
    Instancia las perillas pedagógicas del docente, el syllabus del curso
    y delega a los workers especialistas de ayudantía, corrección y planillas.
    """
    def __init__(self, course_id: str = "course:cit3203"):
        self.course_id = course_id

    def handle(
        self,
        req: AgentChatRequest,
        settings: Optional[PedagogicalSettings] = None
    ) -> AgentChatResponse:
        req.node_id = self.course_id
        if settings:
            req.settings = settings
        return root_agent.process_request(req)

course_teacher_agent = CourseTeacherAgent()
