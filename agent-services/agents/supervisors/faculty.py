from core.models import AgentChatRequest, AgentChatResponse
from agents.root import root_agent

class FacultySupervisorAgent:
    """
    Supervisor Nivel 2: Facultad de Ingeniería y Ciencias UDP.
    Alinea las directivas de ciencias y proyectos con los estándares ABET.
    """
    def __init__(self):
        self.node_id = "faculty:ingenieria"

    def handle(self, req: AgentChatRequest) -> AgentChatResponse:
        req.node_id = self.node_id
        return root_agent.process_request(req)

faculty_supervisor = FacultySupervisorAgent()
