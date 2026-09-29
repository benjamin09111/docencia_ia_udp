import { GeneratedStudyActivity, StudyActivityType, QuizQuestion, ReflectionQuestion } from "@/types";

export interface CourseUnit {
  id: string;
  numero: number;
  nombre: string;
  descripcion: string;
  temas: string[];
}

export const UNIDADES_CURSO: CourseUnit[] = [
  {
    id: "u1",
    numero: 1,
    nombre: "Unidad 1: Atributos de Calidad y Escenarios (NFR)",
    descripcion: "Disponibilidad, Rendimiento, Seguridad, Modificabilidad, RTO/RPO y Tácticas de Arquitectura.",
    temas: ["Escenarios de Calidad Bass", "RTO y RPO", "Tácticas de Disponibilidad", "Latencia y Throughput"],
  },
  {
    id: "u2",
    numero: 2,
    nombre: "Unidad 2: Patrones y Estilos Arquitectónicos",
    descripcion: "Microservicios, Event-Driven, Capas, Hexagonal, CQRS y Trade-offs de Acoplamiento.",
    temas: ["Microservicios vs Monolito", "Event-Driven Architecture", "API Gateway y Service Mesh", "Diagramas C4"],
  },
  {
    id: "u3",
    numero: 3,
    nombre: "Unidad 3: Planificación, Estimación Ágil y Riesgos PMBOK",
    descripcion: "Gestión de proyectos TIC, 12 Principios PMBOK 7, Story Points con Fibonacci y Matriz de Riesgos.",
    temas: ["PMBOK 7ma Edición", "Planning Poker y Fibonacci", "Matriz de Severidad y Mitigación", "Gestión de Alcance y MVP"],
  },
  {
    id: "u4",
    numero: 4,
    nombre: "Unidad 4: Resiliencia Cloud, Despliegue y Pruebas",
    descripcion: "Arquitectura Cloud AWS/GCP, Circuit Breaker, Chaos Engineering y Estrategias CI/CD.",
    temas: ["Circuit Breaker Pattern", "Failover Multirregión", "Observabilidad (Logs/Métricas/Traces)", "SLO y SLA"],
  },
];

