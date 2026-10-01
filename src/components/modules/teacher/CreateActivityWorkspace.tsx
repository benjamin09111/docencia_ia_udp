"use client";

import React, { useState } from "react";
import { CourseDeliverable } from "@/types";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import {
  CanvasOfficialRubricTable,
  RubricMatrixRubro,
} from "@/components/canvas/CanvasOfficialRubricTable";
import {
  ArrowLeft,
  Sparkles,
  Send,
  Bot,
  Calendar,
  Award,
  FileText,
  CheckCircle2,
  GraduationCap,
  Plus,
  Trash2,
  Zap,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  ListOrdered,
  Layers,
  Scale,
  Clock,
  ThumbsUp,
} from "lucide-react";

interface CreateActivityWorkspaceProps {
  courseId: number;
  onBack: () => void;
  onPublish: (activity: CourseDeliverable) => void;
}

export interface MetodologiaDocente {
  id: string;
  tipo: string;
  nombreCorto: string;
  subtitulo: string;
  descripcionDefecto: string;
  ventajas: string;
  duracionSugerida: string;
  contenidoSugerido: string;
  tituloDefecto: string;
  fechaDefecto: string;
  modalidadDefecto: "decimas" | "nota";
  valorDefecto: string;
  targetDefecto: string;
  instruccionesDefecto: string;
  matrizOficial: RubricMatrixRubro[];
}

