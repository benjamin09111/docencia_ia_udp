import React from "react";
import { Clock, Calendar, Building2, MapPin, Lock, ShieldCheck } from "lucide-react";
import { CourseSection } from "@/types/attendance";
import { SessionActiveStatus } from "@/services/udpRoomsService";

interface ClosedScreenProps {
  currentSection: CourseSection;
  sessionStatus: SessionActiveStatus;
  targetCampusNombre: string;
}

export const PublicAttendanceClosedScreen: React.FC<ClosedScreenProps> = ({
  currentSection,
  sessionStatus,
  targetCampusNombre,
}) => {
  return (
    <div className="bg-white border border-[#E0E3E6] rounded-[6px] shadow-canvas-card p-6 max-w-md w-full mx-auto space-y-4 text-center animate-fadeIn">
      <div className="w-12 h-12 bg-blue-100 text-[#008EE2] rounded-full flex items-center justify-center mx-auto shadow-xs">
        <Clock size={24} />
      </div>
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-[#C8102E] uppercase tracking-wider block">
          Portal Cerrado • Fuera de Horario
        </span>
        <h3 className="text-base font-bold text-[#2D3B45]">
          Asistencia No Disponible
        </h3>
      </div>
      <p className="text-xs text-[#6B7780] leading-relaxed">
        El registro de asistencia para <strong>{currentSection.nombre} ({currentSection.codigo})</strong> se habilita exclusivamente durante el horario oficial de ayudantía de clases.
      </p>

      {sessionStatus.proximaSesion && (
        <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-[4px] text-xs text-left space-y-1.5 shadow-2xs">
          <span className="font-bold text-[#2D3B45] flex items-center gap-1.5">
            <Calendar size={13} className="text-[#008EE2]" />
            Próxima Sesión Programada:
          </span>
          <div className="text-gray-800 font-medium">
            <strong>Ayudantía:</strong> {sessionStatus.proximaSesion.diaNombre} de {sessionStatus.proximaSesion.horaInicio} a {sessionStatus.proximaSesion.horaFin} hrs.
          </div>
          <div className="text-gray-600 font-mono text-[11px] flex items-center gap-1 pt-0.5">
            <Building2 size={12} className="text-[#6B7780]" /> Sala: No definida
          </div>
          <div className="text-gray-500 text-[10px] flex items-center gap-1">
            <MapPin size={11} className="text-gray-400" /> {targetCampusNombre}
          </div>
        </div>
      )}
    </div>
  );
};

interface DeviceLockedScreenProps {
  deviceLockedData: {
    studentName: string;
    studentRut?: string;
    timestamp: string;
  };
}

export const PublicAttendanceDeviceLockedScreen: React.FC<DeviceLockedScreenProps> = ({
  deviceLockedData,
}) => {
  return (
    <div className="bg-white border border-[#E0E3E6] rounded-[6px] shadow-canvas-card p-6 max-w-md w-full mx-auto space-y-4 text-center animate-fadeIn">
      <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto shadow-xs">
        <Lock size={24} />
      </div>
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
          Dispositivo Bloqueado
        </span>
        <h3 className="text-base font-bold text-[#2D3B45]">
          Asistencia Ya Registrada Hoy
        </h3>
      </div>
      <p className="text-xs text-[#6B7780] leading-relaxed">
        Este navegador ya envió la asistencia para <strong>{deviceLockedData.studentName}</strong> {deviceLockedData.studentRut ? `(${deviceLockedData.studentRut})` : ""} a las {deviceLockedData.timestamp}.
      </p>
      <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-[4px] text-[11px] text-blue-900 text-left space-y-1">
        <span className="font-bold flex items-center gap-1 text-[#008EE2]">
          <ShieldCheck size={13} /> Probidad Académica UDP
        </span>
        <p>
          Por normativas de la Universidad Diego Portales, no se permite registrar a otro estudiante desde el mismo dispositivo.
        </p>
      </div>
    </div>
  );
};
