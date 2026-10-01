export interface CronogramaRow {
  semana: number;
  fechas: string; // ej. "10 agosto"
  catedraMartes: string; // ej. "Introducción"
  catedraViernes: string; // ej. "Primeros pasos en OpenCV"
  ayudantia: string; // ej. "Taller Python & Entorno"
  evaluacionesIndividuales: string; // ej. "Tarea 1"
  evaluacionesGrupales: string; // ej. "Entrega Informe 1"
  laboratorios: string; // ej. "Lab 1 (Calificado)"
  observaciones: string; // ej. "lunes 10/08 inicio de clases FIC"
  isSpecialRow?: boolean;
  specialType?: "receso" | "solemne1" | "solemne2" | "examenes";
  specialText?: string;
}

export const INITIAL_CRONOGRAMA_ROWS: CronogramaRow[] = [
  {
    semana: 1,
    fechas: "10 agosto",
    catedraMartes: "Introducción y Marco de Arquitectura",
    catedraViernes: "Primeros pasos en OpenCV & Entorno",
    ayudantia: "Setup Git, Python y librerías",
    evaluacionesIndividuales: "-",
    evaluacionesGrupales: "-",
    laboratorios: "Lab 0 (Formativo)",
    observaciones: "Lunes 10/08: Inicio de clases FIC. Jueves 13/08: Feria laboral UDP.",
  },
  {
    semana: 2,
    fechas: "17 agosto",
    catedraMartes: "Primeros pasos en Procesamiento",
    catedraViernes: "Características Geométricas I",
    ayudantia: "Ejercicios Prácticos Numpy",
    evaluacionesIndividuales: "-",
    evaluacionesGrupales: "-",
    laboratorios: "-",
    observaciones: "Inscripción final de grupos de proyecto.",
  },
  {
    semana: 3,
    fechas: "24 agosto",
    catedraMartes: "Características Geométricas I",
    catedraViernes: "Características Geométricas II",
    ayudantia: "Extracción de bordes y contornos",
    evaluacionesIndividuales: "-",
    evaluacionesGrupales: "-",
    laboratorios: "Lab 1 (En entrega)",
    observaciones: "Publicación de pauta oficial para Tarea 1.",
  },
  {
    semana: 4,
    fechas: "31 agosto",
    catedraMartes: "Características Geométricas II",
    catedraViernes: "Características Cromáticas I",
    ayudantia: "Espacios de Color (RGB, HSV, Lab)",
    evaluacionesIndividuales: "-",
    evaluacionesGrupales: "Propuesta Proyecto",
    laboratorios: "-",
    observaciones: "Revisión de avances con ayudante.",
  },
  {
    semana: 5,
    fechas: "7 septiembre",
    catedraMartes: "Características Cromáticas I",
    catedraViernes: "Características Cromáticas II",
    ayudantia: "Taller preparatorio Tarea 1",
    evaluacionesIndividuales: "Tarea 1 (23:59 hrs)",
    evaluacionesGrupales: "-",
    laboratorios: "-",
    observaciones: "Jueves 10/09: Suspensión de docencia desde 13:00 hrs. Viernes 11/09: Suspensión desde 17:30 hrs.",
  },
  {
    semana: 6,
    fechas: "14 septiembre",
    catedraMartes: "-",
    catedraViernes: "-",
    ayudantia: "-",
    evaluacionesIndividuales: "-",
    evaluacionesGrupales: "-",
    laboratorios: "-",
    observaciones: "14/09 al 19/09 — Semana de receso académico por Fiestas Patrias UDP",
    isSpecialRow: true,
    specialType: "receso",
    specialText: "RECESO ACADÉMICO FIESTAS PATRIAS (14 al 19 de Septiembre)",
  },
  {
    semana: 7,
    fechas: "21 septiembre",
    catedraMartes: "Repaso general de contenidos",
    catedraViernes: "SOLEMNE 1 (Presencial)",
    ayudantia: "Resolución de dudas Solemne 1",
    evaluacionesIndividuales: "Solemne 1 (20%)",
    evaluacionesGrupales: "-",
    laboratorios: "-",
    observaciones: "Lunes 21 al miércoles 23: clases y ayudantías de repaso para solemne.",
    isSpecialRow: true,
    specialType: "solemne1",
    specialText: "Jueves 24 – Miércoles 30 septiembre: Semana de Primera Solemne Oficial UDP",
  },
  {
    semana: 8,
    fechas: "28 septiembre",
    catedraMartes: "Retroalimentación Solemne 1",
    catedraViernes: "Características Cromáticas II",
    ayudantia: "Entrega de corrección y décimas",
    evaluacionesIndividuales: "-",
    evaluacionesGrupales: "-",
    laboratorios: "-",
    observaciones: "Jueves 01/10 y viernes 02/10: Suspensión de actividades por Aniversario UDP.",
  },
  {
    semana: 9,
    fechas: "5 octubre",
    catedraMartes: "Compresión de datos PCA",
    catedraViernes: "Compresión de datos VQ",
    ayudantia: "Implementación PCA en Scikit-Learn",
    evaluacionesIndividuales: "-",
    evaluacionesGrupales: "Avance 1 Proyecto",
    laboratorios: "-",
    observaciones: "TOMA PRESENCIAL DE ENCUESTA — EVALUACIÓN TEMPRANA DE CURSOS (ETC).",
  },
  {
    semana: 10,
    fechas: "12 octubre",
    catedraMartes: "Selección de características",
    catedraViernes: "Selección de características",
    ayudantia: "Métricas de información mutua",
    evaluacionesIndividuales: "Tarea 2 (23:59 hrs)",
    evaluacionesGrupales: "-",
    laboratorios: "Lab 2 (Calificado)",
    observaciones: "Lunes 12/10: Feriado Encuentro de Dos Mundos en Chile.",
  },
  {
    semana: 11,
    fechas: "19 octubre",
    catedraMartes: "Clasificadores Supervisados I (k-NN, Bayes)",
    catedraViernes: "Clasificadores Supervisados II (SVM)",
    ayudantia: "Taller Práctico SVM y Kernel Trick",
    evaluacionesIndividuales: "-",
    evaluacionesGrupales: "-",
    laboratorios: "-",
    observaciones: "Mostrar resultados de Encuesta ETC y compromisos estudiante-docente.",
  },
  {
    semana: 12,
    fechas: "26 octubre",
    catedraMartes: "Árboles de Decisión y Random Forest",
    catedraViernes: "Ensambles y Boosting (XGBoost)",
    ayudantia: "Taller Práctico Tarea 3",
    evaluacionesIndividuales: "Tarea 3 (23:59 hrs)",
    evaluacionesGrupales: "-",
    laboratorios: "-",
    observaciones: "Revisión formativa de avances de proyecto semestral.",
  },
  {
    semana: 13,
    fechas: "2 noviembre",
    catedraMartes: "Redes Neuronales Artificiales (MLP)",
    catedraViernes: "Backpropagation y Optimización",
    ayudantia: "PyTorch básico para visión computacional",
    evaluacionesIndividuales: "-",
    evaluacionesGrupales: "Avance 2 Proyecto",
    laboratorios: "Lab 3 (En entrega)",
    observaciones: "Viernes 06/11: Jornada de difusión académica.",
  },
  {
    semana: 14,
    fechas: "9 noviembre",
    catedraMartes: "Evaluación y Validación de Modelos",
    catedraViernes: "Métricas: ROC, AUC, F1-Score y Confusión",
    ayudantia: "Cross-Validation estratificada",
    evaluacionesIndividuales: "Tarea 4 (23:59 hrs)",
    evaluacionesGrupales: "-",
    laboratorios: "-",
    observaciones: "Publicación de notas parciales actualizadas.",
  },
  {
    semana: 15,
    fechas: "16 noviembre",
    catedraMartes: "Clustering: K-Means y DBSCAN",
    catedraViernes: "Clustering Jerárquico y GMM",
    ayudantia: "Resolución de dudas Solemne 2",
    evaluacionesIndividuales: "-",
    evaluacionesGrupales: "-",
    laboratorios: "-",
    observaciones: "Semana de consultas y cierre de laboratorios.",
  },
  {
    semana: 16,
    fechas: "23 noviembre",
    catedraMartes: "Repaso temático Solemne 2",
    catedraViernes: "SOLEMNE 2 (Presencial)",
    ayudantia: "Revisión final de proyecto",
    evaluacionesIndividuales: "Solemne 2 (20%)",
    evaluacionesGrupales: "-",
    laboratorios: "-",
    observaciones: "Lunes 23 a Viernes 27 de noviembre: Semana oficial de Segunda Solemne.",
    isSpecialRow: true,
    specialType: "solemne2",
    specialText: "Lunes 23 – Viernes 27 noviembre: Semana de Segunda Solemne Oficial UDP",
  },
  {
    semana: 17,
    fechas: "30 noviembre",
    catedraMartes: "Presentaciones de Proyecto Final",
    catedraViernes: "Presentaciones y Cierre del Curso",
    ayudantia: "Cierre de actas de ayudantía y décimas",
    evaluacionesIndividuales: "-",
    evaluacionesGrupales: "Informe Final Proyecto (40%)",
    laboratorios: "-",
    observaciones: "Viernes 04/12: Último día lectivo oficial del semestre.",
  },
  {
    semana: 18,
    fechas: "7 diciembre",
    catedraMartes: "-",
    catedraViernes: "EXAMEN GENERAL (Presencial)",
    ayudantia: "-",
    evaluacionesIndividuales: "Examen Final (20%)",
    evaluacionesGrupales: "-",
    laboratorios: "-",
    observaciones: "Martes 08/12: Feriado Inmaculada Concepción. Miércoles 09/12 al viernes 18/12: Período de Exámenes.",
    isSpecialRow: true,
    specialType: "examenes",
    specialText: "Período Oficial de Exámenes UDP: 9, 11, 14, 16 y 18 de Diciembre",
  },
];

const CRONOGRAMA_STORAGE_KEY = "udp_course_cronograma_table_v1";

export function getStoredCronograma(courseCode: string): CronogramaRow[] {
  if (typeof window === "undefined") return INITIAL_CRONOGRAMA_ROWS;
  try {
    const raw = localStorage.getItem(`${CRONOGRAMA_STORAGE_KEY}_${courseCode}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Error loading cronograma data", e);
  }
  return INITIAL_CRONOGRAMA_ROWS;
}

export function saveStoredCronograma(courseCode: string, rows: CronogramaRow[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${CRONOGRAMA_STORAGE_KEY}_${courseCode}`, JSON.stringify(rows));
  } catch (e) {
    console.error("Error saving cronograma data", e);
  }
}
