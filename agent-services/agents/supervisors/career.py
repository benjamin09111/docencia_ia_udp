from core.models import AgentChatRequest, AgentChatResponse
from agents.root import root_agent

class CareerSupervisorAgent:
    """
    Supervisor Nivel 3: Escuela de Ingeniería Civil en Informática y Telecomunicaciones (DIT).
    Gobierna la rigurosidad en código, arquitectura, sistemas y trade-offs técnicos.
    """
    def __init__(self):
        self.node_id = "career:informatica"

    def handle(self, req: AgentChatRequest) -> AgentChatResponse:
        req.node_id = self.node_id
        return root_agent.process_request(req)

career_supervisor = CareerSupervisorAgent()
