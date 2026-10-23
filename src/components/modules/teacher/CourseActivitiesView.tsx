"use client";

import React, { useState, useMemo } from "react";
import { CourseDeliverable, StudentSubmission } from "@/types";
import { CanvasToolbar } from "@/components/canvas/CanvasToolbar";
import { CanvasItemGroup } from "@/components/canvas/CanvasItemGroup";
import { CreateActivityWorkspace } from "./CreateActivityWorkspace";
import { CheckCircle2 } from "lucide-react";
import { ActivityAgentDraft } from "@/types/activityAgent";
import { CourseActivitiesModals } from "./activities/CourseActivitiesModals";
import { ActivityItemRow } from "./activities/ActivityItemRow";

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

  const handleDeleteActivity = () => {
    if (!deletingActivity) return;
    const title = deletingActivity.titulo;
    setActivitiesList((prev) => prev.filter((a) => a.id !== deletingActivity.id));
    setDeletingActivity(null);
    setToastMessage(`Actividad "${title}" eliminada.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleResolveAppeal = (subId: string, action: "aceptar" | "ratificar") => {
    onResolveAppeal?.(subId, action);
    setAppealMessage(action === "aceptar" ? "Apelación aceptada (+0.1 décimas)." : "Calificación ratificada.");
    setTimeout(() => setAppealMessage(null), 3500);
  };

  return (
    <div className="space-y-4">
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

      <CanvasItemGroup
        title="ACTIVIDADES FORMATIVAS & TALLERES"
        weightBadge="Bolsa de Décimas"
        countBadge={<span className="text-xs bg-gray-200 text-[#2D3B45] font-semibold px-2 py-0.5 rounded-full">{filteredActivities.length}</span>}
        onAddClick={() => setIsCreatingWorkspace(true)}
      >
        {filteredActivities.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#6B7780] bg-[#F9FAFB]">
            No hay actividades formativas que coincidan con la búsqueda.
          </div>
        ) : (
          filteredActivities.map((act) => (
            <ActivityItemRow
              key={act.id}
              act={act}
              entregasAlumnos={entregasAlumnos}
              onViewSubmissions={setViewingSubmissionsItem}
              onViewPauta={setViewingPautaActivity}
              onEdit={setEditingActivity}
              onTogglePublish={handleTogglePublish}
              onDelete={setDeletingActivity}
            />
          ))
        )}
      </CanvasItemGroup>

      <CourseActivitiesModals
        courseCode={courseCode}
        courseName={courseName}
        editingActivity={editingActivity}
        setEditingActivity={setEditingActivity}
        onSaveEdited={(updated) => {
          setActivitiesList((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
          setToastMessage(`Cambios guardados en "${updated.titulo}".`);
          setTimeout(() => setToastMessage(null), 3000);
        }}
        deletingActivity={deletingActivity}
        setDeletingActivity={setDeletingActivity}
        onConfirmDelete={handleDeleteActivity}
        viewingSubmissionsItem={viewingSubmissionsItem}
        setViewingSubmissionsItem={setViewingSubmissionsItem}
        submissions={viewingSubmissionsItem ? entregasAlumnos.filter((s) => s.deliverable_id === viewingSubmissionsItem.id) : []}
        onResolveAppeal={handleResolveAppeal}
        appealMessage={appealMessage}
        viewingPautaActivity={viewingPautaActivity}
        setViewingPautaActivity={setViewingPautaActivity}
        isCatalogModalOpen={isCatalogModalOpen}
        setIsCatalogModalOpen={setIsCatalogModalOpen}
        onSelectCatalogActivity={(id) => {
          setSelectedCatalogActivityId(id);
          setAgentDraft(undefined);
          setIsCreatingWorkspace(true);
        }}
        isAgentModalOpen={isAgentModalOpen}
        setIsAgentModalOpen={setIsAgentModalOpen}
        onCreateWithAgent={(draft) => {
          setAgentDraft(draft);
          setSelectedCatalogActivityId(undefined);
          setIsCreatingWorkspace(true);
        }}
      />
    </div>
  );
};
