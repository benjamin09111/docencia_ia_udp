import React from "react";
import { CanvasCourse } from "@/types";
import { CanvasBadge } from "./CanvasBadge";
import { CanvasButton } from "./CanvasButton";
import {
  MoreVertical,
  Megaphone,
  FileText,
  MessageSquare,
  Folder,
  Sparkles,
  CheckCircle2,
  Lock,
} from "lucide-react";

interface CanvasCourseCardProps {
  course: CanvasCourse;
  isAutomated: boolean;
  canAutomate: boolean;
  onAutomate: (courseId: number) => void;
  onOpenCourse: (courseId: number) => void;
  colorIndex?: number;
}

const CANVAS_COLORS = [
  "#008EE2", // Canvas Blue
  "#C8102E", // UDP Red
  "#2E7D32", // Forest Green
  "#E65100", // Warm Orange
  "#6A1B9A", // Deep Purple
  "#00838F", // Teal
  "#37474F", // Slate
];

export const CanvasCourseCard: React.FC<CanvasCourseCardProps> = ({
  course,
  isAutomated,
  canAutomate,
  onAutomate,
  onOpenCourse,
  colorIndex = 0,
}) => {
  const headerColor = CANVAS_COLORS[colorIndex % CANVAS_COLORS.length];

  return (
    <div className="bg-white border border-[#C7CDD1] rounded-[4px] shadow-canvas-card overflow-hidden flex flex-col transition-all hover:shadow-md hover:border-gray-400 group">
      {/* Canvas Colored Header Banner */}
      <div
        className="h-28 relative p-3 flex justify-between items-start text-white transition-opacity group-hover:opacity-95"
        style={{ backgroundColor: headerColor }}
      >
        <span className="text-[11px] font-bold tracking-wider px-2 py-0.5 rounded bg-black/25 uppercase backdrop-blur-xs">
          UDP Pregrado
        </span>
        <button
          className="text-white/80 hover:text-white p-1 rounded hover:bg-black/20 transition-colors"
          title="Opciones de curso Canvas"
        >
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3
            className="text-sm font-bold text-[#2D3B45] line-clamp-2 leading-snug group-hover:text-[#008EE2] transition-colors cursor-pointer"
            onClick={() => (isAutomated ? onOpenCourse(course.id) : canAutomate ? onAutomate(course.id) : null)}
            title={course.name}
          >
            {course.name}
          </h3>
          <span className="text-xs font-semibold text-[#6B7780] block mt-1 font-mono">
            {course.code}
          </span>
          <span className="text-[11px] text-[#6B7780] block mt-0.5">
            {course.term || "2026-02 Semestre Primavera"}
          </span>
        </div>

        {/* Zona de Automatización */}
        <div className="pt-2 border-t border-gray-100">
          {isAutomated ? (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                <CheckCircle2 size={15} />
                <span>Curso Automatizado</span>
              </div>
              <CanvasButton
                variant="primary-canvas"
                size="sm"
                className="w-full"
                onClick={() => onOpenCourse(course.id)}
              >
                Abrir Panel del Curso
              </CanvasButton>
            </div>
          ) : canAutomate ? (
            <div className="space-y-1.5">
              <CanvasBadge variant="udp" className="w-full justify-center">
                ✨ Agente Institucional Disponible
              </CanvasBadge>
              <CanvasButton
                variant="primary-udp"
                size="sm"
                className="w-full"
                onClick={() => onAutomate(course.id)}
                icon={<Sparkles size={13} />}
              >
                Automatizar con IA
              </CanvasButton>
            </div>
          ) : (
            <div className="py-1 flex items-center justify-center gap-1 text-[11px] text-gray-400 bg-gray-50 border border-gray-200 rounded">
              <Lock size={12} />
              <span>Sin Agente de Facultad</span>
            </div>
          )}
        </div>
      </div>

      {/* Canvas Card Bottom Icons Footer */}
      <div className="px-4 py-2 bg-[#F9FAFB] border-t border-[#E0E3E6] flex items-center justify-around text-[#6B7780]">
        <button className="hover:text-[#008EE2] transition-colors" title="Anuncios">
          <Megaphone size={16} />
        </button>
        <button className="hover:text-[#008EE2] transition-colors" title="Tareas">
          <FileText size={16} />
        </button>
        <button className="hover:text-[#008EE2] transition-colors" title="Foros">
          <MessageSquare size={16} />
        </button>
        <button className="hover:text-[#008EE2] transition-colors" title="Archivos">
          <Folder size={16} />
        </button>
      </div>
    </div>
  );
};
