"use client";

import React from "react";
import { CourseDeliverable, StudentSubmission } from "@/types";
import { CanvasModal } from "@/components/canvas/CanvasModal";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CheckCircle2, AlertCircle, FileText, User } from "lucide-react";

interface ActivitySubmissionsModalProps {
  activity: CourseDeliverable;
  submissions: StudentSubmission[];
  isOpen: boolean;
  onClose: () => void;
  onResolveAppeal?: (subId: string, action: "aceptar" | "ratificar") => void;
  appealMessage?: string | null;
}

export const ActivitySubmissionsModal: React.FC<ActivitySubmissionsModalProps> = ({
  activity,
  submissions,
  isOpen,
  onClose,
  onResolveAppeal,
  appealMessage,
}) => {
  return (
    <CanvasModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="4xl"
      title={
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-[#008EE2]" />
          <span>Entregas y Auditoría: {activity.titulo}</span>
        </div>
      }
      subtitle={`Revisión de SpeedGrader IA, retroalimentación y apelaciones de estudiantes (${submissions.length} entregas)`}
      footer={
        <CanvasButton variant="secondary" size="sm" onClick={onClose}>
          Cerrar
        </CanvasButton>
      }
    >
      <div className="space-y-4">
        {appealMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-[3px] text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 size={16} className="text-[#2E7D32] shrink-0" />
            <span>{appealMessage}</span>
          </div>
        )}

        {submissions.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#6B7780] bg-[#F5F6F8] rounded-[3px] border border-[#C7CDD1]">
            Aún no se registran entregas de estudiantes para esta actividad.
          </div>
        ) : (
          <div className="space-y-3.5">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="p-4 border border-[#C7CDD1] rounded-[3px] bg-white space-y-3 shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#E0E3E6] pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#2D3B45] font-bold shrink-0">
                      <User size={15} />
                    </div>
                    <div>
                      <strong className="text-xs font-bold text-[#2D3B45] block">
                        {sub.estudiante_nombre}
                      </strong>
                      <span className="text-[11px] text-[#6B7780]">
                        Archivo: {sub.archivo_nombre} • Entregado: {sub.fecha_entrega}
                      </span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="px-2 py-0.5 bg-emerald-50 text-[#2E7D32] border border-emerald-200 rounded text-[11px] font-bold">
                      +{sub.decimas_sugeridas || 0.3} décimas sugeridas
                    </span>
                  </div>
                </div>

                {/* Resumen IA */}
                <div className="p-3 bg-[#F9FAFB] rounded-[3px] border border-[#E0E3E6] text-xs text-[#2D3B45] leading-relaxed">
                  <span className="font-bold text-[#2D3B45] block mb-1">Dictamen del Agente Evaluador:</span>
                  <p>{sub.feedback_ia.resumen}</p>
                </div>

                {/* Criterios evaluados */}
                <div className="space-y-2">
                  {sub.feedback_ia.criterios_evaluados.map((c, i) => (
                    <div key={i} className="p-2.5 bg-white rounded-[3px] border border-[#E0E3E6] text-xs space-y-1">
                      <div className="flex justify-between font-bold text-[#2D3B45]">
                        <span>{c.criterio}</span>
                        <span className="text-[#008EE2]">{c.puntaje_obtenido}/{c.puntaje_max} pts</span>
                      </div>
                      <p className="text-[11px] text-[#008EE2] italic bg-blue-50/50 p-2 rounded-[3px] border border-blue-100">
                        &quot;{c.cita_textual}&quot;
                      </p>
                      <p className="text-[11px] text-[#6B7780]">{c.comentario}</p>
                    </div>
                  ))}
                </div>

                {/* Apelaciones */}
                {sub.apelacion ? (
                  <div className="p-3 bg-amber-50/70 border border-amber-300 rounded-[3px] space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-amber-900 flex items-center gap-1.5">
                        <AlertCircle size={14} className="text-amber-700" />
                        Apelación del Estudiante:
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        sub.apelacion.estado === "pendiente" ? "bg-amber-200 text-amber-900" :
                        sub.apelacion.estado === "aceptada" ? "bg-emerald-200 text-emerald-900" :
                        "bg-gray-200 text-gray-800"
                      }`}>
                        {sub.apelacion.estado.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-amber-950 bg-white p-2 rounded-[3px] border border-amber-200 italic">
                      &quot;{sub.apelacion.motivo}&quot;
                    </p>

                    {sub.apelacion.estado === "pendiente" && onResolveAppeal && (
                      <div className="flex justify-end gap-2 pt-1 border-t border-amber-200">
                        <CanvasButton
                          variant="secondary"
                          size="sm"
                          onClick={() => onResolveAppeal(sub.id, "ratificar")}
                        >
                          Ratificar
                        </CanvasButton>
                        <CanvasButton
                          variant="primary-udp"
                          size="sm"
                          onClick={() => onResolveAppeal(sub.id, "aceptar")}
                        >
                          Aceptar (+0.1)
                        </CanvasButton>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-[11px] text-[#6B7780] italic">
                    Sin apelaciones registradas.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </CanvasModal>
  );
};
