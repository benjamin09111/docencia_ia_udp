from typing import List, Dict, Any
from rag.pdf_processor import DocumentChunk

class CourseKnowledgeRetriever:
    """
    Motor de recuperación contextual (RAG) especializado para cursos de la UDP.
    Permite inyectar material oficial de cátedras y pautas en el contexto del agente.
    """
    def __init__(self):
        # Repositorio en memoria inicial para desarrollo local
        self._knowledge_base: Dict[str, List[DocumentChunk]] = {
            "CIT3203": [
                DocumentChunk(
                    content="CIT3203 Unidad 1: Arquitectura de Software, Atributos de Calidad (ISO 25010), RTO y RPO.",
                    source="Syllabus CIT3203 2026",
                    page=1
                ),
                DocumentChunk(
                    content="Escenarios tácticos para Disponibilidad: Detección de fallas (Heartbeat), Recuperación (Failover).",
                    source="Cátedra 3 - Disponibilidad",
                    page=4
                ),
                DocumentChunk(
                    content="Pauta Solemne 1: El análisis de trade-offs debe contrastar latencia vs consistencia bajo el teorema CAP.",
                    source="Pauta Solemne 1 - 2025-2",
                    page=2
                )
            ]
        }

    def retrieve_context(self, course_code: str, query: str, top_k: int = 2) -> List[DocumentChunk]:
        """Recupera los fragmentos más relevantes para una consulta."""
        course_key = course_code.upper()
        docs = self._knowledge_base.get(course_key, [])
        query_words = set(query.lower().split())

        # Búsqueda semántica / por coincidencia léxica ponderada
        scored_docs = []
        for doc in docs:
            score = sum(1 for word in query_words if word in doc.content.lower())
            scored_docs.append((score, doc))

        scored_docs.sort(key=lambda x: x[0], reverse=True)
        return [doc for score, doc in scored_docs[:top_k]]

course_retriever = CourseKnowledgeRetriever()
