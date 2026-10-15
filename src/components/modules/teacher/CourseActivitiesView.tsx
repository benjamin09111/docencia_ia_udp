"use client";

import React, { useState, useMemo } from "react";
import { CourseDeliverable, StudentSubmission } from "@/types";
import { CanvasToolbar } from "@/components/canvas/CanvasToolbar";
import { CanvasItemGroup, CanvasItemRow } from "@/components/canvas/CanvasItemGroup";
import { CreateActivityWorkspace } from "./CreateActivityWorkspace";
import { ActivityEditModal } from "./activities/ActivityEditModal";
import { ActivityDeleteConfirmModal } from "./activities/ActivityDeleteConfirmModal";
import { CatalogoActividadesModal } from "./activities/CatalogoActividadesModal";
import { ActivitySubmissionsModal } from "./activities/ActivitySubmissionsModal";
import { ActivityPautaModal } from "./activities/ActivityPautaModal";
import { FileText, Award, Edit3, EyeOff, Globe, Trash2, CheckCircle2 } from "lucide-react";
import { CreateWithAgentModal } from "./activities/CreateWithAgentModal";
import { ActivityAgentDraft } from "@/types/activityAgent";

interface CourseActivitiesViewProps {
  courseId: number;
  courseCode: string;
  courseName: string;
  entregables: CourseDeliverable[];
  entregasAlumnos?: StudentSubmission[];
  onAddDeliverable: (d: CourseDeliverable) => void;
  onResolveAppeal?: (submissionId: string, action: "aceptar" | "ratificar") => void;
}

