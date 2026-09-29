export type UserRole = "admin" | "teacher" | "student";

export interface CanvasUser {
  id: number;
  name: string;
  short_name: string;
  avatar_url: string;
  email?: string;
  role: UserRole;
}

export interface CanvasCourse {
  id: number;
  name: string;
  code: string;
  term?: string;
  students_count?: number;
  is_automated?: boolean;
  agent_id?: string;
}

export interface AgentPerillas {
  nivel_exigencia: 1 | 2 | 3 | 4 | 5; // 1: Laxo, 3: Equilibrado, 5: Riguroso
  estilo_pedagogico: "socratico" | "directo" | "constructivo";
  amabilidad: "formal" | "amable" | "academico_estricto";
  max_decimas_por_actividad: number; // Ej: 0.3
  tope_decimas_solemne: number; // Ej: 0.6
  mostrar_feedback_inmediato: boolean;
}

export interface CourseScheduleClass {
  semana: number;
  sesion: number; // 1 o 2 (las 2 cátedras semanales)
  tipo: "catedra" | "ayudantia" | "evaluacion";
  titulo: string;
  objetivo: string;
  material_referencia: string;
}

export interface RubricCriterion {
  id: string;
  descripcion: string;
  puntaje_max: number;
  indicadores: {
    nivel: "Excelente" | "Aceptable" | "Insuficiente";
    detalle: string;
    puntos: number;
  }[];
}

export interface CourseDeliverable {
  id: string;
  curso_id: number;
  tipo: "tarea_oficial" | "actividad_ayudantia";
  titulo: string;
  descripcion: string;
  fecha_limite: string;
  ponderacion_o_decimas: string; // "25%" si es solemne/tarea, "+0.3 décimas" si es actividad
  rubrica: RubricCriterion[];
  estado: "borrador" | "publicada" | "en_revision" | "finalizada";
  target_evaluacion?: string; // Para décimas: ej. "Solemne 1"
}

export interface StudentSubmission {
  id: string;
  deliverable_id: string;
  estudiante_id: number;
  estudiante_nombre: string;
  fecha_entrega: string;
  archivo_nombre: string;
  texto_solucion: string;
  estado: "pendiente" | "pre_revisada_ia" | "auditada_profesor";
  nota_sugerida: number; // 1.0 a 7.0
  decimas_sugeridas?: number;
  nota_final?: number;
  feedback_ia: {
    resumen: string;
    criterios_evaluados: {
      criterio: string;
      puntaje_obtenido: number;
      puntaje_max: number;
      cita_textual: string;
      comentario: string;
    }[];
    sugerencias_mejora: string[];
    alerta_docente?: string;
  };
  apelacion?: {
    motivo: string;
    fecha: string;
    estado: "pendiente" | "aceptada" | "rechazada";
    respuesta_docente?: string;
  };
}

export interface StudentExcelRow {
  canvas_id: number;
  rut: string;
  apellidos: string;
  nombres: string;
  email: string;
  solemne_1: number;
  decimas_act1: number;
  solemne_1_final: number;
  solemne_2: number;
  taller_proyecto: number;
  asistencia_pct: number;
  nota_final: number;
  estado_curso: "Aprobado" | "Reprobado" | "En Curso";
}

export interface StudentStudyMetrics {
  preguntasRealizadas: number;
  actividadesCompletadas: number;
  quizzesRespondidos: number;
  casosResueltos: number;
  puntosEstudio: number;
}

export type StudyActivityType = "quiz" | "caso_reflexion" | "desarrollo";

export interface QuizQuestion {
  id: string;
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: number;
  explicacion: string;
}

export interface ReflectionQuestion {
  id: string;
  pregunta: string;
  guiaReflexion: string;
  puntosClave: string[];
}

export interface GeneratedStudyActivity {
  id: string;
  tipo: StudyActivityType;
  unidad: string;
  titulo: string;
  contexto?: string;
  preguntasQuiz?: QuizQuestion[];
  preguntasReflexion?: ReflectionQuestion[];
  preguntaDesarrollo?: {
    enunciado: string;
    criteriosEvaluacion: string[];
  };
  fechaCreacion: string;
  completada: boolean;
}

