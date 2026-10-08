"use client";

import React, { useState } from "react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import {
  Bot,
  Brain,
  Sliders,
  Sparkles,
  Check,
  CheckCircle2,
  BookOpen,
  MessageSquare,
  Lock,
} from "lucide-react";

export const TeacherAgentProfileView: React.FC = () => {
  const [exigencia, setExigencia] = useState("4");
  const [estilo, setEstilo] = useState("constructivo");
  const [tono, setTono] = useState("cercano");
  const [promptMaestro, setPromptMaestro] = useState(
    "Actúa como el profesor titular de la Escuela de Informática UDP. Enfatiza siempre buenas prácticas de arquitectura, citación formal y resolución guiada de problemas. En ningún caso entregues código terminado; formula preguntas socráticas para guiar al estudiante."
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Banner Principal Canvas */}
      <div className="bg-[#F5F6F8] border border-[#C7CDD1] rounded-[4px] p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[4px] bg-red-100 border border-red-200 flex items-center justify-center shrink-0 text-[#B71C1C]">
            <Bot size={22} />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#2D3B45]">
              Mi Agente Copiloto (Mini-Yo Docente)
            </h2>
            <p className="text-xs text-[#6B7780]">
              Personaliza tu asistente pedagógico IA para responder dudas y pre-evaluar con tu criterio.
            </p>
          </div>
        </div>

        <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded font-semibold flex items-center gap-1.5">
          <CheckCircle2 size={13} className="text-emerald-600" />
          Activo en 5 Cursos Canvas
        </span>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>Calibración pedagógica guardada y propagada al agente de tus secciones.</span>
        </div>
      )}

      {/* Perillas de Personalización Pedagógica */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-canvas-card space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <h3 className="text-xs font-bold text-[#2D3B45] uppercase tracking-wide flex items-center gap-1.5">
            <Sliders size={14} className="text-[#008EE2]" />
            Perillas de Personalización Pedagógica
          </h3>
          <span className="text-[11px] text-[#6B7780]">Configuración Global Docente</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-bold text-[#2D3B45] block mb-1">Nivel de Exigencia Rúbrica</label>
            <select
              value={exigencia}
              onChange={(e) => setExigencia(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#008EE2] bg-white"
            >
              <option value="3">Moderada (3/5) • Énfasis formativo</option>
              <option value="4">Alta (4/5) • Estándar Ingeniería UDP</option>
              <option value="5">Muy Rigurosa (5/5) • Hitos Capstone</option>
            </select>
            <span className="text-[10px] text-gray-500 mt-1 block">Afecta sugerencias de nota en corrección.</span>
          </div>

          <div>
            <label className="font-bold text-[#2D3B45] block mb-1">Estilo de Retroalimentación</label>
            <select
              value={estilo}
              onChange={(e) => setEstilo(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#008EE2] bg-white"
            >
              <option value="constructivo">Constructivo y Orientador</option>
              <option value="socratico">Preguntas Guía (Método Socrático)</option>
              <option value="rubrica">Estricto por Criterios de Rúbrica</option>
            </select>
            <span className="text-[10px] text-gray-500 mt-1 block">Modo de redactar feedback al estudiante.</span>
          </div>

          <div>
            <label className="font-bold text-[#2D3B45] block mb-1">Tono de Comunicación</label>
            <select
              value={tono}
              onChange={(e) => setTono(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#008EE2] bg-white"
            >
              <option value="cercano">Cercano y Empático</option>
              <option value="formal">Formal y Académico</option>
              <option value="conciso">Técnico y Directo al Punto</option>
            </select>
            <span className="text-[10px] text-gray-500 mt-1 block">Voz institucional con los estudiantes.</span>
          </div>
        </div>

        {/* Instrucciones Maestras (System Prompt del Profesor) */}
        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-bold text-[#2D3B45] block flex items-center justify-between">
            <span>Directrices Específicas del Profesor (System Prompt Docente)</span>
            <span className="text-[10px] text-[#008EE2] font-semibold flex items-center gap-1">
              <Sparkles size={11} /> Criterio Docente Primario
            </span>
          </label>
          <textarea
            value={promptMaestro}
            onChange={(e) => setPromptMaestro(e.target.value)}
            rows={4}
            className="w-full text-xs p-3 border border-gray-300 rounded font-sans focus:outline-none focus:ring-1 focus:ring-[#008EE2]"
            placeholder="Ingresa lineamientos que tu agente siempre deba considerar..."
          />
        </div>

        <div className="flex justify-end pt-2 border-t border-gray-100">
          <CanvasButton
            variant="primary-udp"
            size="sm"
            onClick={handleSave}
            icon={<Check size={14} />}
          >
            Guardar Personalización
          </CanvasButton>
        </div>
      </div>

      {/* Corpus y Vinculación */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-canvas-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-[#008EE2] shrink-0">
            <Brain size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#2D3B45]">Base de Conocimiento Docente Centralizada</h4>
            <p className="text-[11px] text-[#6B7780]">
              El agente se nutre de tus programas, rúbricas de cursos y diapositivas oficiales de la Escuela.
            </p>
          </div>
        </div>
        <span className="text-[11px] bg-gray-100 border border-gray-300 px-2.5 py-1 rounded text-gray-700 font-semibold shrink-0">
          Corpus Sincronizado
        </span>
      </div>
    </div>
  );
};
