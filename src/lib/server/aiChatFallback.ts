import type { AiAgentRole } from "@/types/ai";

/** Contingencia local institucional cuando el microservicio no responde. */
export function buildLocalAiChatReply(
  agentRole: AiAgentRole,
  message: string,
  courseName?: string,
  courseCode?: string
): { reply: string; sources: string[] } {
  const lower = message.toLowerCase();

  switch (agentRole) {
    case "activity_assistant":
      if (lower.includes("instruccion") || lower.includes("paso")) {
        return {
          sources: ["Catálogo Oficial de Metodologías Activas CREA UDP"],
          reply:
            "Le recomiendo estructurar la dinámica con tiempos acotados (ej. 15 min de análisis, 20 min de debate, 10 min de conclusiones) y solicitar un entregable formal de máximo 2 páginas para resguardar la carga cognitiva.",
        };
      }
      if (lower.includes("decima") || lower.includes("nota") || lower.includes("evalua")) {
        return {
          sources: ["Catálogo Oficial de Metodologías Activas CREA UDP"],
          reply:
            "Recuerde que las actividades de ayudantía bonifican décimas formativas (+0.1 a +1.0) que se agregan directamente al hito oficial que usted determine, sin descalibrar las ponderaciones del 100% del curso.",
        };
      }
      if (lower.includes("rubrica") || lower.includes("pauta")) {
        return {
          sources: ["Catálogo Oficial de Metodologías Activas CREA UDP"],
          reply:
            "La rúbrica institucional está dividida en Rubros, Criterios y Subcriterios con descriptores observables sobre 100 puntos netos para evitar sesgos evaluativos.",
        };
      }
      return {
        sources: ["Catálogo Oficial de Metodologías Activas CREA UDP"],
        reply:
          "Entendido profesor. Puedo adaptar cualquier sección del taller (roles, tiempo o pauta oficial) para que se ajuste exactamente a sus objetivos de cátedra.",
      };

    case "theoretical_tutor":
      if (lower.includes("rto") || lower.includes("rpo") || lower.includes("disponibilidad")) {
        return {
          sources: ["Software Architecture in Practice (Bass et al.)", "Guía PMBOK 7ma Edición"],
          reply:
            "📌 RTO (Recovery Time Objective) es el tiempo máximo admisible para restaurar la operatividad del sistema tras un incidente. RPO (Recovery Point Objective) es el volumen tolerable de pérdida transaccional de datos medido en tiempo. Ambos deben figurar en la medida de respuesta de su escenario.",
        };
      }
      if (lower.includes("pmbok") || lower.includes("principio")) {
        return {
          sources: ["Software Architecture in Practice (Bass et al.)", "Guía PMBOK 7ma Edición"],
          reply:
            "La Guía PMBOK 7ma Edición estructura 12 principios rectores orientados a entrega continua de valor. En las evaluaciones se priorizan: Liderazgo adaptativo, Diseño de calidad intrínseca y Navegación proactiva ante riesgos e incertidumbre.",
        };
      }
      if (lower.includes("microservicio") || lower.includes("monolito")) {
        return {
          sources: ["Software Architecture in Practice (Bass et al.)", "Guía PMBOK 7ma Edición"],
          reply:
            "El trade-off fundamental reside en complejidad operacional vs bajo acoplamiento. Los microservicios ofrecen escalabilidad granular pero demandan observabilidad distribuida, consistencia eventual (Sagas) y resiliencia en red (Circuit Breaker).",
        };
      }
      return {
        sources: ["Software Architecture in Practice (Bass et al.)", "Guía PMBOK 7ma Edición"],
        reply:
          "Según el marco conceptual oficial de la Escuela de Informática UDP, las decisiones de arquitectura deben fundamentarse en atributos de calidad cuantificables y matrices de trade-offs verificables.",
      };

    case "technical_tutor":
      if (lower.includes("asistencia") || lower.includes("ri")) {
        return {
          sources: ["Descriptor Oficial sandbox", "Reglamento Académico UDP"],
          reply:
            "La normativa de la Escuela exige un mínimo del 75% de asistencia a cátedras y ayudantías. Quedar bajo este umbral activa causal de Reprobación por Inasistencia (RI).",
        };
      }
      return {
        sources: ["Descriptor Oficial sandbox", "Reglamento Académico UDP"],
        reply: `Para la asignatura ${courseName || "sandbox"} (${courseCode || "CIT3000"}), los parámetros de sala, ayudantía y condiciones de eximición están regulados por el descriptor vigente.`,
      };

    default:
      return {
        sources: ["Ecosistema Docente IA UDP"],
        reply: "Consulta procesada por el motor de agentes institucional CREA UDP.",
      };
  }
}