export const INITIAL_STUDY_ACTIVITIES: GeneratedStudyActivity[] = [
  {
    id: "act_quiz_1",
    tipo: "quiz",
    unidad: "Unidad 1: Atributos de Calidad y Escenarios (NFR)",
    titulo: "Quiz Rápido: Escenarios de Disponibilidad y RTO/RPO",
    fechaCreacion: "2026-09-26",
    completada: false,
    preguntasQuiz: [
      {
        id: "q1",
        pregunta: "En un escenario de disponibilidad para un sistema financiero UDP, ¿cuál es la diferencia exacta entre RTO y RPO?",
        opciones: [
          "RTO es el tiempo máximo aceptable para recuperar el servicio; RPO es el volumen máximo de datos transaccionales tolerables a perder en tiempo.",
          "RTO mide el porcentaje de CPU del servidor y RPO la memoria RAM consumida en failover.",
          "RTO es el costo financiero de la caída y RPO la cantidad de clientes afectados.",
          "Ambos términos son sinónimos utilizados indistintamente en la Guía PMBOK 7."
        ],
        respuestaCorrecta: 0,
        explicacion: "Correcto. El RTO (Recovery Time Objective) define la ventana temporal máxima para reactivar el sistema, mientras que el RPO (Recovery Point Objective) determina el punto en el pasado al que se deben restaurar los datos (pérdida de datos tolerable)."
      },
      {
        id: "q2",
        pregunta: "¿Qué táctica arquitectónica es más efectiva para garantizar un RTO menor a 2 segundos en una base de datos transaccional?",
        opciones: [
          "Restaurar un backup semanal en cinta magnética.",
          "Réplica Activa-Caliente (Hot Standby) con conmutación por error (Failover) automatizada por Heartbeat.",
          "Reescribir toda la lógica de negocio en un solo archivo monolítico.",
          "Limitar el acceso de usuarios durante horas punta."
        ],
        respuestaCorrecta: 1,
        explicacion: "Exacto. La réplica caliente sincronizada y el failover automático permiten conmutar el tráfico en milisegundos sin intervención humana, cumpliendo SLAs estrictos."
      },
      {
        id: "q3",
        pregunta: "Según Bass, Clements & Kazman, ¿cuáles son las 6 partes de un Escenario de Calidad formal?",
        opciones: [
          "Cliente, Contrato, Precio, Factura, Entrega y Cobranza.",
          "Fuente del estímulo, Estímulo, Entorno, Artefacto, Respuesta y Medida de la respuesta.",
          "Frontend, Backend, Database, Cloud, Red y DNS.",
          "Scrum Master, Product Owner, Sprint, Backlog, Daily y Retrospectiva."
        ],
        respuestaCorrecta: 1,
        explicacion: "Correcto. La estructura canónica del SEI/Bass exige identificar Fuente, Estímulo, Entorno, Artefacto, Respuesta y la Medida cuantitativa de respuesta."
      }
    ]
  },
  {
    id: "act_caso_1",
    tipo: "caso_reflexion",
    unidad: "Unidad 2: Patrones y Estilos Arquitectónicos",
    titulo: "Caso Práctico: Desacoplamiento de Pagos en E-Commerce UDP",
    contexto: "La tienda virtual 'Librería UDP' experimenta caídas durante las fechas de matrícula. El servicio de cobro bancario externo sufre latencias de hasta 12 segundos, provocando que los hilos del servidor web se agoten y el portal completo deje de responder a los alumnos.",
    fechaCreacion: "2026-09-26",
    completada: false,
    preguntasReflexion: [
      {
        id: "ref1",
        pregunta: "¿Qué patrón arquitectónico aplicarías para aislar el proceso de compra de la dependencia síncrona del banco externo y por qué?",
        guiaReflexion: "Considera patrones asíncronos como Event-Driven (cola RabbitMQ/Kafka) o el patrón Saga con colas de reintentos.",
        puntosClave: ["Desacoplamiento temporal", "Colas asíncronas", "Patrón Outbox o Saga", "Notificación diferida vía Webhooks/Email"]
      },
      {
        id: "ref2",
        pregunta: "¿Cómo implementarías el patrón Circuit Breaker en este escenario para proteger el portal web?",
        guiaReflexion: "Menciona los tres estados del Circuit Breaker (Cerrado, Abierto, Semi-abierto) y qué respuesta degradada se le entrega al estudiante.",
        puntosClave: ["Transición a estado Abierto tras umbral de errores", "Fallback con mensaje amigable", "Evitar sobrecarga en el proveedor bancario", "Prueba con tráfico reducido en Semi-abierto"]
      }
    ]
  }
];

