"use client";

import React, { useState } from "react";
import { X, Zap, Sliders, CheckCircle2, ShieldCheck } from "lucide-react";
import { AutomationRuleType } from "@/types/automations";

interface CreateAutomationRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRule: (data: {
    name: string;
    description: string;
    type: AutomationRuleType;
    sectionId: string;
    minPresentCount: number;
  }) => void;
}

export const CreateAutomationRuleModal: React.FC<CreateAutomationRuleModalProps> = ({
  isOpen,
  onClose,
  onCreateRule,
}) => {
  const [ruleType, setRuleType] = useState<AutomationRuleType>("asistencia_compartida");
  const [sectionId, setSectionId] = useState<string>("sec_1");
  const [minPresentCount, setMinPresentCount] = useState<number>(2);
  const [customName, setCustomName] = useState<string>("Regla Asistencia Compartida — Sección 1");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const desc = `Si asisten al menos ${minPresentCount} integrantes de un grupo en la ${
      sectionId === "sec_1" ? "Sección 1" : "sección"
    }, se marca automáticamente presente a todo el grupo.`;

    onCreateRule({
      name: customName.trim() || "Regla Asistencia Compartida",
      description: desc,
      type: ruleType,
      sectionId,
      minPresentCount,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-4 py-3 bg-[#2D3B45] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Nueva Regla de Automatización</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 hover:bg-white/20 rounded cursor-pointer">
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs overflow-y-auto flex-1">
          <div>
            <label className="block text-[11px] font-bold text-[#2D3B45] uppercase mb-1">Tipo de Regla:</label>
            <select
              value={ruleType}
              onChange={(e) => setRuleType(e.target.value as AutomationRuleType)}
              className="w-full p-2 bg-gray-50 border border-gray-300 rounded-[4px] text-[#2D3B45] font-semibold"
            >
              <option value="asistencia_compartida">✓ Regla Asistencia Compartida (Quórum Grupal)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#2D3B45] uppercase mb-1">Sección de Aplicación:</label>
            <select
              value={sectionId}
              onChange={(e) => {
                setSectionId(e.target.value);
                setCustomName(`Regla Asistencia Compartida — ${e.target.value === "sec_1" ? "Sección 1" : "Todas las Secciones"}`);
              }}
              className="w-full p-2 bg-gray-50 border border-gray-300 rounded-[4px] text-[#2D3B45]"
            >
              <option value="sec_1">Solo Sección 1 (CIT3203_CA01)</option>
              <option value="all">Todas las secciones del curso</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#2D3B45] uppercase mb-1">Condición de Quórum:</label>
            <select
              value={minPresentCount}
              onChange={(e) => setMinPresentCount(Number(e.target.value))}
              className="w-full p-2 bg-gray-50 border border-gray-300 rounded-[4px] text-[#2D3B45]"
            >
              <option value={2}>Si asisten 2 de 4 integrantes (≥ 50% del grupo)</option>
              <option value={1}>Si asiste al menos 1 integrante (Cualquiera)</option>
              <option value={3}>Si asisten 3 integrantes (Quórum calificado)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#2D3B45] uppercase mb-1">Nombre Descriptivo:</label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full p-2 bg-gray-50 border border-gray-300 rounded-[4px] text-[#2D3B45] font-medium"
              required
            />
          </div>

          <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-[4px] flex items-start gap-2 text-[10px] text-[#0277BD]">
            <ShieldCheck size={14} className="shrink-0 text-[#008EE2] mt-0.5" />
            <span>
              Al ejecutarse la regla, los alumnos del grupo que no hayan marcado recibirán automáticamente el valor 1 (Presente) en esa fecha.
            </span>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-[4px] font-semibold cursor-pointer">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-1.5 bg-[#C8102E] hover:bg-[#A00D24] text-white font-bold rounded-[4px] cursor-pointer shadow-xs">
              Guardar Regla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
