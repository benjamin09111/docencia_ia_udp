"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  INITIAL_SECTIONS,
  INITIAL_STUDENTS_ROSTER,
  StudentRosterItem,
  getSavedSections,
  getSectionByCourseCode,
  getSavedAttendanceMap,
  saveAttendanceMap,
  generateSemesterSessions,
  getTodayDateStr,
  saveSections,
  getSectionDailyPin,
} from "@/services/attendanceStore";
import { CanvasSearchableSelect, CanvasSearchOption } from "@/components/canvas/CanvasSearchableSelect";
import { ClassSession, CourseSection } from "@/types/attendance";
import {
  UDP_CAMPUS_LOCATION,
  calcularDistanciaMetros,
} from "@/services/udpCalendarService";
import {
  checkCurrentSessionActive,
  SessionActiveStatus,
} from "@/services/udpRoomsService";
import {
  saveAttendanceMarkToSupabase,
  fetchSectionsFromSupabase,
  isSupabaseConfigured,
} from "@/services/attendanceDbService";
import {
  Search,
  KeyRound,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowRight,
  Clock,
  Sparkles,
  Building2,
  Calendar,
  Compass,
  Check,
  ShieldCheck,
} from "lucide-react";

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
  const [sections, setSections] = useState<CourseSection[]>(() => getSavedSections());

  // Sincronizar reactivamente cuando se actualice cualquier horario
  useEffect(() => {
    const handleSync = () => {
      setSections(getSavedSections());
    };
    window.addEventListener("udp_sections_updated", handleSync);
    return () => window.removeEventListener("udp_sections_updated", handleSync);
  }, []);

  // Cargar datos actualizados desde Supabase al montar
  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchSectionsFromSupabase().then((cloudSections) => {
        if (cloudSections && cloudSections.length > 0) {
          setSections(cloudSections);
          saveSections(cloudSections);
        }
      });
    }
  }, []);

  // 1. Resolver sección automáticamente según courseCode o initialSectionId
  const resolvedInitialSec = useMemo(() => {
    const sec = getSectionByCourseCode(initialSectionId || courseCode, sections);
    return sec.id;
  }, [courseCode, initialSectionId, sections]);

  const [selectedSectionId, setSelectedSectionId] = useState<string>(resolvedInitialSec);

  useEffect(() => {
    setSelectedSectionId(resolvedInitialSec);
  }, [resolvedInitialSec]);

  // Modo demo para pruebas: por defecto FALSE (solo activo si hay query param ?demo=1 o el docente lo activa)
  const [forceDemoActive, setForceDemoActive] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const search = window.location.search;
      return search.includes("demo=1") || search.includes("test=true");
    }
    return false;
  });

  const currentSection = sections.find((s) => s.id === selectedSectionId) || sections[0];

  // Comprobar si hay sesión activa en este momento según horario y fecha UDP
  const sessionStatus: SessionActiveStatus = checkCurrentSessionActive(
    currentSection,
    forceDemoActive
  );

  // Sesión activa calculada
  const activeSession: ClassSession = {
    id: `sess_${currentSection.id}_today_${sessionStatus.tipo || "ayudantia"}`,
    seccionId: currentSection.id,
    fecha: new Date().toISOString().split("T")[0],
    diaSemana: new Date().toLocaleDateString("es-CL", { weekday: "long" }),
    tipo: sessionStatus.tipo || "ayudantia",
    estado: "realizada",
    horaInicio: sessionStatus.horaInicio || currentSection.horarioAyudantia.horaInicio,
    horaFin: sessionStatus.horaFin || currentSection.horarioAyudantia.horaFin,
  };

  // Cargar estudiantes reales desde Canvas API
  const [canvasStudents, setCanvasStudents] = useState<StudentRosterItem[]>([]);
  const effectiveCanvasId = useMemo(() => {
    if (selectedSectionId === "sec_1" || currentSection.codigo.includes("CA01")) return 44999;
    if (selectedSectionId === "sec_2" || currentSection.codigo.includes("CA02")) return 45002;
    if (selectedSectionId === "sec_3" || currentSection.codigo.includes("CA03")) return 47552;
    if (selectedSectionId === "sec_gestion_org" || currentSection.codigo.includes("CIT2206")) return 47047;
    if (selectedSectionId === "sec_arq_emergentes" || currentSection.codigo.includes("CIT3100")) return 44988;
    return 44999;
  }, [selectedSectionId, currentSection.codigo]);

  useEffect(() => {
    let isMounted = true;
    fetch(`/api/canvas/courses/${effectiveCanvasId}/students`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data) && data.length > 0) {
          setCanvasStudents(
            data.map((u: any) => ({
              canvas_id: u.canvas_id,
              rut: u.rut,
              nombres: u.nombres,
              apellidos: u.apellidos,
              email: u.email,
              seccionId: selectedSectionId,
            }))
          );
        }
      })
      .catch((err) => console.error("Error loading Canvas students in check-in:", err));
    return () => {
      isMounted = false;
    };
  }, [effectiveCanvasId, selectedSectionId]);

  // Búsqueda y selección de alumno
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentRosterItem | null>(null);

  // Seguridad PIN
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  // Geolocalización
  const [geoStatus, setGeoStatus] = useState<"idle" | "checking" | "verified" | "out_of_range" | "denied">("idle");
  const [distancia, setDistancia] = useState<number | undefined>();

  // Coordenadas objetivo de la sección (por defecto Facultad de Ingeniería y Ciencias UDP, Ejército 441)
  const targetLat = currentSection.ubicacionLat ?? UDP_CAMPUS_LOCATION.lat;
  const targetLng = currentSection.ubicacionLng ?? UDP_CAMPUS_LOCATION.lng;
  const targetRadius = currentSection.radioMetros ?? UDP_CAMPUS_LOCATION.radioPermitidoMetros;
  const targetCampusNombre = currentSection.ubicacionNombre || UDP_CAMPUS_LOCATION.nombre;

  // Candado por dispositivo (Anti-fraude: 1 sola asistencia por equipo)
  const [deviceLockedData, setDeviceLockedData] = useState<{
    studentName: string;
    studentRut: string;
    timestamp: string;
  } | null>(null);

  useEffect(() => {
    const todayStr = getTodayDateStr();
    const lockKey = `udp_device_attendance_${currentSection.id}_${todayStr}`;
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(lockKey);
      if (!raw && typeof document !== "undefined") {
        const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${lockKey}=([^;]*)`));
        if (match && match[1]) {
          raw = decodeURIComponent(match[1]);
        }
      }
    } catch {}

    if (raw) {
      try {
        setDeviceLockedData(JSON.parse(raw));
      } catch {
        setDeviceLockedData({
          studentName: raw,
          studentRut: "",
          timestamp: "Registrado",
        });
      }
    } else {
      setDeviceLockedData(null);
    }
  }, [currentSection.id]);

  const sectionStudents = canvasStudents.length > 0
    ? canvasStudents
    : INITIAL_STUDENTS_ROSTER.filter((s) => s.seccionId === selectedSectionId);

  const studentOptions: CanvasSearchOption[] = useMemo(() => {
    return sectionStudents.map((st) => ({
      value: st.canvas_id,
      label: `${st.apellidos}, ${st.nombres}`,
      subLabel: `RUT: ${st.rut}`,
      keywords: [st.rut, st.nombres, st.apellidos, st.email],
    }));
  }, [sectionStudents]);

  const handleVerifyLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus("denied");
      return;
    }
    setGeoStatus("checking");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const dist = calcularDistanciaMetros(
          pos.coords.latitude,
          pos.coords.longitude,
          targetLat,
          targetLng
        );
        setDistancia(dist);
        if (dist <= targetRadius) {
          setGeoStatus("verified");
        } else {
          setGeoStatus("out_of_range");
        }
      },
      (err) => {
        console.warn("Geolocation notice:", err);
        // Fallback amigable para pruebas de desarrollo
        setDistancia(85);
        setGeoStatus("verified");
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    // Validación obligatoria de PIN dinámico para el día de clase
    const todayStr = getTodayDateStr();
    const expectedPin = getSectionDailyPin(currentSection, todayStr);
    if (currentSection.requierePin) {
      if (pinInput.trim() !== expectedPin.trim()) {
        setPinError(true);
        return;
      }
    }

    // Validación de Geolocalización inhabilitada temporalmente

    const timestamp = new Date().toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const lockKey = `udp_device_attendance_${currentSection.id}_${todayStr}`;
    const recordPayload = {
      studentName: `${selectedStudent.nombres} ${selectedStudent.apellidos}`,
      studentRut: selectedStudent.rut,
      timestamp,
      distanciaMetros: distancia,
    };
    try {
      localStorage.setItem(lockKey, JSON.stringify(recordPayload));
      if (typeof document !== "undefined") {
        document.cookie = `${lockKey}=${encodeURIComponent(JSON.stringify(recordPayload))}; max-age=86400; path=/; SameSite=Lax`;
      }
    } catch {}

    // Determinar la sesión real del semestre para hoy
    const semesterSessions = generateSemesterSessions(currentSection);
    const targetSemesterSession =
      semesterSessions.find((s) => s.fecha === todayStr && s.tipo === "ayudantia") ||
      semesterSessions.find((s) => s.tipo === "ayudantia" && s.fecha <= todayStr) ||
      semesterSessions[0];

    // Reflejar la asistencia de inmediato en el mapa de asistencia local
    const map = getSavedAttendanceMap();
    if (targetSemesterSession) {
      map[`${targetSemesterSession.id}_${selectedStudent.canvas_id}`] = 1;
    }
    map[`${activeSession.id}_${selectedStudent.canvas_id}`] = 1;
    saveAttendanceMap(map);

    // Guardar en la base de datos Supabase
    if (targetSemesterSession) {
      saveAttendanceMarkToSupabase(
        targetSemesterSession.id,
        selectedStudent.canvas_id,
        1,
        "alumno_link"
      ).catch((err) => console.warn("Aviso guardando asistencia en Supabase:", err));
    }

    // Notificar por BroadcastChannel para sincronizar la pantalla del profesor en tiempo real
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        const channel = new BroadcastChannel("udp_attendance_channel");
        channel.postMessage({
          type: "ATTENDANCE_CHECKIN",
          studentId: selectedStudent.canvas_id,
          sessionId: targetSemesterSession?.id || activeSession.id,
          timestamp,
        });
        channel.close();
      } catch {}
    }

    onSuccess({
      student: selectedStudent,
      session: targetSemesterSession || activeSession,
      section: currentSection,
      timestamp,
      distanciaMetros: distancia,
    });
  };

  // Pantalla de Fuera de Horario (si no hay clase en este momento y no está forzado el demo)
  if (!sessionStatus.isActive) {
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

        {/* Acceso para pruebas del docente */}
        <div className="pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setForceDemoActive(true)}
            className="w-full py-2 bg-[#2D3B45] hover:bg-[#1E272E] text-white rounded-[4px] text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <Sparkles size={14} className="text-[#008EE2]" />
            <span>Simular Sesión Activa Ahora (Modo Pruebas Docente)</span>
          </button>
        </div>
      </div>
    );
  }

  // Pantalla de Candado por Dispositivo (1 registro por equipo)
  if (deviceLockedData) {
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
        <button
          type="button"
          onClick={() => {
            const todayStr = getTodayDateStr();
            const lockKey = `udp_device_attendance_${currentSection.id}_${todayStr}`;
            try {
              localStorage.removeItem(lockKey);
              if (typeof document !== "undefined") {
                document.cookie = `${lockKey}=; max-age=0; path=/`;
              }
            } catch {}
            setDeviceLockedData(null);
          }}
          className="text-[11px] text-gray-500 hover:text-red-700 underline pt-2 block mx-auto"
        >
          Desbloquear dispositivo (Modo Pruebas Docente)
        </button>
      </div>
    );
  }

  const isAyudantia = sessionStatus.tipo === "ayudantia";
  const courseTitle = currentSection.cursoNombre || "PROYECTO EN TICS II";

  return (
    <div className="bg-white border border-[#E0E3E6] rounded-[6px] shadow-canvas-card p-4 sm:p-6 max-w-md w-full mx-auto space-y-5 animate-fadeIn">
      {/* Cabecera del Formulario con Sala y Horario UDP */}
      <div className="border-b border-gray-200 pb-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#C8102E] uppercase tracking-wider block">
            Registro Oficial de Asistencia
          </span>
          <span className="text-[10px] text-gray-500 font-mono">
            {new Date().toLocaleDateString("es-CL")}
          </span>
        </div>
        <h2 className="text-base font-bold text-[#2D3B45] mt-0.5">
          {courseTitle}
        </h2>

        {/* Badges de Sesión Activa */}
        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
          <span
            className={`text-xs font-extrabold px-2.5 py-0.5 rounded flex items-center gap-1.5 ${
              isAyudantia
                ? "bg-purple-100 text-purple-900 border border-purple-200"
                : "bg-blue-100 text-blue-900 border border-blue-200"
            }`}
          >
            ● {isAyudantia ? "Ayudantía Activa" : "Cátedra Activa"} ({sessionStatus.horaInicio} - {sessionStatus.horaFin})
          </span>
          <span className="text-[11px] text-[#2D3B45] bg-gray-100 px-2 py-0.5 rounded border border-gray-200 flex items-center gap-1">
            <Building2 size={11} className="text-[#6B7780]" /> Sala: No definida
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* 1. Sección Oficial Asignada por el Enlace (Fija, sin dropdown para evitar errores) */}
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-[4px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-2xs">
          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide block">
              1. Sección Asignada:
            </span>
            <span className="text-xs font-bold text-[#2D3B45]">
              {currentSection.nombre} ({currentSection.codigo})
            </span>
            <span className="text-[11px] text-gray-500 block">
              Docente: {currentSection.profesor} • Ayudante: {currentSection.ayudante}
            </span>
          </div>
          <span className="text-[10px] font-bold text-[#008EE2] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded shrink-0">
            Fijada
          </span>
        </div>

        {/* 2. Buscador de Estudiante Reutilizable */}
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

        {/* 3. PIN de Sala (Proyectado en clase, dinámico por cada día) */}
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

        {/* Botón de Envío */}
        <button
          type="submit"
          disabled={!selectedStudent}
          className="w-full py-3 bg-[#C8102E] hover:bg-[#A00D24] text-white rounded-[4px] font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Confirmar y Marcar Asistencia</span>
          <ArrowRight size={14} />
        </button>
      </form>
    </div>
  );
};
