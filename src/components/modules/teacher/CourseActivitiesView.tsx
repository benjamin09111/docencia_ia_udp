"use client";

import React, { useState, useEffect } from "react";
import { CourseDeliverable, StudentSubmission } from "@/types";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasActionMenu } from "@/components/canvas/CanvasActionMenu";
import {
  CanvasTable,
  CanvasTableHeader,
  CanvasTableRow,
  CanvasTableCell,
} from "@/components/canvas/CanvasTable";
import { CreateActivityWorkspace } from "./CreateActivityWorkspace";
import { ActivityEditModal } from "./activities/ActivityEditModal";
import { ActivityDeleteConfirmModal } from "./activities/ActivityDeleteConfirmModal";
import { CanvasOfficialRubricTable } from "@/components/canvas/CanvasOfficialRubricTable";
import { convertRubricCriteriaToMatrix } from "@/services/officialRubricsService";
import {
  Plus,
  Eye,
  Edit3,
  FileText,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Globe,
  EyeOff,
  Award,
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
  const [activitiesList, setActivitiesList] = useState<CourseDeliverable[]>(() =>
    entregables.filter((e) => e.tipo === "actividad_ayudantia")
  );

  // Modales de acciones
  const [editingActivity, setEditingActivity] = useState<CourseDeliverable | null>(null);
  const [deletingActivity, setDeletingActivity] = useState<CourseDeliverable | null>(null);
  const [viewingSubmissionsItem, setViewingSubmissionsItem] = useState<CourseDeliverable | null>(null);
  const [viewingPautaActivity, setViewingPautaActivity] = useState<CourseDeliverable | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [appealMessage, setAppealMessage] = useState<string | null>(null);

  // Sincronizar si se añade un entregable desde el creador
  useEffect(() => {
    const filtered = entregables.filter((e) => e.tipo === "actividad_ayudantia");
    setActivitiesList((prev) => {
      const prevIds = new Set(prev.map((p) => p.id));
      const newItems = filtered.filter((f) => !prevIds.has(f.id));
      if (newItems.length > 0) {
        return [...prev, ...newItems];
      }
      return prev;
    });
  }, [entregables]);

  // Si el docente presiona "Crear Actividad con Agente", se abre la página entera aparte
  if (isCreatingWorkspace) {
    return (
      <CreateActivityWorkspace
        courseId={courseId}
        onBack={() => setIsCreatingWorkspace(false)}
        onPublish={(activity) => {
          onAddDeliverable(activity);
          setActivitiesList((prev) => [activity, ...prev]);
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

  const getDecimasValue = (str: string) => {
    const match = str.match(/[\d.]+/);
    return match ? `+${match[0]}` : "+0.3";
  };

  const handleTogglePublish = (act: CourseDeliverable) => {
    const newStatus = act.estado === "publicada" ? "borrador" : "publicada";
    setActivitiesList((prev) =>
      prev.map((a) => (a.id === act.id ? { ...a, estado: newStatus } : a))
    );
    setToastMessage(
      newStatus === "publicada"
        ? `Actividad "${act.titulo}" publicada correctamente.`
        : `Actividad "${act.titulo}" guardada como borrador (oculta).`
    );
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveEdit = (updated: CourseDeliverable) => {
    setActivitiesList((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
    setToastMessage(`Cambios guardados en "${updated.titulo}".`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleConfirmDelete = () => {
    if (!deletingActivity) return;
    const title = deletingActivity.titulo;
    setActivitiesList((prev) => prev.filter((a) => a.id !== deletingActivity.id));
    setDeletingActivity(null);
    setToastMessage(`Actividad "${title}" eliminada.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Banner Superior Limpio y Profesional */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-canvas-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="px-2 py-0.5 bg-blue-50 text-[#008EE2] text-[11px] font-bold rounded uppercase border border-blue-200">
            Actividades extra
          </span>
          <h2 className="text-base font-bold text-[#2D3B45] mt-1">
            Actividades extra
          </h2>
          <p className="text-xs text-[#6B7780] mt-0.5">
            Gestión de actividades formativas, entregas y apelaciones.
          </p>
        </div>

        <CanvasButton
          variant="primary-udp"
          size="sm"
          onClick={() => setIsCreatingWorkspace(true)}
          icon={<Plus size={15} />}
          title="Crear nueva actividad pedagógica con agentes"
        >
          Nueva actividad
        </CanvasButton>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={15} className="text-[#008EE2] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Tabla Oficial de Actividades */}
      <CanvasTable tableClassName="min-w-[700px]">
        <CanvasTableHeader>
          <tr>
            <th className="p-3">Nombre de la Actividad</th>
            <th className="p-3">Rúbrica</th>
            <th className="p-3 text-center w-24">Décimas</th>
            <th className="p-3 text-center w-24">Entregas</th>
            <th className="p-3 text-center w-36">Apelaciones</th>
            <th className="p-3 text-center w-28">Estado</th>
            <th className="p-3 text-right w-16">Acciones</th>
          </tr>
        </CanvasTableHeader>
        <tbody>
          {activitiesList.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-8 text-center text-xs text-[#6B7780] bg-gray-50/50">
                No hay actividades registradas aún. Presiona <strong>"Nueva actividad"</strong> para crear una.
              </td>
            </tr>
          ) : (
            activitiesList.map((act) => {
              const subs = getSubmissionsForActivity(act.id);
              const appealsCount = subs.filter((s) => s.apelacion?.estado === "pendiente").length;

              return (
                <CanvasTableRow key={act.id} hoverable={true}>
                  <CanvasTableCell>
                    <div className="space-y-0.5">
                      <span className="font-bold text-[#2D3B45] text-xs block">{act.titulo}</span>
                      <span className="text-[11px] text-[#6B7780] line-clamp-1 max-w-sm">
                        {act.descripcion}
                      </span>
                    </div>
                  </CanvasTableCell>

                  <CanvasTableCell>
                    <span className="text-xs text-[#55636E] font-medium">
                      {act.rubrica.length} criterios
                    </span>
                  </CanvasTableCell>

                  {/* Columna Décimas: Solo el número como dato */}
                  <CanvasTableCell align="center">
                    <span className="font-mono font-bold text-[#2D3B45] text-xs bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                      {getDecimasValue(act.ponderacion_o_decimas)}
                    </span>
                  </CanvasTableCell>

                  {/* Columna Entregas Separada */}
                  <CanvasTableCell align="center">
                    <span className="font-bold text-[#2D3B45] text-xs">
                      {subs.length}
                    </span>
                  </CanvasTableCell>

                  {/* Columna Apelaciones Separada */}
                  <CanvasTableCell align="center">
                    {appealsCount > 0 ? (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 rounded text-[11px] font-bold inline-flex items-center gap-1">
                        <span>⚠️ {appealsCount} pendiente{appealsCount > 1 ? "s" : ""}</span>
                      </span>
                    ) : (
                      <span className="text-[#6B7780] text-xs font-mono">0</span>
                    )}
                  </CanvasTableCell>

                  {/* Estado de Publicación */}
                  <CanvasTableCell align="center">
                    {act.estado === "publicada" ? (
                      <CanvasBadge variant="success">Publicada</CanvasBadge>
                    ) : (
                      <CanvasBadge variant="neutral">Borrador</CanvasBadge>
                    )}
                  </CanvasTableCell>

                  {/* Menú de Acciones en 3 Puntitos */}
                  <CanvasTableCell align="right">
                    <CanvasActionMenu
                      ariaLabel={`Acciones para ${act.titulo}`}
                      items={[
                        {
                          label: "Ver y editar",
                          icon: <Edit3 size={14} className="text-[#008EE2]" />,
                          onClick: () => setEditingActivity(act),
                        },
                        {
                          label: "Ver entregas",
                          icon: <FileText size={14} className="text-[#2D3B45]" />,
                          onClick: () => setViewingSubmissionsItem(act),
                        },
                        {
                          label: "Ver pauta oficial",
                          icon: <Award size={14} className="text-[#C8102E]" />,
                          onClick: () => setViewingPautaActivity(act),
                        },
                        {
                          label: act.estado === "publicada" ? "Despublicar" : "Publicar",
                          icon:
                            act.estado === "publicada" ? (
                              <EyeOff size={14} className="text-[#6B7780]" />
                            ) : (
                              <Globe size={14} className="text-emerald-600" />
                            ),
                          onClick: () => handleTogglePublish(act),
                        },
                        {
                          label: "Eliminar",
                          icon: <Trash2 size={14} className="text-red-600" />,
                          variant: "danger",
                          onClick: () => setDeletingActivity(act),
                        },
                      ]}
                    />
                  </CanvasTableCell>
                </CanvasTableRow>
              );
            })
          )}
        </tbody>
      </CanvasTable>

      {/* Modal Ver y Editar Actividad */}
      {editingActivity && (
        <ActivityEditModal
          activity={editingActivity}
          isOpen={true}
          onClose={() => setEditingActivity(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Modal Confirmación de Eliminación */}
      {deletingActivity && (
        <ActivityDeleteConfirmModal
          activity={deletingActivity}
          isOpen={true}
          onClose={() => setDeletingActivity(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {/* Modal / Panel: Ver Entregas, Revisiones y Apelaciones de Alumnos */}
      {viewingSubmissionsItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-[6px] max-w-3xl w-full p-4 sm:p-6 shadow-xl border border-gray-200 space-y-4 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#008EE2] bg-blue-50 px-2 py-0.5 rounded uppercase">
                  Panel de Auditoría Docente
                </span>
                <h3 className="text-base font-bold text-[#2D3B45] mt-1">
                  Entregas y Apelaciones: {viewingSubmissionsItem.titulo}
                </h3>
              </div>
              <button
                onClick={() => setViewingSubmissionsItem(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
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

                      <div className="text-right">
                        <span className="px-2.5 py-1 bg-white border border-emerald-400 text-emerald-800 rounded text-xs font-bold shadow-xs block">
                          Revisado automáticamente según la rúbrica
                        </span>
                        <span className="text-xs font-bold text-[#2D3B45] mt-1 block">
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
                              title="Mantener calificación automática original"
                            >
                              Ratificar
                            </CanvasButton>
                            <CanvasButton
                              variant="primary-udp"
                              size="sm"
                              onClick={() => handleAppealAction(sub.id, "aceptar")}
                              title="Aceptar solicitud del estudiante y sumar 0.1 décimas"
                            >
                              Aceptar (+0.1)
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

      {/* Modal Ver Pauta Oficial de la Actividad */}
      {viewingPautaActivity && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-[4px] max-w-4xl w-full p-4 sm:p-6 shadow-xl border border-gray-200 space-y-4 animate-scaleUp max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#008EE2] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Pauta de Evaluación Oficial (Actividad Extra)
                  </span>
                  <span className="text-xs text-gray-500 font-mono">
                    {viewingPautaActivity.ponderacion_o_decimas}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#2D3B45] mt-1">
                  {viewingPautaActivity.titulo}
                </h3>
                <p className="text-xs text-[#6B7780] mt-0.5 leading-relaxed">
                  {viewingPautaActivity.descripcion}
                </p>
              </div>
              <button
                onClick={() => setViewingPautaActivity(null)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <CanvasOfficialRubricTable
              rubros={convertRubricCriteriaToMatrix(viewingPautaActivity.rubrica)}
              isEditable={false}
              tituloPauta={`PAUTA OFICIAL: ${viewingPautaActivity.titulo.toUpperCase()}`}
              subtituloPauta="Matriz institucional de rubros, criterios y subcriterios de desempeño (100 pts)"
            />

            <div className="pt-2 border-t flex justify-end">
              <CanvasButton variant="outline" size="sm" onClick={() => setViewingPautaActivity(null)}>
                Cerrar
              </CanvasButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
