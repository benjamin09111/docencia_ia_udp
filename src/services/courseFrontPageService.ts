export interface CourseDocenteInfo {
  nombre: string;
  rol: "Profesor Titular" | "Profesor Co-Docente" | "Ayudante de Cátedra" | "Coordinador";
  email: string;
  horarioAtencion: string;
  salaAtencion?: string;
  avatarUrl?: string;
}

export interface CourseEvaluationItem {
  id: string;
  nombre: string;
  ponderacion: string;
  fechaEstimada: string;
  caracter: "Individual" | "Grupal";
  descripcion: string;
}

export interface CourseScheduleWeek {
  semana: number;
  fechas: string;
  temaCatedra: string;
  temaAyudantia: string;
  hitoEvaluacion?: string;
}

export interface CourseFrontPageData {
  courseId: number;
  courseCode: string;
  courseName: string;
  facultad: string;
  escuela: string;
  semestre: string;
  creditos: number;
  descripcionBienvenida: string;
  objetivosPrincipales: string[];
  docentes: CourseDocenteInfo[];
  reglasAsistencia: {
    porcentajeMinimo: number;
    politicaJustificacion: string;
    modalidadToma: string;
    consecuenciaReprobacion: string;
  };
  sistemaEvaluacion: {
    formulaVisual: string;
    explicacionFormula: string;
    notaMinimaAprobacion: number;
    notaMinimaEximicion?: number;
    items: CourseEvaluationItem[];
  };
  cronograma: CourseScheduleWeek[];
  politicaIA: {
    permitido: boolean;
    nivel: string;
    declaracion: string;
  };
  enlacesRapidos: {
    nombre: string;
    url: string;
    descripcion: string;
  }[];
  canvasWikiPageTitle: string;
  lastSyncedAt?: string;
  canvasPageUrl?: string;
}

