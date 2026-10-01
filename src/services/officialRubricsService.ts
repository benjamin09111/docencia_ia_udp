import { RubricMatrixRubro } from "@/components/canvas/CanvasOfficialRubricTable";
import { RubricCriterion } from "@/types";

export const matricesOficialesEntregables: Record<number, RubricMatrixRubro[]> = {
  1: [
    {
      id: "rub_ent1_1",
      nombre: "Diagnóstico de la Problemática y Alcance",
      puntajeRubro: 50,
      criterios: [
        {
          id: "crit_ent1_1",
          nombre: "Justificación del Proyecto y Necesidad Real",
          subcriterios: [
            {
              id: "sub_ent1_1",
              nombre: "Contextualización del Mandante y Problema",
              descriptores: [
                "Identificación rigurosa de los dolores de negocio del mandante institucional o externo.",
                "Análisis de interesados (stakeholders) y caracterización de usuarios finales.",
                "Delimitación explícita del alcance esencial y fronteras de la solución tecnológica.",
              ],
              puntaje: 25,
            },
            {
              id: "sub_ent1_2",
              nombre: "Requerimientos Funcionales y Atributos de Calidad",
              descriptores: [
                "Definición de casos de uso e historias de usuario con criterios de aceptación (DoD).",
                "Especificación formal de requerimientos no funcionales (latencia, disponibilidad y seguridad).",
                "Matriz de trazabilidad entre requerimientos y valor de negocio para el mandante.",
              ],
              puntaje: 25,
            },
          ],
        },
      ],
    },
    {
      id: "rub_ent1_2",
      nombre: "Planificación, EDT y Arquitectura Base",
      puntajeRubro: 50,
      criterios: [
        {
          id: "crit_ent1_2",
          nombre: "Estructura del Trabajo y Viabilidad Técnica",
          subcriterios: [
            {
              id: "sub_ent1_3",
              nombre: "EDT/WBS y Cronograma de Hitos",
              descriptores: [
                "Estructura de desglose del trabajo organizada por paquetes entregables verificables.",
                "Estimación inicial de esfuerzo y ruta crítica del proyecto para el semestre.",
                "Asignación de roles y responsabilidades de equipo con criterios de paridad.",
              ],
              puntaje: 25,
            },
            {
              id: "sub_ent1_4",
              nombre: "Propuesta de Arquitectura y Stack Tecnológico",
              descriptores: [
                "Diagrama de arquitectura de alto nivel (C4 Model / componentes y conectores).",
                "Justificación fundada del stack de frameworks, base de datos y servicios cloud.",
                "Evaluación de riesgos de integración con sistemas legados o externos.",
              ],
              puntaje: 25,
            },
          ],
        },
      ],
    },
  ],
  2: [
    {
      id: "rub_ent2_1",
      nombre: "Fundamentos de Arquitectura de Software",
      puntajeRubro: 50,
      criterios: [
        {
          id: "crit_ent2_1",
          nombre: "Patrones y Atributos de Calidad (NFR)",
          subcriterios: [
            {
              id: "sub_ent2_1",
              nombre: "Patrones Arquitectónicos y Trade-offs",
              descriptores: [
                "Identificación de escenarios tácticos para disponibilidad, rendimiento y modificabilidad.",
                "Resolución fundada de problemas de acoplamiento en arquitecturas cliente-servidor y APIs.",
                "Evaluación de impacto de microservicios vs monolito modular según contexto operacional.",
              ],
              puntaje: 25,
            },
            {
              id: "sub_ent2_2",
              nombre: "Diseño de Integraciones y Seguridad",
              descriptores: [
                "Protocolos de autenticación, autorización y cifrado en tránsito y en reposo.",
                "Patrones de resiliencia y tolerancia a fallos (Circuit Breaker, Retry y Rate Limiting).",
                "Manejo seguro de credenciales y secretos en entornos distribuidos.",
              ],
              puntaje: 25,
            },
          ],
        },
      ],
    },
    {
      id: "rub_ent2_2",
      nombre: "Marcos Ágiles y Dirección de Proyectos",
      puntajeRubro: 50,
      criterios: [
        {
          id: "crit_ent2_2",
          nombre: "Principios de Gestión y Control de Riesgos",
          subcriterios: [
            {
              id: "sub_ent2_3",
              nombre: "Estimación y Gestión del Alcance Ágil",
              descriptores: [
                "Cálculo de velocidad de equipo, burn-down y calibración técnica con Story Points.",
                "Priorización por valor de negocio y costo del retraso (WSJF).",
                "Mecanismos de negociación de backlog ante cambios imprevistos de requerimientos.",
              ],
              puntaje: 25,
            },
            {
              id: "sub_ent2_4",
              nombre: "Matriz de Severidad y Mitigación de Riesgos",
              descriptores: [
                "Clasificación cuantitativa y cualitativa de riesgos según probabilidad e impacto.",
                "Diseño de planes de contingencia viables y asignación de responsables.",
                "Estrategias de comunicación transparente de contingencias con los interesados.",
              ],
              puntaje: 25,
            },
          ],
        },
      ],
    },
  ],
  3: [
    {
      id: "rub_ent3_1",
      nombre: "Implementación de Arquitectura y Pipeline CI/CD",
      puntajeRubro: 50,
      criterios: [
        {
          id: "crit_ent3_1",
          nombre: "Infraestructura Base y Repositorio",
          subcriterios: [
            {
              id: "sub_ent3_1",
              nombre: "Pipeline de Integración Continua (CI/CD)",
              descriptores: [
                "Pipeline de CI operativo con linters, verificación de tipado estricto y build automático.",
                "Estrategia de ramas (GitFlow / Trunk-based) documentada y adoptada disciplinadamente.",
                "Ambiente de staging o despliegue preliminar accesible para pruebas.",
              ],
              puntaje: 25,
            },
            {
              id: "sub_ent3_2",
              nombre: "Esquema de Base de Datos y APIs Base",
              descriptores: [
                "Modelo de datos normalizado con scripts de migración versionados y reproducibles.",
                "Endpoints REST/GraphQL iniciales implementados con validación rigurosa de entradas.",
                "Pruebas unitarias de integridad de datos y modelos centrales.",
              ],
              puntaje: 25,
            },
          ],
        },
      ],
    },
    {
      id: "rub_ent3_2",
      nombre: "Avance del MVP y Trazabilidad de Gestión",
      puntajeRubro: 50,
      criterios: [
        {
          id: "crit_ent3_2",
          nombre: "Velocidad de Equipo y Control del Alcance",
          subcriterios: [
            {
              id: "sub_ent3_3",
              nombre: "Historias Críticas del Primer Mes Completadas",
              descriptores: [
                "Al menos 3 historias del núcleo esencial terminadas con Definition of Done verificado.",
                "Demostración funcional navegable del flujo inicial de usuario.",
                "Cero deuda técnica de bloqueo acumulada en el primer hito.",
              ],
              puntaje: 25,
            },
            {
              id: "sub_ent3_4",
              nombre: "Seguimiento del Cronograma y Desviaciones",
              descriptores: [
                "Comparativa gráfica y cuantitativa entre avance planificado vs avance real.",
                "Registro documentado de impedimentos técnicos resueltos colaborativamente.",
                "Plan de mitigación si existiesen desviaciones respecto a la ruta crítica.",
              ],
              puntaje: 25,
            },
          ],
        },
      ],
    },
  ],
  4: [
    {
      id: "rub_ent4_1",
      nombre: "Prototipo Funcional Integrado (MVP)",
      puntajeRubro: 50,
      criterios: [
        {
          id: "crit_ent4_1",
          nombre: "Completitud Funcional y Calidad de Código",
          subcriterios: [
            {
              id: "sub_ent4_1",
              nombre: "Flujo End-to-End Totalmente Operativo",
              descriptores: [
                "Flujo principal de usuario ejecutable de punta a punta (UI, backend y base de datos).",
                "Manejo consistente de excepciones y retroalimentación clara de errores al usuario.",
                "Diseño visual responsivo adaptado a los perfiles de usuario especificados.",
              ],
              puntaje: 25,
            },
            {
              id: "sub_ent4_2",
              nombre: "Cobertura de Pruebas Automatizadas",
              descriptores: [
                "Batería de pruebas unitarias y de integración sobre la lógica de negocio nuclear.",
                "Cobertura mínima de código verificada en el pipeline automatizado.",
                "Pruebas de casos borde y validación de seguridad básica.",
              ],
              puntaje: 25,
            },
          ],
        },
      ],
    },
    {
      id: "rub_ent4_2",
      nombre: "Validación con el Mandante y Rendimiento",
      puntajeRubro: 50,
      criterios: [
        {
          id: "crit_ent4_2",
          nombre: "Retroalimentación Real y Ajustes Técnicos",
          subcriterios: [
            {
              id: "sub_ent4_3",
              nombre: "Acta de Validación con el Mandante",
              descriptores: [
                "Evidencia formal de reunión de demostración intermedia con el mandante real.",
                "Registro de observaciones y acuerdos de ajuste pactados para la versión final.",
                "Nivel de satisfacción del mandante respecto al avance presentado.",
              ],
              puntaje: 25,
            },
            {
              id: "sub_ent4_4",
              nombre: "Pruebas de Rendimiento y Carga Preliminar",
              descriptores: [
                "Medición de tiempos de respuesta en consultas pesadas o concurrentes.",
                "Aislamiento y resolución de cuellos de botella detectados.",
                "Monitoreo de consumo de recursos y costos de infraestructura cloud.",
              ],
              puntaje: 25,
            },
          ],
        },
      ],
    },
  ],
  5: [
    {
      id: "rub_ent5_1",
      nombre: "Solución Tecnológica Desplegada en Producción",
      puntajeRubro: 50,
      criterios: [
        {
          id: "crit_ent5_1",
          nombre: "Despliegue Cloud y Operatividad Real",
          subcriterios: [
            {
              id: "sub_ent5_1",
              nombre: "Disponibilidad en Entorno Productivo Real",
              descriptores: [
                "Software 100% desplegado en la nube con dominio propio, certificado SSL/HTTPS y alta disponibilidad.",
                "Cumplimiento total del alcance pactado con el mandante institucional.",
                "Base de datos productiva respaldada con políticas de backup automatizadas.",
              ],
              puntaje: 25,
            },
            {
              id: "sub_ent5_2",
              nombre: "Telemetría, Monitoreo y Manuales Técnicos",
              descriptores: [
                "Monitoreo activo de errores en vivo y alertas automáticas configuradas.",
                "Documentación completa de APIs (Swagger/OpenAPI) y guía de arquitectura para mantenedores.",
                "Manual de usuario final y procedimientos de administración del sistema.",
              ],
              puntaje: 25,
            },
          ],
        },
      ],
    },
    {
      id: "rub_ent5_2",
      nombre: "Defensa Oral ante Comisión y Reporte Final",
      puntajeRubro: 50,
      criterios: [
        {
          id: "crit_ent5_2",
          nombre: "Demostración en Vivo y Memoria Técnica",
          subcriterios: [
            {
              id: "sub_ent5_3",
              nombre: "Demostración en Vivo y Ronda de Preguntas",
              descriptores: [
                "Demostración en vivo impecable ante la comisión sin caídas de software.",
                "Dominio técnico, justificación rigurosa de trade-offs arquitectónicos y oratoria profesional.",
                "Participación activa y equilibrada de todos los miembros del grupo.",
              ],
              puntaje: 25,
            },
            {
              id: "sub_ent5_4",
              nombre: "Memoria Técnica y Acta de Recepción del Mandante",
              descriptores: [
                "Memoria técnica exhaustiva que detalla arquitectura, costos, lecciones aprendidas y trabajo futuro.",
                "Acta formal de entrega y recepción final firmada conforme por el mandante.",
                "Balance del valor de ingeniería entregado y aporte al entorno real.",
              ],
              puntaje: 25,
            },
          ],
        },
      ],
    },
  ],
};

