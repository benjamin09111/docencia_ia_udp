"use client";

import React from "react";
import { CourseSection } from "@/types/attendance";
import { CanvasActionMenu } from "@/components/canvas/CanvasActionMenu";
import { BookOpen, Clock, User } from "lucide-react";

interface AdminCourseSectionTableProps {
  sections: CourseSection[];
  onSelectSection: (sec: CourseSection) => void;
  getDiasTexto: (dias: number[]) => string;
}

export const AdminCourseSectionTable: React.FC<AdminCourseSectionTableProps> = ({
  sections,
  onSelectSection,
  getDiasTexto,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-[3px] shadow-2xs overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-[#F5F6F8] text-[#55636E] uppercase font-semibold text-xs border-b border-gray-200">
          <tr>
            <th className="p-3">Código Sección</th>
            <th className="p-3">Sección</th>
            <th className="p-3">Profesor Titular</th>
            <th className="p-3">Ayudantía (Días & Horario)</th>
            <th className="p-3">Sala</th>
            <th className="p-3 text-right w-16">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sections.map((sec) => (
            <tr
              key={sec.codigo}
              onClick={() => onSelectSection(sec)}
              className="hover:bg-blue-50/40 cursor-pointer transition-colors"
            >
              <td className="p-3 font-mono font-bold text-[#008EE2]">
                {sec.codigo}
              </td>
              <td className="p-3 font-semibold text-[#2D3B45]">
                {sec.nombre}
              </td>
              <td className="p-3 text-[#55636E]">
                <span className="flex items-center gap-1.5">
                  <User size={13} className="text-gray-400" />
                  <span>{sec.profesor}</span>
                </span>
              </td>
              <td className="p-3 text-purple-950 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-purple-600" />
                  <span>
                    {getDiasTexto(sec.horarioAyudantia.dias)} {sec.horarioAyudantia.horaInicio} - {sec.horarioAyudantia.horaFin}
                  </span>
                </span>
              </td>
              <td className="p-3 font-mono text-xs text-gray-600">
                {sec.horarioAyudantia.sala}
              </td>
              <td
                className="p-3 text-right"
                onClick={(e) => e.stopPropagation()}
              >
                <CanvasActionMenu
                  ariaLabel={`Acciones para ${sec.codigo}`}
                  items={[
                    {
                      label: "Ver y editar curso",
                      icon: <BookOpen size={14} className="text-[#008EE2]" />,
                      onClick: () => onSelectSection(sec),
                    },
                  ]}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
