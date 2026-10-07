from typing import List, Dict, Any, Optional
from datetime import datetime

class TeacherFact:
    def __init__(self, key: str, value: str, course_id: str, confidence: float = 1.0):
        self.key = key
        self.value = value
        self.course_id = course_id
        self.confidence = confidence
        self.created_at = datetime.utcnow().isoformat()

class LongTermMemoryBank:
    """
    Pipeline ETL de Memoria a Largo Plazo:
    Permite al agente recordar preferencias del docente, decisiones previas
    y estilos evaluativos a lo largo del semestre sin depender de la ventana de contexto inmediata.
    """
    def __init__(self):
        self._facts: Dict[str, List[TeacherFact]] = {}

    def extract_and_store(self, course_id: str, key: str, value: str, confidence: float = 0.9):
        """Almacena o actualiza un hecho consolidado sobre el curso o profesor."""
        if course_id not in self._facts:
            self._facts[course_id] = []
        
        # Evitar duplicados exactos
        self._facts[course_id] = [f for f in self._facts[course_id] if f.key != key]
        self._facts[course_id].append(TeacherFact(key, value, course_id, confidence))

    def get_course_memory_summary(self, course_id: str) -> List[Dict[str, Any]]:
        """Retorna los hechos consolidados activos para inyección en el prompt."""
        facts = self._facts.get(course_id, [])
        return [
            {"key": f.key, "value": f.value, "confidence": f.confidence}
            for f in facts
        ]

memory_bank = LongTermMemoryBank()
