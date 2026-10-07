import { useState, useEffect, useMemo, useCallback } from "react";
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
import { CanvasSearchOption } from "@/components/canvas/CanvasSearchableSelect";

interface UsePublicAttendanceCheckinParams {
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

export function usePublicAttendanceCheckin({
  courseCode,
  initialSectionId,
  onSuccess,
}: UsePublicAttendanceCheckinParams) {
  const [sections, setSections] = useState<CourseSection[]>(() => getSavedSections());

  useEffect(() => {
    const handleSync = () => setSections(getSavedSections());
    window.addEventListener("udp_sections_updated", handleSync);
    return () => window.removeEventListener("udp_sections_updated", handleSync);
  }, []);

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

  const resolvedInitialSec = useMemo(() => {
    const sec = getSectionByCourseCode(initialSectionId || courseCode, sections);
    return sec.id;
  }, [courseCode, initialSectionId, sections]);

  const [selectedSectionId, setSelectedSectionId] = useState<string>(resolvedInitialSec);

  useEffect(() => {
    setSelectedSectionId(resolvedInitialSec);
  }, [resolvedInitialSec]);

  const [forceDemoActive, setForceDemoActive] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const search = window.location.search;
      return search.includes("demo=1") || search.includes("test=true");
    }
    return false;
  });

  const currentSection = sections.find((s) => s.id === selectedSectionId) || sections[0];

  const sessionStatus: SessionActiveStatus = checkCurrentSessionActive(
    currentSection,
    forceDemoActive
  );

  const todayDateOnly = new Date().toISOString().split("T")[0];
  const activeSessionType = sessionStatus.tipo || "ayudantia";
  const secIdOrCode = currentSection.codigo || currentSection.id;
  const activeSession: ClassSession = {
    id: `sess_${secIdOrCode}_${activeSessionType === "ayudantia" ? "ayu" : "cat"}_${todayDateOnly}`,
    seccionId: currentSection.id,
    fecha: todayDateOnly,
    diaSemana: new Date().toLocaleDateString("es-CL", { weekday: "long" }),
    tipo: activeSessionType,
    estado: "realizada",
    horaInicio: sessionStatus.horaInicio || currentSection.horarioAyudantia.horaInicio,
    horaFin: sessionStatus.horaFin || currentSection.horarioAyudantia.horaFin,
  };

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
      .catch((err) => console.warn("Aviso cargando alumnos Canvas:", err));
    return () => {
      isMounted = false;
    };
  }, [effectiveCanvasId, selectedSectionId]);

  const [selectedStudent, setSelectedStudent] = useState<StudentRosterItem | null>(null);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  const [geoStatus, setGeoStatus] = useState<"idle" | "checking" | "verified" | "out_of_range" | "denied">("idle");
  const [distancia, setDistancia] = useState<number | undefined>();

  const targetLat = currentSection.ubicacionLat ?? UDP_CAMPUS_LOCATION.lat;
  const targetLng = currentSection.ubicacionLng ?? UDP_CAMPUS_LOCATION.lng;
  const targetRadius = currentSection.radioMetros ?? UDP_CAMPUS_LOCATION.radioPermitidoMetros;
  const targetCampusNombre = currentSection.ubicacionNombre || UDP_CAMPUS_LOCATION.nombre;

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
        if (match && match[1]) raw = decodeURIComponent(match[1]);
      }
    } catch {}

    if (raw) {
      try {
        setDeviceLockedData(JSON.parse(raw));
      } catch {
        setDeviceLockedData({ studentName: raw, studentRut: "", timestamp: "Registrado" });
      }
    } else {
      setDeviceLockedData(null);
    }
  }, [currentSection.id]);

  const unlockDevice = useCallback(() => {
    const todayStr = getTodayDateStr();
    const lockKey = `udp_device_attendance_${currentSection.id}_${todayStr}`;
    try {
      localStorage.removeItem(lockKey);
      if (typeof document !== "undefined") {
        document.cookie = `${lockKey}=; max-age=0; path=/`;
      }
    } catch {}
    setDeviceLockedData(null);
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

  const handleVerifyLocation = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
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
        console.warn("Aviso geolocalización GPS:", err);
        setGeoStatus("denied");
      },
      { timeout: 10000, enableHighAccuracy: true, maximumAge: 30000 }
    );
  }, [targetLat, targetLng, targetRadius]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    const todayStr = getTodayDateStr();
    const expectedPin = getSectionDailyPin(currentSection, todayStr);
    if (currentSection.requierePin && pinInput.trim() !== expectedPin.trim()) {
      setPinError(true);
      return;
    }

    if (currentSection.requiereGeolocalizacion && geoStatus !== "verified") {
      return;
    }

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

    const semesterSessions = generateSemesterSessions(currentSection);
    const targetSemesterSession =
      semesterSessions.find((s) => s.fecha === todayStr && s.tipo === "ayudantia") ||
      semesterSessions.find((s) => s.tipo === "ayudantia" && s.fecha <= todayStr) ||
      semesterSessions[0];

    const map = getSavedAttendanceMap();
    if (targetSemesterSession) map[`${targetSemesterSession.id}_${selectedStudent.canvas_id}`] = 1;
    map[`${activeSession.id}_${selectedStudent.canvas_id}`] = 1;
    saveAttendanceMap(map);

    if (targetSemesterSession) {
      saveAttendanceMarkToSupabase(
        targetSemesterSession.id,
        selectedStudent.canvas_id,
        1,
        "alumno_link"
      ).catch((err) => console.warn("Aviso guardando asistencia en Supabase:", err));
    }

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
  }, [
    selectedStudent,
    currentSection,
    pinInput,
    geoStatus,
    distancia,
    activeSession.id,
    onSuccess,
  ]);

  return {
    currentSection,
    sessionStatus,
    activeSession,
    targetCampusNombre,
    targetRadius,
    deviceLockedData,
    unlockDevice,
    forceDemoActive,
    setForceDemoActive,
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
  };
}
