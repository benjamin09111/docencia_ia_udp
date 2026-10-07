from typing import List, Dict, Any, Optional
from collections import deque

class SessionMessage:
    def __init__(self, role: str, content: str):
        self.role = role
        self.content = content

class SessionManager:
    """
    Gestor de sesiones y memoria a corto/mediano plazo.
    Aplica ventana deslizante (Sliding Window) para evitar el desborde de tokens (Context Rot).
    """
    def __init__(self, max_history_turns: int = 10):
        self.max_history_turns = max_history_turns
        self._sessions: Dict[str, deque] = {}

    def add_message(self, session_id: str, role: str, content: str):
        if session_id not in self._sessions:
            self._sessions[session_id] = deque(maxlen=self.max_history_turns * 2)
        self._sessions[session_id].append(SessionMessage(role, content))

    def get_context_window(self, session_id: str) -> List[Dict[str, str]]:
        if session_id not in self._sessions:
            return []
        return [
            {"role": msg.role, "content": msg.content}
            for msg in self._sessions[session_id]
        ]

    def clear_session(self, session_id: str):
        if session_id in self._sessions:
            del self._sessions[session_id]

session_manager = SessionManager()