export function generateActivityWithAI(params: {
  unidadId: string;
  tipo: StudyActivityType;
  customPrompt?: string;
}): GeneratedStudyActivity {
  const unidad = UNIDADES_CURSO.find((u) => u.id === params.unidadId) || UNIDADES_CURSO[0];
  const timestamp = Date.now();
  const tituloBase = params.customPrompt ? `Práctica IA: ${params.customPrompt.slice(0, 45)}...` : `Evaluación Formativa: ${unidad.nombre}`;

  if (params.tipo === "quiz") {
    return {
      id: `gen_quiz_${timestamp}`,
      tipo: "quiz",
      unidad: unidad.nombre,
      titulo: tituloBase,
      fechaCreacion: new Date().toISOString().split("T")[0],
      completada: false,
      preguntasQuiz: [
        {
          id: `q_${timestamp}_1`,
          pregunta: `[${unidad.temas[0] || "Concepto Clave"}] ¿Cuál es el principal criterio de diseño al evaluar este aspecto en un proyecto real?`,
          opciones: [
            "Garantizar la resiliencia y aislamiento de fallas sin incrementar innecesariamente la complejidad operativa.",
            "Priorizar siempre la solución más rápida de programar sin considerar atributos no funcionales.",
            "Evitar cualquier tipo de métrica cuantitativa de latencia o disponibilidad.",
            "Eliminar todas las bases de datos para usar almacenamiento plano local."
          ],
          respuestaCorrecta: 0,
          explicacion: "Excelente. La arquitectura de software consiste en balancear trade-offs: la resiliencia no debe generar sobre-ingeniería no justificada."
        },
        {
          id: `q_${timestamp}_2`,
          pregunta: `En relación con ${unidad.temas[1] || "la cátedra UDP"}, ¿qué impacto directo tiene una mala estimación sobre los RAPs del curso?`,
          opciones: [
            "No tiene ningún impacto pues la evaluación solo mide líneas de código finales.",
            "Afecta la viabilidad del MVP, eleva el riesgo de deuda técnica y compromete la entrega a tiempo de los reportes.",
            "Genera que la universidad cambie la pauta de corrección a mitad de semestre.",
            "Garantiza automáticamente la aprobación con nota 7.0."
          ],
          respuestaCorrecta: 1,
          explicacion: "Correcto. El subestimar la incertidumbre lleva a recortar pruebas, acumulando deuda técnica crítica antes de la solemne y entregables."
        },
        {
          id: `q_${timestamp}_3`,
          pregunta: `¿Cuál de las siguientes afirmaciones describe mejor el enfoque PMBOK 7ma Edición frente a la gestión predictiva tradicional?`,
          opciones: [
            "PMBOK 7 se enfoca en principios y entrega de valor continuo, superando el cumplimiento rígido de procesos de la 6ta edición.",
            "PMBOK 7 prohíbe el uso de metodologías ágiles como Scrum o Kanban.",
            "PMBOK 7 solo se aplica a obras civiles y no a proyectos de software o TIC.",
            "PMBOK 7 elimina por completo la gestión de riesgos y la matriz de severidad."
          ],
          respuestaCorrecta: 0,
          explicacion: "Exacto. PMBOK 7 transita desde procesos prescriptivos hacia 12 principios rectores orientados a generar valor real para los interesados."
        }
      ]
    };
  }

  if (params.tipo === "caso_reflexion") {
    return {
      id: `gen_caso_${timestamp}`,
      tipo: "caso_reflexion",
      unidad: unidad.nombre,
      titulo: tituloBase,
      contexto: `Un banco chileno migra su plataforma hipotecaria a la nube pública. Durante la prueba de estrés de la Solemne, la latencia promedio supera los 8 segundos debido a consultas recurrentes no cacheadas y bloqueos de tablas en la base de datos relacional. El equipo propone refactorizar usando ${unidad.temas[0] || "nuevas tácticas"}.`,
      fechaCreacion: new Date().toISOString().split("T")[0],
      completada: false,
      preguntasReflexion: [
        {
          id: `ref_${timestamp}_1`,
          pregunta: "¿Qué táctica de rendimiento específica aplicarías sobre la capa de datos (ej. Read Replicas, Caché Redis, CQRS) y cómo medirías su efectividad?",
          guiaReflexion: "Justifica con métricas de Latencia p95 y Throughput en solicitudes concurrentes por segundo.",
          puntosClave: ["Implementación de Redis para lecturas masivas", "Monitoreo de hit ratio de caché", "Separación de comandos de escritura y consultas (CQRS)"]
        },
        {
          id: `ref_${timestamp}_2`,
          pregunta: "¿Qué riesgo operacional o de consistencia introduce la solución propuesta y cómo lo mitigarías según PMBOK?",
          guiaReflexion: "Considera consistencia eventual vs consistencia inmediata (Teorema CAP) y comunicación a los usuarios.",
          puntosClave: ["Riesgo de dirty reads (lectura de datos desactualizados)", "Estrategia de invalidación de caché TTL", "Matriz de severidad y plan de contingencia"]
        }
      ]
    };
  }

  // Tipo desarrollo
  return {
    id: `gen_des_${timestamp}`,
    tipo: "desarrollo",
    unidad: unidad.nombre,
    titulo: tituloBase,
    fechaCreacion: new Date().toISOString().split("T")[0],
    completada: false,
    preguntaDesarrollo: {
      enunciado: `Pregunta de Ensayo para la Solemne:\n\n'Suponga que usted es el Arquitecto de Software jefe en una fintech regulada por la CMF. Explique cómo diseñaría la arquitectura para satisfacer simultáneamente un RTO < 10 segundos y cumplimiento estricto de auditoría transaccional. Integre conceptos de ${unidad.temas.join(", ")}.'`,
      criteriosEvaluacion: [
        "Definición explícita de la táctica de disponibilidad y redundancia de datos.",
        "Mención de auditoría inmutable (Event Sourcing o Append-Only log).",
        "Justificación de los trade-offs de costo y complejidad operativa."
      ]
    }
  };
}
