from typing import List, Dict, Any
import re

class DocumentChunk:
    def __init__(self, content: str, source: str, page: int = 1, metadata: Dict[str, Any] = None):
        self.content = content
        self.source = source
        self.page = page
        self.metadata = metadata or {}

class CourseDocumentProcessor:
    """
    Procesador de documentos académicos (Syllabus, Cátedras, Solemnes anteriores).
    Divide textos en fragmentos semánticos respetando encabezados y carga cognitiva.
    """
    def __init__(self, chunk_size: int = 500, overlap: int = 50):
        self.chunk_size = chunk_size
        self.overlap = overlap

    def chunk_text(self, text: str, source_name: str) -> List[DocumentChunk]:
        """Divide un texto plano en fragmentos con solapamiento."""
        words = text.split()
        chunks = []
        page = 1

        for i in range(0, len(words), self.chunk_size - self.overlap):
            chunk_words = words[i:i + self.chunk_size]
            chunk_str = " ".join(chunk_words)
            if len(chunk_str.strip()) > 30:
                chunks.append(DocumentChunk(
                    content=chunk_str,
                    source=source_name,
                    page=page,
                    metadata={"word_count": len(chunk_words)}
                ))
            if i > 0 and i % 800 == 0:
                page += 1

        return chunks

document_processor = CourseDocumentProcessor()
