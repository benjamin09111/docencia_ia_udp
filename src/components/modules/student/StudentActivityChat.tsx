"use client";

import React, { useState } from "react";
import { Bot, Send } from "lucide-react";
import { sendAgentQuery } from "@/services/aiAgentService";

export const StudentActivityChat: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ sender: "user" | "agent"; text: string }>>([
    {
      sender: "agent",
      text: "¡Hola! Soy el Agente de Ayudantía. Conozco las reglas de esta dinámica, la rúbrica y los estándares PMBOK requeridos. ¿Tienes dudas antes de entregar?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const query = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: query }]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await sendAgentQuery({
        agentRole: "activity_assistant",
        message: query,
      });
      setIsTyping(false);
      setMessages((prev) => [...prev, { sender: "agent", text: res.reply }]);
    } catch {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "agent",
          text: "No fue posible conectar con el asistente. Intenta nuevamente.",
        },
      ]);
    }
  };

  return (
    <div className="bg-white border border-[#E0E3E6] rounded-[4px] shadow-canvas-card flex flex-col h-[480px] xl:h-[540px]">
      <div className="p-3.5 border-b border-[#E0E3E6] bg-[#F9FAFB] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-100 text-[#008EE2] flex items-center justify-center font-bold text-xs">
            <Bot size={15} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#2D3B45]">Tutor de la Actividad</h3>
            <span className="text-[10px] text-[#2E7D32] font-medium">● Orientación sobre criterios de rúbrica</span>
          </div>
        </div>
        <span className="text-[10px] bg-[#F5F6F8] border border-[#C7CDD1] text-[#2D3B45] px-1.5 py-0.5 rounded font-semibold">
          Canvas IA
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex gap-2 ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
            {m.sender === "agent" && (
              <div className="w-5 h-5 rounded-full bg-blue-50 text-[#008EE2] border border-blue-200 flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold">
                IA
              </div>
            )}
            <div
              className={`p-2.5 rounded-[4px] max-w-[85%] leading-relaxed ${
                m.sender === "user"
                  ? "bg-[#B71C1C] text-white"
                  : "bg-[#F5F6F8] text-[#2D3B45] border border-[#E0E3E6]"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="text-[11px] text-[#6B7780] italic flex items-center gap-1">
            <span className="animate-spin inline-block">⏳</span> Asistente analizando rúbrica...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t border-[#E0E3E6] bg-white flex gap-2">
        <input
          type="text"
          placeholder="Pregunta sobre la rúbrica o criterios..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 text-xs border border-[#C7CDD1] rounded-[3px] px-3 py-2 text-[#2D3B45] focus:outline-none focus:ring-1 focus:ring-[#008EE2]"
        />
        <button
          type="submit"
          className="px-3.5 py-2 bg-[#B71C1C] hover:bg-[#8B1010] text-white text-xs font-semibold rounded-[3px] transition-colors flex items-center gap-1.5"
        >
          <Send size={12} />
          <span>Enviar</span>
        </button>
      </form>
    </div>
  );
};
