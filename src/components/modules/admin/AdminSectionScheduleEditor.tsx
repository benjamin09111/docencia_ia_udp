"use client";

import React, { useState, useEffect } from "react";
import { CourseSection, SectionSchedule } from "@/types/attendance";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { Calendar, Building2, Save, PlusCircle, Trash2, Clock } from "lucide-react";

interface AdminSectionScheduleEditorProps {
  section: CourseSection;
  onSave: (updatedData: {
    profesor: string;
    ayudante: string;
    horarioAyudantia: SectionSchedule;
    horarioAyudantia2?: SectionSchedule;
  }) => void;
  saveSuccess?: boolean;
}

const DIAS_OPCIONES = [
  { val: 1, label: "Lunes" },
  { val: 2, label: "Martes" },
  { val: 3, label: "Miércoles" },
  { val: 4, label: "Jueves" },
  { val: 5, label: "Viernes" },
  { val: 6, label: "Sábado" },
];

export const AdminSectionScheduleEditor: React.FC<AdminSectionScheduleEditorProps> = ({ section, onSave }) => {
  const [dia1, setDia1] = useState<number>(section.horarioAyudantia?.dias?.[0] ?? 3);
  const [inicio1, setInicio1] = useState(section.horarioAyudantia?.horaInicio || "14:30");
  const [fin1, setFin1] = useState(section.horarioAyudantia?.horaFin || "16:00");
  const [sala1, setSala1] = useState(section.horarioAyudantia?.sala || "SALA X");

  const [hasSchedule2, setHasSchedule2] = useState<boolean>(
    Boolean(section.horarioAyudantia2 && (section.horarioAyudantia2.dias?.length ?? 0) > 0)
  );
  const [dia2, setDia2] = useState<number>(section.horarioAyudantia2?.dias?.[0] ?? 5);
  const [inicio2, setInicio2] = useState(section.horarioAyudantia2?.horaInicio || "10:00");
  const [fin2, setFin2] = useState(section.horarioAyudantia2?.horaFin || "11:30");
  const [sala2, setSala2] = useState(section.horarioAyudantia2?.sala || "SALA X");

  const [profesor, setProfesor] = useState(section.profesor || "Prof. Titular UDP");
  const [ayudante, setAyudante] = useState(section.ayudante || "Ayudante UDP");

  useEffect(() => {
    setDia1(section.horarioAyudantia?.dias?.[0] ?? 3);
    setInicio1(section.horarioAyudantia?.horaInicio || "14:30");
    setFin1(section.horarioAyudantia?.horaFin || "16:00");
    setSala1(section.horarioAyudantia?.sala || "SALA X");

    const has2 = Boolean(section.horarioAyudantia2 && (section.horarioAyudantia2.dias?.length ?? 0) > 0);
    setHasSchedule2(has2);
    setDia2(section.horarioAyudantia2?.dias?.[0] ?? 5);
    setInicio2(section.horarioAyudantia2?.horaInicio || "10:00");
    setFin2(section.horarioAyudantia2?.horaFin || "11:30");
    setSala2(section.horarioAyudantia2?.sala || "SALA X");

    setProfesor(section.profesor || "Prof. Titular UDP");
    setAyudante(section.ayudante || "Ayudante UDP");
  }, [section]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const horario1: SectionSchedule = { ...section.horarioAyudantia, dias: [dia1], horaInicio: inicio1, horaFin: fin1, sala: sala1 };
    const horario2: SectionSchedule | undefined = hasSchedule2 ? { dias: [dia2], horaInicio: inicio2, horaFin: fin2, sala: sala2 } : undefined;
    onSave({ profesor, ayudante, horarioAyudantia: horario1, horarioAyudantia2: horario2 });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-canvas-card space-y-4">
      <div className="border-b border-gray-200 pb-3">
        <h3 className="text-sm font-bold text-[#2D3B45] flex items-center gap-2">
          <Calendar size={16} className="text-[#008EE2]" />
          Horarios Oficiales de Asistencia
        </h3>
        <p className="text-xs text-[#6B7780] mt-0.5">Configura hasta 2 horarios semanales independientes para abrir la asistencia.</p>
      </div>

      {/* BLOQUE HORARIO 1 */}
      <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[4px] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#1E293B] flex items-center gap-1.5"><Clock size={13} className="text-[#008EE2]" /> Horario 1 (Principal)</span>
          <span className="text-[10px] bg-blue-100 text-[#008EE2] px-1.5 py-0.5 rounded font-bold uppercase">Activo</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-bold text-gray-600 block mb-1">Día Semanal</label>
            <select value={dia1} onChange={(e) => setDia1(Number(e.target.value))} className="w-full text-xs border border-gray-300 rounded p-1.5 bg-white text-[#2D3B45]">
              {DIAS_OPCIONES.map((d) => (<option key={d.val} value={d.val}>{d.label}</option>))}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-600 block mb-1">Hora Inicio</label>
            <input type="time" value={inicio1} onChange={(e) => setInicio1(e.target.value)} className="w-full text-xs border border-gray-300 rounded p-1.5 bg-white text-[#2D3B45]" />
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-600 block mb-1">Hora Fin</label>
            <input type="time" value={fin1} onChange={(e) => setFin1(e.target.value)} className="w-full text-xs border border-gray-300 rounded p-1.5 bg-white text-[#2D3B45]" />
          </div>
        </div>
        <div>
          <label className="text-[11px] font-bold text-gray-600 block mb-1">Sala Asignada</label>
          <div className="relative">
            <Building2 size={13} className="absolute left-2.5 top-2.5 text-gray-400" />
            <input type="text" value={sala1} onChange={(e) => setSala1(e.target.value)} placeholder="Ej: LAB-COMP 2" className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-300 rounded bg-white text-[#2D3B45]" />
          </div>
        </div>
      </div>

      {/* BLOQUE HORARIO 2 (OPCIONAL) */}
      {hasSchedule2 ? (
        <div className="p-3 bg-[#FFFDF5] border border-[#FDE68A] rounded-[4px] space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#92400E] flex items-center gap-1.5"><Clock size={13} className="text-[#D97706]" /> Horario 2 (Secundario / Segundo Bloque)</span>
            <button type="button" onClick={() => setHasSchedule2(false)} className="text-[11px] text-red-600 hover:text-red-800 flex items-center gap-1 font-semibold cursor-pointer">
              <Trash2 size={12} /> Quitar 2do Horario
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-gray-600 block mb-1">Día Semanal</label>
              <select value={dia2} onChange={(e) => setDia2(Number(e.target.value))} className="w-full text-xs border border-gray-300 rounded p-1.5 bg-white text-[#2D3B45]">
                {DIAS_OPCIONES.map((d) => (<option key={d.val} value={d.val}>{d.label}</option>))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-600 block mb-1">Hora Inicio</label>
              <input type="time" value={inicio2} onChange={(e) => setInicio2(e.target.value)} className="w-full text-xs border border-gray-300 rounded p-1.5 bg-white text-[#2D3B45]" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-600 block mb-1">Hora Fin</label>
              <input type="time" value={fin2} onChange={(e) => setFin2(e.target.value)} className="w-full text-xs border border-gray-300 rounded p-1.5 bg-white text-[#2D3B45]" />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-600 block mb-1">Sala Asignada (Bloque 2)</label>
            <div className="relative">
              <Building2 size={13} className="absolute left-2.5 top-2.5 text-gray-400" />
              <input type="text" value={sala2} onChange={(e) => setSala2(e.target.value)} placeholder="Ej: SALA 302" className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-300 rounded bg-white text-[#2D3B45]" />
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setHasSchedule2(true)}
          className="w-full py-2 px-3 border border-dashed border-[#008EE2]/60 hover:border-[#008EE2] bg-blue-50/40 hover:bg-blue-50 text-[#008EE2] text-xs rounded-[4px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <PlusCircle size={14} />
          Agregar un Segundo Horario para este Curso/Sección
        </button>
      )}

      {/* PROFESOR Y AYUDANTE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-gray-100">
        <div>
          <label className="text-xs font-bold text-[#2D3B45] block mb-1">Profesor Titular</label>
          <input type="text" value={profesor} onChange={(e) => setProfesor(e.target.value)} className="w-full text-xs border border-gray-300 rounded p-2 bg-white text-[#2D3B45]" />
        </div>
        <div>
          <label className="text-xs font-bold text-[#2D3B45] block mb-1">Ayudante a Cargo</label>
          <input type="text" value={ayudante} onChange={(e) => setAyudante(e.target.value)} className="w-full text-xs border border-gray-300 rounded p-2 bg-white text-[#2D3B45]" />
        </div>
      </div>

      <div className="flex justify-end pt-2 border-t border-gray-100">
        <CanvasButton variant="primary-canvas" size="sm" type="submit" icon={<Save size={14} />} title="Guardar horarios configurados">
          Guardar Cambios de Horario
        </CanvasButton>
      </div>
    </form>
  );
};
