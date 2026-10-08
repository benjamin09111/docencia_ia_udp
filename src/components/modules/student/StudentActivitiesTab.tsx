"use client";

import React, { useState } from "react";
import { CourseDeliverable, StudentSubmission } from "@/types";
import { CanvasTable, CanvasTableHeader, CanvasTableRow, CanvasTableCell } from "@/components/canvas/CanvasTable";
import { StudentActivityWorkspace } from "./StudentActivityWorkspace";
import { StudentActivityChat } from "./StudentActivityChat";
import { StudentActivityReviewModal } from "./StudentActivityReviewModal";
import { StudentActivityAppealModal } from "./StudentActivityAppealModal";
import { Sparkles, CheckCircle2, Clock } from "lucide-react";

interface StudentActivitiesTabProps {
  entregables: CourseDeliverable[];
  entregasAlumnos: StudentSubmission[];
  onSubmitActivity: (deliverableId: string, solutionText: string) => void;
  onSendAppeal: (submissionId: string, appealText: string) => void;
}

export const StudentActivitiesTab: React.FC<StudentActivitiesTabProps> = ({
  entregables,
  entregasAlumnos,
  onSubmitActivity,
  onSendAppeal,
}) => {
  const actividades = entregables.filter((e) => e.tipo === "actividad_ayudantia");
  const [selectedActivityId, setSelectedActivityId] = useState<string>(
    actividades[0]?.id || "act_1"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showAppealModal, setShowAppealModal] = useState(false);

  const selectedActivity = actividades.find((a) => a.id === selectedActivityId) || actividades[0];
  const userSubmission = entregasAlumnos.find((s) => s.deliverable_id === selectedActivity?.id);

  const handleQuickSubmit = () => {
    if (!selectedActivity) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const mockSolution =
        "Solución oficial del Grupo 1 (Benjamín Morales): Para la crisis de presupuesto del mandante, aplicamos la matriz de riesgos PMBOK categorizando el retraso con severidad Alta. Reducimos el alcance de los módulos secundarios priorizando la arquitectura base transaccional con RTO de 1.8 segundos y RPO=0. Se acordó con el mandante adelantar la versión MVP sin comprometer la seguridad ni el testing automatizado.";
      onSubmitActivity(selectedActivity.id, mockSolution);
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Tabla Oficial Canvas de Actividades */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h2 className="text-base font-bold text-[#2D3B45] flex items-center gap-2">
              <Sparkles size={18} className="text-[#008EE2]" />
              Evaluaciones Formativas & Talleres Prácticos
            </h2>
            <p className="text-xs text-[#6B7780] mt-0.5">
              Talleres de ayudantía para afianzar conceptos con bonificación directa en la bolsa de décimas.
            </p>
          </div>
          <span className="text-xs text-[#2D3B45] bg-[#F5F6F8] border border-[#C7CDD1] px-2.5 py-1 rounded-[3px] font-semibold">
            {actividades.length} Talleres Disponibles
          </span>
        </div>

        <CanvasTable tableClassName="min-w-[640px]">
          <CanvasTableHeader>
            <tr>
              <th className="p-2.5">Taller / Actividad</th>
              <th className="p-2.5 text-center">Incentivo</th>
              <th className="p-2.5 text-center">Plazo</th>
              <th className="p-2.5 text-center">Estado</th>
              <th className="p-2.5 text-right">Acción</th>
            </tr>
          </CanvasTableHeader>
          <tbody>
            {actividades.map((act) => {
              const isSelected = selectedActivity?.id === act.id;
              const sub = entregasAlumnos.find((s) => s.deliverable_id === act.id);

              return (
                <CanvasTableRow
                  key={act.id}
                  onClick={() => setSelectedActivityId(act.id)}
                  className={isSelected ? "bg-blue-50/40" : ""}
                >
                  <CanvasTableCell>
                    <div>
                      <strong className="text-xs text-[#2D3B45] block hover:text-[#008EE2] transition-colors">
                        {act.titulo}
                      </strong>
                      <span className="text-[11px] text-[#6B7780] line-clamp-1">{act.descripcion}</span>
                    </div>
                  </CanvasTableCell>

                  <CanvasTableCell align="center">
                    <span className="text-xs font-bold text-[#2E7D32] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-[3px]">
                      {act.ponderacion_o_decimas}
                    </span>
                  </CanvasTableCell>

                  <CanvasTableCell align="center">
                    <span className="text-xs text-[#6B7780]">{act.fecha_limite}</span>
                  </CanvasTableCell>

                  <CanvasTableCell align="center">
                    {sub ? (
                      <span className="text-[11px] font-bold text-[#2E7D32] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center justify-center gap-1">
                        <CheckCircle2 size={12} /> Revisado (+{sub.decimas_sugeridas || 0.3} décimas)
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded flex items-center justify-center gap-1">
                        <Clock size={12} /> Pendiente
                      </span>
                    )}
                  </CanvasTableCell>

                  <CanvasTableCell align="right">
                    <button
                      type="button"
                      onClick={() => setSelectedActivityId(act.id)}
                      className={`text-xs px-2.5 py-1 rounded-[3px] font-semibold border transition-all ${
                        isSelected
                          ? "bg-[#008EE2] text-white border-[#0077BE]"
                          : "bg-white text-[#2D3B45] border-[#C7CDD1] hover:bg-gray-50"
                      }`}
                    >
                      {isSelected ? "Seleccionada" : "Ver Detalle"}
                    </button>
                  </CanvasTableCell>
                </CanvasTableRow>
              );
            })}
          </tbody>
        </CanvasTable>
      </div>

      {/* 2. Workspace y Chat de la Actividad */}
      {selectedActivity && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-7">
            <StudentActivityWorkspace
              activity={selectedActivity}
              submission={userSubmission}
              isSubmitting={isSubmitting}
              onQuickSubmit={handleQuickSubmit}
              onOpenReview={() => setShowReviewModal(true)}
              onOpenAppeal={() => setShowAppealModal(true)}
            />
          </div>

          <div className="lg:col-span-5">
            <StudentActivityChat />
          </div>
        </div>
      )}

      {/* Modales */}
      {showReviewModal && userSubmission && (
        <StudentActivityReviewModal
          submission={userSubmission}
          onClose={() => setShowReviewModal(false)}
        />
      )}

      {showAppealModal && userSubmission && (
        <StudentActivityAppealModal
          submission={userSubmission}
          onSendAppeal={onSendAppeal}
          onClose={() => setShowAppealModal(false)}
        />
      )}
    </div>
  );
};