export const CourseActivitiesView: React.FC<CourseActivitiesViewProps> = ({
  courseId,
  courseCode,
  courseName,
  entregables,
  entregasAlumnos = [],
  onAddDeliverable,
  onResolveAppeal,
}) => {
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [activitiesList, setActivitiesList] = useState<CourseDeliverable[]>(() =>
    entregables.filter((e) => e.tipo === "actividad_ayudantia")
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [appealMessage, setAppealMessage] = useState<string | null>(null);

  // Modales
  const [editingActivity, setEditingActivity] = useState<CourseDeliverable | null>(null);
  const [deletingActivity, setDeletingActivity] = useState<CourseDeliverable | null>(null);
  const [viewingSubmissionsItem, setViewingSubmissionsItem] = useState<CourseDeliverable | null>(null);
  const [viewingPautaActivity, setViewingPautaActivity] = useState<CourseDeliverable | null>(null);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [selectedCatalogActivityId, setSelectedCatalogActivityId] = useState<string | undefined>(undefined);
  const [agentDraft, setAgentDraft] = useState<ActivityAgentDraft | undefined>(undefined);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);

  const filteredActivities = useMemo(() => {
    if (!searchQuery.trim()) return activitiesList;
    const q = searchQuery.toLowerCase();
    return activitiesList.filter(
      (a) => a.titulo.toLowerCase().includes(q) || a.descripcion.toLowerCase().includes(q)
    );
  }, [activitiesList, searchQuery]);

  if (isCreatingWorkspace) {
    return (
      <CreateActivityWorkspace
        courseId={courseId}
        courseCode={courseCode}
        initialActivityId={selectedCatalogActivityId}
        agentDraft={agentDraft}
        onBack={() => setIsCreatingWorkspace(false)}
        onPublish={(activity) => {
          onAddDeliverable(activity);
          setActivitiesList((prev) => [activity, ...prev]);
          setAgentDraft(undefined);
          setIsCreatingWorkspace(false);
          setToastMessage(`Actividad "${activity.titulo}" publicada en el curso.`);
          setTimeout(() => setToastMessage(null), 3000);
        }}
      />
    );
  }

  const handleTogglePublish = (act: CourseDeliverable) => {
    const newStatus = act.estado === "publicada" ? "borrador" : "publicada";
    setActivitiesList((prev) =>
      prev.map((a) => (a.id === act.id ? { ...a, estado: newStatus } : a))
    );
    setToastMessage(newStatus === "publicada" ? `"${act.titulo}" publicada.` : `"${act.titulo}" en borrador.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleResolveAppeal = (subId: string, action: "aceptar" | "ratificar") => {
    onResolveAppeal?.(subId, action);
    setAppealMessage(
      action === "aceptar"
        ? "Apelación aceptada (+0.1 décimas registradas)."
        : "Calificación ratificada según rúbrica."
    );
    setTimeout(() => setAppealMessage(null), 3500);
  };

  return (
    <div className="space-y-4">
      {/* Canvas Content Toolbar */}
      <CanvasToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Buscar actividad formativa..."
        secondaryButtonLabel="Catálogo Formativo (21)"
        onSecondaryClick={() => setIsCatalogModalOpen(true)}
        tertiaryButtonLabel="Crear con agente"
        onTertiaryClick={() => setIsAgentModalOpen(true)}
        primaryButtonLabel="+ Actividad"
        onPrimaryClick={() => {
          setSelectedCatalogActivityId(undefined);
          setAgentDraft(undefined);
          setIsCreatingWorkspace(true);
        }}
      />

      {toastMessage && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-[#008EE2] rounded-[3px] text-xs flex items-center gap-2">
          <CheckCircle2 size={15} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Canvas Item Group (Módulos de Canvas) */}
      <CanvasItemGroup
        title="ACTIVIDADES FORMATIVAS & TALLERES"
        weightBadge="Bolsa de Décimas"
        countBadge={
          <span className="text-xs bg-gray-200 text-[#2D3B45] font-semibold px-2 py-0.5 rounded-full">
            {filteredActivities.length}
          </span>
        }
        onAddClick={() => setIsCreatingWorkspace(true)}
      >
        {filteredActivities.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#6B7780] bg-[#F9FAFB]">
            No hay actividades formativas que coincidan con la búsqueda.
          </div>
        ) : (
          filteredActivities.map((act) => {
            const subs = entregasAlumnos.filter((s) => s.deliverable_id === act.id);
            const appeals = subs.filter((s) => s.apelacion?.estado === "pendiente").length;

            return (
              <CanvasItemRow
                key={act.id}
                id={act.id}
                indicatorColor={act.estado === "publicada" ? "green" : "gray"}
                icon={<FileText size={17} />}
                title={act.titulo}
                subtitle={
                  <span>
                    Fecha límite: <strong>{act.fecha_limite}</strong> • {act.target_evaluacion || "Solemne 1"} •{" "}
                    {act.rubrica.length} criterios •{" "}
                    <strong className="text-[#2E7D32]">{act.ponderacion_o_decimas}</strong>
                  </span>
                }
                isPublished={act.estado === "publicada"}
                rightBadge={
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#2D3B45] font-semibold px-2 py-0.5 bg-[#F5F6F8] rounded-[3px] border border-[#C7CDD1]">
                      {subs.length} {subs.length === 1 ? "entrega" : "entregas"}
                    </span>
                    {appeals > 0 && (
                      <span className="text-xs text-amber-900 font-bold px-2 py-0.5 bg-amber-50 rounded-[3px] border border-amber-300">
                        ⚠️ {appeals} apelación
                      </span>
                    )}
                  </div>
                }
                actionItems={[
                  {
                    label: "Ver entregas y SpeedGrader",
                    icon: <FileText size={14} className="text-[#008EE2]" />,
                    onClick: () => setViewingSubmissionsItem(act),
                  },
                  {
                    label: "Ver pauta oficial y rúbrica",
                    icon: <Award size={14} className="text-[#B71C1C]" />,
                    onClick: () => setViewingPautaActivity(act),
                  },
                  {
                    label: "Editar actividad",
                    icon: <Edit3 size={14} className="text-[#2D3B45]" />,
                    onClick: () => setEditingActivity(act),
                  },
                  {
                    label: act.estado === "publicada" ? "Despublicar" : "Publicar",
                    icon: act.estado === "publicada" ? <EyeOff size={14} /> : <Globe size={14} />,
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
            );
          })
        )}
      </CanvasItemGroup>

      {/* Modales Canónicos */}
      {editingActivity && (
        <ActivityEditModal
          activity={editingActivity}
          isOpen={true}
          onClose={() => setEditingActivity(null)}
          onSave={(updated) => {
            setActivitiesList((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
            setToastMessage(`Cambios guardados en "${updated.titulo}".`);
            setTimeout(() => setToastMessage(null), 3000);
          }}
        />
      )}

      {deletingActivity && (
        <ActivityDeleteConfirmModal
          activity={deletingActivity}
          isOpen={true}
          onClose={() => setDeletingActivity(null)}
          onConfirm={() => {
            const title = deletingActivity.titulo;
            setActivitiesList((prev) => prev.filter((a) => a.id !== deletingActivity.id));
            setDeletingActivity(null);
            setToastMessage(`Actividad "${title}" eliminada.`);
            setTimeout(() => setToastMessage(null), 3000);
          }}
        />
      )}

      {viewingSubmissionsItem && (
        <ActivitySubmissionsModal
          activity={viewingSubmissionsItem}
          submissions={entregasAlumnos.filter((s) => s.deliverable_id === viewingSubmissionsItem.id)}
          isOpen={true}
          onClose={() => setViewingSubmissionsItem(null)}
          onResolveAppeal={handleResolveAppeal}
          appealMessage={appealMessage}
        />
      )}

      {viewingPautaActivity && (
        <ActivityPautaModal
          activity={viewingPautaActivity}
          isOpen={true}
          onClose={() => setViewingPautaActivity(null)}
        />
      )}

      <CatalogoActividadesModal
        isOpen={isCatalogModalOpen}
        onClose={() => setIsCatalogModalOpen(false)}
        onSelectForCreation={(id) => {
          setSelectedCatalogActivityId(id);
          setAgentDraft(undefined);
          setIsCreatingWorkspace(true);
        }}
      />
      <CreateWithAgentModal
        isOpen={isAgentModalOpen}
        courseCode={courseCode}
        courseName={courseName}
        onClose={() => setIsAgentModalOpen(false)}
        onCreate={(draft) => {
          setAgentDraft(draft);
          setSelectedCatalogActivityId(undefined);
          setIsCreatingWorkspace(true);
        }}
      />
    </div>
  );
};
