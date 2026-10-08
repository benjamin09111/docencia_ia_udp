export type LearningPerformanceLevel = "destacado" | "favorable" | "en_riesgo" | "atencion";

export interface StudentLearningProfile {
  studentId: number;
  nombres: string;
  apellidos: string;
  rut: string;
  email: string;
  seccionId: string;
  avatarUrl?: string;
  progresoGeneral: number; // 0 a 100
  nivelRendimiento: LearningPerformanceLevel;
  promedioActual: number;
  asistenciaPct: number;
  
  // Reflexión personal del estudiante (conectado al módulo futuro del estudiante)
  reflexionEstudiante: {
    fecha: string;
    texto: string;
    autoevaluacionComprension: number; // 1 a 5
    dificultadesPercibidas: string[];
    metasProximoHito: string;
  };

  // Análisis pedagógico del docente / IA
  fortalezas: string[];
  debilidades: string[];
  
  // Diagnóstico e intervenciones generadas por IA
  diagnosticoIA: {
    resumen: string;
    patronAprendizaje: string;
    recomendacionDocente: string;
    preguntasGatilladoras: string[];
    accionesSugeridas: string[];
  };
}
