"use client";

import React from "react";
import { StudentRosterItem } from "@/services/attendanceStore";
import { CanvasSearchableSelect } from "@/components/canvas/CanvasSearchableSelect";
import { ClassSession, CourseSection } from "@/types/attendance";
import { PublicAttendanceLocationCard } from "./PublicAttendanceLocationCard";
import {
  PublicAttendanceClosedScreen,
  PublicAttendanceDeviceLockedScreen,
} from "./PublicAttendanceStatusScreens";
import { usePublicAttendanceCheckin } from "@/hooks/usePublicAttendanceCheckin";
import { KeyRound, ArrowRight, Building2, Globe, MapPin } from "lucide-react";

interface PublicAttendanceCheckinProps {
  courseCode?: string;
  initialSectionId?: string;
  onSuccess: (data: {
    student: StudentRosterItem;
    session: ClassSession;
    section: CourseSection;
    timestamp: string;
    distanciaMetros?: number;
  }) => void;
}

export const PublicAttendanceCheckin: React.FC<PublicAttendanceCheckinProps> = ({
  courseCode,
  initialSectionId,
  onSuccess,
}) => {
  const {
    currentSection,
    sessionStatus,
    targetCampusNombre,
    targetRadius,
    deviceLockedData,
    studentOptions,
    selectedStudent,
    setSelectedStudent,
    sectionStudents,
    pinInput,
    setPinInput,
    pinError,
    setPinError,
    geoStatus,
    distancia,
    handleVerifyLocation,
    handleSubmit,
  } = usePublicAttendanceCheckin({ courseCode, initialSectionId, onSuccess });

  if (!sessionStatus.isActive) {
    return (
      <PublicAttendanceClosedScreen
        currentSection={currentSection}
        sessionStatus={sessionStatus}
        targetCampusNombre={targetCampusNombre}
      />
    );
  }

  if (deviceLockedData) {
    return (
      <PublicAttendanceDeviceLockedScreen
        deviceLockedData={deviceLockedData}
      />
    );
  }

  const isAyudantia = sessionStatus.tipo === "ayudantia";
  const courseTitle = currentSection.cursoNombre || "PROYECTO EN TICS II";

  return (
    <div className="bg-white border border-[#E0E3E6] rounded-[6px] shadow-canvas-card p-4 sm:p-6 max-w-md w-full mx-auto space-y-5 animate-fadeIn">
      <div className="border-b border-gray-200 pb-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#C8102E] uppercase tracking-wider block">
            Registro Oficial de Asistencia
          </span>
          <span className="text-[10px] text-gray-500 font-mono">
            {new Date().toLocaleDateString("es-CL")}
          </span>
        </div>
        <h2 className="text-base font-bold text-[#2D3B45] mt-0.5">{courseTitle}</h2>
        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
          <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded flex items-center gap-1.5 ${isAyudantia ? "bg-purple-100 text-purple-900 border border-purple-200" : "bg-blue-100 text-blue-900 border border-blue-200"}`}>
            ● {isAyudantia ? "Ayudantía Activa" : "Cátedra Activa"} ({sessionStatus.horaInicio} - {sessionStatus.horaFin})
          </span>
          <span className="text-[11px] text-[#2D3B45] bg-gray-100 px-2 py-0.5 rounded border border-gray-200 flex items-center gap-1">
            <Building2 size={11} className="text-[#6B7780]" /> Sala: No definida
          </span>
          {!currentSection.requiereGeolocalizacion && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded border bg-blue-50 text-[#008EE2] border-blue-200 flex items-center gap-1">
              <Globe size={11} /> Online (Sin GPS)
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-[4px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-2xs">
          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide block">1. Sección Asignada:</span>
            <span className="text-xs font-bold text-[#2D3B45]">{currentSection.nombre} ({currentSection.codigo})</span>
            <span className="text-[11px] text-gray-500 block">Docente: {currentSection.profesor} • Ayudante: {currentSection.ayudante}</span>
          </div>
          <span className="text-[10px] font-bold text-[#008EE2] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded shrink-0">Fijada</span>
        </div>

        <CanvasSearchableSelect
          label="2. Busca tu Nombre o RUT en la Nómina:"
          placeholder="Escribe tu apellido, nombre o RUT (ej: Aliaga o 20.481)..."
          options={studentOptions}
          value={selectedStudent?.canvas_id || null}
          onChange={(val) => {
            const found = sectionStudents.find((s) => s.canvas_id === val);
            setSelectedStudent(found || null);
          }}
          required
          selectedCardLabel="Estudiante Confirmado en Nómina"
          noOptionsText="No se encontró ningún estudiante con ese nombre o RUT en esta sección."
        />

        {currentSection.requierePin && (
          <div className="space-y-1.5 p-3 bg-gray-50 border border-gray-200 rounded-[4px]">
            <label className="font-bold text-[#2D3B45] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound size={13} className="text-[#008EE2]" />
                3. Ingresa el PIN Proyectado en la Sala:
              </span>
              <span className="text-[10px] text-gray-500 font-mono">(4 dígitos • único de hoy)</span>
            </label>
            <input
              type="text"
              maxLength={4}
              placeholder="Ej: 4821"
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError(false);
              }}
              className="w-full text-center font-mono font-black text-lg p-2 border border-gray-300 rounded-[4px] bg-white tracking-widest text-[#2D3B45]"
            />
            {pinError && (
              <span className="text-[11px] text-red-600 font-semibold block">
                PIN incorrecto para la sesión de hoy. Revisa el código proyectado en la pantalla de la sala.
              </span>
            )}
          </div>
        )}

        {currentSection.requiereGeolocalizacion ? (
          <PublicAttendanceLocationCard
            geoStatus={geoStatus}
            distancia={distancia}
            targetCampusNombre={targetCampusNombre}
            targetRadius={targetRadius}
            onVerifyLocation={handleVerifyLocation}
          />
        ) : (
          <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-[4px] flex items-center gap-2.5 text-xs text-blue-900 animate-fadeIn">
            <Globe size={16} className="text-[#008EE2] shrink-0" />
            <div>
              <span className="font-bold">Ayudantía Online Activa:</span>
              <p className="text-[11px] text-gray-600 mt-0.5">
                No se requiere verificar ubicación GPS en campus para registrar tu asistencia hoy.
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!selectedStudent || (currentSection.requiereGeolocalizacion && geoStatus !== "verified")}
          className="w-full py-3 bg-[#C8102E] hover:bg-[#A00D24] text-white rounded-[4px] font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Confirmar y Marcar Asistencia</span>
          <ArrowRight size={14} />
        </button>

        {currentSection.requiereGeolocalizacion && geoStatus !== "verified" && selectedStudent && (
          <p className="text-[10px] text-center text-gray-500">
            * Debes presionar &ldquo;Verificar que estoy en la sala (GPS)&rdquo; para habilitar el botón de envío.
          </p>
        )}
      </form>
    </div>
  );
};
