"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import { CourseSection } from "@/types/attendance";
import { StudentRosterItem } from "@/services/attendanceStore";
import { createDecimasAppeal, DECIMAS_DESCRIPTION_MAX } from "@/services/appealsStore";

interface DecimasAppealFormProps {
  section: CourseSection;
  student: StudentRosterItem | undefined;
  onResult: (result: { success: boolean; message: string }) => void;
  onCancel: () => void;
}

/** Apelación de décimas (trabajos): solo una descripción breve, nada más. */
export const DecimasAppealForm: React.FC<DecimasAppealFormProps> = ({ section, student, onResult, onCancel }) => {
  const [descripcion, setDescripcion] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending) return;
    if (!student) {
      onResult({ success: false, message: "Por favor busca y selecciona tu nombre de la lista." });
      return;
    }
    setIsSending(true);
    const result = await createDecimasAppeal({
      sectionCode: section.codigo,
      studentCanvasId: student.canvas_id,
      descripcion,
    });
    setIsSending(false);
    if (result.success) setDescripcion("");
    onResult(result);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="decimas-desc" className="block text-[11px] font-bold text-[#2D3B45] uppercase mb-1">
          2. Describe tu apelación de décimas:
        </label>
        <textarea
          id="decimas-desc"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          maxLength={DECIMAS_DESCRIPTION_MAX}
          rows={3}
          placeholder="Ej: Entregué el trabajo 3 pero no aparece en mis décimas."
          className="w-full p-2 bg-gray-50 border border-gray-300 rounded-[4px] text-[#2D3B45] text-xs resize-none focus:bg-white focus:outline-hidden focus:border-[#008EE2]"
        />
        <div className="text-right text-[10px] text-gray-400 font-mono">
          {descripcion.length}/{DECIMAS_DESCRIPTION_MAX}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-[4px] font-semibold cursor-pointer">
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSending || descripcion.trim().length === 0}
          className="px-4 py-1.5 text-xs bg-[#C8102E] hover:bg-[#A00D24] text-white font-bold rounded-[4px] inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Send size={13} />
          <span>{isSending ? "Enviando..." : "Enviar apelación de décimas"}</span>
        </button>
      </div>
    </form>
  );
};
