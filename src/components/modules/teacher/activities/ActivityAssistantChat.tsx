"use client";

import React from "react";
import { Bot, Send } from "lucide-react";

export interface ChatMessageItem {
  sender: "user" | "agent";
  text: string;
}

interface ActivityAssistantChatProps {
  chatMessages: ChatMessageItem[];
  chatInput: string;
  setChatInput: (v: string) => void;
  isTyping: boolean;
  onSendMessage: (e: React.FormEvent) => void;
}

export const ActivityAssistantChat: React.FC<ActivityAssistantChatProps> = ({
  chatMessages,
  chatInput,
  setChatInput,
  isTyping,
  onSendMessage,
}) => {
  return (
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
      <form onSubmit={onSendMessage} className="p-3 border-t border-gray-200 flex gap-2 bg-white">
        <input
          type="text"
          placeholder="Pregúntale al agente o pídele cambios para cualquier paso..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          className="flex-1 text-xs border border-gray-300 rounded-[4px] px-3 py-2 focus:ring-1 focus:ring-[#008EE2]"
        />
        <button
          type="submit"
          className="px-3.5 py-2 bg-[#2D3B45] hover:bg-[#1E272E] text-white rounded-[4px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Send size={12} />
          <span>Enviar</span>
        </button>
      </form>
    </div>
  );
};
