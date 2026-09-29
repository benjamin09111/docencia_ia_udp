"use client";

import React, { useState } from "react";
import { CourseDeliverable } from "@/types";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import {
  BookOpen,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  Bot,
  Layers,
  Sparkles,
  HelpCircle,
} from "lucide-react";

interface StudentDashboardTabProps {
  entregables: CourseDeliverable[];
}

export const StudentDashboardTab: React.FC<StudentDashboardTabProps> = ({ entregables }) => {
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "agent"; text: string }>>([
    {
      sender: "agent",
      text: "¡Hola Benjamín! Soy el Agente Técnico de Proyecto en TICs II. Conozco el descriptor oficial, fechas de calendario, RAPs y reglamento de asistencia del curso. ¿En qué duda administrativa o formal puedo ayudarte hoy?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const query = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: query }]);
    setChatInput("");

    setTimeout(() => {
      const lower = query.toLowerCase();
      let reply =
        "Según el descriptor oficial de la Escuela de Informática UDP, el curso cuenta con 6 créditos SCT y un esquema de 5 evaluaciones de 20% cada una.";

      if (lower.includes("asistencia") || lower.includes("ri") || lower.includes("inasistencia")) {
        reply =
          "La asistencia mínima obligatoria es del 75% tanto a cátedras como ayudantías. Actualmente tienes un 95% registrado, por lo que te encuentras sin riesgo de causal RI (Reprobado por Inasistencia).";
      } else if (lower.includes("fecha") || lower.includes("avance") || lower.includes("cuándo") || lower.includes("cuando")) {
        reply =
          "La próxima entrega oficial es el Reporte de Avance 1 (20%), programada para el 18 de octubre a las 23:59 hrs. Además, tienes disponible la actividad de ayudantía para sumar +0.3 décimas sobre esa nota.";
      } else if (lower.includes("rap") || lower.includes("resultado")) {
        reply =
          "El curso evalúa 6 RAPs: 1. Problemática TIC real, 2. Diseño de solución, 3. Planificación, riesgos y calidad PMBOK, 4. Contratos y adquisiciones, 5. Trabajo colaborativo, y 6. Comunicación efectiva oral y escrita.";
      }

      setChatMessages((prev) => [...prev, { sender: "agent", text: reply }]);
    }, 800);
  };

  const entregablesOficiales = entregables.filter((e) => e.tipo === "tarea_oficial" || !e.tipo);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Columna Izquierda: Ficha Técnica y Próximas Entregas (7 Cols) */}
      <div className="lg:col-span-7 space-y-4">
        {/* Ficha Técnica del Curso */}
        <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card space-y-4">
          <div className="flex justify-between items-start border-b border-gray-200 pb-3">
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                Facultad de Ingeniería y Ciencias UDP • Semestre 10
              </span>
              <h2 className="text-base font-bold text-[#2D3B45] mt-0.5">
                PROYECTO EN TICS II (CIT3621 / CIT3203)
              </h2>
            </div>
            <CanvasBadge variant="success">Asistencia: 95% (Sin Riesgo RI)</CanvasBadge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-[#F9FAFB] p-2.5 rounded border border-gray-200">
              <span className="text-[#6B7780] block text-[11px]">Régimen</span>
              <strong className="text-[#2D3B45]">6 Créditos SCT</strong>
            </div>
            <div className="bg-[#F9FAFB] p-2.5 rounded border border-gray-200">
              <span className="text-[#6B7780] block text-[11px]">Sesiones</span>
              <strong className="text-[#2D3B45]">2 Cátedras + 1 Ayud.</strong>
            </div>
            <div className="bg-[#F9FAFB] p-2.5 rounded border border-gray-200">
              <span className="text-[#6B7780] block text-[11px]">Asistencia Mínima</span>
              <strong className="text-[#C8102E]">75% Obligatoria</strong>
            </div>
            <div className="bg-[#F9FAFB] p-2.5 rounded border border-gray-200">
              <span className="text-[#6B7780] block text-[11px]">Esquema Notas</span>
              <strong className="text-[#008EE2]">5 x 20% = 100%</strong>
            </div>
          </div>

          {/* RAPs del Curso */}
          <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-[4px] space-y-1.5 text-xs text-[#0277BD]">
            <span className="font-bold flex items-center gap-1.5 text-xs">
              <BookOpen size={14} /> Resultados de Aprendizaje Principales (RAPs):
            </span>
            <p className="text-[11px] leading-relaxed text-[#01579B]">
              RAP 3: Planifica esfuerzo, costos, matriz de riesgos y calidad según estándares PMBOK • RAP 5: Trabajo colaborativo y resolución ágil de imprevistos.
            </p>
          </div>
        </div>

        {/* Cronograma de Entregas Oficiales (5 x 20%) */}
        <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-[#2D3B45] uppercase tracking-wider flex items-center gap-1.5">
              <Calendar size={14} className="text-[#008EE2]" />
              Cronograma de Entregables Oficiales (5 x 20%)
            </h3>
            <span className="text-[11px] text-[#6B7780]">Ponderación Acumulada 100%</span>
          </div>

          <div className="space-y-2">
            {[
              { titulo: "Presentación e Informe Inicial", fecha: "2026-09-20", pond: "20%", estado: "Entregado", nota: "6.2" },
              { titulo: "Solemne Oficial Escrita", fecha: "2026-10-08", pond: "20%", estado: "Próxima", nota: "Pendiente" },
              { titulo: "Reporte de Avance 1 (Técnico + Gestión)", fecha: "2026-10-18", pond: "20%", estado: "En Desarrollo", nota: "Admite +0.3 décimas" },
              { titulo: "Reporte de Avance 2 (Testing + Despliegue)", fecha: "2026-11-15", pond: "20%", estado: "Pendiente", nota: "-" },
              { titulo: "Presentación Final / Feria de Proyectos TIC", fecha: "2026-12-05", pond: "20%", estado: "Pendiente", nota: "-" },
            ].map((h, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-[4px] border border-gray-200 bg-white text-xs">
                <div>
                  <strong className="text-[#2D3B45] block">{h.titulo}</strong>
                  <span className="text-[11px] text-[#6B7780]">Fecha: {h.fecha} • Ponderación: {h.pond}</span>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    h.estado === "Entregado" ? "bg-emerald-100 text-emerald-800" :
                    h.estado === "Próxima" ? "bg-amber-100 text-amber-800" :
                    "bg-blue-100 text-blue-800"
                  }`}>
                    {h.estado}
                  </span>
                  <span className="block text-[11px] font-mono text-gray-500 mt-0.5">{h.nota}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Columna Derecha: Chat Técnico con el Agente del Curso (5 Cols) */}
      <div className="lg:col-span-5 bg-white border border-[#E0E3E6] rounded-[4px] shadow-canvas-card flex flex-col h-[580px]">
        <div className="p-3.5 border-b border-gray-200 bg-[#F9FAFB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-red-100 text-[#C8102E] flex items-center justify-center font-bold text-xs">
              <Bot size={15} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#2D3B45]">Agente Técnico del Curso</h3>
              <span className="text-[10px] text-emerald-700 font-medium">● Conoce el programa oficial y fechas</span>
            </div>
          </div>
          <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">
            CIT3203
          </span>
        </div>

        {/* Mensajes del chat */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          {chatMessages.map((m, idx) => (
            <div key={idx} className={`flex gap-2 ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
              {m.sender === "agent" && (
                <div className="w-5 h-5 rounded-full bg-red-50 text-[#C8102E] flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                  IA
                </div>
              )}
              <div
                className={`p-2.5 rounded-[6px] max-w-[85%] leading-relaxed ${
                  m.sender === "user" ? "bg-[#008EE2] text-white" : "bg-gray-100 text-[#2D3B45] border border-gray-200"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Sugerencias Rápidas */}
        <div className="p-2 border-t border-gray-200 bg-gray-50 flex flex-wrap gap-1 text-[11px]">
          <button
            onClick={() => {
              setChatInput("¿Cuándo es la fecha de entrega del Avance 1?");
            }}
            className="bg-white border border-gray-300 hover:bg-blue-50 px-2 py-0.5 rounded text-[#2D3B45]"
          >
            📅 Fecha Avance 1
          </button>
          <button
            onClick={() => {
              setChatInput("¿Cómo evito la causal de reprobación por inasistencia (RI)?");
            }}
            className="bg-white border border-gray-300 hover:bg-blue-50 px-2 py-0.5 rounded text-[#2D3B45]"
          >
            ⚠️ Regla RI 75%
          </button>
          <button
            onClick={() => {
              setChatInput("¿Cuáles son los 6 RAPs evaluados?");
            }}
            className="bg-white border border-gray-300 hover:bg-blue-50 px-2 py-0.5 rounded text-[#2D3B45]"
          >
            📚 RAPs del curso
          </button>
        </div>

        {/* Formulario input */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 flex gap-2 bg-white">
          <input
            type="text"
            placeholder="Pregúntale al agente sobre fechas, RAPs o asistencia..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="flex-1 text-xs border border-gray-300 rounded-[4px] px-2.5 py-1.5 focus:ring-1 focus:ring-[#008EE2]"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-[#2D3B45] hover:bg-[#1E272E] text-white rounded-[4px] text-xs font-semibold"
          >
            <Send size={12} />
          </button>
        </form>
      </div>
    </div>
  );
};
