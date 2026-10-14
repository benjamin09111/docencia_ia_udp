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
} from "@/services/attendanceStore";
import { submitCheckin } from "@/services/checkinService";
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
  const [sections, setSections] = useState<CourseSection[]>([]);

  useEffect(() => {
    setSections(getSavedSections());
    const handleSync = () => setSections(getSavedSections());
    window.addEventListener("udp_sections_updated", handleSync);
    return () => window.removeEventListener("udp_sections_updated", handleSync);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const fetchLatest = () => {
      fetchSectionsFromSupabase().then((cloudSections) => {
        if (cloudSections && cloudSections.length > 0) {
          setSections(cloudSections);
          saveSections(cloudSections);
        }
      });
    };
    fetchLatest();

    const onFocus = () => fetchLatest();
    window.addEventListener("focus", onFocus);
    const interval = setInterval(fetchLatest, 10000);

    return () => {
      window.removeEventListener("focus", onFocus);
      clearInterval(interval);
    };
  }, []);

  const resolvedInitialSec = useMemo(() => {
    const sec = getSectionByCourseCode(initialSectionId || courseCode, sections);
    return sec.id;
  }, [courseCode, initialSectionId, sections]);

  const [selectedSectionId, setSelectedSectionId] = useState<string>(resolvedInitialSec);

  useEffect(() => {
    setSelectedSectionId(resolvedInitialSec);
  }, [resolvedInitialSec]);

  // El bypass ?demo=1 / ?test=true solo existe en desarrollo: en producción nadie puede forzar una sesión activa
  const [forceDemoActive, setForceDemoActive] = useState<boolean>(() => {
    if (process.env.NODE_ENV === "production") return false;
    if (typeof window !== "undefined") {
      const search = window.location.search;
      return search.includes("demo=1") || search.includes("test=true");
    }
    return false;
  });

  const currentSection =
    sections.find((s) => s.id === selectedSectionId || s.codigo === selectedSectionId) ||
    sections[0] ||
    getSectionByCourseCode(initialSectionId || courseCode, sections);

  const sessionStatus: SessionActiveStatus = checkCurrentSessionActive(
    currentSection,
    forceDemoActive
  );

  const todayDateOnly = new Date().toISOString().split("T")[0];
  const activeSessionType = "ayudantia";
  const secIdOrCode = currentSection?.codigo || currentSection?.id || "sec_1";
  const activeSession: ClassSession = {
    id: `sess_${secIdOrCode}_ayu_${todayDateOnly}`,
    seccionId: currentSection?.id || "sec_1",
    fecha: todayDateOnly,
    diaSemana: new Date().toLocaleDateString("es-CL", { weekday: "long" }),
    tipo: "ayudantia",
    estado: "realizada",
    horaInicio: sessionStatus.horaInicio || currentSection?.horarioAyudantia?.horaInicio || "16:00",
    horaFin: sessionStatus.horaFin || currentSection?.horarioAyudantia?.horaFin || "17:20",
  };

  const [canvasStudents, setCanvasStudents] = useState<StudentRosterItem[]>([]);
  const effectiveCanvasId = useMemo(() => {
    const code = currentSection?.codigo || "";
    if (selectedSectionId === "sec_1" || code.includes("CA01")) return 44999;
    if (selectedSectionId === "sec_2" || code.includes("CA02")) return 45002;
    if (selectedSectionId === "sec_3" || code.includes("CA03")) return 47552;
    if (selectedSectionId === "sec_gestion_org" || code.includes("CIT2206")) return 47047;
    if (selectedSectionId === "sec_arq_emergentes" || code.includes("CIT3100")) return 44988;
    return 44999;
  }, [selectedSectionId, currentSection?.codigo]);

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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [geoStatus, setGeoStatus] = useState<"idle" | "checking" | "verified" | "out_of_range" | "denied">("idle");
  const [distancia, setDistancia] = useState<number | undefined>();
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

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
    : INITIAL_STUDENTS_ROSTER.filter((s) => s.seccionId === selectedSectionId || s.codigo === selectedSectionId || s.seccionId === currentSection.codigo || s.codigo === currentSection.codigo);

  const studentOptions: CanvasSearchOption[] = useMemo(() => {
    return sectionStudents.map((st) => ({
      value: st.canvas_id,
      label: `${st.apellidos}, ${st.nombres}`,
      subLabel: st.email || "Estudiante UDP",
      keywords: [st.nombres, st.apellidos, st.email || ""],
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
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
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

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || isSubmitting) return;
    setSubmitError(null);

    if (currentSection.requiereGeolocalizacion && geoStatus !== "verified") {
      return;
    }

    // La clase de hoy (solo para mostrar el comprobante): el servidor es quien decide si se puede marcar
    // (horario en hora de Chile, PIN, GPS, clase vigente, matrícula y dispositivo).
    const todayStr = getTodayDateStr();
    const targetSemesterSession =
      generateSemesterSessions(currentSection).find((s) => s.fecha === todayStr && s.tipo === activeSessionType) ||
      activeSession;

    setIsSubmitting(true);
    try {
      const response = await submitCheckin({
        section: currentSection.codigo || currentSection.id,
        studentCanvasId: selectedStudent.canvas_id,
        pin: currentSection.requierePin ? pinInput.trim() : undefined,
        lat: coords?.lat,
        lng: coords?.lng,
      });

      if (!response.ok) {
        if (response.code === "pin_invalid") setPinError(true);
        else setSubmitError(response.message);
        return;
      }

      const timestamp = response.timestamp;
      const studentName = response.studentName || `${selectedStudent.nombres} ${selectedStudent.apellidos}`;

      const lockKey = `udp_device_attendance_${currentSection.id}_${todayStr}`;
      const recordPayload = { studentName, studentRut: selectedStudent.rut, timestamp, distanciaMetros: distancia };
      try {
        localStorage.setItem(lockKey, JSON.stringify(recordPayload));
        if (typeof document !== "undefined") {
          document.cookie = `${lockKey}=${encodeURIComponent(JSON.stringify(recordPayload))}; max-age=86400; path=/; SameSite=Lax`;
        }
      } catch {}

      const map = getSavedAttendanceMap();
      map[`${targetSemesterSession.id}_${selectedStudent.canvas_id}`] = 1;
      saveAttendanceMap(map);

      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        try {
          const channel = new BroadcastChannel("udp_attendance_channel");
          channel.postMessage({
            type: "ATTENDANCE_CHECKIN",
            studentId: selectedStudent.canvas_id,
            sessionId: targetSemesterSession.id,
            timestamp,
          });
          channel.close();
        } catch {}
      }

      onSuccess({
        student: selectedStudent,
        session: targetSemesterSession,
        section: currentSection,
        timestamp,
        distanciaMetros: distancia,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    selectedStudent,
    isSubmitting,
    currentSection,
    pinInput,
    geoStatus,
    distancia,
    coords,
    activeSession,
    activeSessionType,
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
    submitError,
    isSubmitting,
    geoStatus,
    distancia,
    handleVerifyLocation,
    handleSubmit,
  };
}