export const matricesOficialesPorMetodologia: Record<string, RubricMatrixRubro[]> = {
  rol_crisis: [
    {
      id: "rub_1",
      nombre: "Gestión de Alcance y Negociación Ágil",
      puntajeRubro: 50,
      criterios: [
        {
          id: "crit_1",
          nombre: "Repriorización de Backlog y Trade-offs",
          subcriterios: [
            {
              id: "sub_1_1",
              nombre: "Definición de MVP y Alcance Esencial",
              descriptores: [
                "Justificación técnica explícita de historias de usuario indispensables frente al recorte presupuestario.",
                "Identificación formal de al menos 3 historias postergadas con impacto evaluado.",
                "Consistencia con los objetivos de negocio pactados con el mandante.",
              ],
              puntaje: 25,
            },
            {
              id: "sub_1_2",
              nombre: "Defensa Técnica de la Arquitectura",
              descriptores: [
                "Demostración de que el recorte no rompe atributos de calidad (latencia, seguridad e integridad).",
                "Presentación de alternativas viables de implementación sin generar deuda técnica crítica.",
                "Evaluación de impacto en contratos de API y persistencia de datos.",
              ],
              puntaje: 25,
            },
          ],
        },
      ],
    },
    {
      id: "rub_2",
      nombre: "Dinámica de Roles y Trabajo Colaborativo",
      puntajeRubro: 50,
      criterios: [
        {
          id: "crit_2",
          nombre: "Desempeño y Coordinación de Roles",
          subcriterios: [
            {
              id: "sub_2_1",
              nombre: "Articulación de Roles del Equipo",
              descriptores: [
                "Scrum Master modera activamente la negociación y facilita acuerdos con el mandante.",
                "Tech Lead y Product Owner defienden la consistencia del producto y la viabilidad técnica.",
                "Participación equitativa y rotativa de todos los integrantes del grupo.",
              ],
              puntaje: 25,
            },
            {
              id: "sub_2_2",
              nombre: "Matriz de Riesgos y Plan de Mitigación",
              descriptores: [
                "Actualización de matriz con probabilidad e impacto ajustados post-negociación.",
                "Definición de protocolo de comunicación y seguimiento ante futuros imprevistos.",
                "Plan de contingencia claro para mantener informados a los interesados.",
              ],
              puntaje: 25,
            },
          ],
        },
      ],
    },
  ],
  caso_forense: [
    {
      id: "rub_cf_1",
      nombre: "Diagnóstico Forense y Vulneración de SLAs",
      puntajeRubro: 50,
      criterios: [
        {
          id: "crit_cf_1",
          nombre: "Análisis Contractual y de Compromisos",
          subcriterios: [
            {
              id: "sub_cf_1",
              nombre: "Identificación de Cláusulas y SLAs Incumplidos",
              descriptores: [
                "Detección precisa de los acuerdos de nivel de servicio (SLAs) de disponibilidad vulnerados.",
                "Análisis de penalizaciones contractuales aplicables según bases de licitación.",
                "Determinación de responsabilidades entre proveedor y mandante.",
              ],
              puntaje: 25,
            },
            {
              id: "sub_cf_2",
              nombre: "Aislamiento Técnico de la Causa Raíz",
              descriptores: [
                "Identificación de cuellos de botella en infraestructura, concurrencia o bases de datos.",
                "Trazabilidad del error a partir de registros de logs y telemetría histórica.",
                "Diagnóstico diferencial entre fallas de diseño vs fallas operacionales.",
              ],
              puntaje: 25,
            },
          ],
        },
      ],
    },
    {
      id: "rub_cf_2",
      nombre: "Plan de Calidad y Prevención de Incidentes",
      puntajeRubro: 50,
      criterios: [
        {
          id: "crit_cf_2",
          nombre: "Estrategia de Aseguramiento de Calidad (QA)",
          subcriterios: [
            {
              id: "sub_cf_3",
              nombre: "Diseño de Batería de Pruebas de Estrés",
              descriptores: [
                "Definición de pruebas de carga concurrente simulando el escenario del colapso.",
                "Protocolo de pruebas de seguridad y penetración (OWASP).",
                "Criterios de aceptación no negociables antes del paso a producción.",
              ],
              puntaje: 25,
            },
            {
              id: "sub_cf_4",
              nombre: "Dictamen Ejecutivo y Checklist de Salida",
              descriptores: [
                "Redacción ejecutiva formal con recomendaciones técnicas y contractuales preventivas.",
                "Checklist de salida a producción (go-live checklist) no negociable.",
                "Estrategia de rollback y monitoreo preventivo continuo.",
              ],
              puntaje: 25,
            },
          ],
        },
      ],
    },
  ],
  gamificacion_poker: [
    {
      id: "rub_gp_1",
      nombre: "Calibración Técnica de Estimaciones",
      puntajeRubro: 50,
      criterios: [
        {
          id: "crit_gp_1",
          nombre: "Fundamentación de Story Points",
          subcriterios: [
            {
              id: "sub_gp_1",
              nombre: "Desglose de Complejidad e Incertidumbre",
              descriptores: [
                "Argumentación basada en capas afectadas (APIs, base de datos, lógica y UI).",
                "Identificación de dependencias externas que condicionan la estimación.",
                "Evaluación del esfuerzo de refactorización y deuda técnica.",
              ],
              puntaje: 25,
            },
            {
              id: "sub_gp_2",
              nombre: "Uso Riguroso de la Serie Fibonacci",
              descriptores: [
                "Aplicación de la secuencia estándar justificando saltos entre órdenes de magnitud.",
                "Sustentación técnica por parte de los votos divergentes durante el debate.",
                "Eliminación de sesgos de anclaje mediante la votación ciega.",
              ],
              puntaje: 25,
            },
          ],
        },
      ],
    },
    {
      id: "rub_gp_2",
      nombre: "Consenso y Criterios de Aceptación",
      puntajeRubro: 50,
      criterios: [
        {
          id: "crit_gp_2",
          nombre: "Definición de Hecho (Definition of Done)",
          subcriterios: [
            {
              id: "sub_gp_3",
              nombre: "Consenso y Nivelación de Velocidad",
              descriptores: [
                "Llegada a consenso fundamentado sin imposición unilateral de estimaciones.",
                "Calibración de la velocidad del equipo para el sprint planificado.",
                "Claridad de supuestos técnicos compartidos por todo el grupo.",
              ],
              puntaje: 25,
            },
            {
              id: "sub_gp_4",
              nombre: "Cobertura de Criterios de Aceptación y Testing",
              descriptores: [
                "Inclusión obligatoria de pruebas unitarias y de integración en el criterio de aceptación.",
                "Coherencia entre el tamaño estimado y el esfuerzo real de verificación técnica.",
                "Definición explícita de pipeline de CI/CD para la entrega.",
              ],
              puntaje: 25,
            },
          ],
        },
      ],
    },
  ],
  debate_fishbowl: [
    {
      id: "rub_df_1",
      nombre: "Solidez Técnica y Fundamentación",
      puntajeRubro: 50,
      criterios: [
        {
          id: "crit_df_1",
          nombre: "Rigor en Decisiones Arquitectónicas",
          subcriterios: [
            {
              id: "sub_df_1",
              nombre: "Uso de Métricas y Atributos de Calidad",
              descriptores: [
                "Respaldo de posturas con métricas de latencia, concurrencia, costos y escalabilidad.",
                "Comparación objetiva de trade-offs entre patrones monolíticos y desacoplados.",
                "Evaluación del impacto operacional en el equipo de desarrollo.",
              ],
              puntaje: 25,
            },
            {
              id: "sub_df_2",
              nombre: "Evidencia de la Industria y Casos de Estudio",
              descriptores: [
                "Cita de fuentes técnicas autorizadas y arquitecturas de referencia contrastadas.",
                "Coherencia con los requerimientos específicos del contexto planteado.",
                "Análisis de viabilidad técnica y presupuestaria en la nube.",
              ],
              puntaje: 25,
            },
          ],
        },
      ],
    },
    {
      id: "rub_df_2",
      nombre: "Debate Dialógico y Comunicación Efectiva",
      puntajeRubro: 50,
      criterios: [
        {
          id: "crit_df_2",
          nombre: "Habilidades Dialógicas y Refutación",
          subcriterios: [
            {
              id: "sub_df_3",
              nombre: "Capacidad de Refutación Asertiva",
              descriptores: [
                "Respuesta a contraargumentos basada en evidencias técnicas sin descalificaciones.",
                "Reconocimiento de limitaciones inherentes a la propia postura defendida.",
                "Uso oportuno de los turnos de palabra en el círculo interno.",
              ],
              puntaje: 25,
            },
            {
              id: "sub_df_4",
              nombre: "Escucha Activa y Síntesis Técnica",
              descriptores: [
                "Integración de aportes de la pecera y reformulación constructiva de acuerdos.",
                "Emisión de conclusiones ejecutivas claras sobre la arquitectura óptima.",
                "Registro de lecciones aprendidas durante la discusión grupal.",
              ],
              puntaje: 25,
            },
          ],
        },
      ],
    },
  ],
  war_room: [
    {
      id: "rub_wr_1",
      nombre: "Diagnóstico y Aislamiento de la Falla",
      puntajeRubro: 50,
      criterios: [
        {
          id: "crit_wr_1",
          nombre: "Velocidad y Precisión en Telemetría",
          subcriterios: [
            {
              id: "sub_wr_1",
              nombre: "Inspección de Logs y Monitoreo",
              descriptores: [
                "Uso metódico de logs y trazas distribuidas para localizar la causa raíz en menos de 15 min.",
                "Clasificación certera del incidente según matriz de severidad técnica.",
                "Identificación exacta de la consulta o componente que originó el bloqueo.",
              ],
              puntaje: 25,
            },
            {
              id: "sub_wr_2",
              nombre: "Contención y Aislamiento del Error",
              descriptores: [
                "Aplicación de medidas de contención para evitar la propagación del daño al clúster.",
                "Preservación de evidencias y volcados de memoria para el análisis forense.",
                "Aislamiento de la base de datos sin comprometer la integridad transaccional.",
              ],
              puntaje: 25,
            },
          ],
        },
      ],
    },
    {
      id: "rub_wr_2",
      nombre: "Despliegue de Hotfix y Trazabilidad",
      puntajeRubro: 50,
      criterios: [
        {
          id: "crit_wr_2",
          nombre: "Mitigación y Comunicación",
          subcriterios: [
            {
              id: "sub_wr_3",
              nombre: "Estrategia de Rollback y Hotfix",
              descriptores: [
                "Construcción de hotfix seguro en rama aislada con pruebas mínimas de regresión.",
                "Ejecución de despliegue con plan de reversión (rollback) probado y operativo.",
                "Verificación del restablecimiento del 100% de la operatividad del servicio.",
              ],
              puntaje: 25,
            },
            {
              id: "sub_wr_4",
              nombre: "Comunicación con Mandante y Reporte Post-Mortem",
              descriptores: [
                "Emisión de comunicados de estado periódicos claros hacia los afectados.",
                "Redacción de informe post-mortem con 3 acciones preventivas para evitar recurrencia.",
                "Plan de auditoría preventiva a aplicar en el siguiente ciclo de release.",
              ],
              puntaje: 25,
            },
          ],
        },
      ],
    },
  ],
  peer_review: [
    {
      id: "rub_pr_1",
      nombre: "Rigor de la Auditoría Cruzada",
      puntajeRubro: 50,
      criterios: [
        {
          id: "crit_pr_1",
          nombre: "Revisión de Arquitectura y Buenas Prácticas",
          subcriterios: [
            {
              id: "sub_pr_1",
              nombre: "Evaluación de Modularidad y Clean Code",
              descriptores: [
                "Verificación de principios de diseño modular, bajo acoplamiento y alta cohesión.",
                "Detección de código duplicado, falta de tipado estricto o malas prácticas.",
                "Revisión de la estructura de paquetes y convenciones de nombres.",
              ],
              puntaje: 25,
            },
            {
              id: "sub_pr_2",
              nombre: "Verificación de Cobertura de Pruebas",
              descriptores: [
                "Comprobación de existencia de suites de pruebas unitarias sobre módulos críticos.",
                "Análisis de casos de borde no contemplados en la implementación auditada.",
                "Verificación de ejecución automatizada en entorno de pruebas.",
              ],
              puntaje: 25,
            },
          ],
        },
      ],
    },
    {
      id: "rub_pr_2",
      nombre: "Calidad del Feedback y Plan de Mejora",
      puntajeRubro: 50,
      criterios: [
        {
          id: "crit_pr_2",
          nombre: "Aportes Constructivos y Viabilidad",
          subcriterios: [
            {
              id: "sub_pr_3",
              nombre: "Fundamentación de Hallazgos Críticos",
              descriptores: [
                "Redacción de al menos 3 observaciones fundamentadas citando líneas exactas o módulos.",
                "Tono profesional, asertivo y pedagógico orientado a la mejora del equipo evaluado.",
                "Claridad en la explicación de riesgos derivados del hallazgo reportado.",
              ],
              puntaje: 25,
            },
            {
              id: "sub_pr_4",
              nombre: "Propuestas de Mejora en 48 Horas",
              descriptores: [
                "Plan de acción priorizado con soluciones técnicas concretas y viables de ejecutar.",
                "Facilitación del checklist de verificación para la re-entrega oficial.",
                "Acompañamiento entre pares para facilitar la resolución de dudas técnicas.",
              ],
              puntaje: 25,
            },
          ],
        },
      ],
    },
  ],
};

