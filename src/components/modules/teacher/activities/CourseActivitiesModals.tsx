"use client";

import React from "react";
import { CourseDeliverable, StudentSubmission } from "@/types";
import { ActivityAgentDraft } from "@/types/activityAgent";
import { ActivityEditModal } from "./ActivityEditModal";
import { ActivityDeleteConfirmModal } from "./ActivityDeleteConfirmModal";
import { CatalogoActividadesModal } from "./CatalogoActividadesModal";
import { ActivitySubmissionsModal } from "./ActivitySubmissionsModal";
import { ActivityPautaModal } from "./ActivityPautaModal";
import { CreateWithAgentModal } from "./CreateWithAgentModal";

interface CourseActivitiesModalsProps {
  courseCode: string;
  courseName: string;
  editingActivity: CourseDeliverable | null;
  setEditingActivity: (a: CourseDeliverable | null) => void;
  onSaveEdited: (updated: CourseDeliverable) => void;
  deletingActivity: CourseDeliverable | null;
  setDeletingActivity: (a: CourseDeliverable | null) => void;
  onConfirmDelete: () => void;
  viewingSubmissionsItem: CourseDeliverable | null;
  setViewingSubmissionsItem: (a: CourseDeliverable | null) => void;
  submissions: StudentSubmission[];
  onResolveAppeal: (subId: string, action: "aceptar" | "ratificar") => void;
  appealMessage: string | null;
  viewingPautaActivity: CourseDeliverable | null;
  setViewingPautaActivity: (a: CourseDeliverable | null) => void;
  isCatalogModalOpen: boolean;
  setIsCatalogModalOpen: (open: boolean) => void;
  onSelectCatalogActivity: (id: string) => void;
  isAgentModalOpen: boolean;
  setIsAgentModalOpen: (open: boolean) => void;
  onCreateWithAgent: (draft: ActivityAgentDraft) => void;
}

export const CourseActivitiesModals: React.FC<CourseActivitiesModalsProps> = ({
  courseCode,
  courseName,
  editingActivity,
  setEditingActivity,
  onSaveEdited,
  deletingActivity,
  setDeletingActivity,
  onConfirmDelete,
  viewingSubmissionsItem,
  setViewingSubmissionsItem,
  submissions,
  onResolveAppeal,
  appealMessage,
  viewingPautaActivity,
  setViewingPautaActivity,
  isCatalogModalOpen,
  setIsCatalogModalOpen,
  onSelectCatalogActivity,
  isAgentModalOpen,
  setIsAgentModalOpen,
  onCreateWithAgent,
}) => {
  return (
    <>
      {editingActivity && (
        <ActivityEditModal
          activity={editingActivity}
          isOpen={true}
          onClose={() => setEditingActivity(null)}
          onSave={onSaveEdited}
        />
      )}

      {deletingActivity && (
        <ActivityDeleteConfirmModal
          activity={deletingActivity}
          isOpen={true}
          onClose={() => setDeletingActivity(null)}
          onConfirm={onConfirmDelete}
        />
      )}

      {viewingSubmissionsItem && (
        <ActivitySubmissionsModal
          activity={viewingSubmissionsItem}
          submissions={submissions}
          isOpen={true}
          onClose={() => setViewingSubmissionsItem(null)}
          onResolveAppeal={onResolveAppeal}
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
        onSelectForCreation={onSelectCatalogActivity}
      />

      <CreateWithAgentModal
        isOpen={isAgentModalOpen}
        courseCode={courseCode}
        courseName={courseName}
        onClose={() => setIsAgentModalOpen(false)}
        onCreate={onCreateWithAgent}
      />
    </>
  );
};