// Plantillas oficiales pre-configuradas según el descriptor UDP y programa oficial
export function getDefaultFrontPageData(courseId: number, courseCode: string, courseName: string): CourseFrontPageData {
  const isCIT3203 = courseCode.includes("CIT3203") || courseName.toUpperCase().includes("TICS II");
  const isCIT2206 = courseCode.includes("CIT2206") || courseName.toUpperCase().includes("GESTIÓN");
  const isCIT3100 = courseCode.includes("CIT3100") || courseName.toUpperCase().includes("ARQUITECTURAS");

  const professorName = courseCode.includes("CA03")
    ? "Prof. Leandro Lanza"
    : "Prof. Jorge Esteban Cruz León";

  if (isCIT3203) {
    return {
      courseId,
      courseCode,
      courseName: "Proyecto en TICs II",
      facultad: "Facultad de Ingeniería y Ciencias",
      escuela: "Escuela de Informática y Telecomunicaciones",
      semestre: "2026-02 Semestre Primavera",
      creditos: 6,
      descripcionBienvenida:
        "Bienvenidos a Proyecto en TICs II. Esta asignatura capstone permite a los y las estudiantes integrar conocimientos de ingeniería de software, arquitectura de sistemas y gestión ágil de proyectos mediante el desarrollo colaborativo de una solución tecnológica real con un mandante externo, guiados por los estándares PMBOK 7ma Edición y marcos ágiles.",
      objetivosPrincipales: [
        "Identificar y modelar una problemática tecnológica compleja con usuarios reales.",
        "Planificar, costear y gestionar riesgos según los 12 principios rectores de la Guía PMBOK 7.",
        "Construir y desplegar un Producto Mínimo Viable (MVP) con arquitectura cloud escalable.",
        "Defender técnicamente los resultados y lecciones aprendidas ante comisión evaluadora.",
      ],
      docentes: [
        {
          nombre: professorName,
          rol: "Profesor Titular",
          email: courseCode.includes("CA03") ? "leandro.lanza@mail.udp.cl" : "jorge.cruz@mail.udp.cl",
          horarioAtencion: "Lunes y Miércoles 16:30 - 17:30 (Previa coordinación)",
          salaAtencion: "Oficina Docente Edificio EIT, Toesca 1780",
        },
        {
          nombre: "Equipo de Ayudantía EIT",
          rol: "Ayudante de Cátedra",
          email: "ayudantia.tics2@mail.udp.cl",
          horarioAtencion: "Miércoles 16:00 - 17:20",
          salaAtencion: "Laboratorio EIT / Canal Teams UDP",
        },
      ],
      reglasAsistencia: {
        porcentajeMinimo: 75,
        politicaJustificacion:
          "Las inasistencias por motivos de salud deben justificarse exclusivamente en Secretaría Académica de la Facultad dentro de un plazo máximo de 5 días hábiles con certificado médico oficial visado.",
        modalidadToma:
          "Registro oficial automatizado mediante Código PIN rotativo / QR en aula en cada cátedra y ayudantía presencial.",
        consecuenciaReprobacion:
          "Una asistencia inferior al 75% sin justificación reglamentaria impide la presentación a examen o aprobación del taller.",
      },
      sistemaEvaluacion: {
        formulaVisual: "NP = (S1 · 0.30 + S2 · 0.30 + NT · 0.10) / 0.70",
        explicacionFormula:
          "La Nota de Presentación (NP) pondera las evaluaciones teóricas (60%) y talleres prácticos (10%) normalizados al 70%. En modalidad capstone de taller, los 5 hitos entregables ponderan 20% cada uno.",
        notaMinimaAprobacion: 4.0,
        notaMinimaEximicion: 5.5,
        items: [
          {
            id: "ev_1",
            nombre: "Hito 1: Presentación e Informe Inicial (Alcance y Mandante)",
            ponderacion: "20%",
            fechaEstimada: "10 de Abril, 2026",
            caracter: "Grupal",
            descripcion: "Definición del problema, actores clave y arquitectura de alto nivel.",
          },
          {
            id: "ev_2",
            nombre: "Hito 2: Solemne Teórica (PMBOK 7 & RAPs)",
            ponderacion: "20%",
            fechaEstimada: "15 de Mayo, 2026",
            caracter: "Individual",
            descripcion: "Evaluación individual sobre fundamentos PMBOK y gestión de alcance.",
          },
          {
            id: "ev_3",
            nombre: "Hito 3: Reporte de Avance 1 (WBS y Backlog Priorizado)",
            ponderacion: "20%",
            fechaEstimada: "29 de Mayo, 2026",
            caracter: "Grupal",
            descripcion: "Modelado de procesos, estimación y matriz de riesgos inicial.",
          },
          {
            id: "ev_4",
            nombre: "Hito 4: Reporte de Avance 2 (MVP y Pruebas de Integración)",
            ponderacion: "20%",
            fechaEstimada: "26 de Junio, 2026",
            caracter: "Grupal",
            descripcion: "Prototipo funcional operativo desplegado en ambiente de pruebas.",
          },
          {
            id: "ev_5",
            nombre: "Hito 5: Presentación Final, Demo en Vivo y Reporte Escrito",
            ponderacion: "20%",
            fechaEstimada: "10 de Julio, 2026",
            caracter: "Grupal",
            descripcion: "Defensa oral en la Feria de Proyectos TIC ante comisión y mandante.",
          },
        ],
      },
      cronograma: [
        { semana: 1, fechas: "10 Ago - 14 Ago", temaCatedra: "Introducción al curso, conformación de equipos y selección de mandantes", temaAyudantia: "Setup de repositorios GitHub y herramientas colaborativas" },
        { semana: 2, fechas: "17 Ago - 21 Ago", temaCatedra: "Levantamiento de requerimientos y modelado de dominio", temaAyudantia: "Taller de User Stories y Criterios de Aceptación" },
        { semana: 3, fechas: "24 Ago - 28 Ago", temaCatedra: "Arquitectura de Software y trade-offs técnicos", temaAyudantia: "Diagramas C4 y decisiones arquitectónicas" },
        { semana: 4, fechas: "31 Ago - 04 Sep", temaCatedra: "12 Principios PMBOK 7ma Edición y dominios de desempeño", temaAyudantia: "Revisión preliminar de Informe Inicial", hitoEvaluacion: "Entrega Hito 1" },
        { semana: 5, fechas: "07 Sep - 11 Sep", temaCatedra: "Gestión de Riesgos, Matriz de Severidad y Mitigación", temaAyudantia: "Simulación de Planning Poker y Fibonacci" },
        { semana: 6, fechas: "14 Sep - 18 Sep", temaCatedra: "Semana Fiestas Patrias (Receso Académico)", temaAyudantia: "Receso Académico UDP" },
        { semana: 7, fechas: "21 Sep - 25 Sep", temaCatedra: "Calidad de software, pruebas automatizadas y CI/CD", temaAyudantia: "Configuración de GitHub Actions y pipelines" },
        { semana: 8, fechas: "28 Sep - 02 Oct", temaCatedra: "Preparación para Solemne Teórica y resolución de dudas", temaAyudantia: "Taller socrático de estudio PMBOK", hitoEvaluacion: "Solemne Teórica" },
        { semana: 9, fechas: "05 Oct - 09 Oct", temaCatedra: "Adquisiciones, contratos y licenciamiento de software", temaAyudantia: "Retroalimentación Solemne y corrección" },
        { semana: 10, fechas: "12 Oct - 16 Oct", temaCatedra: "Desarrollo del MVP y pruebas de integración", temaAyudantia: "Revisión de Avance 1 con ayudantes", hitoEvaluacion: "Entrega Hito 3" },
        { semana: 11, fechas: "19 Oct - 23 Oct", temaCatedra: "Observabilidad, métricas operacionales y SLA", temaAyudantia: "Logging y monitoreo con herramientas cloud" },
        { semana: 12, fechas: "26 Oct - 30 Oct", temaCatedra: "Métricas ágiles: Velocity, Burndown y Throughput", temaAyudantia: "Taller de preparación MVP funcional" },
        { semana: 13, fechas: "02 Nov - 06 Nov", temaCatedra: "Despliegue a producción y pruebas con usuarios reales", temaAyudantia: "Testing de carga y validación", hitoEvaluacion: "Entrega Hito 4 (MVP)" },
        { semana: 14, fechas: "09 Nov - 13 Nov", temaCatedra: "Estrategias de comunicación efectiva y oratoria técnica", temaAyudantia: "Ensayos de pitch y defensa oral" },
        { semana: 15, fechas: "16 Nov - 20 Nov", temaCatedra: "Feria de Proyectos TIC UDP: Defensas Finales", temaAyudantia: "Evaluación de software desplegado", hitoEvaluacion: "Presentación Final (Hito 5)" },
        { semana: 16, fechas: "23 Nov - 27 Nov", temaCatedra: "Cierre de actas oficiales, apelaciones y notas finales", temaAyudantia: "Cierre semestral" },
      ],
      politicaIA: {
        permitido: true,
        nivel: "Permitido como copiloto de aprendizaje con declaración obligatoria de uso",
        declaracion:
          "Se fomenta activamente el uso de herramientas de Inteligencia Artificial (ChatGPT, GitHub Copilot, Claude) como asistentes para ideación, depuración y exploración conceptual. Todo código o documento asistido por IA debe ser transparentado y comprendido en su totalidad por el estudiante. En instancias de evaluación individual oral o solemne escrita, la defensa conceptual es de autoría personal e indelegable.",
      },
      enlacesRapidos: [
        { nombre: "Tareas y Entregables Canvas", url: "#assignments", descripcion: "Acceso directo a las pautas y buzones de entrega." },
        { nombre: "Anuncios Oficiales de la Cátedra", url: "#announcements", descripcion: "Comunicaciones semanales de los profesores." },
        { nombre: "Foro de Consultas y Dudas", url: "#discussions", descripcion: "Canal asíncrono para dudas de talleres y proyectos." },
        { nombre: "Portal de Asistencia UDP", url: `/asistencia/${courseCode}`, descripcion: "Consulta tu porcentaje de asistencia en tiempo real." },
      ],
      canvasWikiPageTitle: "Inicio - Proyecto en TICs II (CIT3203)",
    };
  }

  // Plantilla general para otros cursos de la Facultad
  return {
    courseId,
    courseCode,
    courseName,
    facultad: "Facultad de Ingeniería y Ciencias",
    escuela: "Escuela de Informática y Telecomunicaciones",
    semestre: "2026-02 Semestre Primavera",
    creditos: 6,
    descripcionBienvenida: `Bienvenidos al curso ${courseName} (${courseCode}). Esta página de inicio centraliza toda la información académica esencial del semestre: reglas de asistencia, sistema de evaluación y cronograma oficial.`,
    objetivosPrincipales: [
      "Comprender los fundamentos teóricos y metodológicos de la disciplina.",
      "Aplicar estándares profesionales de ingeniería en la resolución de problemas.",
      "Desarrollar pensamiento crítico y capacidad de trabajo en equipo.",
    ],
    docentes: [
      {
        nombre: professorName,
        rol: "Profesor Titular",
        email: "docente.udp@mail.udp.cl",
        horarioAtencion: "Previa coordinación por correo institucional",
        salaAtencion: "Edificio EIT Toesca 1780",
      },
    ],
    reglasAsistencia: {
      porcentajeMinimo: 75,
      politicaJustificacion:
        "Justificaciones médicas a través de Secretaría Académica en un plazo de 5 días hábiles.",
      modalidadToma: "Registro oficial con Código PIN y QR institucional.",
      consecuenciaReprobacion: "Asistencia inferior al 75% condiciona la situación académica del curso.",
    },
    sistemaEvaluacion: {
      formulaVisual: "NP = (S1 · 0.30 + S2 · 0.30 + NT · 0.10) / 0.70",
      explicacionFormula:
        "La Nota de Presentación (NP) se calcula con base en Solemnes (60%) y Talleres (10%) normalizado al 70%. Examen final pondera el 30% restante.",
      notaMinimaAprobacion: 4.0,
      notaMinimaEximicion: 5.5,
      items: [
        { id: "ev_1", nombre: "Solemne 1", ponderacion: "30%", fechaEstimada: "Semana 8", caracter: "Individual", descripcion: "Evaluación teórica parcial." },
        { id: "ev_2", nombre: "Solemne 2", ponderacion: "30%", fechaEstimada: "Semana 14", caracter: "Individual", descripcion: "Evaluación acumulativa semestral." },
        { id: "ev_3", nombre: "Talleres y Laboratorios", ponderacion: "10%", fechaEstimada: "Semanal", caracter: "Grupal", descripcion: "Ejercicios prácticos en ayudantía." },
      ],
    },
    cronograma: [
      { semana: 1, fechas: "Semana 1", temaCatedra: "Presentación del curso e introducción temática", temaAyudantia: "Sesión inicial de laboratorio" },
      { semana: 8, fechas: "Semana 8", temaCatedra: "Solemne 1 de Cátedra", temaAyudantia: "Resolución de ejercicios", hitoEvaluacion: "Solemne 1" },
      { semana: 14, fechas: "Semana 14", temaCatedra: "Solemne 2 de Cátedra", temaAyudantia: "Revisión general", hitoEvaluacion: "Solemne 2" },
      { semana: 16, fechas: "Semana 16", temaCatedra: "Cierre de notas y promedios finales", temaAyudantia: "Cierre semestral" },
    ],
    politicaIA: {
      permitido: true,
      nivel: "Permitido como herramienta de apoyo con citación obligatoria",
      declaracion: "El uso de IA generativa está permitido para apoyar el aprendizaje, siempre que el alumno declare explícitamente su utilización.",
    },
    enlacesRapidos: [
      { nombre: "Tareas y Evaluaciones Canvas", url: "#assignments", descripcion: "Buzones oficiales de entrega." },
      { nombre: "Anuncios Oficiales", url: "#announcements", descripcion: "Comunicaciones y avisos del curso." },
    ],
    canvasWikiPageTitle: `Inicio - ${courseName}`,
  };
}

