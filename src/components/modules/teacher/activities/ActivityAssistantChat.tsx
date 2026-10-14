"use client";

import React from "react";
import { Bot, Send } from "lucide-react";
import { CanvasButton } from "@/components/canvas/CanvasButton";

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
    <aside
      aria-label="Copiloto de Actividades Formativas"
      className="w-full h-full bg-white border border-[#C7CDD1] rounded-[3px] shadow-2xs flex flex-col overflow-hidden"
    >
      {/* Header Canvas con tipografía clara y sin colores estridentes */}
      <div className="p-4 border-b border-[#C7CDD1] flex items-center justify-between bg-[#F5F6F8] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-100 text-[#B71C1C] flex items-center justify-center shrink-0">
            <Bot size={17} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#2D3B45]">
              Copiloto de Actividades
            </h3>
            <span className="text-xs text-[#2E7D32] font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2E7D32] inline-block" />
              Asistente Pedagógico Activo
            </span>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-white text-[#2D3B45] border border-[#C7CDD1]">
          CREA UDP
        </span>
      </div>

      {/* Lista de Mensajes con tipografía legible Canvas (13.5px) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-[13.5px]">
        {chatMessages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "agent" && (
              <div className="w-7 h-7 rounded-full bg-[#F5F6F8] text-[#B71C1C] border border-[#C7CDD1] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                IA
              </div>
            )}

            <div className={`space-y-1 max-w-[85%] ${msg.sender === "user" ? "items-end" : "items-start"}`}>
              <div
                className={`p-3.5 rounded-[4px] leading-relaxed shadow-2xs ${
                  msg.sender === "user"
                    ? "bg-[#B71C1C] text-white font-medium"
                    : "bg-[#F5F6F8] text-[#2D3B45] border border-[#C7CDD1]"
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-[#6B7780] italic p-2">
            <Bot size={14} className="animate-spin text-[#B71C1C]" />
            <span>Consultando modelo pedagógico...</span>
          </div>
        )}
      </div>

      {/* Input de Chat Canvas con CanvasButton */}
      <form onSubmit={onSendMessage} className="p-3 border-t border-[#C7CDD1] flex gap-2 bg-[#F9FAFB] shrink-0">
        <input
          type="text"
          placeholder="Pregúntale al copiloto o solicita ajustes al taller..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          className="flex-1 text-[13px] bg-white border border-[#C7CDD1] rounded-[3px] px-3.5 py-2 text-[#2D3B45] focus:outline-none focus:border-[#B71C1C]"
        />
        <CanvasButton
          type="submit"
          variant="primary-udp"
          size="sm"
          icon={<Send size={13} />}
        >
          Enviar
        </CanvasButton>
      </form>
    </aside>
  );
};
