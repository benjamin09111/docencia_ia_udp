import {
  AgentPerillas,
  CourseDeliverable,
  CourseScheduleClass,
  StudentExcelRow,
  StudentSubmission,
} from "@/types";

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
  estudiantes_excel: [
    {
      canvas_id: 29248,
      rut: "20.481.932-8",
      apellidos: "Morales Pizarro",
      nombres: "Benjamín",
      email: "benjamin.morales3@mail.udp.cl",
      solemne_1: 5.7,
      decimas_act1: 0.3,
      solemne_1_final: 6.0,
      solemne_2: 5.9,
      taller_proyecto: 6.5,
      asistencia_pct: 92,
      nota_final: 6.2,
      estado_curso: "Aprobado",
    },
    {
      canvas_id: 31021,
      rut: "21.109.845-K",
      apellidos: "Barrera Jorquera",
      nombres: "Víctor Vicente",
      email: "victor.barrera@mail.udp.cl",
      solemne_1: 5.4,
      decimas_act1: 0.3,
      solemne_1_final: 5.7,
      solemne_2: 5.8,
      taller_proyecto: 6.3,
      asistencia_pct: 88,
      nota_final: 5.9,
      estado_curso: "Aprobado",
    },
    {
      canvas_id: 32415,
      rut: "20.912.433-4",
      apellidos: "Salinas Herrera",
      nombres: "Laura Francisca",
      email: "laura.salinas1@mail.udp.cl",
      solemne_1: 6.2,
      decimas_act1: 0.3,
      solemne_1_final: 6.5,
      solemne_2: 6.0,
      taller_proyecto: 6.8,
      asistencia_pct: 95,
      nota_final: 6.5,
      estado_curso: "Aprobado",
    },
    {
      canvas_id: 33890,
      rut: "20.765.231-1",
      apellidos: "Alvarado Vivanco",
      nombres: "Francisco",
      email: "francisco.alvarado1@mail.udp.cl",
      solemne_1: 4.8,
      decimas_act1: 0.3,
      solemne_1_final: 5.1,
      solemne_2: 5.2,
      taller_proyecto: 5.8,
      asistencia_pct: 84,
      nota_final: 5.3,
      estado_curso: "Aprobado",
    },
    {
      canvas_id: 34112,
      rut: "21.345.678-9",
      apellidos: "Tapia González",
      nombres: "Camila Ignacia",
      email: "camila.tapia@mail.udp.cl",
      solemne_1: 3.8,
      decimas_act1: 0.0,
      solemne_1_final: 3.8,
      solemne_2: 4.2,
      taller_proyecto: 4.5,
      asistencia_pct: 78,
      nota_final: 4.1,
      estado_curso: "Aprobado",
    },
  ],
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
  const codeUpper = (courseCode || "").toUpperCase();
  const isArqSoft = codeUpper.includes("CIT3000") || codeUpper.includes("3000") || codeUpper === "41210" || codeUpper.includes("ARQ_SOFT");

  const mockArqSoftStudents: StudentExcelRow[] = [
    { canvas_id: 50001, rut: "21.501.001-1", apellidos: "Silva Araya", nombres: "Mateo Ignacio", email: "mateo.silva@mail.udp.cl", solemne_1: 5.8, decimas_act1: 0.4, solemne_1_final: 6.2, solemne_2: 6.0, taller_proyecto: 6.5, asistencia_pct: 90, nota_final: 6.3, estado_curso: "Aprobado" },
    { canvas_id: 50002, rut: "21.502.002-2", apellidos: "Vera Morales", nombres: "Valentina Paz", email: "valentina.vera@mail.udp.cl", solemne_1: 6.2, decimas_act1: 0.2, solemne_1_final: 6.4, solemne_2: 6.5, taller_proyecto: 6.8, asistencia_pct: 100, nota_final: 6.6, estado_curso: "Aprobado" },
    { canvas_id: 50003, rut: "20.503.003-3", apellidos: "Araya Castro", nombres: "Tomás Andrés", email: "tomas.araya@mail.udp.cl", solemne_1: 3.5, decimas_act1: 0.0, solemne_1_final: 3.5, solemne_2: 3.8, taller_proyecto: 4.2, asistencia_pct: 60, nota_final: 3.8, estado_curso: "Reprobado" },
    { canvas_id: 50004, rut: "21.504.004-4", apellidos: "Castro Paredes", nombres: "Sofía Isabel", email: "sofia.castro@mail.udp.cl", solemne_1: 5.0, decimas_act1: 0.6, solemne_1_final: 5.6, solemne_2: 5.4, taller_proyecto: 5.9, asistencia_pct: 85, nota_final: 5.6, estado_curso: "Aprobado" },
    { canvas_id: 50005, rut: "20.505.005-5", apellidos: "Morales Rojas", nombres: "Lucas Benjamín", email: "lucas.morales@mail.udp.cl", solemne_1: 4.2, decimas_act1: 0.2, solemne_1_final: 4.4, solemne_2: 4.8, taller_proyecto: 5.0, asistencia_pct: 80, nota_final: 4.7, estado_curso: "Aprobado" },
  ];

  if (typeof window === "undefined") {
    return isArqSoft ? mockArqSoftStudents : initialCourseData.estudiantes_excel;
  }
  try {
    const raw = localStorage.getItem(`${GRADES_STORAGE_PREFIX}${courseCode}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Error loading course grades", e);
  }
  return isArqSoft ? mockArqSoftStudents : initialCourseData.estudiantes_excel;
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

