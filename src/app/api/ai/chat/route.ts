import { NextRequest, NextResponse } from "next/server";
import { AiChatRequest, AiChatResponse } from "@/types/ai";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AiChatRequest;
    const { agentRole, message, courseCode, courseName } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "El mensaje es requerido." }, { status: 400 });
    }

    const lower = message.toLowerCase();
    let reply = "";
    let sources: string[] = [];

    // Lógica modular según el rol del agente (Preparada para conectar OpenAI/Anthropic/Gemini)
    switch (agentRole) {
      case "activity_assistant":
        sources = ["Catálogo Oficial de Metodologías Activas CREA UDP"];
        if (lower.includes("instruccion") || lower.includes("paso")) {
          reply =
            "Le recomiendo estructurar la dinámica con tiempos acotados (ej. 15 min de análisis, 20 min de debate, 10 min de conclusiones) y solicitar un entregable formal de máximo 2 páginas para resguardar la carga cognitiva.";
        } else if (lower.includes("decima") || lower.includes("nota") || lower.includes("evalua")) {
          reply =
            "Recuerde que las actividades de ayudantía bonifican décimas formativas (+0.1 a +1.0) que se agregan directamente al hito oficial que usted determine, sin descalibrar las ponderaciones del 100% del curso.";
        } else if (lower.includes("rubrica") || lower.includes("pauta")) {
          reply =
            "La rúbrica institucional está dividida en Rubros, Criterios y Subcriterios con descriptores observables sobre 100 puntos netos para evitar sesgos evaluativos.";
        } else {
          reply =
            "Entendido profesor. Puedo adaptar cualquier sección del taller (roles, tiempo o pauta oficial) para que se ajuste exactamente a sus objetivos de cátedra.";
        }
        break;

      case "theoretical_tutor":
        sources = ["Software Architecture in Practice (Bass et al.)", "Guía PMBOK 7ma Edición"];
        if (lower.includes("rto") || lower.includes("rpo") || lower.includes("disponibilidad")) {
          reply =
            "📌 RTO (Recovery Time Objective) es el tiempo máximo admisible para restaurar la operatividad del sistema tras un incidente. RPO (Recovery Point Objective) es el volumen tolerable de pérdida transaccional de datos medido en tiempo. Ambos deben figurar en la medida de respuesta de su escenario.";
        } else if (lower.includes("pmbok") || lower.includes("principio")) {
          reply =
            "La Guía PMBOK 7ma Edición estructura 12 principios rectores orientados a entrega continua de valor. En las evaluaciones se priorizan: Liderazgo adaptativo, Diseño de calidad intrínseca y Navegación proactiva ante riesgos e incertidumbre.";
        } else if (lower.includes("microservicio") || lower.includes("monolito")) {
          reply =
            "El trade-off fundamental reside en complejidad operacional vs bajo acoplamiento. Los microservicios ofrecen escalabilidad granular pero demandan observabilidad distribuida, consistencia eventual (Sagas) y resiliencia en red (Circuit Breaker).";
        } else {
          reply =
            "Según el marco conceptual oficial de la Escuela de Informática UDP, las decisiones de arquitectura deben fundamentarse en atributos de calidad cuantificables y matrices de trade-offs verificables.";
        }
        break;

      case "technical_tutor":
        sources = ["Descriptor Oficial CIT3203", "Reglamento Académico UDP"];
        if (lower.includes("asistencia") || lower.includes("ri")) {
          reply =
            "La normativa de la Escuela exige un mínimo del 75% de asistencia a cátedras y ayudantías. Quedar bajo este umbral activa causal de Reprobación por Inasistencia (RI).";
        } else {
          reply = `Para la asignatura ${courseName || "oficial"} (${courseCode || "CIT3203"}), los parámetros de sala, ayudantía y condiciones de eximición están regulados por el descriptor vigente.`;
        }
        break;

      default:
        reply = "Consulta procesada por el motor de agentes institucional CREA UDP.";
        sources = ["Ecosistema Docente IA UDP"];
    }

    const response: AiChatResponse = {
      reply,
      agentRole,
      tokensUsed: Math.round(reply.length / 4),
      sources,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error en API de Agente IA:", error);
    return NextResponse.json(
      { error: "Error interno al procesar la consulta con el agente." },
      { status: 500 }
    );
  }
}
