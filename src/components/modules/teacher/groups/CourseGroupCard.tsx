"use client";

import React, { useState } from "react";
import { Folder, Users, Trash2, UserPlus, X, Plus } from "lucide-react";
import { CourseGroup, StudentGroupMember } from "@/types/groups";
import { StudentRosterItem } from "@/services/attendanceStore";

interface CourseGroupCardProps {
  group: CourseGroup;
  availableStudents: StudentRosterItem[];
  onDeleteGroup: (groupId: string) => void;
  onAddMember: (groupId: string, member: StudentGroupMember) => void;
  onRemoveMember: (groupId: string, canvasId: number) => void;
}

export const CourseGroupCard: React.FC<CourseGroupCardProps> = ({
  group,
  availableStudents,
  onDeleteGroup,
  onAddMember,
  onRemoveMember,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCanvasId, setSelectedCanvasId] = useState<number | "">("");

  const handleAdd = () => {
    if (!selectedCanvasId) return;
    const st = availableStudents.find((s) => s.canvas_id === Number(selectedCanvasId));
    if (st) {
      onAddMember(group.id, {
        canvas_id: st.canvas_id,
        nombres: st.nombres,
        apellidos: st.apellidos,
        rut: st.rut,
        email: st.email,
      });
      setSelectedCanvasId("");
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white border border-[#E0E3E6] rounded-[4px] shadow-xs p-3.5 space-y-3 hover:border-gray-400 transition-all">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[4px] bg-blue-50 text-[#008EE2] border border-blue-200 flex items-center justify-center font-bold shrink-0">
            <Folder size={15} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#2D3B45]">{group.name}</h4>
            <span className="text-[10px] text-[#6B7780] font-medium block">
              {group.categoryName || "General"} • {group.members.length} integrantes
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onDeleteGroup(group.id)}
          className="p-1 text-gray-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors cursor-pointer"
          title="Eliminar grupo"
        >
          <Trash2 size={13} />
        </button>
      </div>

      <div className="space-y-1.5">
        {group.members.length === 0 ? (
          <div className="p-3 bg-gray-50 border border-dashed border-gray-200 rounded-[4px] text-center text-[11px] text-gray-400">
            Sin integrantes asignados
          </div>
        ) : (
          <div className="space-y-1 max-h-44 overflow-y-auto pr-0.5">
            {group.members.map((m) => (
              <div
                key={m.canvas_id}
                className="flex items-center justify-between px-2 py-1 bg-gray-50 border border-gray-200 rounded-[3px] text-xs hover:bg-white transition-colors"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-5 h-5 rounded-full bg-[#2D3B45] text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                    {m.nombres.charAt(0)}
                  </span>
                  <span className="font-semibold text-[#2D3B45] truncate">
                    {m.nombres} {m.apellidos}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveMember(group.id, m.canvas_id)}
                  className="text-gray-400 hover:text-rose-600 p-0.5 rounded cursor-pointer"
                  title="Quitar del grupo"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {isAdding ? (
        <div className="pt-2 border-t border-gray-100 flex items-center gap-1.5">
          <select
            value={selectedCanvasId}
            onChange={(e) => setSelectedCanvasId(e.target.value ? Number(e.target.value) : "")}
            className="flex-1 p-1 text-[11px] bg-gray-50 border border-gray-300 rounded-[3px] text-[#2D3B45]"
          >
            <option value="">-- Seleccionar alumno --</option>
            {availableStudents.map((st) => (
              <option key={st.canvas_id} value={st.canvas_id}>
                {st.apellidos}, {st.nombres}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAdd}
            className="px-2 py-1 bg-[#008EE2] text-white text-[11px] font-bold rounded-[3px] cursor-pointer"
          >
            Añadir
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="w-full py-1 text-[11px] font-semibold text-[#008EE2] hover:bg-blue-50/70 border border-dashed border-blue-200 rounded-[3px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
        >
          <UserPlus size={12} />
          <span>Asignar Integrante</span>
        </button>
      )}
    </div>
  );
};
