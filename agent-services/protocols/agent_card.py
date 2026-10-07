import json
import os
from typing import Dict, Any

def get_agent_card() -> Dict[str, Any]:
    """Carga y retorna el manifiesto A2A oficial del ecosistema de agentes."""
    current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    card_path = os.path.join(current_dir, ".well-known", "agent-card.json")
    if os.path.exists(card_path):
        with open(card_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {
        "name": "Docencia IA UDP Agents",
        "version": "1.0.0",
        "status": "ready"
    }
