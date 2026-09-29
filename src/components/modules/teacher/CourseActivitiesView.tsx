"use client";

import React, { useState } from "react";
import { CourseDeliverable, StudentSubmission } from "@/types";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import {
  CanvasTable,
  CanvasTableHeader,
  CanvasTableRow,
  CanvasTableCell,
} from "@/components/canvas/CanvasTable";
import { CreateActivityWorkspace } from "./CreateActivityWorkspace";
import {
  Plus,
  Eye,
  Bot,
  Sparkles,
  Layers,
  FileText,
  CheckCircle2,
  AlertCircle,
  Quote,
  Scale,
  ShieldCheck,
} from "lucide-react";

interface CourseActivitiesViewProps {
  courseId: number;
  entregables: CourseDeliverable[];
  entregasAlumnos?: StudentSubmission[];
  onAddDeliverable: (d: CourseDeliverable) => void;
  onResolveAppeal?: (submissionId: string, action: "aceptar" | "ratificar") => void;
}

export const CourseActivitiesView: React.FC<CourseActivitiesViewProps> = ({
  courseId,
  entregables,
  entregasAlumnos = [],
  onAddDeliverable,
  onResolveAppeal,
}) => {
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [viewingRubricItem, setViewingRubricItem] = useState<CourseDeliverable | null>(null);
  const [viewingSubmissionsItem, setViewingSubmissionsItem] = useState<CourseDeliverable | null>(null);
  const [appealMessage, setAppealMessage] = useState<string | null>(null);

  const actividades = entregables.filter((e) => e.tipo === "actividad_ayudantia");

  // Si el docente presiona "Crear Actividad con Agente", se abre la página entera aparte
  if (isCreatingWorkspace) {
    return (
      <CreateActivityWorkspace
        courseId={courseId}
        onBack={() => setIsCreatingWorkspace(false)}
        onPublish={(activity) => {
          onAddDeliverable(activity);
          setIsCreatingWorkspace(false);
        }}
      />
    );
  }

  const handleAppealAction = (subId: string, action: "aceptar" | "ratificar") => {
    if (onResolveAppeal) {
      onResolveAppeal(subId, action);
      setAppealMessage(
        action === "aceptar"
          ? "Apelación aceptada con éxito (+0.1 décima adicional inyectada a la planilla)."
          : "Calificación ratificada conforme a la rúbrica objetiva."
      );
      setTimeout(() => setAppealMessage(null), 3500);
    }
  };

  const getSubmissionsForActivity = (activityId: string) => {
    return entregasAlumnos.filter((s) => s.deliverable_id === activityId);
  };

  return (
    <div className="space-y-5">
      {/* Banner Superior con el Enjambre Multi-Agente */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[11px] font-bold rounded uppercase">
              Actividades Dinámicas de Ayudantía
            </span>
            <span className="text-xs text-[#6B7780] flex items-center gap-1">
              <Bot size={13} className="text-[#008EE2]" />
              Enjambre de 5 Agentes del Curso (Creativo + Teórico + Técnico + Corrector + Excel)
            </span>
          </div>
          <h2 className="text-base font-bold text-[#2D3B45] mt-1">
            Talleres Prácticos Recreativos con Incentivo de Décimas o Nota
          </h2>
          <p className="text-xs text-[#6B7780] mt-0.5">
            Supervisa las entregas revisadas automáticamente y gestiona las solicitudes de apelación de los estudiantes.
          </p>
        </div>

        <CanvasButton
          variant="primary-udp"
          size="md"
          onClick={() => setIsCreatingWorkspace(true)}
          icon={<Plus size={15} />}
        >
          Crear Actividad con Agente
        </CanvasButton>
      </div>

      {/* Tabla Oficial de Actividades */}
      <CanvasTable>
        <CanvasTableHeader>
          <tr>
            <th className="p-3">Nombre del Taller / Dinámica</th>
            <th className="p-3">Metodología Pedagógica</th>
            <th className="p-3 text-center">Incentivo</th>
            <th className="p-3 text-center">Entregas y Apelaciones</th>
            <th className="p-3 text-center">Estado</th>
            <th className="p-3 text-right">Acción</th>
          </tr>
        </CanvasTableHeader>
        <tbody>
          {actividades.map((act) => {
            const subs = getSubmissionsForActivity(act.id);
            const appealsCount = subs.filter((s) => s.apelacion?.estado === "pendiente").length;

            return (
              <CanvasTableRow key={act.id} hoverable={false}>
                <CanvasTableCell>
                  <div className="space-y-0.5">
                    <span className="font-bold text-[#2D3B45] text-xs block">{act.titulo}</span>
                    <span className="text-[11px] text-[#6B7780] line-clamp-1 max-w-sm">{act.descripcion}</span>
                  </div>
                </CanvasTableCell>

                <CanvasTableCell>
                  <span className="text-xs text-[#55636E] font-medium">
                    {act.rubrica.length} Criterios Objetivos (PMBOK + RAPs)
                  </span>
                </CanvasTableCell>

                <CanvasTableCell align="center">
                  <span className="font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded text-xs">
                    {act.ponderacion_o_decimas}
                  </span>
                </CanvasTableCell>

                <CanvasTableCell align="center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs font-semibold text-[#2D3B45]">
                      {subs.length} {subs.length === 1 ? "Entrega" : "Entregas"}
                    </span>
                    {appealsCount > 0 ? (
                      <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded text-[10px] font-bold">
                        ⚠️ {appealsCount} Apelación pendiente
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-700 font-medium">Sin apelaciones</span>
                    )}
                  </div>
                </CanvasTableCell>

                <CanvasTableCell align="center">
                  <CanvasBadge variant="success">Publicada y Activa</CanvasBadge>
                </CanvasTableCell>

                <CanvasTableCell align="right">
                  <div className="flex items-center justify-end gap-1.5">
                    <CanvasButton
                      variant="outline"
                      size="sm"
                      onClick={() => setViewingRubricItem(act)}
                      icon={<Eye size={13} />}
                    >
                      Rúbrica
                    </CanvasButton>
                    <CanvasButton
                      variant="primary-canvas"
                      size="sm"
                      onClick={() => setViewingSubmissionsItem(act)}
                      icon={<FileText size={13} />}
                    >
                      Ver Entregas {subs.length > 0 && `(${subs.length})`}
                    </CanvasButton>
                  </div>
                </CanvasTableCell>
              </CanvasTableRow>
            );
          })}
        </tbody>
      </CanvasTable>

      {/* Modal Ver Rúbrica Detallada */}
      {viewingRubricItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[6px] max-w-lg w-full p-6 shadow-xl border border-gray-200 space-y-4 animate-scaleUp">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-[#2D3B45]">{viewingRubricItem.titulo}</h3>
                <span className="text-xs text-purple-800 font-semibold bg-purple-50 px-2 py-0.5 rounded">
                  Incentivo: {viewingRubricItem.ponderacion_o_decimas} en {viewingRubricItem.target_evaluacion}
                </span>
              </div>
              <button onClick={() => setViewingRubricItem(null)} className="text-gray-400 hover:text-gray-600 font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {viewingRubricItem.rubrica.map((crit) => (
                <div key={crit.id} className="p-3 border border-gray-200 rounded text-xs space-y-2">
                  <div className="flex justify-between font-bold text-[#2D3B45]">
                    <span>• {crit.descripcion}</span>
                    <span className="text-[#008EE2]">{crit.puntaje_max} pts</span>
                  </div>
                  <div className="space-y-1">
                    {crit.indicadores.map((ind, idx) => (
                      <div key={idx} className="bg-gray-50 p-2 rounded text-[11px] text-[#55636E]">
                        <strong className="text-gray-800">{ind.nivel} ({ind.puntos}p):</strong> {ind.detalle}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t">
              <CanvasButton variant="outline" size="sm" onClick={() => setViewingRubricItem(null)}>
                Cerrar
              </CanvasButton>
            </div>
          </div>
        </div>
      )}

      {/* Modal / Panel: Ver Entregas, Revisiones y Apelaciones de Alumnos */}
      {viewingSubmissionsItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[6px] max-w-3xl w-full p-6 shadow-xl border border-gray-200 space-y-4 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#008EE2] bg-blue-50 px-2 py-0.5 rounded uppercase">
                  Panel de Auditoría Docente
                </span>
                <h3 className="text-base font-bold text-[#2D3B45] mt-1">
                  Entregas y Apelaciones: {viewingSubmissionsItem.titulo}
                </h3>
              </div>
              <button onClick={() => setViewingSubmissionsItem(null)} className="text-gray-400 hover:text-gray-600 font-bold">
                ✕
              </button>
            </div>

            {appealMessage && (
              <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{appealMessage}</span>
              </div>
            )}

            {/* Listado de entregas del hito */}
            {getSubmissionsForActivity(viewingSubmissionsItem.id).length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-500 bg-gray-50 rounded border border-gray-200">
                Aún no hay entregas de estudiantes registradas para esta actividad.
              </div>
            ) : (
              <div className="space-y-4">
                {getSubmissionsForActivity(viewingSubmissionsItem.id).map((sub) => (
                  <div key={sub.id} className="p-4 border border-gray-300 rounded-[4px] bg-[#FAFBFD] space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <strong className="text-xs font-bold text-[#2D3B45] block">
                          Alumno: {sub.estudiante_nombre.split(" ")[0]}
                        </strong>
                        <span className="text-[11px] text-gray-500">
                          Archivo: {sub.archivo_nombre} • Entregado: {sub.fecha_entrega}
                        </span>
                      </div>

                      {/* Badge Mandatorio: Revisado automáticamente según la rúbrica */}
                      <div className="text-right">
                        <span className="px-2.5 py-1 bg-white border border-emerald-400 text-emerald-800 rounded text-xs font-bold shadow-xs block">
                          Revisado automáticamente según la rúbrica
                        </span>
                        <span className="text-xs font-bold text-purple-900 mt-1 block">
                          Calificación: +{sub.decimas_sugeridas || 0.3} décimas
                        </span>
                      </div>
                    </div>

                    {/* Resumen del Agente Corrector */}
                    <div className="p-3 bg-white rounded border border-gray-200 text-xs text-[#2D3B45] leading-relaxed">
                      <strong>Dictamen del Agente Corrector:</strong> {sub.feedback_ia.resumen}
                    </div>

                    {/* Criterios evaluados con Citas */}
                    <div className="space-y-2">
                      {sub.feedback_ia.criterios_evaluados.map((c, i) => (
                        <div key={i} className="p-2.5 bg-white rounded border border-gray-200 text-xs space-y-1">
                          <div className="flex justify-between font-bold text-[#2D3B45]">
                            <span>{c.criterio}</span>
                            <span className="text-[#008EE2]">{c.puntaje_obtenido}/{c.puntaje_max} pts</span>
                          </div>
                          <p className="text-[11px] text-[#01579B] italic bg-blue-50/60 p-2 rounded">
                            &quot;{c.cita_textual}&quot;
                          </p>
                          <p className="text-[11px] text-gray-600">{c.comentario}</p>
                        </div>
                      ))}
                    </div>

                    {/* Sección de Apelación del Alumno */}
                    {sub.apelacion ? (
                      <div className="p-3.5 bg-amber-50 border-2 border-amber-300 rounded-[4px] space-y-2.5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                            <AlertCircle size={14} className="text-amber-700" />
                            Apelación Recibida del Alumno:
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            sub.apelacion.estado === "pendiente" ? "bg-amber-200 text-amber-900" :
                            sub.apelacion.estado === "aceptada" ? "bg-emerald-200 text-emerald-900" :
                            "bg-gray-200 text-gray-800"
                          }`}>
                            Estado: {sub.apelacion.estado.toUpperCase()}
                          </span>
                        </div>

                        <p className="text-xs text-amber-950 bg-white p-2.5 rounded border border-amber-200 italic leading-relaxed">
                          &quot;{sub.apelacion.motivo}&quot;
                        </p>

                        {sub.apelacion.respuesta_docente && (
                          <p className="text-[11px] font-semibold text-emerald-800">
                            {sub.apelacion.respuesta_docente}
                          </p>
                        )}

                        {sub.apelacion.estado === "pendiente" && (
                          <div className="flex justify-end gap-2 pt-1 border-t border-amber-200">
                            <CanvasButton
                              variant="outline"
                              size="sm"
                              onClick={() => handleAppealAction(sub.id, "ratificar")}
                            >
                              Ratificar Dictamen Automático
                            </CanvasButton>
                            <CanvasButton
                              variant="primary-udp"
                              size="sm"
                              onClick={() => handleAppealAction(sub.id, "aceptar")}
                            >
                              Aceptar Apelación (+0.1 Décima Adicional)
                            </CanvasButton>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-[11px] text-gray-500 italic bg-gray-50 p-2 rounded">
                        El estudiante no ha presentado apelaciones para esta entrega.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2 border-t">
              <CanvasButton variant="outline" size="sm" onClick={() => setViewingSubmissionsItem(null)}>
                Cerrar
              </CanvasButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