/**
 * Convierte una lista plana de RubricCriterion en una matriz jerárquica
 * estructurada en Rubros, Criterios y Subcriterios con descriptores oficiales.
 */
export function convertRubricCriteriaToMatrix(
  criteria: RubricCriterion[]
): RubricMatrixRubro[] {
  if (!criteria || criteria.length === 0) {
    return [
      {
        id: "rub_gen_1",
        nombre: "Calidad Técnica y Ejecución",
        puntajeRubro: 100,
        criterios: [
          {
            id: "crit_gen_1",
            nombre: "Criterios Generales de la Actividad",
            subcriterios: [
              {
                id: "sub_gen_1",
                nombre: "Cumplimiento de Objetivos del Taller",
                descriptores: [
                  "Aplicación rigurosa de las instrucciones y consignas del taller.",
                  "Fundamentación técnica adecuada en la resolución propuesta.",
                ],
                puntaje: 50,
              },
              {
                id: "sub_gen_2",
                nombre: "Evidencia y Formato de Entrega",
                descriptores: [
                  "Entrega puntual dentro del plazo reglamentario.",
                  "Claridad expositiva y presentación profesional del reporte.",
                ],
                puntaje: 50,
              },
            ],
          },
        ],
      },
    ];
  }

  // Dividir criterios en 2 rubros
  const mitad = Math.ceil(criteria.length / 2);
  const grupo1 = criteria.slice(0, mitad);
  const grupo2 = criteria.slice(mitad);

  const mapGrupoToRubro = (
    nombreRubro: string,
    rubroId: string,
    critList: RubricCriterion[]
  ): RubricMatrixRubro => {
    const subs = critList.map((c, idx) => ({
      id: c.id || `sub_${rubroId}_${idx}`,
      nombre: c.descripcion.split(">").pop()?.trim() || c.descripcion,
      descriptores: c.indicadores && c.indicadores.length > 0
        ? c.indicadores.map((ind) => `${ind.nivel}: ${ind.detalle}`)
        : ["Cumplimiento conforme al estándar esperado de la cátedra."],
      puntaje: c.puntaje_max || 25,
    }));

    const totalRubro = subs.reduce((a, s) => a + s.puntaje, 0);

    return {
      id: rubroId,
      nombre: nombreRubro,
      puntajeRubro: totalRubro,
      criterios: [
        {
          id: `crit_${rubroId}`,
          nombre: "Evaluación de Competencias y Desempeño",
          subcriterios: subs,
        },
      ],
    };
  };

  return [
    mapGrupoToRubro("Dimensión Técnica y Aplicación", "rub_1", grupo1),
    ...(grupo2.length > 0
      ? [mapGrupoToRubro("Dimensión de Gestión y Evidencia", "rub_2", grupo2)]
      : []),
  ];
}
