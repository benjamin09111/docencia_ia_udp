"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Clock, MapPin, Globe, ArrowRight } from "lucide-react";
import { StudentRosterItem } from "@/services/attendanceStore";
import { ClassSession, CourseSection } from "@/types/attendance";

interface AttendanceConfirmationTicketProps {
  student: StudentRosterItem;
  session: ClassSession;
  section: CourseSection;
  timestamp: string;
  distanciaMetros?: number;
}

export const AttendanceConfirmationTicket: React.FC<AttendanceConfirmationTicketProps> = ({
  student,
  session,
  section,
  timestamp,
  distanciaMetros,
}) => {
  return (
    <div className="bg-white border border-[#E0E3E6] rounded-[6px] shadow-canvas-card p-4 sm:p-6 max-w-md w-full mx-auto space-y-5 animate-fadeIn">
      {/* Icono de Éxito */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-lg font-extrabold text-[#2D3B45]">
          ¡Asistencia Registrada con Éxito!
        </h2>
        <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-block">
          Comprobante Oficial UDP
        </span>
      </div>

      {/* Ticket con Detalles */}
      <div className="border border-dashed border-gray-300 rounded-[4px] bg-[#F9FAFB] p-4 space-y-3 text-xs">
        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
          <span className="text-[#6B7780] font-medium">Asignatura:</span>
          <strong className="text-[#2D3B45] text-right">{section.cursoNombre || "PROYECTO EN TICS II"}</strong>
        </div>

        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
          <span className="text-[#6B7780] font-medium">Sección:</span>
          <span className="font-semibold text-[#008EE2]">{section.nombre}</span>
        </div>

        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
          <span className="text-[#6B7780] font-medium">Tipo de Sesión:</span>
          <span className="font-bold uppercase text-purple-900 bg-purple-100 px-2 py-0.5 rounded text-[10px]">
            {session.tipo}
          </span>
        </div>

        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
          <span className="text-[#6B7780] font-medium">Estudiante:</span>
          <span className="font-bold text-[#2D3B45] text-right">
            {student.nombres} {student.apellidos}
          </span>
        </div>

        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
          <span className="text-[#6B7780] font-medium">ID Canvas:</span>
          <span className="font-mono text-gray-700">{student.canvas_id}</span>
        </div>

        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
          <span className="text-[#6B7780] font-medium flex items-center gap-1">
            <Clock size={12} /> Hora de Marcaje:
          </span>
          <span className="font-mono text-[#2D3B45] font-semibold">{timestamp}</span>
        </div>

        {distanciaMetros !== undefined ? (
          <div className="flex justify-between items-center">
            <span className="text-[#6B7780] font-medium flex items-center gap-1">
              <MapPin size={12} /> Ubicación:
            </span>
            <span className="text-emerald-800 font-medium">
              Dentro del Campus UDP ({distanciaMetros}m)
            </span>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <span className="text-[#6B7780] font-medium flex items-center gap-1">
              <Globe size={12} /> Modalidad:
            </span>
            <span className="text-[#008EE2] font-semibold">
              Online / Remoto (Sin validación GPS)
            </span>
          </div>
        )}
      </div>

      {/* Candado Anti-Fraude */}
      <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-[4px] text-[11px] text-[#0277BD] flex items-start gap-2">
        <ShieldCheck size={16} className="shrink-0 mt-0.5 text-[#008EE2]" />
        <span>
          <strong>Dispositivo bloqueado:</strong> Tu navegador ha registrado esta marca oficial. No se permite registrar la asistencia de otros compañeros desde este equipo.
        </span>
      </div>

      <div className="text-center pt-1 border-t border-gray-100">
        <Link
          href={`/${encodeURIComponent(section.codigo)}/visual`}
          className="text-xs font-bold text-[#008EE2] hover:underline inline-flex items-center gap-1"
        >
          <span>Ver Planilla de Asistencias y Décimas a la Fecha</span>
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
};