// Generador de HTML Canvas Rico e Institucional
// Utiliza etiquetas y estilos compatibles con el visor de páginas Wiki de Canvas Instructure
export function generateCanvasHomePageHtml(data: CourseFrontPageData): string {
  const docentesHtml = data.docentes
    .map(
      (d) => `
    <div style="background-color: #ffffff; border: 1px solid #E0E3E6; border-left: 4px solid #C8102E; border-radius: 4px; padding: 14px; margin-bottom: 10px;">
      <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap;">
        <strong style="color: #2D3B45; font-size: 15px;">${d.nombre}</strong>
        <span style="background-color: #F5F6F8; color: #55636E; font-size: 11px; padding: 2px 8px; border-radius: 3px; font-weight: bold; border: 1px solid #E0E3E6;">${d.rol}</span>
      </div>
      <div style="color: #55636E; font-size: 13px; margin-top: 6px; line-height: 1.5;">
        <div>✉️ <strong>Correo:</strong> <a href="mailto:${d.email}" style="color: #008EE2; text-decoration: none;">${d.email}</a></div>
        <div>⏰ <strong>Atención:</strong> ${d.horarioAtencion}</div>
        ${d.salaAtencion ? `<div>📍 <strong>Ubicación:</strong> ${d.salaAtencion}</div>` : ""}
      </div>
    </div>`
    )
    .join("");

  const evalItemsHtml = data.sistemaEvaluacion.items
    .map(
      (item) => `
    <tr style="border-bottom: 1px solid #E0E3E6;">
      <td style="padding: 10px 12px; font-weight: bold; color: #2D3B45; font-size: 13px;">${item.nombre}</td>
      <td style="padding: 10px 12px; text-align: center;">
        <span style="background-color: #FFEBEE; color: #C8102E; font-weight: bold; font-size: 12px; padding: 3px 8px; border-radius: 3px; border: 1px solid #FFCDD2;">${item.ponderacion}</span>
      </td>
      <td style="padding: 10px 12px; color: #55636E; font-size: 12px;">${item.fechaEstimada}</td>
      <td style="padding: 10px 12px; color: #55636E; font-size: 12px;">${item.caracter}</td>
      <td style="padding: 10px 12px; color: #6B7780; font-size: 12px;">${item.descripcion}</td>
    </tr>`
    )
    .join("");

  const cronogramaRowsHtml = data.cronograma
    .slice(0, 16)
    .map(
      (c) => `
    <tr style="border-bottom: 1px solid #E0E3E6; ${c.hitoEvaluacion ? "background-color: #FFF9E6;" : ""}">
      <td style="padding: 8px 10px; font-weight: bold; text-align: center; color: #2D3B45; font-size: 12px;">Semana ${c.semana}</td>
      <td style="padding: 8px 10px; color: #6B7780; font-size: 12px; font-family: monospace;">${c.fechas}</td>
      <td style="padding: 8px 10px; color: #2D3B45; font-size: 12px;">${c.temaCatedra}</td>
      <td style="padding: 8px 10px; color: #55636E; font-size: 12px;">${c.temaAyudantia}</td>
      <td style="padding: 8px 10px; text-align: center;">
        ${
          c.hitoEvaluacion
            ? `<span style="background-color: #C8102E; color: #ffffff; font-weight: bold; font-size: 11px; padding: 2px 6px; border-radius: 3px;">${c.hitoEvaluacion}</span>`
            : `<span style="color: #A0AAB2; font-size: 11px;">—</span>`
        }
      </td>
    </tr>`
    )
    .join("");

  const objetivosListHtml = data.objetivosPrincipales
    .map((obj) => `<li style="margin-bottom: 6px; color: #2D3B45; font-size: 13px;">${obj}</li>`)
    .join("");

  return `
<!-- INICIO DE PÁGINA OFICIAL UDP (CANVAS LMS) -->
<div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #2D3B45; max-width: 1000px; margin: 0 auto; line-height: 1.6;">

  <!-- ENCABEZADO INSTITUCIONAL UDP -->
  <div style="background: linear-gradient(135deg, #2D3B45 0%, #1A2328 100%); color: #ffffff; border-radius: 6px; padding: 24px 28px; margin-bottom: 24px; border-left: 6px solid #C8102E; box-shadow: 0 2px 4px rgba(0,0,0,0.08);">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 8px;">
      <span style="font-size: 12px; font-weight: bold; letter-spacing: 0.8px; text-transform: uppercase; color: #E0E3E6;">
        UNIVERSIDAD DIEGO PORTALES • ${data.facultad.toUpperCase()}
      </span>
      <span style="background-color: #C8102E; color: #ffffff; font-size: 11px; font-weight: bold; padding: 3px 10px; border-radius: 3px; font-family: monospace;">
        ${data.semestre}
      </span>
    </div>
    <h1 style="font-size: 26px; font-weight: 800; margin: 6px 0; color: #ffffff; letter-spacing: -0.3px;">
      ${data.courseName}
    </h1>
    <div style="display: flex; gap: 14px; flex-wrap: wrap; font-size: 13px; color: #C7CDD1; margin-top: 8px;">
      <span><strong>Código:</strong> <span style="font-family: monospace; color: #ffffff;">${data.courseCode}</span></span>
      <span>•</span>
      <span><strong>Escuela:</strong> ${data.escuela}</span>
      <span>•</span>
      <span><strong>Créditos:</strong> ${data.creditos} SCT</span>
    </div>
  </div>

  <!-- TARJETA DE BIENVENIDA Y RESUMEN DEL CURSO -->
  <div style="background-color: #ffffff; border: 1px solid #E0E3E6; border-radius: 6px; padding: 20px 24px; margin-bottom: 22px;">
    <h2 style="font-size: 17px; font-weight: 700; color: #2D3B45; margin-top: 0; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
      📖 Bienvenida y Propósito del Curso
    </h2>
    <p style="color: #55636E; font-size: 14px; line-height: 1.7; margin-bottom: 14px;">
      ${data.descripcionBienvenida}
    </p>
    <div style="background-color: #F8F9FA; border-left: 3px solid #008EE2; padding: 12px 16px; border-radius: 0 4px 4px 0;">
      <strong style="color: #2D3B45; font-size: 13px; display: block; margin-bottom: 6px;">Resultados de Aprendizaje Principales (RAPs):</strong>
      <ul style="margin: 0; padding-left: 20px;">
        ${objetivosListHtml}
      </ul>
    </div>
  </div>

  <!-- EQUIPO DOCENTE -->
  <div style="margin-bottom: 22px;">
    <h2 style="font-size: 17px; font-weight: 700; color: #2D3B45; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
      👨‍🏫 Equipo Docente y Canales de Atención
    </h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 12px;">
      ${docentesHtml}
    </div>
  </div>

  <!-- REGLAMENTO Y POLÍTICA DE ASISTENCIA -->
  <div style="background-color: #ffffff; border: 1px solid #E0E3E6; border-radius: 6px; padding: 20px 24px; margin-bottom: 22px;">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; margin-bottom: 12px;">
      <h2 style="font-size: 17px; font-weight: 700; color: #2D3B45; margin: 0; display: flex; align-items: center; gap: 8px;">
        ✅ Asistencia Oficial Requerida
      </h2>
      <span style="background-color: #E8F5E9; color: #2E7D32; font-weight: 800; font-size: 13px; padding: 4px 10px; border-radius: 4px; border: 1px solid #C8E6C9;">
        Mínimo Obligatorio: ${data.reglasAsistencia.porcentajeMinimo}%
      </span>
    </div>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; font-size: 13px;">
      <div style="background-color: #F8F9FA; padding: 12px 14px; border-radius: 4px; border: 1px solid #E0E3E6;">
        <strong style="color: #2D3B45; display: block; margin-bottom: 4px;">📲 Modalidad de Registro:</strong>
        <p style="color: #55636E; margin: 0; line-height: 1.5;">${data.reglasAsistencia.modalidadToma}</p>
      </div>
      <div style="background-color: #F8F9FA; padding: 12px 14px; border-radius: 4px; border: 1px solid #E0E3E6;">
        <strong style="color: #2D3B45; display: block; margin-bottom: 4px;">🏥 Justificación de Inasistencias:</strong>
        <p style="color: #55636E; margin: 0; line-height: 1.5;">${data.reglasAsistencia.politicaJustificacion}</p>
      </div>
    </div>
    <p style="margin-top: 10px; margin-bottom: 0; font-size: 12px; color: #C62828; font-weight: 500;">
      ⚠️ <em>${data.reglasAsistencia.consecuenciaReprobacion}</em>
    </p>
  </div>

  <!-- SISTEMA DE EVALUACIÓN Y PONDERACIONES -->
  <div style="background-color: #ffffff; border: 1px solid #E0E3E6; border-radius: 6px; padding: 20px 24px; margin-bottom: 22px;">
    <h2 style="font-size: 17px; font-weight: 700; color: #2D3B45; margin-top: 0; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
      📊 Sistema de Evaluación y Ponderaciones
    </h2>

    <!-- FÓRMULA OFICIAL VISUAL -->
    <div style="background-color: #F5F6F8; border: 1px solid #E0E3E6; border-radius: 4px; padding: 14px; text-align: center; margin-bottom: 16px;">
      <div style="font-size: 15px; font-weight: bold; color: #2D3B45; font-family: monospace;">
        Fórmula de Presentación: <span style="background-color: #ffffff; padding: 4px 10px; border-radius: 4px; border: 1px solid #C7CDD1; color: #008EE2;">${data.sistemaEvaluacion.formulaVisual}</span>
      </div>
      <div style="font-size: 12px; color: #6B7780; margin-top: 6px;">
        ${data.sistemaEvaluacion.explicacionFormula}
      </div>
    </div>

    <!-- TABLA DE EVALUACIONES -->
    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
        <thead>
          <tr style="background-color: #F5F6F8; border-bottom: 2px solid #C7CDD1; font-size: 11px; text-transform: uppercase; color: #55636E;">
            <th style="padding: 8px 12px;">Evaluación / Hito</th>
            <th style="padding: 8px 12px; text-align: center;">Ponderación</th>
            <th style="padding: 8px 12px;">Fecha Estimada</th>
            <th style="padding: 8px 12px;">Modalidad</th>
            <th style="padding: 8px 12px;">Alcance</th>
          </tr>
        </thead>
        <tbody>
          ${evalItemsHtml}
        </tbody>
      </table>
    </div>

    <div style="margin-top: 12px; display: flex; gap: 16px; font-size: 12px; color: #55636E; flex-wrap: wrap;">
      <span><strong>Nota Mínima de Aprobación:</strong> ${data.sistemaEvaluacion.notaMinimaAprobacion.toFixed(1)}</span>
      ${
        data.sistemaEvaluacion.notaMinimaEximicion
          ? `<span>•</span><span><strong>Nota Mínima de Eximición de Examen:</strong> ${data.sistemaEvaluacion.notaMinimaEximicion.toFixed(1)}</span>`
          : ""
      }
    </div>
  </div>

  <!-- CRONOGRAMA SEMANAL -->
  <div style="background-color: #ffffff; border: 1px solid #E0E3E6; border-radius: 6px; padding: 20px 24px; margin-bottom: 22px;">
    <h2 style="font-size: 17px; font-weight: 700; color: #2D3B45; margin-top: 0; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
      🗓️ Cronograma Semanal y Fechas Clave
    </h2>
    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
        <thead>
          <tr style="background-color: #F5F6F8; border-bottom: 2px solid #C7CDD1; font-size: 11px; text-transform: uppercase; color: #55636E;">
            <th style="padding: 8px 10px; text-align: center; width: 85px;">Semana</th>
            <th style="padding: 8px 10px; width: 120px;">Fechas</th>
            <th style="padding: 8px 10px;">Cátedra</th>
            <th style="padding: 8px 10px;">Ayudantía / Laboratorio</th>
            <th style="padding: 8px 10px; text-align: center; width: 120px;">Hito</th>
          </tr>
        </thead>
        <tbody>
          ${cronogramaRowsHtml}
        </tbody>
      </table>
    </div>
  </div>

  <!-- POLÍTICA OFICIAL DE USO DE INTELIGENCIA ARTIFICIAL UDP -->
  <div style="background-color: #F0F7FF; border: 1px solid #BEE3F8; border-left: 4px solid #008EE2; border-radius: 4px; padding: 16px 20px; margin-bottom: 22px;">
    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; margin-bottom: 6px;">
      <strong style="color: #008EE2; font-size: 14px;">🤖 Política de Uso de Inteligencia Artificial (IA Generativa)</strong>
      <span style="background-color: #ffffff; color: #008EE2; font-size: 11px; font-weight: bold; padding: 2px 8px; border-radius: 3px; border: 1px solid #BEE3F8;">
        ${data.politicaIA.nivel}
      </span>
    </div>
    <p style="color: #2D3B45; font-size: 13px; line-height: 1.6; margin: 0;">
      ${data.politicaIA.declaracion}
    </p>
  </div>

  <!-- PIE DE PÁGINA INSTITUCIONAL -->
  <div style="text-align: center; padding: 16px 0; border-top: 1px solid #E0E3E6; font-size: 12px; color: #6B7780;">
    <p style="margin: 0;">
      Portal del Curso gestionado mediante <strong>Docencia IA • Ecosistema Académico UDP</strong> sincronizado directamente con Canvas LMS.
    </p>
  </div>

</div>
<!-- FIN DE PÁGINA OFICIAL UDP -->
  `.trim();
}

// Helpers de almacenamiento local para persistencia inmediata en el navegador
const STORAGE_PREFIX = "udp_course_frontpage_";

export function loadCourseFrontPageFromStorage(courseId: number, courseCode: string, courseName: string): CourseFrontPageData {
  if (typeof window === "undefined") {
    return getDefaultFrontPageData(courseId, courseCode, courseName);
  }

  const key = `${STORAGE_PREFIX}${courseId}`;
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Ignorar error y usar plantilla
    }
  }

  const defaultData = getDefaultFrontPageData(courseId, courseCode, courseName);
  saveCourseFrontPageToStorage(defaultData);
  return defaultData;
}

export function saveCourseFrontPageToStorage(data: CourseFrontPageData): void {
  if (typeof window === "undefined") return;
  const key = `${STORAGE_PREFIX}${data.courseId}`;
  localStorage.setItem(key, JSON.stringify(data));
}
