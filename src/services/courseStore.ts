import {
  AgentPerillas,
  CourseDeliverable,
  CourseScheduleClass,
  StudentExcelRow,
  StudentSubmission,
} from "@/types";
import { INITIAL_STUDENTS_ROSTER } from "@/constants/initialStudentRoster";

export interface CourseData {
  id: number;
  nombre: string;
  codigo: string;
  seccion: string;
  profesor_titular: string;
  ayudante: string;
  perillas: AgentPerillas;
  cronograma: CourseScheduleClass[];
  entregables: CourseDeliverable[];
  estudiantes_excel: StudentExcelRow[];
  entregas_alumnos: StudentSubmission[];
}

export const initialCourseData: CourseData = {
  id: 41210,
  nombre: "ARQUITECTURA DE SOFTWARE",
  codigo: "CIT3000_CA02",
  seccion: "Sección 2",
  profesor_titular: "Jorge Esteban Cruz León",
  ayudante: "Benjamín Morales Pizarro",
  perillas: {
    nivel_exigencia: 4,
    estilo_pedagogico: "constructivo",
    amabilidad: "amable",
    max_decimas_por_actividad: 0.3,
    tope_decimas_solemne: 0.6,
    mostrar_feedback_inmediato: true,
  },
  cronograma: [
    {
      semana: 1,
      sesion: 1,
      tipo: "catedra",
      titulo: "Introducción y Atributos de Calidad (NFR)",
      objetivo: "Comprender la diferencia entre arquitectura y diseño detallado.",
      material_referencia: "Capítulo 1 Bass, Clements & Kazman.",
    },
    {
      semana: 1,
      sesion: 2,
      tipo: "catedra",
      titulo: "Escenarios de Calidad y Tácticas de Rendimiento",
      objetivo: "Escribir escenarios con estímulo, entorno y respuesta medida.",
      material_referencia: "Diapositivas Cátedra 2 - UDP.",
    },
    {
      semana: 1,
      sesion: 3,
      tipo: "ayudantia",
      titulo: "Taller Práctico 1: Modelado de Escenarios",
      objetivo: "Redactar 3 escenarios de disponibilidad y latencia con décimas.",
      material_referencia: "Guía de Ejercicios Ayudantía 1.",
    },
    {
      semana: 2,
      sesion: 1,
      tipo: "catedra",
      titulo: "Patrones Arquitectónicos: Capas, Microservicios y Event-Driven",
      objetivo: "Evaluar trade-offs de acoplamiento y escalabilidad.",
      material_referencia: "Lectura complementaria Fowler.",
    },
    {
      semana: 2,
      sesion: 2,
      tipo: "catedra",
      titulo: "Tácticas de Seguridad y Mantenibilidad",
      objetivo: "Diseño para la evolución del software y resistencia a fallos.",
      material_referencia: "Cátedra 4 UDP.",
    },
    {
      semana: 2,
      sesion: 3,
      tipo: "ayudantia",
      titulo: "Taller Práctico 2: Diagramas C4 y Vistas Arquitectónicas",
      objetivo: "Representar Contexto, Contenedor y Componentes.",
      material_referencia: "Herramienta Structurizr / PlantUML.",
    },
    {
      semana: 5,
      sesion: 1,
      tipo: "evaluacion",
      titulo: "SOLEMNE 1 (30% Nota Final)",
      objetivo: "Evaluación formal individual de Atributos de Calidad y Patrones.",
      material_referencia: "Pauta Oficial Escuela de Informática UDP.",
    },
  ],
  entregables: [
    {
      id: "deliv_sol1",
      curso_id: 41210,
      tipo: "tarea_oficial",
      titulo: "Solemne 1: Evaluación Teórico-Práctica",
      descripcion: "Evaluación individual sobre Atributos de Calidad, Patrones de Arquitectura y Tácticas.",
      fecha_limite: "2026-10-14",
      ponderacion_o_decimas: "30%",
      estado: "publicada",
      rubrica: [
        {
          id: "r1",
          descripcion: "Definición rigurosa de Escenarios de Calidad (6 partes)",
          puntaje_max: 30,
          indicadores: [
            { nivel: "Excelente", detalle: "Incluye fuente, estímulo, artefacto, entorno, respuesta y medida.", puntos: 30 },
            { nivel: "Aceptable", detalle: "Omite artefacto o medida cuantificable.", puntos: 18 },
            { nivel: "Insuficiente", detalle: "Redacción ambigua o sin métricas.", puntos: 5 },
          ],
        },
        {
          id: "r2",
          descripcion: "Selección y Justificación de Tácticas Arquitectónicas",
          puntaje_max: 40,
          indicadores: [
            { nivel: "Excelente", detalle: "Justifica trade-offs de rendimiento vs costo.", puntos: 40 },
            { nivel: "Aceptable", detalle: "Menciona tácticas pero sin balance de consecuencias.", puntos: 25 },
            { nivel: "Insuficiente", detalle: "Tácticas incompatibles con el problema.", puntos: 10 },
          ],
        },
      ],
    },
    {
      id: "deliv_act1",
      curso_id: 41210,
      tipo: "actividad_ayudantia",
      titulo: "Actividad Ayudantía 1: Modelado de Escenarios de Disponibilidad",
      descripcion: "Diseña un escenario de calidad para un sistema bancario ante caída de servidor. Entrega en PDF o texto.",
      fecha_limite: "2026-10-02",
      ponderacion_o_decimas: "+0.3 décimas",
      target_evaluacion: "Solemne 1",
      estado: "publicada",
      rubrica: [
        {
          id: "act_r1",
          descripcion: "Estructura formal del escenario (Estímulo y Medida de Respuesta)",
          puntaje_max: 50,
          indicadores: [
            { nivel: "Excelente", detalle: "Tiempo de recuperación menor a 30s medido explícitamente.", puntos: 50 },
            { nivel: "Aceptable", detalle: "Menciona disponibilidad pero sin umbral de tiempo.", puntos: 30 },
            { nivel: "Insuficiente", detalle: "Incompleto.", puntos: 10 },
          ],
        },
        {
          id: "act_r2",
          descripcion: "Táctica de Redundancia o Conmutación por Error (Failover)",
          puntaje_max: 50,
          indicadores: [
            { nivel: "Excelente", detalle: "Explica réplica activa-pasiva con sincronización.", puntos: 50 },
            { nivel: "Aceptable", detalle: "Solo menciona 'poner otro servidor'.", puntos: 25 },
            { nivel: "Insuficiente", detalle: "Sin táctica identificable.", puntos: 0 },
          ],
        },
      ],
    },
  ],
  estudiantes_excel: INITIAL_STUDENTS_ROSTER.filter((s) => s.seccionId === "sec_1").map((st) => ({
    canvas_id: st.canvas_id,
    rut: st.rut,
    apellidos: st.apellidos,
    nombres: st.nombres,
    email: st.email,
    solemne_1: Number((5.0 + ((st.canvas_id % 20) / 10)).toFixed(1)),
    decimas_act1: (st.canvas_id % 3 === 0) ? 0.3 : 0.0,
    solemne_1_final: Number((5.0 + ((st.canvas_id % 20) / 10)).toFixed(1)),
    solemne_2: Number((5.2 + ((st.canvas_id % 15) / 10)).toFixed(1)),
    taller_proyecto: Number((5.8 + ((st.canvas_id % 12) / 10)).toFixed(1)),
    asistencia_pct: 85 + (st.canvas_id % 15),
    nota_final: 5.7,
    estado_curso: "Aprobado",
  })),
  entregas_alumnos: [
    {
      id: "sub_1",
      deliverable_id: "deliv_act1",
      estudiante_id: 29248,
      estudiante_nombre: "Benjamín Morales Pizarro",
      fecha_entrega: "2026-09-25 18:30",
      archivo_nombre: "solucion_ayudantia1_morales.pdf",
      texto_solucion:
        "Para el sistema bancario, definimos el estímulo como la caída no programada del nodo transaccional primario bajo carga normal (1.000 req/s). Se aplica la táctica de Réplica Activa-Caliente con Heartbeat cada 500ms. En caso de timeout en 3 pulsos sucesivos, el balanceador de carga redirige el tráfico al nodo secundario sincronizado vía streaming WAL. La medida de respuesta es que el RTO (Recovery Time Objective) es de exactamente 1.8 segundos, sin pérdida de transacciones confirmadas (RPO=0).",
      estado: "pre_revisada_ia",
      nota_sugerida: 6.8,
      decimas_sugeridas: 0.3,
      feedback_ia: {
        resumen:
          "Excelente entrega. Cumple a cabalidad con la especificación formal del escenario y fundamenta técnicamente la táctica de failover con métricas RTO y RPO cuantificables.",
        criterios_evaluados: [
          {
            criterio: "Estructura formal del escenario (Estímulo y Medida)",
            puntaje_obtenido: 50,
            puntaje_max: 50,
            cita_textual:
              "El RTO (Recovery Time Objective) es de exactamente 1.8 segundos, sin pérdida de transacciones confirmadas (RPO=0).",
            comentario: "Métrica objetiva y verificable conforme a los estándares de la cátedra UDP.",
          },
          {
            criterio: "Táctica de Redundancia o Conmutación por Error",
            puntaje_obtenido: 48,
            puntaje_max: 50,
            cita_textual:
              "Se aplica la táctica de Réplica Activa-Caliente con Heartbeat cada 500ms... sincronizado vía streaming WAL.",
            comentario: "Táctica bien elegida y explicada con rigor técnico.",
          },
        ],
        sugerencias_mejora: [
          "Podrías añadir cómo se maneja la consistencia de caché local en el nodo secundario al activarse.",
        ],
      },
    },
  ],
};