export const catalogoMetodologiasDocentes: MetodologiaDocente[] = [
  {
    id: "rol_crisis",
    tipo: "Juego de Roles (Simulación de Crisis y Negociación)",
    nombreCorto: "Juego de Roles",
    subtitulo: "Simulación vivencial de negociación y contingencias",
    descripcionDefecto:
      "El mandante del proyecto recorta el 30% del presupuesto y exige adelantar la entrega en 2 semanas. El equipo asume roles diferenciados para renegociar el alcance sin quebrar la arquitectura técnica.",
    ventajas: "Desarrolla habilidades de negociación ágil, tolerancia a la frustración bajo presión y trabajo colaborativo equitativo.",
    duracionSugerida: "40 min en Ayudantía",
    contenidoSugerido: "Unidad 3: Planificación, Estimación Ágil y Riesgos PMBOK",
    tituloDefecto: "Simulación de Negociación ante Recorte de Presupuesto del Mandante",
    fechaDefecto: "2026-10-18",
    modalidadDefecto: "decimas",
    valorDefecto: "0.3",
    targetDefecto: "Reporte de Avance 1",
    instruccionesDefecto:
      "1. Cada equipo asignará internamente los roles de Scrum Master, Product Owner y Tech Lead de forma consensuada.\n2. El docente presentará el comunicado oficial del mandante con la restricción presupuestaria.\n3. En 20 minutos, los grupos deberán re-priorizar el Backlog identificando el MVP estricto y las características prescindibles.\n4. Cada grupo expondrá en 3 minutos su matriz de decisiones y la justificación técnica de los trade-offs acordados.",
    matrizOficial: matricesOficialesPorMetodologia.rol_crisis,
  },
  {
    id: "caso_forense",
    tipo: "Estudio de Caso Real y Análisis Forense (Post-Mortem)",
    nombreCorto: "Estudio de Caso Real",
    subtitulo: "Análisis forense de contratos, SLAs y fallas en producción",
    descripcionDefecto:
      "Los estudiantes analizan el caso real de una plataforma de software que colapsó en su primer día de lanzamiento. Deben redactar un informe forense identificando qué cláusulas y pruebas de QA fueron omitidas.",
    ventajas: "Fomenta el juicio ético-profesional de la ingeniería, el análisis de causas raíces y la comprensión de contratos y niveles de servicio.",
    duracionSugerida: "45 min en Ayudantía",
    contenidoSugerido: "Unidad 4: Aseguramiento de Calidad, SLAs y Baterías de Testing",
    tituloDefecto: "Dictamen Forense de un Software Gubernamental Fallido",
    fechaDefecto: "2026-11-05",
    modalidadDefecto: "nota",
    valorDefecto: "1.0",
    targetDefecto: "Evaluación Práctica de Ayudantía",
    instruccionesDefecto:
      "1. Leer el documento de antecedentes técnicos del incidente y la arquitectura involucrada.\n2. Identificar y clasificar las causas del fallo en tres ejes: omisiones contractuales, pruebas de estrés no ejecutadas y fallos de infraestructura.\n3. Proponer un checklist de aseguramiento de calidad (QA) y pruebas de carga obligatorias para prevenir futuros incidentes.\n4. Entregar el dictamen en formato de reporte técnico ejecutivo (máximo 2 páginas).",
    matrizOficial: matricesOficialesPorMetodologia.caso_forense,
  },
  {
    id: "gamificacion_poker",
    tipo: "Gamificación Ágil (Planning Poker & Estimación)",
    nombreCorto: "Planning Poker Ágil",
    subtitulo: "Torneo de estimación y consenso de Story Points con Fibonacci",
    descripcionDefecto:
      "Competencia grupal donde los equipos reciben historias de usuario reales de proyectos de software. Usan la serie Fibonacci en votación ciega para calibrar estimaciones y nivelar supuestos técnicos.",
    ventajas: "Neutraliza la dominancia verbal mediante votación ciega, fomenta la calibración colectiva y explicita supuestos de desarrollo.",
    duracionSugerida: "35 min en Ayudantía",
    contenidoSugerido: "Unidad 2: Metodologías Ágiles, Historias de Usuario y Estimación",
    tituloDefecto: "Torneo de Calibración Técnica con Story Points y Fibonacci",
    fechaDefecto: "2026-10-25",
    modalidadDefecto: "decimas",
    valorDefecto: "0.4",
    targetDefecto: "Reporte de Avance 1",
    instruccionesDefecto:
      "1. Se proyectarán 5 historias de usuario complejas con requerimientos de API y base de datos.\n2. En cada ronda, cada integrante emitirá su voto en secreto con la escala Fibonacci (1, 2, 3, 5, 8, 13).\n3. Los puntajes extremos (el más alto y el más bajo) explicarán sus supuestos técnicos al equipo.\n4. Se repite la votación hasta alcanzar consenso unánime y definir los criterios de aceptación (Definition of Done).",
    matrizOficial: matricesOficialesPorMetodologia.gamificacion_poker,
  },
  {
    id: "debate_fishbowl",
    tipo: "Debate Socrático / Pecera de Arquitectura (Fishbowl)",
    nombreCorto: "Debate Socrático",
    subtitulo: "Discusión dialógica estructurada sobre decisiones de arquitectura",
    descripcionDefecto:
      "Dinámica estructurada en círculo interno (pecera) y externo. Los grupos defienden posturas contrapuestas justificando costos operacionales, latencia, escalabilidad y tiempos de entrega.",
    ventajas: "Fortalece la argumentación técnica basada en evidencia, el pensamiento crítico dialógico y la escucha activa respetuosa.",
    duracionSugerida: "40 min en Ayudantía",
    contenidoSugerido: "Unidad 1: Requerimientos, Casos de Uso y Arquitectura de Software",
    tituloDefecto: "Discusión de Arquitectura: Monolito Modular vs Microservicios Cloud",
    fechaDefecto: "2026-10-28",
    modalidadDefecto: "decimas",
    valorDefecto: "0.3",
    targetDefecto: "Reporte de Avance 1",
    instruccionesDefecto:
      "1. Se conformará la pecera interna con 4 representantes (2 a favor de Monolito Modular y 2 de Microservicios).\n2. El círculo externo tomará nota de las debilidades y fortalezas de cada argumento técnico.\n3. Cada intervención debe estar respaldada por costos de infraestructura en la nube o métricas de mantenibilidad.\n4. Tras 25 minutos, se abrirá la pecera para que el público formule preguntas de refutación técnica.",
    matrizOficial: matricesOficialesPorMetodologia.debate_fishbowl,
  },
  {
    id: "war_room",
    tipo: "Simulación de Sala de Crisis en Vivo (War Room DevOps)",
    nombreCorto: "War Room DevOps",
    subtitulo: "Respuesta cronometrada a incidentes críticos de producción",
    descripcionDefecto:
      "Simulación cronometrada donde se inyecta una falla inducida en una réplica del software. El equipo coordina la comunicación con el cliente, aísla la falla en logs y despliega un hotfix.",
    ventajas: "Entrenamiento de alta fidelidad para el ejercicio profesional: fomenta la calma metódica, roles de emergencia claros y trazabilidad.",
    duracionSugerida: "50 min en Ayudantía",
    contenidoSugerido: "Unidad 5: Gestión de Incidentes, DevOps y Despliegue en Producción",
    tituloDefecto: "Respuesta a Incidentes Críticos de Producción y Caída de Base de Datos",
    fechaDefecto: "2026-11-12",
    modalidadDefecto: "decimas",
    valorDefecto: "0.5",
    targetDefecto: "Reporte de Avance 2",
    instruccionesDefecto:
      "1. Al sonar la alarma de caída de servicio, el equipo activará el protocolo de War Room y designará un Incident Commander.\n2. Analizar los registros de logs y telemetría para diagnosticar la causa raíz del error 500 en menos de 15 minutos.\n3. Desarrollar un hotfix de emergencia en una rama dedicada y redactar el comunicado de estado para los usuarios.\n4. Realizar el despliegue con rollback plan preparado y emitir el reporte post-mortem del incidente.",
    matrizOficial: matricesOficialesPorMetodologia.war_room,
  },
  {
    id: "peer_review",
    tipo: "Revisión Ciega por Pares (Blind Peer Review)",
    nombreCorto: "Revisión por Pares",
    subtitulo: "Auditoría cruzada anónima de código y arquitectura",
    descripcionDefecto:
      "Cada grupo revisa de forma anónima el avance técnico de otro equipo utilizando la rúbrica oficial del curso, emitiendo un informe con sugerencias de mejora inmediata.",
    ventajas: "Evaluación formativa entre pares: desarrolla habilidades de análisis crítico, metacognición y calibración de estándares antes de la entrega.",
    duracionSugerida: "45 min en Ayudantía",
    contenidoSugerido: "Unidad 6: Auditoría de Código y Revisión Cruzada de Software",
    tituloDefecto: "Auditoría Cruzada de Arquitectura y Código Previa a Entrega Oficial",
    fechaDefecto: "2026-10-14",
    modalidadDefecto: "decimas",
    valorDefecto: "0.3",
    targetDefecto: "Reporte de Avance 1",
    instruccionesDefecto:
      "1. Cada equipo recibirá el repositorio y documentación de otro grupo con nombres anonimizados.\n2. Aplicar la rúbrica de auditoría revisando modularidad, cobertura de pruebas unitarias y legibilidad del código.\n3. Redactar al menos 3 observaciones críticas fundamentadas y 2 recomendaciones concretas aplicables en 48 horas.\n4. Consolidar el feedback en el template oficial de revisión por pares.",
    matrizOficial: matricesOficialesPorMetodologia.peer_review,
  },
];

