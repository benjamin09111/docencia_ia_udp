from typing import Any, Dict, List


class VectorRecord:
    def __init__(self, id: str, content: str, embedding: List[float] = None, metadata: Dict[str, Any] = None):
        self.id = id
        self.content = content
        self.embedding = embedding or []
        self.metadata = metadata or {}


class VectorStoreAdapter:
    """
    Almacén vectorial en memoria con búsqueda léxica hasta pgvector.
    """

    def __init__(self):
        self._records: Dict[str, VectorRecord] = {}

    def insert(self, record: VectorRecord):
        self._records[record.id] = record

    def search(self, query: str, top_k: int = 3) -> List[VectorRecord]:
        query_words = {w for w in (query or "").lower().split() if len(w) > 2}
        if not query_words:
            return list(self._records.values())[:top_k]

        scored = []
        for record in self._records.values():
            hay = record.content.lower()
            score = sum(1 for word in query_words if word in hay)
            if score:
                scored.append((score, record))

        scored.sort(key=lambda x: x[0], reverse=True)
        if scored:
            return [r for _, r in scored[:top_k]]
        return list(self._records.values())[:top_k]


vector_store = VectorStoreAdapter()
