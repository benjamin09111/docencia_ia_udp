"use client";

import React, { useState, useEffect } from "react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { TechnicalAgentItem } from "./AgentHistoryModal";
import {
  X,
  Edit3,
  Save,
  CheckCircle2,
  Bot,
  Sliders,
  FileCode,
  Sparkles,
} from "lucide-react";

interface AgentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: TechnicalAgentItem | null;
  onSave: (updated: TechnicalAgentItem) => void;
}

export const AgentEditModal: React.FC<AgentEditModalProps> = ({
  isOpen,
  onClose,
  agent,
  onSave,
}) => {
  const [nombre, setNombre] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [modelo, setModelo] = useState("claude-3-5-sonnet");
  const [temperatura, setTemperatura] = useState(0.2);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (agent) {
      setNombre(agent.nombre);
      setEspecialidad(agent.especialidad);
      setDescripcion(agent.descripcion);
      setModelo(agent.modelo);
      setTemperatura(agent.temperatura);
      setSystemPrompt(agent.systemPrompt);
      setSaveSuccess(false);
    }
  }, [agent]);

  if (!isOpen || !agent) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...agent,
      nombre,
      especialidad,
      descripcion,
      modelo,
      temperatura,
      systemPrompt,
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-[6px] border border-[#E0E3E6] shadow-canvas-modal max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 flex justify-between items-start bg-[#FAFBFB]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-[#008EE2] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {agent.codigo}
              </span>
              <span className="text-xs text-[#6B7780]">{agent.ambito}</span>
            </div>
            <h2 className="text-base font-bold text-[#2D3B45] flex items-center gap-2">
              <Edit3 size={17} className="text-[#008EE2]" />
              Configuración y Parámetros del Agente
            </h2>
            <p className="text-xs text-[#6B7780]">
              Edita el modelo base, temperatura y directrices pedagógicas de este agente técnico.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Notificación de Éxito */}
        {saveSuccess && (
          <div className="m-4 mb-0 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-[4px] flex items-center gap-2 shadow-xs">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>Configuración del agente guardada correctamente en el ecosistema CREA UDP.</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          <div>
            <label className="text-xs font-bold text-[#2D3B45] block mb-1">
              Nombre Institucional del Agente
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full text-xs border border-gray-300 rounded-[4px] px-3 py-2 bg-white text-[#2D3B45] focus:outline-none focus:ring-1 focus:ring-[#008EE2]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#2D3B45] block mb-1">
              Rol & Especialidad
            </label>
            <input
              type="text"
              value={especialidad}
              onChange={(e) => setEspecialidad(e.target.value)}
              required
              className="w-full text-xs border border-gray-300 rounded-[4px] px-3 py-2 bg-white text-[#2D3B45] focus:outline-none focus:ring-1 focus:ring-[#008EE2]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#2D3B45] block mb-1">
              Descripción del Comportamiento
            </label>
            <textarea
              rows={2}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full text-xs border border-gray-300 rounded-[4px] p-2 bg-white text-[#2D3B45] focus:outline-none focus:ring-1 focus:ring-[#008EE2]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-xs font-bold text-[#2D3B45] block mb-1 flex items-center gap-1">
                <Bot size={13} className="text-[#008EE2]" />
                Modelo Fundacional (LLM)
              </label>
              <select
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                className="w-full text-xs border border-gray-300 rounded-[4px] px-2.5 py-2 bg-white text-[#2D3B45] focus:outline-none focus:ring-1 focus:ring-[#008EE2]"
              >
                <option value="claude-3-5-sonnet">Claude 3.5 Sonnet (Antrópico UDP)</option>
                <option value="gpt-4o">GPT-4o Institucional (OpenAI)</option>
                <option value="llama-3.3-70b">Llama 3.3 70B (Servidores UDP)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#2D3B45] block mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Sliders size={13} className="text-purple-600" />
                  Temperatura: {temperatura}
                </span>
                <span className="text-[10px] text-gray-400">
                  {temperatura <= 0.2 ? "Preciso" : "Creativo"}
                </span>
              </label>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={temperatura}
                onChange={(e) => setTemperatura(parseFloat(e.target.value))}
                className="w-full accent-[#008EE2] cursor-pointer mt-2"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#2D3B45] block mb-1 flex items-center gap-1">
              <FileCode size={13} className="text-gray-500" />
              System Prompt & Directrices Institucionales
            </label>
            <textarea
              rows={4}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full text-xs font-mono border border-gray-300 rounded-[4px] p-2.5 bg-[#FAFBFB] text-[#2D3B45] focus:outline-none focus:ring-1 focus:ring-[#008EE2] leading-relaxed"
            />
            <span className="text-[10px] text-gray-500 block mt-1">
              Las instrucciones modelan la respuesta del agente con rigor académico y sin alucinaciones.
            </span>
          </div>

          {/* Footer del Formulario */}
          <div className="pt-3 border-t border-gray-200 flex justify-end items-center gap-2">
            <CanvasButton variant="outline" size="sm" type="button" onClick={onClose}>
              Cancelar
            </CanvasButton>
            <CanvasButton
              variant="primary-canvas"
              size="sm"
              type="submit"
              icon={<Save size={14} />}
              title="Guardar cambios del agente técnico"
            >
              Guardar
            </CanvasButton>
          </div>
        </form>
      </div>
    </div>
  );
};
