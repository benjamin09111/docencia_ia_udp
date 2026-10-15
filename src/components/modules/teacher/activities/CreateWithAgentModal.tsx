"use client";

import React, { useState } from "react";
import { Bot, Sparkles } from "lucide-react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasModal } from "@/components/canvas/CanvasModal";
import { CanvasSelect } from "@/components/canvas/CanvasSelect";
import { getOfficialCourseContents } from "@/constants/courseOfficialContents";
import { ActivityAgentDraft, ActivityAgentRequest } from "@/types/activityAgent";

interface CreateWithAgentModalProps {
  isOpen: boolean;
  courseCode: string;
  courseName: string;
  onClose: () => void;
  onCreate: (draft: ActivityAgentDraft) => void;
}

export const CreateWithAgentModal: React.FC<CreateWithAgentModalProps> = ({
  isOpen, courseCode, courseName, onClose, onCreate,
}) => {
  const contents = getOfficialCourseContents(courseCode);
  const [content, setContent] = useState("");
  const [objective, setObjective] = useState("");
  const [duration, setDuration] = useState("45 minutos");
  const [format, setFormat] = useState<ActivityAgentRequest["format"]>("grupal");
  const [assessment, setAssessment] = useState<ActivityAgentRequest["assessment"]>("decimas");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!objective.trim()) {
      setError("Indica el objetivo o requerimiento de la actividad.");
      return;
    }
    setError(null);
    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/activity-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseCode, courseName, content, objective, duration, format, assessment }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo generar el borrador.");
      onCreate(data as ActivityAgentDraft);
      onClose();
    } catch {
      setError("No se pudo generar la actividad en este momento. Intenta nuevamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <CanvasModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={<span className="flex items-center gap-2"><Bot size={18} className="text-[#B71C1C]" />Crear actividad con agente</span>}
      subtitle="El agente creará un borrador completo para revisarlo y editarlo en el wizard antes de publicar."
      footer={<><CanvasButton variant="secondary" onClick={onClose}>Cancelar</CanvasButton><CanvasButton variant="primary-udp" disabled={isGenerating} onClick={generate} icon={<Sparkles size={15} />}>{isGenerating ? "Generando..." : "Generar borrador"}</CanvasButton></>}
    >
      <CanvasSelect label="Escoger contenido del curso (opcional)" value={content} onChange={(e) => setContent(e.target.value)} options={[{ value: "", label: "Sin contenido específico" }, ...contents.map((item) => ({ value: item, label: item }))]} />
      <div><label className="block text-xs font-bold mb-1">Objetivo o requerimiento <span className="text-[#C8102E]">*</span></label><textarea value={objective} onChange={(e) => setObjective(e.target.value)} rows={3} placeholder="Ej.: aplicar tácticas de disponibilidad en un caso de estudio" className="w-full border border-[#C7CDD1] rounded-[3px] p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#008EE2]" /></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div><label className="block text-xs font-bold mb-1">Duración</label><input value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full border border-[#C7CDD1] rounded-[3px] p-2 text-sm" /></div>
        <CanvasSelect label="Modalidad" value={format} onChange={(e) => setFormat(e.target.value as ActivityAgentRequest["format"])} options={[{ value: "grupal", label: "Grupal" }, { value: "individual", label: "Individual" }]} />
        <CanvasSelect label="Evaluación" value={assessment} onChange={(e) => setAssessment(e.target.value as ActivityAgentRequest["assessment"])} options={[{ value: "decimas", label: "Bolsa de décimas" }, { value: "nota", label: "Nota formativa" }]} />
      </div>
      {error && <p className="text-xs text-[#C8102E]">{error}</p>}
    </CanvasModal>
  );
};
