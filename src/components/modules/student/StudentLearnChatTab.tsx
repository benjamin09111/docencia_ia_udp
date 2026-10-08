"use client";

import React, { useState } from "react";
import { Brain, Send, Bookmark } from "lucide-react";
import { sendAgentQuery } from "@/services/aiAgentService";

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
      text: "¡Hola! Soy el Agente Tutor Teórico de la asignatura. Conozco en detalle toda la materia oficial: Atributos de Calidad (NFR), Patrones Arquitectónicos, Guía PMBOK 7ma Edición y la bibliografía de Joseph Phillips y Bass, Clements & Kazman. Pregúntame cualquier duda teórica para preparar tu Solemne.",
      source: "Bibliografía Oficial UDP • Bass, Clements & Kazman / PMBOK 7",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const query = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: "user", text: query }]);
    setChatInput("");
    setIsTyping(true);

    if (onQuestionAsked) onQuestionAsked();

    try {
      const res = await sendAgentQuery({ agentRole: "theoretical_tutor", message: query });
      setIsTyping(false);
      setChatMessages((prev) => [
        ...prev,
        { sender: "agent", text: res.reply, source: res.sources?.[0] || "Bibliografía Oficial UDP" },
      ]);
    } catch {
      setIsTyping(false);
      setChatMessages((prev) => [
        ...prev,
        { sender: "agent", text: "No se pudo conectar con el Agente Tutor. Intenta nuevamente.", source: "Error de Conexión" },
      ]);
    }
  };

  return (
    <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card space-y-4 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#E0E3E6] pb-3">
        <div>
          <h2 className="text-base font-bold text-[#2D3B45] flex items-center gap-2">
            <Brain size={18} className="text-[#008EE2]" />
            Tutor Pedagógico de Cátedra & Consultas Teóricas
          </h2>
          <p className="text-xs text-[#6B7780] mt-0.5">
            Respuestas alineadas con las 4 unidades del curso, preparación de solemnes y bibliografía oficial UDP.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#2D3B45] bg-[#F5F6F8] border border-[#C7CDD1] px-2.5 py-1 rounded-[3px] font-semibold">
            Consultas en sesión: <strong>{preguntasContador}</strong>
          </span>
        </div>
      </div>

      <div className="border border-[#E0E3E6] rounded-[3px] bg-[#F9FAFB] flex flex-col h-[460px] xl:h-[520px]">
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
          {chatMessages.map((m, idx) => (
            <div key={idx} className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
              {m.sender === "agent" && (
                <div className="w-7 h-7 rounded-full bg-blue-100 text-[#008EE2] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                  <Brain size={15} />
                </div>
              )}
              <div className={`space-y-1 max-w-[85%] ${m.sender === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`p-3 rounded-[4px] leading-relaxed whitespace-pre-wrap ${
                    m.sender === "user" ? "bg-[#B71C1C] text-white" : "bg-white text-[#2D3B45] border border-[#E0E3E6]"
                  }`}
                >
                  {m.text}
                </div>
                {m.source && (
                  <span className="text-[10px] text-[#6B7780] font-mono flex items-center gap-1 pl-1">
                    <Bookmark size={11} className="text-[#008EE2]" /> {m.source}
                  </span>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-[#6B7780] italic p-2">
              <Brain size={14} className="animate-spin text-[#008EE2]" />
              <span>Consultando bibliografía oficial y descriptor de la asignatura...</span>
            </div>
          )}
        </div>

        <div className="p-2.5 bg-white border-t border-[#E0E3E6] space-y-1">
          <span className="text-[10px] font-bold text-[#6B7780] uppercase tracking-wider block">
            Consultas sugeridas para la Solemne:
          </span>
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            {[
              "¿Qué diferencia hay entre RTO y RPO en un escenario de disponibilidad?",
              "Explícame los 12 principios de la Guía PMBOK 7ma Edición.",
              "¿Cómo funciona el patrón Circuit Breaker y sus 3 estados?",
            ].map((chip, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setChatInput(chip)}
                className="bg-[#F5F6F8] hover:bg-gray-100 border border-[#C7CDD1] px-2.5 py-1 rounded-[3px] text-[#2D3B45] transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSendMessage} className="p-3 bg-[#F9FAFB] border-t border-[#E0E3E6] flex gap-2">
          <input
            type="text"
            placeholder="Pregúntale al agente sobre cualquier concepto, patrón o táctica del curso..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="flex-1 text-xs border border-[#C7CDD1] rounded-[3px] px-3 py-2 bg-white text-[#2D3B45] focus:outline-none focus:ring-1 focus:ring-[#008EE2]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#B71C1C] hover:bg-[#8B1010] text-white rounded-[3px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Send size={13} />
            <span>Consultar</span>
          </button>
        </form>
      </div>
    </div>
  );
};
