"use client";

import React from "react";
import { CourseDeliverable, StudentSubmission } from "@/types";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import {
  Upload,
  Eye,
  ShieldAlert,
  Send,
  AlertCircle,
  Calendar,
  Award,
} from "lucide-react";

interface StudentActivityWorkspaceProps {
  activity: CourseDeliverable;
  submission?: StudentSubmission;
  isSubmitting: boolean;
  onQuickSubmit: () => void;
  onOpenReview: () => void;
  onOpenAppeal: () => void;
}

export const StudentActivityWorkspace: React.FC<StudentActivityWorkspaceProps> = ({
  activity,
  submission,
  isSubmitting,
  onQuickSubmit,
  onOpenReview,
  onOpenAppeal,
}) => {
  return (
    <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#E0E3E6] pb-3">
        <div>
          <span className="text-[10px] font-bold text-[#B71C1C] bg-red-50 border border-red-200 px-2 py-0.5 rounded uppercase">
            Taller Formativo Activo
          </span>
          <h3 className="text-base font-bold text-[#2D3B45] mt-1">{activity.titulo}</h3>
          <div className="flex items-center gap-3 text-xs text-[#6B7780] mt-0.5">
            <span className="flex items-center gap-1">
              <Calendar size={13} /> Plazo: {activity.fecha_limite}
            </span>
            <span className="flex items-center gap-1 font-semibold text-[#2E7D32]">
              <Award size={13} /> Incentivo: {activity.ponderacion_o_decimas}
            </span>
          </div>
        </div>
      </div>

      <p className="text-xs text-[#2D3B45] leading-relaxed bg-[#F9FAFB] p-3 rounded-[3px] border border-[#E0E3E6]">
        {activity.descripcion}
      </p>

      {/* Rúbrica de la actividad */}
      <div className="space-y-1.5">
        <span className="text-xs font-bold text-[#2D3B45] block">
          Rúbrica de Evaluación Automática Canvas:
        </span>
        <div className="border border-[#E0E3E6] rounded-[3px] overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#F5F6F8] text-[#2D3B45] font-semibold border-b border-[#E0E3E6]">
              <tr>
                <th className="p-2.5">Criterio</th>
                <th className="p-2.5 text-right">Puntos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E3E6]">
              {activity.rubrica.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/50">
                  <td className="p-2.5">
                    <strong className="text-[#2D3B45]">{r.descripcion}</strong>
                    <p className="text-[11px] text-[#6B7780] mt-0.5">{r.indicadores[0]?.detalle}</p>
                  </td>
                  <td className="p-2.5 text-right font-bold text-[#008EE2]">{r.puntaje_max} pts</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Estado de Entrega */}
      <div className="pt-2 border-t border-[#E0E3E6]">
        {submission ? (
          <div className="p-4 bg-emerald-50/60 border border-emerald-300 rounded-[3px] space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="text-[10px] font-bold text-[#2E7D32] bg-emerald-100 px-2 py-0.5 rounded uppercase">
                  Entrega Calificada
                </span>
                <h4 className="text-xs font-bold text-[#2D3B45] mt-1">
                  Archivo: {submission.archivo_nombre}
                </h4>
                <span className="text-[11px] text-[#6B7780]">
                  Fecha de envío: {submission.fecha_entrega}
                </span>
              </div>

              <div className="text-left sm:text-right">
                <span className="px-2.5 py-1 bg-white border border-emerald-400 text-[#2E7D32] rounded-[3px] text-xs font-bold inline-block">
                  +{submission.decimas_sugeridas || 0.3} décimas acreditadas
                </span>
              </div>
            </div>

            {submission.apelacion && (
              <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-[3px] text-xs text-amber-900 space-y-0.5">
                <strong className="flex items-center gap-1">
                  <AlertCircle size={13} /> Apelación Enviada al Docente:
                </strong>
                <p className="text-[11px] text-amber-800 italic">
                  &quot;{submission.apelacion.motivo}&quot;
                </p>
                <span className="text-[10px] text-amber-700 block font-bold">
                  Estado: {submission.apelacion.estado === "pendiente" ? "Pendiente de revisión" : submission.apelacion.estado}
                </span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-1 border-t border-emerald-200">
              {!submission.apelacion && (
                <CanvasButton
                  variant="outline"
                  size="sm"
                  onClick={onOpenAppeal}
                  icon={<ShieldAlert size={13} className="text-amber-600" />}
                >
                  Apelar
                </CanvasButton>
              )}
              <CanvasButton
                variant="primary-canvas"
                size="sm"
                onClick={onOpenReview}
                icon={<Eye size={13} />}
              >
                Ver revisión
              </CanvasButton>
            </div>
          </div>
        ) : (
          <div className="p-4 border-2 border-dashed border-[#C7CDD1] rounded-[3px] text-center space-y-3 bg-[#FAFBFD]">
            <Upload size={22} className="mx-auto text-[#6B7780]" />
            <div>
              <h4 className="text-xs font-bold text-[#2D3B45]">Entregar Solución del Taller</h4>
              <p className="text-[11px] text-[#6B7780] mt-0.5">
                Simula el envío para obtener retroalimentación instantánea según la rúbrica oficial.
              </p>
            </div>

            <CanvasButton
              variant="primary-udp"
              size="sm"
              onClick={onQuickSubmit}
              disabled={isSubmitting}
              icon={<Send size={13} />}
            >
              {isSubmitting ? "Evaluando rúbrica..." : "Entregar solución"}
            </CanvasButton>
          </div>
        )}
      </div>
    </div>
  );
};
