"use client";

import React, { useState, use } from "react";
import dynamic from "next/dynamic";
import { AttendanceConfirmationTicket } from "@/components/modules/public-attendance/AttendanceConfirmationTicket";
import { StudentRosterItem } from "@/services/attendanceStore";
import { ClassSession, CourseSection } from "@/types/attendance";
import { GraduationCap, ShieldCheck, Loader2 } from "lucide-react";

const PublicAttendanceCheckin = dynamic(
  () =>
    import("@/components/modules/public-attendance/PublicAttendanceCheckin").then(
      (mod) => mod.PublicAttendanceCheckin
    ),
  {
    ssr: false,
    loading: () => (
      <div className="max-w-md w-full mx-auto p-6 bg-white border border-[#E0E3E6] rounded-[4px] shadow-sm flex items-center justify-center py-16 text-xs text-[#6B7780] gap-2">
        <Loader2 size={16} className="animate-spin text-[#008EE2]" />
        <span>Cargando sistema de asistencia...</span>
      </div>
    ),
  }
);

interface PublicAttendancePageProps {
  params: Promise<{ cursoId: string }>;
  searchParams: Promise<{ sec?: string }>;
}

export default function PublicAttendancePage({
  params,
  searchParams,
}: PublicAttendancePageProps) {
  const resolvedParams = use(params);
  const resolvedSearch = use(searchParams);

  const [confirmedData, setConfirmedData] = useState<{
    student: StudentRosterItem;
    session: ClassSession;
    section: CourseSection;
    timestamp: string;
    distanciaMetros?: number;
  } | null>(null);

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Header Institucional Superior */}
      <header className="max-w-md w-full mx-auto flex items-center justify-between border-b border-gray-200 pb-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#C8102E] text-white flex items-center justify-center font-bold">
            <GraduationCap size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
              Universidad Diego Portales
            </span>
            <h1 className="text-xs font-bold text-[#2D3B45]">
              Escuela de Informática y Telecomunicaciones
            </h1>
          </div>
        </div>

        <span className="text-[10px] text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded font-mono flex items-center gap-1">
          <ShieldCheck size={11} /> Seguro
        </span>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 flex items-center justify-center">
        {!confirmedData ? (
          <PublicAttendanceCheckin
            courseCode={resolvedParams.cursoId}
            initialSectionId={resolvedSearch?.sec}
            onSuccess={(data) => setConfirmedData(data)}
          />
        ) : (
          <AttendanceConfirmationTicket
            student={confirmedData.student}
            session={confirmedData.session}
            section={confirmedData.section}
            timestamp={confirmedData.timestamp}
            distanciaMetros={confirmedData.distanciaMetros}
          />
        )}
      </main>

      {/* Footer Mínimo */}
      <footer className="text-center text-[11px] text-gray-500 mt-8 py-3 border-t border-gray-200">
        Portal de Marcaje Asistido • Plataforma Docente UDP © 2026
      </footer>
    </div>
  );
}
