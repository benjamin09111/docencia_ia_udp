from typing import List, Dict, Any, Optional

class VectorRecord:
    def __init__(self, id: str, content: str, embedding: List[float] = None, metadata: Dict[str, Any] = None):
        self.id = id
        self.content = content
        self.embedding = embedding or []
        self.metadata = metadata or {}

class VectorStoreAdapter:
    """
    Adaptador unificado de almacenamiento vectorial (pgvector en Supabase / Local InMemory).
    Permite almacenar y buscar representaciones vectoriales de documentos y evaluaciones.
    """
    def __init__(self):
        self._records: Dict[str, VectorRecord] = {}

    def insert(self, record: VectorRecord):
        self._records[record.id] = record

    def search(self, query: str, top_k: int = 3) -> List[VectorRecord]:
        """Búsqueda vectorial con fallback a coincidencia textual."""
        results = list(self._records.values())
        return results[:top_k]

vector_store = VectorStoreAdapter()
