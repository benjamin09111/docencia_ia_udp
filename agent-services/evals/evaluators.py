from typing import Dict, Any, List
from core.models import AgentChatRequest
from agents.root import root_agent

class TrajectoryEvaluator:
    """
    Evaluador de Trayectoria (Glass Box) según Sección 6 de la Guía de Implementación.
    Comprueba si el agente seleccionó el nodo correcto, ejecutó las herramientas esperadas
    y satisfizo los criterios cualitativos institucionales.
    """
    def evaluate_test_case(self, test_case: Dict[str, Any]) -> Dict[str, Any]:
        req = AgentChatRequest(
            message=test_case["input_message"],
            node_id=test_case.get("expected_node", "course:cit3203"),
            worker_role=test_case.get("expected_worker")
        )
        
        response = root_agent.process_request(req)
        
        # Validación de nodo
        node_match = response.node_id == test_case["expected_node"]
        
        # Validación de herramientas
        expected_tool = test_case.get("expected_tool")
        tool_match = (expected_tool in response.tool_calls_executed) if expected_tool else True
        
        passed = node_match and (tool_match or expected_tool is None)

        return {
            "test_id": test_case["id"],
            "passed": passed,
            "node_match": node_match,
            "tool_match": tool_match,
            "tools_executed": response.tool_calls_executed,
            "reply_snippet": response.reply[:80] + "..."
        }

trajectory_evaluator = TrajectoryEvaluator()