export const CONTENIDOS_OFICIALES = [
  "Unidad 1: Requerimientos, Casos de Uso y Arquitectura de Software",
  "Unidad 2: Metodologías Ágiles, Historias de Usuario y Estimación",
  "Unidad 3: Planificación, Estimación Ágil y Riesgos PMBOK",
  "Unidad 4: Aseguramiento de Calidad, SLAs y Baterías de Testing",
  "Unidad 5: Gestión de Incidentes, DevOps y Despliegue en Producción",
  "Unidad 6: Auditoría de Código y Revisión Cruzada de Software",
  "Personalizado (Definir manualmente)",
];

const PASOS_WIZARD = [
  { num: 1, label: "Tipo de actividad" },
  { num: 2, label: "Información" },
  { num: 3, label: "Instrucciones" },
  { num: 4, label: "Rúbrica y evaluación" },
  { num: 5, label: "Resumen" },
];

export const CreateActivityWorkspace: React.FC<CreateActivityWorkspaceProps> = ({
  courseId,
  onBack,
  onPublish,
}) => {
  const [pasoActual, setPasoActual] = useState<number>(1);
  const [metodologia, setMetodologia] = useState<MetodologiaDocente>(catalogoMetodologiasDocentes[0]);

  // Form State
  const [titulo, setTitulo] = useState(catalogoMetodologiasDocentes[0].tituloDefecto);
  const [descripcion, setDescripcion] = useState(catalogoMetodologiasDocentes[0].descripcionDefecto);
  const [contenidoSeleccionado, setContenidoSeleccionado] = useState(catalogoMetodologiasDocentes[0].contenidoSugerido);
  const [contenidoManual, setContenidoManual] = useState("");
  const [fecha, setFecha] = useState(catalogoMetodologiasDocentes[0].fechaDefecto);
  const [instrucciones, setInstrucciones] = useState(catalogoMetodologiasDocentes[0].instruccionesDefecto);

  // Modalidad de evaluación extra
  const [modalidad, setModalidad] = useState<"decimas" | "nota">("decimas");
  const [decimas, setDecimas] = useState("0.3");
  const [targetEvaluacion, setTargetEvaluacion] = useState("Reporte de Avance 1");

  // Matriz de Rúbrica Oficial
  const [matrizRubros, setMatrizRubros] = useState<RubricMatrixRubro[]>(
    catalogoMetodologiasDocentes[0].matrizOficial
  );

  // Chat State
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: "user" | "agent"; text: string }>
  >([
    {
      sender: "agent",
      text: "Hola profesor. Seleccione el tipo de actividad en el catálogo para comenzar. Le asistiré en cada paso del diseño pedagógico.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isGeneratingInstructions, setIsGeneratingInstructions] = useState(false);

  // Seleccionar metodología en Paso 1
  const handleSelectMetodologia = (met: MetodologiaDocente) => {
    setMetodologia(met);
    setTitulo(met.tituloDefecto);
    setDescripcion(met.descripcionDefecto);
    setContenidoSeleccionado(met.contenidoSugerido);
    setFecha(met.fechaDefecto);
    setModalidad(met.modalidadDefecto);
    setDecimas(met.valorDefecto);
    setTargetEvaluacion(met.targetDefecto);
    setInstrucciones(met.instruccionesDefecto);
    setMatrizRubros(met.matrizOficial);

    setChatMessages((prev) => [
      ...prev,
      {
        sender: "agent",
        text: `Seleccionaste "${met.nombreCorto}". Esta dinámica es ideal para: ${met.ventajas}. Avanza a Información cuando desees.`,
      },
    ]);
  };

  // Generar instrucciones con IA en Paso 3
  const handleGenerarInstruccionesIA = () => {
    setIsGeneratingInstructions(true);
    setTimeout(() => {
      const contenidoFinal = contenidoSeleccionado.startsWith("Personalizado")
        ? contenidoManual || "los contenidos de la sesión"
        : contenidoSeleccionado;

      const textoGenerado =
        `Instrucciones Oficiales — Dinámica: ${metodologia.nombreCorto}\n` +
        `Eje Temático Evaluado: ${contenidoFinal}\n\n` +
        `1. Organización y Roles:\n` +
        `   Los equipos se conformarán en grupos de 3 a 4 estudiantes. Cada integrante asumirá un rol activo con tareas delimitadas.\n\n` +
        `2. Desarrollo de la Dinámica (${metodologia.duracionSugerida}):\n` +
        `   ${metodologia.descripcionDefecto}\n\n` +
        `3. Aplicación Práctica y Evidencia:\n` +
        `   Aplicar los conceptos de ${contenidoFinal} resolviendo la problemática propuesta con fundamentación técnica y justificación de decisiones.\n\n` +
        `4. Cierre y Entregable:\n` +
        `   Cada grupo registrará su entrega antes de la fecha límite (${fecha}). La evaluación se realizará según la pauta oficial del taller.`;

      setInstrucciones(textoGenerado);
      setIsGeneratingInstructions(false);

      setChatMessages((prev) => [
        ...prev,
        {
          sender: "agent",
          text: `He generado instrucciones adaptadas para "${metodologia.nombreCorto}" enfocadas en: ${contenidoFinal}. Puedes editarlas libremente en el campo de texto.`,
        },
      ]);
    }, 700);
  };

  // Chat submit
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const lower = userText.toLowerCase();

      let reply = "Entendido profesor. Puedo adaptar cualquier sección del formulario o sugerirle ajustes según sus objetivos pedagógicos.";

      if (lower.includes("instruccion") || lower.includes("paso")) {
        reply = "Le recomiendo incluir tiempos específicos para cada fase de la actividad y solicitar un entregable conciso (máximo 2 carillas o un enlace al repositorio).";
      } else if (lower.includes("decima") || lower.includes("nota") || lower.includes("evalua")) {
        reply = "Recuerde que esta actividad es extra a la ponderación del curso. Las décimas (+0.1 a +1.0) se sumarán directamente al hito que usted elija.";
      } else if (lower.includes("rubrica") || lower.includes("criterio") || lower.includes("pauta")) {
        reply = "La pauta oficial está estructurada en Rubros, Criterios y Subcriterios con descriptores formales que totalizan 100 puntos.";
      } else if (lower.includes("poker") || lower.includes("roles") || lower.includes("caso") || lower.includes("debate")) {
        const found = catalogoMetodologiasDocentes.find((m) =>
          m.nombreCorto.toLowerCase().includes(lower.split(" ")[0])
        );
        if (found) {
          handleSelectMetodologia(found);
          reply = `He seleccionado "${found.nombreCorto}" y actualizado la pauta oficial correspondiente.`;
        }
      }

      setChatMessages((prev) => [...prev, { sender: "agent", text: reply }]);
    }, 600);
  };

  // Confirmar y publicar
  const handlePublishFinal = () => {
    const ponderacionFinal =
      modalidad === "decimas"
        ? `+${decimas} décimas`
        : "Evaluación formativa (1.0 - 7.0)";

    // Mapear la matriz oficial a la estructura RubricCriterion para compatibilidad
    const rubricaGenerada = matrizRubros.flatMap((rubro) =>
      rubro.criterios.flatMap((criterio) =>
        criterio.subcriterios.map((sub) => ({
          id: sub.id,
          descripcion: `${rubro.nombre} > ${criterio.nombre}: ${sub.nombre}`,
          puntaje_max: sub.puntaje,
          indicadores: [
            { nivel: "Excelente" as const, detalle: sub.descriptores.join(" • "), puntos: sub.puntaje },
            { nivel: "Aceptable" as const, detalle: "Cumple parcialmente con los requerimientos.", puntos: Math.round(sub.puntaje * 0.6) },
            { nivel: "Insuficiente" as const, detalle: "No cumple con los estándares mínimos.", puntos: Math.round(sub.puntaje * 0.2) },
          ],
        }))
      )
    );

    const newActivity: CourseDeliverable = {
      id: `act_${Date.now()}`,
      curso_id: courseId,
      tipo: "actividad_ayudantia",
      titulo: `${metodologia.nombreCorto}: ${titulo}`,
      descripcion,
      fecha_limite: fecha,
      ponderacion_o_decimas: ponderacionFinal,
      target_evaluacion: modalidad === "decimas" ? targetEvaluacion : "Evaluación Extra Ayudantía",
      estado: "publicada",
      rubrica: rubricaGenerada,
    };

    onPublish(newActivity);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header Institucional de Navegación */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-canvas-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            title="Volver a Actividades extra"
            aria-label="Volver a Actividades extra"
            className="w-8 h-8 rounded-[4px] border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-100 text-[#2D3B45] hover:text-[#008EE2] transition-colors flex items-center justify-center shrink-0 shadow-2xs"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-gray-500">PROYECTO EN TICS II (CIT3203)</span>
              <CanvasBadge variant="udp">Actividades extra</CanvasBadge>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-[#2D3B45] mt-0.5">
              Diseño de Actividad Pedagógica
            </h1>
          </div>
        </div>
      </div>

      {/* STEPPER BAR (WIZARD DE 5 PASOS) */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-3 shadow-canvas-card">
        <div className="grid grid-cols-5 gap-1 sm:gap-2">
          {PASOS_WIZARD.map((p) => {
            const isActive = pasoActual === p.num;
            const isCompleted = pasoActual > p.num;

            return (
              <button
                key={p.num}
                type="button"
                onClick={() => setPasoActual(p.num)}
                className={`py-2 px-1 sm:px-2 rounded-[4px] text-left transition-all border flex flex-col sm:flex-row items-center sm:items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? "border-[#008EE2] bg-[#F0F8FF] text-[#008EE2] font-bold"
                    : isCompleted
                    ? "border-emerald-200 bg-emerald-50/60 text-emerald-800"
                    : "border-transparent bg-gray-50/70 text-gray-500 hover:bg-gray-100"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                    isActive
                      ? "bg-[#008EE2] text-white"
                      : isCompleted
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={12} /> : p.num}
                </div>
                <span className="text-[10px] sm:text-xs truncate text-center sm:text-left">
                  {p.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* LAYOUT DE DOS COLUMNAS: FORMULARIO WIZARD (7 Cols) + ASISTENTE STICKY (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* COLUMNA IZQUIERDA: CONTENIDO DEL PASO DEL WIZARD */}
        <div className="lg:col-span-7 bg-white border border-[#E0E3E6] rounded-[4px] p-5 sm:p-6 shadow-canvas-card space-y-5">
          {/* ================= PASO 1: TIPO DE ACTIVIDAD ================= */}
          {pasoActual === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-bold text-[#2D3B45] flex items-center gap-2">
                  <GraduationCap size={16} className="text-[#008EE2]" />
                  Paso 1: Catálogo de Tipos de Actividad
                </h2>
                <p className="text-xs text-[#6B7780] mt-0.5">
                  Selecciona la metodología pedagógica que deseas implementar. Cada opción incluye sus ventajas y formato recomendado.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {catalogoMetodologiasDocentes.map((m) => {
                  const isSelected = m.id === metodologia.id;

                  return (
                    <div
                      key={m.id}
                      onClick={() => handleSelectMetodologia(m)}
                      className={`p-3.5 rounded-[4px] border-2 cursor-pointer transition-all flex flex-col justify-between space-y-2.5 ${
                        isSelected
                          ? "border-[#008EE2] bg-[#F0F8FF] ring-2 ring-[#008EE2] shadow-xs"
                          : "border-[#E0E3E6] bg-white hover:border-gray-400 hover:bg-gray-50/60"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-bold ${isSelected ? "text-[#008EE2]" : "text-[#2D3B45]"}`}>
                            {m.nombreCorto}
                          </span>
                          <span className="text-[10px] text-gray-500 font-medium bg-gray-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Clock size={10} /> {m.duracionSugerida}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#55636E] line-clamp-2 leading-relaxed">
                          {m.descripcionDefecto}
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-gray-100">
                        <div className="text-[10.5px] text-[#2D3B45] bg-white p-1.5 rounded border border-gray-200">
                          <strong className="text-[#008EE2]">Ventaja:</strong> {m.ventajas}
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-gray-500 truncate max-w-[170px]">
                            {m.contenidoSugerido.split(":")[0]}
                          </span>
                          {isSelected && (
                            <span className="text-[#008EE2] font-bold flex items-center gap-0.5">
                              <CheckCircle2 size={11} /> Seleccionada
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t flex justify-end">
                <CanvasButton
                  variant="primary-udp"
                  size="sm"
                  onClick={() => setPasoActual(2)}
                  icon={<ChevronRight size={14} />}
                >
                  Continuar a Información
                </CanvasButton>
              </div>
            </div>
          )}

          {/* ================= PASO 2: INFORMACIÓN Y CONTENIDOS ================= */}
          {pasoActual === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-bold text-[#2D3B45] flex items-center gap-2">
                  <FileText size={16} className="text-[#008EE2]" />
                  Paso 2: Información General y Contenidos a Evaluar
                </h2>
                <p className="text-xs text-[#6B7780] mt-0.5">
                  Define el título, enunciado general y selecciona la temática oficial del programa a evaluar en este taller.
                </p>
              </div>

              {/* Título de la actividad */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#2D3B45]">Título del Taller / Dinámica</label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded-[4px] p-2 focus:ring-1 focus:ring-[#008EE2]"
                />
              </div>

              {/* Descripción */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#2D3B45]">Descripción del Taller</label>
                <textarea
                  rows={2}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded-[4px] p-2 focus:ring-1 focus:ring-[#008EE2]"
                />
              </div>

              {/* CONTENIDOS EVALUADOS (Selector Oficial + Modo Personalizado) */}
              <div className="space-y-2 bg-[#F9FAFB] p-3.5 rounded-[4px] border border-gray-200">
                <label className="text-xs font-bold text-[#2D3B45] flex items-center gap-1.5">
                  <BookOpen size={14} className="text-[#008EE2]" />
                  Contenidos del Curso Evaluados en la Actividad
                </label>
                <p className="text-[11px] text-[#6B7780]">
                  Selecciona la unidad temática oficial del descriptor o escribe un contenido específico.
                </p>

                <select
                  value={contenidoSeleccionado}
                  onChange={(e) => setContenidoSeleccionado(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded-[4px] p-2 bg-white font-medium text-[#2D3B45]"
                >
                  {CONTENIDOS_OFICIALES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                {contenidoSeleccionado.startsWith("Personalizado") && (
                  <div className="pt-1">
                    <input
                      type="text"
                      placeholder="Escribe los contenidos o temas específicos a evaluar..."
                      value={contenidoManual}
                      onChange={(e) => setContenidoManual(e.target.value)}
                      className="w-full text-xs border border-blue-300 rounded-[4px] p-2 bg-white"
                    />
                  </div>
                )}
              </div>

              {/* Fecha Límite */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#2D3B45] flex items-center gap-1">
                  <Calendar size={13} className="text-[#008EE2]" />
                  Fecha Límite de Entrega
                </label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded-[4px] p-2 bg-white"
                />
              </div>

              <div className="pt-3 border-t flex justify-between">
                <CanvasButton variant="outline" size="sm" onClick={() => setPasoActual(1)} icon={<ChevronLeft size={14} />}>
                  Volver a Tipo
                </CanvasButton>
                <CanvasButton variant="primary-udp" size="sm" onClick={() => setPasoActual(3)} icon={<ChevronRight size={14} />}>
                  Continuar a Instrucciones
                </CanvasButton>
              </div>
            </div>
          )}

          {/* ================= PASO 3: INSTRUCCIONES ================= */}
          {pasoActual === 3 && (
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h2 className="text-sm font-bold text-[#2D3B45] flex items-center gap-2">
                    <ListOrdered size={16} className="text-[#008EE2]" />
                    Paso 3: Instrucciones para Estudiantes
                  </h2>
                  <p className="text-xs text-[#6B7780] mt-0.5">
                    Detalla los pasos que deben seguir los estudiantes para completar el taller.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGenerarInstruccionesIA}
                  disabled={isGeneratingInstructions}
                  className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-[4px] text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs"
                >
                  <Sparkles size={13} className="text-purple-700" />
                  {isGeneratingInstructions ? "Generando..." : "Generar con Agente Creativo"}
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#2D3B45]">
                  Pauta e Instrucciones Paso a Paso (Editable)
                </label>
                <textarea
                  rows={9}
                  value={instrucciones}
                  onChange={(e) => setInstrucciones(e.target.value)}
                  className="w-full text-xs font-mono border border-gray-300 rounded-[4px] p-3 focus:ring-1 focus:ring-[#008EE2] leading-relaxed bg-[#FAFAFA]"
                />
              </div>

              <div className="pt-3 border-t flex justify-between">
                <CanvasButton variant="outline" size="sm" onClick={() => setPasoActual(2)} icon={<ChevronLeft size={14} />}>
                  Volver a Información
                </CanvasButton>
                <CanvasButton variant="primary-udp" size="sm" onClick={() => setPasoActual(4)} icon={<ChevronRight size={14} />}>
                  Continuar a Rúbrica
                </CanvasButton>
              </div>
            </div>
          )}

          {/* ================= PASO 4: RÚBRICA Y EVALUACIÓN ================= */}
          {pasoActual === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-bold text-[#2D3B45] flex items-center gap-2">
                  <Award size={16} className="text-[#008EE2]" />
                  Paso 4: Matriz Oficial de Evaluación y Modalidad Extra
                </h2>
                <p className="text-xs text-[#6B7780] mt-0.5">
                  Estructura jerárquica oficial de la pauta. Los talleres otorgan décimas o evaluación formativa extra sin alterar ponderaciones del curso.
                </p>
              </div>

              {/* Selector de Modalidad */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setModalidad("decimas")}
                  className={`p-3 rounded-[4px] border text-left transition-all cursor-pointer ${
                    modalidad === "decimas"
                      ? "border-purple-400 bg-purple-50 ring-1 ring-purple-400"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <span className="text-xs font-bold text-purple-950 block">
                    Bonificación de Décimas
                  </span>
                  <span className="text-[11px] text-[#6B7780] mt-0.5 block">
                    Suma directamente a la nota final de un entregable oficial.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setModalidad("nota")}
                  className={`p-3 rounded-[4px] border text-left transition-all cursor-pointer ${
                    modalidad === "nota"
                      ? "border-blue-400 bg-blue-50 ring-1 ring-blue-400"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <span className="text-xs font-bold text-blue-950 block">
                    Evaluación Formativa (1.0 - 7.0)
                  </span>
                  <span className="text-[11px] text-[#6B7780] mt-0.5 block">
                    Registro de nota extra en el libro de ayudantía sin alterar ponderaciones oficiales.
                  </span>
                </button>
              </div>

              {/* Detalle según modalidad */}
              {modalidad === "decimas" ? (
                <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-[4px] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-purple-950 block mb-1">
                      Cantidad de Décimas a Bonificar
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-purple-950 text-sm">+</span>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        max="1.0"
                        value={decimas}
                        onChange={(e) => setDecimas(e.target.value)}
                        className="w-24 text-xs font-bold border border-purple-300 rounded-[4px] p-1.5 bg-white text-purple-950 text-center"
                      />
                      <span className="text-[#6B7780]">décimas</span>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-purple-950 block mb-1">
                      Hito Oficial al que se Sumarán
                    </label>
                    <select
                      value={targetEvaluacion}
                      onChange={(e) => setTargetEvaluacion(e.target.value)}
                      className="w-full text-xs border border-purple-300 rounded-[4px] p-1.5 bg-white font-medium text-purple-950"
                    >
                      <option value="Presentación e informe inicial">Presentación e informe inicial</option>
                      <option value="Solemne Oficial">Solemne Oficial</option>
                      <option value="Reporte de Avance 1">Reporte de Avance 1</option>
                      <option value="Reporte de Avance 2">Reporte de Avance 2</option>
                      <option value="Presentación Final">Presentación Final</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-[4px] text-xs text-blue-950">
                  <span>
                    La actividad se evaluará en escala 1.0 a 7.0 para retroalimentación formativa de los estudiantes. No modifica la ponderación oficial del 100% de los entregables del curso.
                  </span>
                </div>
              )}

              {/* Matriz Oficial de Evaluación en Tabla Formal */}
              <div className="pt-2">
                <CanvasOfficialRubricTable
                  rubros={matrizRubros}
                  onChangeRubros={setMatrizRubros}
                  isEditable={true}
                  tituloPauta={`PAUTA OFICIAL: ${metodologia.nombreCorto.toUpperCase()}`}
                  subtituloPauta="Matriz institucional de rubros, criterios y subcriterios de desempeño"
                />
              </div>

              <div className="pt-3 border-t flex justify-between">
                <CanvasButton variant="outline" size="sm" onClick={() => setPasoActual(3)} icon={<ChevronLeft size={14} />}>
                  Volver a Instrucciones
                </CanvasButton>
                <CanvasButton variant="primary-udp" size="sm" onClick={() => setPasoActual(5)} icon={<ChevronRight size={14} />}>
                  Continuar a Resumen
                </CanvasButton>
              </div>
            </div>
          )}

          {/* ================= PASO 5: RESUMEN Y REVISIÓN DEL AGENTE ================= */}
          {pasoActual === 5 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-bold text-[#2D3B45] flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-700" />
                  Paso 5: Resumen Consolidado y Validación Final
                </h2>
                <p className="text-xs text-[#6B7780] mt-0.5">
                  Verifica todos los datos y la pauta oficial antes de publicar la actividad en el curso.
                </p>
              </div>

              {/* Panel de Validación Pedagógica y Equidad */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-[4px] p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <ThumbsUp size={14} className="text-emerald-700" />
                    Validación Pedagógica y Equidad de Participación
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Validada
                  </span>
                </div>
                <p className="text-[11px] text-[#2E7D32] leading-relaxed">
                  La actividad cuenta con roles colaborativos equilibrados, instrucciones claras con tiempos delimitados y matriz oficial estructurada sin sesgos de evaluación.
                </p>
              </div>

              {/* Ficha Resumen de la Actividad */}
              <div className="bg-gray-50 border border-gray-200 rounded-[4px] p-4 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2 pb-2 border-b border-gray-200">
                  <div>
                    <span className="text-gray-500 block text-[10.5px]">Tipo de Actividad:</span>
                    <strong className="text-[#2D3B45]">{metodologia.nombreCorto}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10.5px]">Evaluación Extra:</span>
                    <strong className="text-[#008EE2]">
                      {modalidad === "decimas" ? `+${decimas} décimas (${targetEvaluacion})` : "Nota Formativa (1.0 - 7.0)"}
                    </strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10.5px]">Fecha Límite:</span>
                    <strong className="text-[#2D3B45]">{fecha}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10.5px]">Contenido Evaluado:</span>
                    <strong className="text-[#2D3B45] truncate block">
                      {contenidoSeleccionado.startsWith("Personalizado") ? contenidoManual || "Personalizado" : contenidoSeleccionado}
                    </strong>
                  </div>
                </div>

                <div>
                  <span className="text-gray-500 block text-[10.5px]">Título Oficial:</span>
                  <strong className="text-[#2D3B45]">{metodologia.nombreCorto}: {titulo}</strong>
                </div>
              </div>

              {/* Matriz Oficial Consolidada en el Resumen */}
              <div className="pt-2">
                <CanvasOfficialRubricTable
                  rubros={matrizRubros}
                  isEditable={false}
                  tituloPauta={`PAUTA OFICIAL CONSOLIDADA: ${metodologia.nombreCorto.toUpperCase()}`}
                  subtituloPauta="Matriz institucional que se publicará y sincronizará con el curso"
                />
              </div>

              <div className="pt-3 border-t flex justify-between">
                <CanvasButton variant="outline" size="sm" onClick={() => setPasoActual(4)} icon={<ChevronLeft size={14} />}>
                  Volver a Rúbrica
                </CanvasButton>
                <CanvasButton
                  variant="primary-udp"
                  size="sm"
                  onClick={handlePublishFinal}
                  icon={<Zap size={14} />}
                >
                  Confirmar y Publicar actividad
                </CanvasButton>
              </div>
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: CHAT DEL ASISTENTE EN VIVO (STICKY) */}
        <div className="lg:col-span-5 bg-white border border-[#E0E3E6] rounded-[4px] shadow-canvas-card flex flex-col h-[580px] xl:h-[650px] max-h-[calc(100vh-100px)] lg:sticky lg:top-20 z-10">
          {/* Header del Chat */}
          <div className="p-3.5 border-b border-[#E0E3E6] flex items-center justify-between bg-[#F9FAFB]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                <Bot size={17} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#2D3B45]">
                  Agente de Actividades Dinámicas
                </h3>
                <span className="text-[10.5px] text-emerald-700 font-medium flex items-center gap-1">
                  ● Conectado con Agente Teórico & Técnico UDP
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-[#008EE2] shrink-0">
              Asistente en Vivo
            </span>
          </div>

          {/* Mensajes del Chat */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "agent" && (
                  <div className="w-6 h-6 rounded-full bg-purple-50 text-purple-800 border border-purple-200 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">
                    IA
                  </div>
                )}

                <div className={`space-y-1.5 max-w-[88%] ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`p-3 rounded-[6px] leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[#008EE2] text-white"
                        : "bg-[#F5F6F8] text-[#2D3B45] border border-gray-200"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-gray-500 italic">
                <Bot size={13} className="animate-spin text-purple-700" />
                <span>Generando sugerencia pedagógica...</span>
              </div>
            )}
          </div>

          {/* Input del Chat */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 flex gap-2 bg-white">
            <input
              type="text"
              placeholder="Pregúntale al agente o pídele cambios para cualquier paso..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 text-xs border border-gray-300 rounded-[4px] px-3 py-2 focus:ring-1 focus:ring-[#008EE2]"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-[#2D3B45] hover:bg-[#1E272E] text-white rounded-[4px] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Send size={12} />
              <span>Enviar</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