const GRADES_STORAGE_PREFIX = "udp_course_grades_";

/**
 * Obtiene las notas anonimizadas del curso desde localStorage o retorna las notas base.
 */
export function getStoredCourseGrades(courseCode: string): StudentExcelRow[] {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(`${GRADES_STORAGE_PREFIX}${courseCode}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Error loading course grades", e);
    }
  }

  const codeUpper = (courseCode || "").toUpperCase();
  const matched = INITIAL_STUDENTS_ROSTER.filter(
    (s) =>
      s.codigo === courseCode ||
      s.seccionId === courseCode ||
      (codeUpper.includes("CA01") && s.seccionId === "sec_1") ||
      (codeUpper.includes("CA02") && s.seccionId === "sec_2") ||
      (codeUpper.includes("CA03") && s.seccionId === "sec_3") ||
      (codeUpper.includes("3100") && s.seccionId === "sec_arq_emergentes")
  );

  const baseList = matched.length > 0 ? matched : INITIAL_STUDENTS_ROSTER.filter((s) => s.seccionId === "sec_1");

  return baseList.map((st) => ({
    canvas_id: st.canvas_id,
    rut: st.rut,
    apellidos: st.apellidos,
    nombres: st.nombres,
    email: st.email,
    solemne_1: Number((5.0 + ((st.canvas_id % 20) / 10)).toFixed(1)),
    decimas_act1: (st.canvas_id % 3 === 0) ? 0.3 : 0.0,
    solemne_1_final: Number((5.0 + ((st.canvas_id % 20) / 10)).toFixed(1)),
    solemne_2: Number((5.2 + ((st.canvas_id % 15) / 10)).toFixed(1)),
    taller_proyecto: Number((5.8 + ((st.canvas_id % 12) / 10)).toFixed(1)),
    asistencia_pct: 85 + (st.canvas_id % 15),
    nota_final: 5.7,
    estado_curso: "Aprobado",
  }));
}

/**
 * Guarda las notas anonimizadas del curso en localStorage para sincronización en tiempo real
 * con la vista pública de alumnos.
 */
export function saveStoredCourseGrades(courseCode: string, grades: StudentExcelRow[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${GRADES_STORAGE_PREFIX}${courseCode}`, JSON.stringify(grades));
    window.dispatchEvent(new Event("udp_grades_updated"));
  } catch (e) {
    console.error("Error saving course grades", e);
  }
}

