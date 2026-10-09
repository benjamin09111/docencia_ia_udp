import { RubricMatrixRubro } from "@/components/canvas/CanvasOfficialRubricTable";
import { catalogoActividadesFormativasDocentes } from "./actividadesFormativasCatalog";

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
  ...catalogoActividadesFormativasDocentes,
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

export const PASOS_WIZARD = [
  { num: 1, label: "Tipo de actividad" },
  { num: 2, label: "Información" },
  { num: 3, label: "Instrucciones" },
  { num: 4, label: "Rúbrica y evaluación" },
  { num: 5, label: "Resumen" },
];
