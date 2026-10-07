"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Users, FolderPlus, RefreshCw, CheckCircle2, AlertCircle, Sparkles, Folder } from "lucide-react";
import { CourseGroup, StudentGroupMember } from "@/types/groups";
import { StudentRosterItem } from "@/services/attendanceStore";
import { getSavedGroups, saveGroups, createGroup, deleteGroup, addMemberToGroup, removeMemberFromGroup } from "@/services/groupsStore";
import { CourseGroupCard } from "./CourseGroupCard";
import { CreateGroupModal } from "./CreateGroupModal";

interface CourseGroupsWorkspaceProps {
  courseCode: string;
  courseName: string;
  canvasCourseId?: number;
  students: StudentRosterItem[];
  sectionId?: string;
}

export const CourseGroupsWorkspace: React.FC<CourseGroupsWorkspaceProps> = ({
  courseCode,
  courseName,
  canvasCourseId,
  students,
  sectionId = "sec_1",
}) => {
  const [groups, setGroups] = useState<CourseGroup[]>(() => getSavedGroups(courseCode, sectionId));
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSyncingCanvas, setIsSyncingCanvas] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const refresh = () => setGroups(getSavedGroups(courseCode, sectionId));

  useEffect(() => {
    refresh();
    const handleUpdate = () => refresh();
    window.addEventListener("udp_groups_updated", handleUpdate);
    return () => window.removeEventListener("udp_groups_updated", handleUpdate);
  }, [courseCode, sectionId]);

  // Alumnos que están asignados a algún grupo
  const assignedCanvasIds = useMemo(() => {
    const set = new Set<number>();
    groups.forEach((g) => g.members.forEach((m) => set.add(m.canvas_id)));
    return set;
  }, [groups]);

  // Alumnos sin grupo
  const unassignedStudents = useMemo(() => {
    return students.filter((s) => !assignedCanvasIds.has(s.canvas_id));
  }, [students, assignedCanvasIds]);

  const handleSyncCanvas = async () => {
    if (!canvasCourseId) {
      setNotification({ type: "error", text: "No se identificó el ID numérico de Canvas para este curso." });
      return;
    }
    setIsSyncingCanvas(true);
    try {
      const res = await fetch(`/api/canvas/courses/${canvasCourseId}/groups`);
      if (res.ok) {
        const cloudGroups = await res.json();
        if (Array.isArray(cloudGroups) && cloudGroups.length > 0) {
          const formatted: CourseGroup[] = cloudGroups.map((cg: any) => ({
            id: cg.id || `grp_${Date.now()}`,
            courseCode,
            sectionId,
            name: cg.name,
            categoryName: cg.categoryName || "Canvas LMS",
            members: cg.members || [],
            createdAt: cg.createdAt || new Date().toISOString(),
          }));
          const merged = [...formatted, ...groups.filter((g) => !formatted.some((fg) => fg.name === g.name))];
          saveGroups(merged);
          setNotification({ type: "success", text: `✓ Sincronizados ${formatted.length} grupos desde Canvas.` });
        } else {
          setNotification({ type: "success", text: "No se encontraron grupos nuevos creados en Canvas para este curso." });
        }
      }
    } catch {
      setNotification({ type: "error", text: "Error de conexión al sincronizar con Canvas." });
    } finally {
      setIsSyncingCanvas(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleCreateGroup = (name: string, categoryName: string, selectedIds: number[]) => {
    const initialMembers: StudentGroupMember[] = students
      .filter((s) => selectedIds.includes(s.canvas_id))
      .map((s) => ({ canvas_id: s.canvas_id, nombres: s.nombres, apellidos: s.apellidos, rut: s.rut, email: s.email }));
    createGroup(courseCode, { name, categoryName, sectionId, members: initialMembers });
    setNotification({ type: "success", text: `✓ Grupo "${name}" creado exitosamente.` });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header del Módulo de Grupos */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[4px] bg-[#2D3B45] text-white flex items-center justify-center font-bold">
            <Users size={20} className="text-[#008EE2]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#2D3B45]">Grupos de Trabajo • {courseName}</h2>
            <p className="text-xs text-[#6B7780]">
              {groups.length} grupos definidos • {assignedCanvasIds.size} de {students.length} estudiantes agrupados
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleSyncCanvas}
            disabled={isSyncingCanvas}
            className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-[#2D3B45] border border-gray-300 rounded-[4px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <RefreshCw size={13} className={isSyncingCanvas ? "animate-spin text-[#008EE2]" : ""} />
            <span>{isSyncingCanvas ? "Sincronizando..." : "Sincronizar Canvas"}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-1.5 bg-[#008EE2] hover:bg-[#0077BE] text-white font-bold rounded-[4px] text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <FolderPlus size={14} />
            <span>Crear Grupo</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className={`p-2.5 rounded-[4px] text-xs font-semibold border flex items-center gap-2 shadow-2xs ${
          notification.type === "success" ? "bg-emerald-50 border-emerald-300 text-emerald-900" : "bg-rose-50 border-rose-300 text-rose-900"
        }`}>
          {notification.type === "success" ? <CheckCircle2 size={15} className="text-emerald-700" /> : <AlertCircle size={15} className="text-rose-700" />}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Alumnos sin grupo */}
      {unassignedStudents.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-[4px] p-3 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-amber-900 flex items-center gap-1.5">
              <Users size={13} />
              Estudiantes sin grupo asignado ({unassignedStudents.length}):
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {unassignedStudents.map((st) => (
              <span key={st.canvas_id} className="px-2 py-0.5 bg-white border border-amber-300 text-amber-950 rounded text-[11px] font-medium">
                {st.apellidos}, {st.nombres}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Grid de Grupos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {groups.map((group) => (
          <CourseGroupCard
            key={group.id}
            group={group}
            availableStudents={unassignedStudents}
            onDeleteGroup={(id) => { deleteGroup(id); refresh(); }}
            onAddMember={(id, member) => { addMemberToGroup(id, member); refresh(); }}
            onRemoveMember={(id, canvasId) => { removeMemberFromGroup(id, canvasId); refresh(); }}
          />
        ))}
      </div>

      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        availableStudents={students}
        onCreate={handleCreateGroup}
      />
    </div>
  );
};
