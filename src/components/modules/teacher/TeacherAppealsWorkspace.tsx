"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FileText, Clock, Award } from "lucide-react";
import { CourseSection, AttendanceAppeal } from "@/types/attendance";
import { getSavedAppeals } from "@/services/appealsStore";
import { TeacherAttendanceAppealsPanel } from "./TeacherAttendanceAppealsPanel";
import { TeacherDecimasAppealsPanel } from "./TeacherDecimasAppealsPanel";

interface TeacherAppealsWorkspaceProps {
  section: CourseSection;
  /** Se invoca SOLO con las apelaciones de asistencia que la base confirmó como resueltas */
  onAppealsResolved: (resolved: AttendanceAppeal[]) => void;
}

type Kind = "asistencia" | "decimas";

export const TeacherAppealsWorkspace: React.FC<TeacherAppealsWorkspaceProps> = ({ section, onAppealsResolved }) => {
  const [appeals, setAppeals] = useState<AttendanceAppeal[]>([]);
  const [kind, setKind] = useState<Kind>("asistencia");

  const refresh = useCallback(() => getSavedAppeals(section.codigo).then(setAppeals), [section.codigo]);

  // Las apelaciones llegan desde los celulares de los alumnos vía Supabase: recargar periódicamente
  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 15000);
    return () => clearInterval(interval);
  }, [refresh]);

  const byKind = useMemo(() => {
    const asistencia = appeals.filter((a) => a.motivo === "asistencia");
    const decimas = appeals.filter((a) => a.motivo === "decimas");
    const pend = (l: AttendanceAppeal[]) => l.filter((a) => a.status === "pendiente").length;
    return { asistencia, decimas, pendAsistencia: pend(asistencia), pendDecimas: pend(decimas) };
  }, [appeals]);

  const kindButton = (id: Kind, label: string, pending: number, icon: React.ReactNode) => (
    <button
      type="button"
      onClick={() => setKind(id)}
      className={`px-3.5 h-9 text-xs font-bold rounded-[4px] flex items-center gap-1.5 border cursor-pointer transition-colors ${
        kind === id
          ? "bg-[#2D3B45] text-white border-[#2D3B45]"
          : "bg-white text-[#2D3B45] border-[#C7CDD1] hover:bg-[#F5F6F8]"
      }`}
    >
      {icon}
      <span>{label}</span>
      {pending > 0 && (
        <span className="px-1.5 min-w-[18px] text-center bg-[#C8102E] text-white rounded-full text-[10px]">{pending}</span>
      )}
    </button>
  );

  return (
    <div className="space-y-3 animate-fadeIn">
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[4px] bg-[#C8102E] text-white flex items-center justify-center">
            <FileText size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#2D3B45]">Apelaciones • {section.nombre}</h2>
            <p className="text-[11px] text-[#6B7780] flex items-center gap-1">
              <Clock size={11} /> {byKind.pendAsistencia + byKind.pendDecimas} pendientes en total
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {kindButton("asistencia", "Asistencia", byKind.pendAsistencia, <Clock size={13} />)}
          {kindButton("decimas", "Décimas", byKind.pendDecimas, <Award size={13} />)}
        </div>
      </div>

      {kind === "asistencia" ? (
        <TeacherAttendanceAppealsPanel appeals={byKind.asistencia} refresh={refresh} onAppealsResolved={onAppealsResolved} />
      ) : (
        <TeacherDecimasAppealsPanel appeals={byKind.decimas} refresh={refresh} />
      )}
    </div>
  );
};
