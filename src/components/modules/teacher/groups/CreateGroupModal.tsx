"use client";

import React, { useState } from "react";
import { X, FolderPlus, Users } from "lucide-react";
import { StudentRosterItem } from "@/services/attendanceStore";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableStudents: StudentRosterItem[];
  onCreate: (name: string, categoryName: string, selectedCanvasIds: number[]) => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  availableStudents,
  onCreate,
}) => {
  const [name, setName] = useState("");
  const [categoryName, setCategoryName] = useState("Proyecto Semestral");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  if (!isOpen) return null;

  const toggleStudent = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim(), categoryName.trim(), selectedIds);
    setName("");
    setSelectedIds([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-4 py-3 bg-[#2D3B45] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderPlus size={16} className="text-[#008EE2]" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Crear Nuevo Grupo</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 hover:bg-white/20 rounded cursor-pointer">
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs overflow-y-auto flex-1">
          <div>
            <label className="block text-[11px] font-bold text-[#2D3B45] uppercase mb-1">Nombre del Grupo:</label>
            <input
              type="text"
              required
              placeholder="Ej: Grupo 4 — Soluciones IoT"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 bg-gray-50 border border-gray-300 rounded-[4px] text-[#2D3B45] font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#2D3B45] uppercase mb-1">Categoría / Tipo:</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Ej: Proyecto Semestral / Laboratorio"
              className="w-full p-2 bg-gray-50 border border-gray-300 rounded-[4px] text-[#2D3B45]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#2D3B45] uppercase mb-1">
              Asignar Integrantes Iniciales ({selectedIds.length} seleccionados):
            </label>
            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-[4px] p-2 space-y-1 bg-gray-50/50">
              {availableStudents.length === 0 ? (
                <p className="text-gray-400 text-center py-2 text-[11px]">No hay estudiantes disponibles</p>
              ) : (
                availableStudents.map((st) => (
                  <label
                    key={st.canvas_id}
                    className="flex items-center gap-2 p-1 hover:bg-white rounded cursor-pointer text-[#2D3B45]"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(st.canvas_id)}
                      onChange={() => toggleStudent(st.canvas_id)}
                      className="rounded text-[#008EE2]"
                    />
                    <span className="text-[11px]">
                      {st.apellidos}, {st.nombres}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-[4px] font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#008EE2] hover:bg-[#0077BE] text-white font-bold rounded-[4px] cursor-pointer shadow-xs"
            >
              Crear Grupo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
