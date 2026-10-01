"use client";

import React, { useState } from "react";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import { Brain, Send, Bookmark, Sparkles, BookOpen, HelpCircle } from "lucide-react";

interface StudentLearnChatTabProps {
  onQuestionAsked?: () => void;
  preguntasContador?: number;
}

export const StudentLearnChatTab: React.FC<StudentLearnChatTabProps> = ({
  onQuestionAsked,
  preguntasContador = 0,
}) => {
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: "user" | "agent"; text: string; source?: string }>
  >([
    {
      sender: "agent",
      text: "¡Hola! Soy el Agente Tutor Teórico de la asignatura. Conozco en detalle toda la materia oficial: Atributos de Calidad (NFR), Patrones Arquitectónicos, Guía PMBOK 7ma Edición y la bibliografía de Joseph Phillips y Bass, Clements & Kazman. Pregúntame cualquier duda teórica o técnica para preparar tu Solemne.",
      source: "Bibliografía Oficial UDP • Bass, Clements & Kazman / PMBOK 7",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const query = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: "user", text: query }]);
    setChatInput("");
    setIsTyping(true);

    if (onQuestionAsked) {
      onQuestionAsked();
    }

    setTimeout(() => {
      setIsTyping(false);
      const lower = query.toLowerCase();
      let reply =
        "Según la cátedra de la Escuela de Informática UDP, los atributos de calidad guían la toma de decisiones arquitectónicas. Deben evaluarse mediante escenarios cuantificables que permitan verificar si la arquitectura cumple los requerimientos no funcionales (Cap. 4 Bass et al.).";
      let source = "Software Architecture in Practice (Bass, Clements, Kazman) • Cátedra UDP";

      if (lower.includes("pmbok") || lower.includes("principio")) {
        reply =
          "La Guía PMBOK 7ma Edición define 12 principios rectores centrados en valor continuo. Los más evaluados en las pruebas son:\n1. Demostrar liderazgo adaptativo ante la incertidumbre.\n2. Diseñar la calidad en los procesos y entregables técnicos.\n3. Navegar en la complejidad y responder activamente a los riesgos.";
        source = "PMBOK 7ma Edición • Dominios de Desempeño y Principios";
      } else if (lower.includes("rto") || lower.includes("rpo") || lower.includes("disponibilidad")) {
        reply =
          "📌 Métricas Clave de Recuperación:\n• RTO (Recovery Time Objective): Tiempo máximo aceptable para que el servicio vuelva a operar tras un fallo (ej. < 5 segundos en failover automático).\n• RPO (Recovery Point Objective): Volumen máximo admisible de pérdida transaccional de datos medido en tiempo (ej. 0 segundos si hay replicación sincrónica WAL).\nAmbos deben especificarse en la medida de respuesta del escenario de disponibilidad.";
        source = "Unidad 1: Atributos de Calidad y Escenarios Formales";
      } else if (lower.includes("microservicio") || lower.includes("monolito") || lower.includes("patron")) {
        reply =
          "El trade-off entre Monolito Modular y Microservicios radica en acoplamiento vs complejidad operacional. Los microservicios ofrecen escalabilidad independiente y despliegues aislados, pero demandan observabilidad avanzada (Distributed Tracing), consistencia eventual (Sagas) y tolerancia a fallos en red (Circuit Breaker).";
        source = "Unidad 2: Patrones y Estilos Arquitectónicos • Martin Fowler";
      } else if (lower.includes("fibonacci") || lower.includes("poker") || lower.includes("story") || lower.includes("estimac")) {
        reply =
          "Planning Poker emplea la escala Fibonacci modificada (1, 2, 3, 5, 8, 13...) porque la incertidumbre crece no linealmente al aumentar el tamaño del ítem. En la Solemne se evalúa que consideres tres factores: volumen de código, complejidad de integración externa e incertidumbre de requisitos.";
        source = "Unidad 3: Planificación y Estimación Ágil de Proyectos TIC";
      } else if (lower.includes("circuit") || lower.includes("breaker") || lower.includes("resiliencia")) {
        reply =
          "El patrón Circuit Breaker previene fallos en cascada operando en tres estados:\n1. Cerrado: El tráfico fluye normalmente al servicio externo.\n2. Abierto: Ante una tasa de fallas superior al umbral (ej. 50%), corta el tráfico y retorna un fallback inmediato sin saturar la red.\n3. Semi-abierto: Tras un tiempo de reposo, envía solicitudes de prueba para verificar si el servicio externo se recuperó.";
        source = "Unidad 4: Resiliencia Cloud y Microservicios Resilientes";
      }

      setChatMessages((prev) => [...prev, { sender: "agent", text: reply, source }]);
    }, 750);
  };

  return (
    <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-6 shadow-canvas-card space-y-4 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[11px] font-bold uppercase">
              Tutor Oficial de la Asignatura
            </span>
            <span className="text-xs text-[#6B7780]">Respuestas con base teórica UDP verificada</span>
          </div>
          <h2 className="text-base font-bold text-[#2D3B45] mt-1 flex items-center gap-2">
            <Brain size={18} className="text-[#008EE2]" />
            Aprendizaje y Consultas Teóricas (Agente del Curso)
          </h2>
          <p className="text-xs text-[#6B7780] mt-0.5">
            Consulta dudas sobre las 4 unidades del curso, preparación de solemnes, rúbricas y bibliografía PMBOK 7.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[11px] text-[#6B7780] block">Consultas en esta sesión:</span>
            <span className="text-xs font-bold text-[#008EE2]">{preguntasContador} preguntas</span>
          </div>
          <CanvasBadge variant="info">Base Teórica: 100%</CanvasBadge>
        </div>
      </div>

      {/* Caja de Conversación */}
      <div className="border border-gray-200 rounded-[4px] bg-[#F9FAFB] flex flex-col h-[460px] xl:h-[520px] max-h-[62vh]">
        {/* Historial de Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
          {chatMessages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.sender === "agent" && (
                <div className="w-7 h-7 rounded-full bg-blue-100 text-[#008EE2] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                  <Brain size={15} />
                </div>
              )}

              <div className={`space-y-1.5 max-w-[85%] ${m.sender === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`p-3.5 rounded-[4px] leading-relaxed whitespace-pre-wrap ${
                    m.sender === "user"
                      ? "bg-[#008EE2] text-white"
                      : "bg-white text-[#2D3B45] border border-gray-200"
                  }`}
                >
                  {m.text}
                </div>

                {m.source && (
                  <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1 pl-1">
                    <Bookmark size={11} className="text-[#008EE2]" /> {m.source}
                  </span>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-gray-500 italic p-2">
              <Brain size={14} className="animate-spin text-[#008EE2]" />
              <span>Consultando bibliografía oficial y descriptor de la asignatura...</span>
            </div>
          )}
        </div>

        {/* Chips de Consultas Sugeridas */}
        <div className="p-2.5 bg-white border-t border-gray-200 space-y-1">
          <span className="text-[10px] font-bold text-[#6B7780] uppercase tracking-wider block">
            💡 Consultas rápidas recomendadas para la Solemne:
          </span>
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            {[
              "¿Qué diferencia hay entre RTO y RPO en un escenario de disponibilidad?",
              "Explícame los 12 principios de la Guía PMBOK 7ma Edición.",
              "¿Cómo funciona el patrón Circuit Breaker y cuáles son sus 3 estados?",
              "¿Cómo justificar la estimación con Fibonacci en la Solemne?",
            ].map((chip, i) => (
              <button
                key={i}
                onClick={() => setChatInput(chip)}
                className="bg-gray-100 hover:bg-blue-50 hover:border-blue-300 border border-gray-200 px-2.5 py-1 rounded text-[#2D3B45] transition-colors"
              >
                {chip.slice(0, 38)}...
              </button>
            ))}
          </div>
        </div>

        {/* Formulario de Envío */}
        <form onSubmit={handleSendMessage} className="p-3 bg-[#F9FAFB] border-t border-gray-200 flex gap-2">
          <input
            type="text"
            placeholder="Pregúntale al agente sobre cualquier concepto, patrón, táctica o contenido del curso..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="flex-1 text-xs border border-gray-300 rounded-[4px] px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-[#008EE2]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#2D3B45] hover:bg-[#1E272E] text-white rounded-[4px] text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Send size={13} />
            <span>Consultar</span>
          </button>
        </form>
      </div>
    </div>
  );
};
