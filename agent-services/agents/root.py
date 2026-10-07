from typing import List, Dict, Any
from core.hierarchy import hierarchy_manager
from core.engine import agent_loop_engine
from core.models import AgentChatRequest, AgentChatResponse

class RootInstitutionalAgent:
    """
    Orquestador Raíz (Nivel 1): Representa a la Vicerrectoría Académica y al CREA UDP.
    Punto de entrada general. Valida la petición institucional y enruta al subárbol adecuado.
    """
    def __init__(self):
        self.node_id = "institution:udp"

    def process_request(self, request: AgentChatRequest) -> AgentChatResponse:
        # Si la petición apunta a un nodo más profundo (ej: curso), delega manteniendo el linaje
        target_node_id = request.node_id or self.node_id
        node = hierarchy_manager.get_node(target_node_id) or hierarchy_manager.get_node(self.node_id)
        
        system_prompt = hierarchy_manager.compile_system_prompt(
            node_id=node.id,
            custom_settings=request.settings,
            worker_role=request.worker_role
        )
        
        reply, tools, sources, tokens = agent_loop_engine.run_turn(
            system_prompt=system_prompt,
            user_message=request.message,
            node_name=node.name,
            worker_role=request.worker_role or ""
        )
        
        lineage = hierarchy_manager.get_lineage(node.id)
        node_path = [ancestor.name for ancestor in lineage]

        return AgentChatResponse(
            reply=reply,
            node_id=node.id,
            node_path=node_path,
            steps_executed=1 if not tools else len(tools) + 1,
            sources=sources,
            tool_calls_executed=tools,
            tokens_estimated=tokens
        )

root_agent = RootInstitutionalAgent()
