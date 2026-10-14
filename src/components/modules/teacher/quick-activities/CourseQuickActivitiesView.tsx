"use client";

import React, { useState, useEffect, useMemo } from "react";
import { CanvasToolbar } from "@/components/canvas/CanvasToolbar";
import { CanvasItemGroup } from "@/components/canvas/CanvasItemGroup";
import { QuickActivity } from "@/types/quickActivities";
import {
  getStoredQuickActivities,
  createQuickActivity,
  updateQuickActivity,
  deleteQuickActivity,
  togglePublishQuickActivity,
} from "@/services/quickActivitiesService";
import { QuickActivityItemRow } from "./QuickActivityItemRow";
import { QuickActivityCreateModal } from "./QuickActivityCreateModal";
import { QuickActivityDetailModal } from "./QuickActivityDetailModal";
import { QuickActivityEditModal } from "./QuickActivityEditModal";
import { QuickActivityDeleteModal } from "./QuickActivityDeleteModal";
import { Zap, CheckCircle2 } from "lucide-react";

interface CourseQuickActivitiesViewProps {
  courseId: number;
  courseCode: string;
  courseName: string;
}

export const CourseQuickActivitiesView: React.FC<CourseQuickActivitiesViewProps> = ({
  courseId,
  courseCode,
  courseName,
}) => {
  const [activities, setActivities] = useState<QuickActivity[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<QuickActivity | null>(null);
  const [editingItem, setEditingItem] = useState<QuickActivity | null>(null);
  const [deletingItem, setDeletingItem] = useState<QuickActivity | null>(null);

  useEffect(() => {
    setActivities(getStoredQuickActivities(courseCode));
    const handleSync = () => setActivities(getStoredQuickActivities(courseCode));
    window.addEventListener("udp_quick_activities_updated", handleSync);
    return () => window.removeEventListener("udp_quick_activities_updated", handleSync);
  }, [courseCode]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredActivities = useMemo(() => {
    if (!searchQuery.trim()) return activities;
    const q = searchQuery.toLowerCase();
    return activities.filter((a) => a.titulo.toLowerCase().includes(q) || a.descripcion.toLowerCase().includes(q));
  }, [activities, searchQuery]);

  const handleCreated = (item: QuickActivity) => {
    const created = createQuickActivity(courseCode, item);
    setActivities(getStoredQuickActivities(courseCode));
    showToast(`Tarea "${created.titulo}" publicada en Canvas.`);
  };

  const handleSaveEdit = (updated: QuickActivity) => {
    updateQuickActivity(courseCode, updated);
    setActivities(getStoredQuickActivities(courseCode));
    showToast(`Cambios guardados en "${updated.titulo}".`);
  };

  const handleDelete = () => {
    if (!deletingItem) return;
    deleteQuickActivity(courseCode, deletingItem.id);
    setActivities(getStoredQuickActivities(courseCode));
    showToast(`Tarea "${deletingItem.titulo}" eliminada.`);
    setDeletingItem(null);
  };

  const handleTogglePublish = (id: string) => {
    const res = togglePublishQuickActivity(courseCode, id);
    setActivities(getStoredQuickActivities(courseCode));
    if (res) showToast(res.estado === "publicada" ? `"${res.titulo}" publicada.` : `"${res.titulo}" en borrador.`);
  };

  return (
    <div className="space-y-4">
      {/* Banner Informativo Canvas */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-canvas-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-base font-bold text-[#2D3B45] flex items-center gap-2">
              <Zap size={18} className="text-[#B71C1C]" />
              Actividades Rápidas de Canvas
            </h2>
            <p className="text-xs text-[#6B7780] mt-0.5">
              Publica tareas y guías en 1 paso adjuntando un PDF o enlace. Sin rúbricas pesadas ni configuraciones complejas.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-red-50 text-[#B71C1C] border border-red-200 px-3 py-1.5 rounded text-xs font-semibold">
            <span>{activities.length} tareas publicadas</span>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-[3px] flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Toolbar Canónico de Canvas */}
      <CanvasToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Buscar tarea o guía rápida..."
        primaryButtonLabel="+ Tarea rápida"
        onPrimaryClick={() => setIsCreateModalOpen(true)}
      />

      {/* Lista de Ítems en Módulos de Canvas */}
      <CanvasItemGroup
        title="TAREAS RÁPIDAS & GUÍAS DE CÁTEDRA"
        weightBadge="Acceso Directo"
        countBadge={
          <span className="text-xs bg-gray-200 text-[#2D3B45] font-semibold px-2 py-0.5 rounded-full">
            {filteredActivities.length}
          </span>
        }
        onAddClick={() => setIsCreateModalOpen(true)}
      >
        {filteredActivities.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#6B7780] bg-[#F9FAFB]">
            No hay actividades rápidas publicadas. Haz clic en <strong>+ Tarea rápida</strong> para subir un PDF o enlace.
          </div>
        ) : (
          filteredActivities.map((act) => (
            <QuickActivityItemRow
              key={act.id}
              activity={act}
              onSelect={() => setSelectedDetail(act)}
              onEdit={() => setEditingItem(act)}
              onTogglePublish={() => handleTogglePublish(act.id)}
              onDelete={() => setDeletingItem(act)}
            />
          ))
        )}
      </CanvasItemGroup>

      {/* Modales */}
      <QuickActivityCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        courseCode={courseCode}
        courseId={courseId}
        onCreated={handleCreated}
      />

      <QuickActivityDetailModal
        activity={selectedDetail}
        isOpen={!!selectedDetail}
        onClose={() => setSelectedDetail(null)}
      />

      {editingItem && (
        <QuickActivityEditModal
          activity={editingItem}
          isOpen={true}
          onClose={() => setEditingItem(null)}
          onSave={handleSaveEdit}
        />
      )}

      <QuickActivityDeleteModal
        activity={deletingItem}
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};
