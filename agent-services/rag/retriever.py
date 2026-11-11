from pathlib import Path
from typing import Dict, List
from rag.pdf_processor import DocumentChunk, document_processor


def _repo_knowledge_root() -> Path:
    # agent-services/rag -> agent-services -> repo root / knowledge
    return Path(__file__).resolve().parents[2] / "knowledge"


class CourseKnowledgeRetriever:
    """
    RAG léxico sobre materiales indexados.
    El sandbox CIT3000 recibe el corpus de knowledge/ para desarrollo seguro.
    """

    def __init__(self):
        self._knowledge_base: Dict[str, List[DocumentChunk]] = {}
        self._seed_builtin()
        self._load_knowledge_dir()

    def _seed_builtin(self):
        self._knowledge_base["CIT3000"] = [
            DocumentChunk(
                content=(
                    "CIT3000 Sandbox — Arquitectura de Software: atributos de calidad ISO 25010, "
                    "escenarios de disponibilidad, RTO/RPO, trade-offs CAP y Clean Architecture."
                ),
                source="Descriptor Sandbox CIT3000",
                page=1,
            ),
            DocumentChunk(
                content=(
                    "Rúbrica formativa sandbox: fundamentación técnica con métricas, separación de capas, "
                    "y comunicación de trade-offs. Escala 100 puntos netos; décimas con tope docente."
                ),
                source="Pauta formativa sandbox",
                page=1,
            ),
        ]

    def _load_knowledge_dir(self):
        root = _repo_knowledge_root()
        if not root.exists():
            return

        for md_path in sorted(root.rglob("*.md")):
            try:
                text = md_path.read_text(encoding="utf-8")
            except OSError:
                continue
            chunks = document_processor.chunk_text(text, source_name=str(md_path.relative_to(root)))
            # Corpus de dominio indexado en sandbox para no apuntar IA a cursos reales por defecto
            self._knowledge_base.setdefault("CIT3000", []).extend(chunks)
            # Alias de carpeta (ej. CIT3203_...) solo como referencia secundaria
            top = md_path.relative_to(root).parts[0] if md_path.relative_to(root).parts else ""
            if top.upper().startswith("CIT") and "_" in top:
                alias = top.split("_", 1)[0].upper()
                if alias != "CIT3000":
                    self._knowledge_base.setdefault(alias, []).extend(chunks)

    def index_chunks(self, course_code: str, chunks: List[DocumentChunk]):
        key = course_code.upper()
        self._knowledge_base.setdefault(key, []).extend(chunks)

    def retrieve_context(self, course_code: str, query: str, top_k: int = 3) -> List[DocumentChunk]:
        course_key = (course_code or "CIT3000").upper().split("_")[0]
        docs = list(self._knowledge_base.get(course_key, []))
        if not docs and course_key != "CIT3000":
            docs = list(self._knowledge_base.get("CIT3000", []))

        query_words = {w for w in query.lower().split() if len(w) > 2}
        if not query_words:
            return docs[:top_k]

        scored = []
        for doc in docs:
            hay = doc.content.lower()
            score = sum(1 for word in query_words if word in hay)
            if score:
                scored.append((score, doc))

        scored.sort(key=lambda x: x[0], reverse=True)
        if scored:
            return [doc for _, doc in scored[:top_k]]
        return docs[:top_k]


course_retriever = CourseKnowledgeRetriever()
