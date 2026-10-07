from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class AgentLevel(str, Enum):
    INSTITUTION = "institution"  # Nivel 1: UDP / Vicerrectoría / CREA
    FACULTY = "faculty"          # Nivel 2: Facultad (Ingeniería y Ciencias)
    CAREER = "career"            # Nivel 3: Carrera / Escuela (Informática y Telecomunicaciones)
    COURSE = "course"            # Nivel 4: Asignatura / Docente ("Mini-Yo del Profesor")
    WORKER = "worker"            # Nivel 5: Especialista de Tarea Específica

class ExigencyLevel(str, Enum):
    LAXO = "laxo"
    MODERADO = "moderado"
    ESTRICTO = "estricto"
    SOLEMNE = "solemne"

class PedagogicalStyle(str, Enum):
    SOCRATICO = "socratico"      # Guía con preguntas e inducción reflexiva
    DIRECTO = "directo"          # Señala errores y muestra resolución técnica
    RUBRICA_PURA = "rubrica"     # Cita exclusivamente criterios y puntajes observables

class PedagogicalSettings(BaseModel):
    nivel_exigencia: ExigencyLevel = Field(default=ExigencyLevel.ESTRICTO)
    estilo_pedagogico: PedagogicalStyle = Field(default=PedagogicalStyle.SOCRATICO)
    politica_decimas: float = Field(default=0.6, description="Tope de bonificación en décimas")
    modulo_activo: Optional[str] = Field(default=None, description="Semanas o hitos activos")

class AgentNode(BaseModel):
    id: str
    name: str
    level: AgentLevel
    parent_id: Optional[str] = None
    description: str
    directives: List[str] = Field(default_factory=list)
    default_settings: Optional[PedagogicalSettings] = None
    allowed_workers: List[str] = Field(default_factory=list)

class AgentChatRequest(BaseModel):
    message: str
    node_id: str = Field(default="course:cit3203", description="Identificador del nodo en el árbol")
    worker_role: Optional[str] = Field(default=None, description="Worker especialista asignado")
    session_id: Optional[str] = Field(default=None)
    settings: Optional[PedagogicalSettings] = None
    context_data: Optional[Dict[str, Any]] = None

class AgentChatResponse(BaseModel):
    reply: str
    node_id: str
    node_path: List[str]
    steps_executed: int = 1
    sources: List[str] = Field(default_factory=list)
    tool_calls_executed: List[str] = Field(default_factory=list)
    tokens_estimated: int = 0

class RubricItem(BaseModel):
    criterio: str
    puntaje_max: float
    descriptores: List[str] = Field(default_factory=list)

class SubmissionEvaluationRequest(BaseModel):
    student_solution: str
    assignment_title: str
    course_id: str = "course:cit3203"
    rubric: List[RubricItem]
    max_decimas: float = 0.6

class CriteriaScore(BaseModel):
    criterio: str
    puntaje_obtenido: float
    puntaje_max: float
    cita_textual: str
    comentario: str

class SubmissionEvaluationResponse(BaseModel):
    nota_sugerida: float
    decimas_sugeridas: float
    resumen_feedback: str
    criterios_evaluados: List[CriteriaScore]
    sugerencias_mejora: List[str]
    profesor_revisor_pendiente: bool = True
