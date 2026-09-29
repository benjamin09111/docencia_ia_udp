"use client";

import React, { useState } from "react";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import {
  Brain,
  Send,
  Sparkles,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Zap,
  Bookmark,
  Award,
} from "lucide-react";

export const StudentLearnTab: React.FC = () => {
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: "user" | "agent"; text: string; source?: string }>
  >([
    {
      sender: "agent",
      text: "¡Hola Benjamín! Soy el Agente Teórico del Curso. Tengo indexada toda la bibliografía oficial de Proyecto en TICs II: la Guía PMBOK 7ma Edición, IT Project Management de Joseph Phillips y las 7 unidades temáticas de la UDP. Reemplazo el uso de ChatGPT genérico para que estudies con respuestas 100% alineadas a las pruebas y solemnes. ¿Qué concepto deseas repasar hoy?",
      source: "Bibliografía Oficial EIT UDP • PMBOK 7ma Edición",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const query = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: query }]);
    setChatInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const lower = query.toLowerCase();
      let reply =
        "Según la cátedra oficial de la UDP, un proyecto TIC debe gestionarse bajo un enfoque adaptativo o predictivo según la incertidumbre de los requisitos (Capítulo 2 PMBOK).";
      let source = "PMBOK Guide 7th Edition • Joseph Phillips";

      if (lower.includes("pmbok") || lower.includes("principio")) {
        reply =
          "La Guía PMBOK 7ma Edición se basa en 12 principios orientados a la entrega de valor, reemplazando las 10 áreas de conocimiento rígidas de la 6ta edición. Los 3 más evaluados en las pruebas son: 1. Demostrar liderazgo adaptativo, 2. Diseñar la calidad en los procesos y entregables, y 3. Navegar en la complejidad y responder a la incertidumbre técnica.";
        source = "PMBOK 7ma Edición • Dominios de Desempeño";
      } else if (lower.includes("rto") || lower.includes("rpo") || lower.includes("disponibilidad")) {
        reply =
          "El RTO (Recovery Time Objective) es la duración máxima admisible para restablecer el servicio tras una caída (ej. 30 segundos). El RPO (Recovery Point Objective) es el volumen máximo de datos transaccionales tolerables a perder (ej. 0 transacciones si hay replicación sincrónica). Ambos son atributos no funcionales obligatorios en los reportes de avance.";
        source = "Unidad 4: Gestión de Calidad y Arquitectura TIC";
      } else if (lower.includes("poker") || lower.includes("estimac") || lower.includes("fibonacci") || lower.includes("story")) {
        reply =
          "Planning Poker utiliza la serie Fibonacci (1, 2, 3, 5, 8, 13...) porque la incertidumbre crece exponencialmente con el tamaño de la tarea. En la prueba te pedirán justificar un puntaje alto: no solo por la cantidad de código, sino por la integración de APIs externas, concurrencia de datos y falta de documentación previa.";
        source = "Unidad 2: Planificación y Estimación de Esfuerzo";
      } else if (lower.includes("pregunta") || lower.includes("solemne") || lower.includes("prueba") || lower.includes("ensayo")) {
        reply =
          "🎯 Pregunta de Ensayo para la Solemne:\n\n'Una empresa de retail exige añadir pasarela de pagos con criptomonedas a 3 semanas del lanzamiento. ¿Qué táctica de negociación y qué ajuste al EDT/WBS propondrías aplicando la Guía PMBOK?'\n\nPista de respuesta: Renegociar alcance esencial (MVP), evaluar riesgo de cumplimiento legal (SLA) y aislar el módulo en un sprint posterior.";
        source = "Simulador de Solemne Oficial CIT3203";
      }

      setChatMessages((prev) => [...prev, { sender: "agent", text: reply, source }]);
    }, 850);
  };

  const handleQuickChip = (prompt: string) => {
    setChatInput(prompt);
  };

  return (
    <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-6 shadow-canvas-card space-y-4 animate-fadeIn">
      {/* Header del Espacio de Aprendizaje */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[11px] font-bold uppercase">
              Tutor Oficial de la Asignatura
            </span>
            <span className="text-xs text-[#6B7780]">Reemplazo Oficial de ChatGPT para Pruebas</span>
          </div>
          <h2 className="text-base font-bold text-[#2D3B45] mt-1 flex items-center gap-2">
            <Brain size={18} className="text-[#008EE2]" />
            Aprender con el Agente Teórico (Bibliografía UDP & PMBOK 7)
          </h2>
          <p className="text-xs text-[#6B7780] mt-0.5">
            Entrenado con el descriptor oficial, el libro guía de Joseph Phillips y los criterios de corrección de la cátedra.
          </p>
        </div>

        <div className="text-right">
          <CanvasBadge variant="info">Base Teórica: 100% Verificada</CanvasBadge>
        </div>
      </div>

      {/* Caja del Chat */}
      <div className="border border-gray-200 rounded-[4px] bg-[#F9FAFB] flex flex-col h-[520px]">
        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {chatMessages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.sender === "agent" && (
                <div className="w-8 h-8 rounded-full bg-blue-100 text-[#008EE2] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                  <Brain size={16} />
                </div>
              )}

              <div className={`space-y-1.5 max-w-[85%] ${m.sender === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`p-3.5 rounded-[6px] leading-relaxed whitespace-pre-wrap ${
                    m.sender === "user"
                      ? "bg-[#008EE2] text-white shadow-xs"
                      : "bg-white text-[#2D3B45] border border-gray-200 shadow-xs"
                  }`}
                >
                  {m.text}
                </div>

                {m.source && (
                  <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1 pl-1">
                    <Bookmark size={11} className="text-[#008EE2]" /> Fuente: {m.source}
                  </span>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-gray-500 italic">
              <Brain size={14} className="animate-spin text-[#008EE2]" />
              <span>Consultando Guía PMBOK y descriptor oficial...</span>
            </div>
          )}
        </div>

        {/* Chips de Preguntas Frecuentes para Preparar Pruebas */}
        <div className="p-3 bg-white border-t border-gray-200 space-y-1.5">
          <span className="text-[10px] font-bold text-[#6B7780] uppercase tracking-wider block">
            💡 Temas Clave de Estudio para la Solemne:
          </span>
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            <button
              onClick={() => handleQuickChip("Explícame los 12 principios de la Guía PMBOK 7 y cuáles son los más evaluados.")}
              className="bg-gray-100 hover:bg-blue-50 hover:border-blue-300 border border-gray-200 px-2.5 py-1 rounded text-[#2D3B45] transition-colors"
            >
              📘 12 Principios PMBOK 7
            </button>
            <button
              onClick={() => handleQuickChip("¿Cómo justificar la estimación con Story Points y Fibonacci en la Solemne?")}
              className="bg-gray-100 hover:bg-blue-50 hover:border-blue-300 border border-gray-200 px-2.5 py-1 rounded text-[#2D3B45] transition-colors"
            >
              ⚡ Story Points y Fibonacci
            </button>
            <button
              onClick={() => handleQuickChip("¿Qué diferencia hay entre RTO y RPO en un informe de avance?")}
              className="bg-gray-100 hover:bg-blue-50 hover:border-blue-300 border border-gray-200 px-2.5 py-1 rounded text-[#2D3B45] transition-colors"
            >
              🛡️ Métricas RTO y RPO
            </button>
            <button
              onClick={() => handleQuickChip("Genera una pregunta tipo prueba sobre Gestión de Contratos y Riesgos TIC.")}
              className="bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2.5 py-1 rounded text-purple-900 font-semibold transition-colors"
            >
              🎯 Pregunta de Ensayo para la Solemne
            </button>
          </div>
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-3 bg-[#F9FAFB] border-t border-gray-200 flex gap-2">
          <input
            type="text"
            placeholder="Escribe tu consulta teórica o pide que te prepare una pregunta de prueba..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="flex-1 text-xs border border-gray-300 rounded-[4px] px-3 py-2 bg-white focus:ring-1 focus:ring-[#008EE2]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#2D3B45] hover:bg-[#1E272E] text-white rounded-[4px] text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Send size={12} />
            <span>Consultar</span>
          </button>
        </form>
      </div>
    </div>
  );
};
