"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  ClassSession,
  CourseSection,
  StudentAttendanceSummary,
  AttendanceValue,
  TodaySessionInfo,
  StudentWorkRecord,
} from "@/types/attendance";
import {
  INITIAL_SECTIONS,
  INITIAL_STUDENTS_ROSTER,
  StudentRosterItem,
  getSavedSections,
  saveSections,
  generateSemesterSessions,
  generateInitialRecords,
  getSavedAttendanceMap,
  saveAttendanceMap,
  getSavedStudentWorkRecords,
  saveStudentWorkRecords,
  getSavedTotalTrabajos,
  saveTotalTrabajos,
  getTodayDateStr,
  getSectionByCourseCode,
  saveSessionOverride,
  regenerateSectionPin,
  getSectionDailyPin,
} from "@/services/attendanceStore";
import { exportAttendanceToExcel, AttendanceExportScope } from "@/services/excelExportService";
import {
  syncCourseAndSectionToSupabase,
  syncStudentsAndSessionsToSupabase,
  saveAttendanceMarkToSupabase,
  saveAttendanceBatchToSupabase,
  fetchAttendanceMapFromSupabase,
  fetchHistoricalRecordedSessionsFromSupabase,
  saveStudentWorkRecordToSupabase,
  fetchStudentWorkRecordsFromSupabase,
  updateSessionStatusInSupabase,
  isSupabaseConfigured,
  updateSectionOnlineStatusInSupabase,
  fetchSectionsFromSupabase,
} from "@/services/attendanceDbService";
import { AttendanceMatrixTable } from "./attendance/AttendanceMatrixTable";
import { AttendanceCancelClassModal } from "./attendance/AttendanceCancelClassModal";
import {
  GraduationCap,
  KeyRound,
  Link as LinkIcon,
  Share2,
  Download,
  Check,
  Copy,
  Search,
  Globe,
  MapPin,
} from "lucide-react";
import { getPublicCheckinUrl, getPublicVisualUrl } from "@/utils/urlHelper";
import { StudentExcelRow } from "@/types";

interface TeacherAttendanceWorkspaceProps {
  courseCode?: string;
  courseName?: string;
  canvasCourseId?: number;
  estudiantesExcel?: StudentExcelRow[];
  onUpdateGrade?: (canvasId: number, field: keyof StudentExcelRow, value: number) => void;
}

export const TeacherAttendanceWorkspace: React.FC<TeacherAttendanceWorkspaceProps> = ({
  courseCode = "CIT3203_CA01",
  courseName = "PROYECTO EN TICS II",
  canvasCourseId,
  estudiantesExcel,
  onUpdateGrade,
}) => {
  const [sections, setSections] = useState<CourseSection[]>(() => getSavedSections());
  
  // Escuchar cambios de horarios y secciones desde la pestaña de Admin
  useEffect(() => {
    const handleSync = () => {
      setSections(getSavedSections());
    };
    window.addEventListener("udp_sections_updated", handleSync);
    return () => window.removeEventListener("udp_sections_updated", handleSync);
  }, []);

  // Cargar secciones y modalidad online/presencial desde Supabase al iniciar
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

  // 1 curso = 1 sección (determinada por el código del curso Canvas)
  const matchedSectionId = useMemo(() => {
    return getSectionByCourseCode(courseCode, sections).id;
  }, [courseCode, sections]);

  const [selectedSectionId, setSelectedSectionId] = useState<string>(matchedSectionId);
  const [filterType, setFilterType] = useState<"catedras" | "ayudantias">("ayudantias");
  const [incluirAyudantiasEnFinal, setIncluirAyudantiasEnFinal] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showOnlyUpToToday, setShowOnlyUpToToday] = useState<boolean>(true);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(() => isSupabaseConfigured());

  // Actualizar sección automáticamente cuando cambia el curso seleccionado
  useEffect(() => {
    setSelectedSectionId(matchedSectionId);
  }, [matchedSectionId]);

  // Modales y estados de copiado
  const [cancelModalSession, setCancelModalSession] = useState<ClassSession | null>(null);
  const [copiedCheckin, setCopiedCheckin] = useState(false);
  const [copiedVisual, setCopiedVisual] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);
  const lastLocalEditTimeRef = useRef<number>(0);

  // Secciones relevantes para este curso
  const relevantSections = useMemo(() => {
    if (courseCode.includes("CIT3203") || courseCode.includes("3203")) {
      return sections.filter((s) => s.codigo.includes("CIT3203"));
    }
    if (courseCode.includes("CIT2206") || courseCode.includes("2206")) {
      return sections.filter((s) => s.codigo.includes("CIT2206"));
    }
    if (courseCode.includes("CIT3100") || courseCode.includes("3100")) {
      return sections.filter((s) => s.codigo.includes("CIT3100"));
    }
    const exact = sections.filter((s) => s.codigo === courseCode || s.id === courseCode);
    return exact.length > 0 ? exact : sections;
  }, [sections, courseCode]);

  const selectedSection = sections.find((s) => s.id === selectedSectionId || s.codigo === selectedSectionId) || relevantSections[0] || sections[0];

  // Generar sesiones por sección con base en el horario guardado
  const [sessionsBySection, setSessionsBySection] = useState<Record<string, ClassSession[]>>(() => {
    const map: Record<string, ClassSession[]> = {};
    sections.forEach((sec) => {
      const gen = generateSemesterSessions(sec);
      map[sec.id] = gen;
      map[sec.codigo] = gen;
    });
    return map;
  });

  // Regenerar sesiones si las secciones cambian
  useEffect(() => {
    setSessionsBySection(() => {
      const map: Record<string, ClassSession[]> = {};
      sections.forEach((sec) => {
        const gen = generateSemesterSessions(sec);
        map[sec.id] = gen;
        map[sec.codigo] = gen;
      });
      return map;
    });
  }, [sections]);

  // Alumnos reales de Canvas para la sección seleccionada
  const [canvasStudentsBySection, setCanvasStudentsBySection] = useState<Record<string, StudentRosterItem[]>>({});
  const [isLoadingStudents, setIsLoadingStudents] = useState<boolean>(false);

  // Mapear el ID numérico de Canvas según la sección
  const effectiveCanvasCourseId = useMemo(() => {
    if (selectedSectionId === "sec_1" || selectedSectionId === "CIT3203_CA01") return 44999;
    if (selectedSectionId === "sec_2" || selectedSectionId === "CIT3203_CA02") return 45002;
    if (selectedSectionId === "sec_3" || selectedSectionId === "CIT3203_CA03") return 47552;
    if (selectedSectionId === "sec_gestion_org" || selectedSectionId === "CIT2206_CA01") return 47047;
    if (selectedSectionId === "sec_arq_emergentes" || selectedSectionId === "CIT3100_CA02") return 44988;
    return canvasCourseId || 44999;
  }, [selectedSectionId, canvasCourseId]);

  // Cargar estudiantes reales desde la API de Canvas
  useEffect(() => {
    let isMounted = true;
    setIsLoadingStudents(true);

    fetch(`/api/canvas/courses/${effectiveCanvasCourseId}/students`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data) && data.length > 0) {
          const mapped: StudentRosterItem[] = data.map((u: any) => ({
            canvas_id: u.canvas_id,
            rut: u.rut,
            nombres: u.nombres,
            apellidos: u.apellidos,
            email: u.email,
            seccionId: selectedSectionId,
          }));

          setCanvasStudentsBySection((prev) => ({
            ...prev,
            [selectedSectionId]: mapped,
          }));

          try {
            if (typeof window !== "undefined") {
              localStorage.setItem(`udp_canvas_students_${effectiveCanvasCourseId}`, JSON.stringify(mapped));
              localStorage.setItem(`udp_canvas_students_${selectedSectionId}`, JSON.stringify(mapped));
              window.dispatchEvent(new CustomEvent("udp_canvas_students_updated"));
            }
          } catch {}

          // Inicializar asistencias para estos alumnos en 0 si aún no existen
          const sessList = sessionsBySection[selectedSectionId] || [];
          setAttendanceMap((prev) => {
            const next = { ...prev };
            let hasNew = false;
            sessList.forEach((sess) => {
              if (sess.estado === "cancelada") return;
              mapped.forEach((st) => {
                const k = `${sess.id}_${st.canvas_id}`;
                if (next[k] === undefined) {
                  next[k] = 0;
                  hasNew = true;
                }
              });
            });
            if (hasNew) saveAttendanceMap(next);
            return hasNew ? next : prev;
          });
        }
      })
      .catch((err) => console.error("Error al cargar alumnos de Canvas:", err))
      .finally(() => {
        if (isMounted) setIsLoadingStudents(false);
      });

    return () => {
      isMounted = false;
    };
  }, [effectiveCanvasCourseId, selectedSectionId, sessionsBySection]);

  // Mapa de asistencia: key `${sessionId}_${canvasId}` => 1 | 0 | 'J'
  // Todas las asistencias parten en 0 por defecto o se recuperan de localStorage
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceValue>>(() => {
    const saved = getSavedAttendanceMap();
    if (saved && Object.keys(saved).length > 0) return saved;

    const initialRecords = generateInitialRecords(
      Object.values(sessionsBySection).flat(),
      INITIAL_STUDENTS_ROSTER
    );
    const map: Record<string, AttendanceValue> = {};
    initialRecords.forEach((r) => {
      map[`${r.sessionId}_${r.estudianteCanvasId}`] = 0;
    });
    return map;
  });

  // Registro de décimas y trabajos realizados por estudiante (específico para Ayudantías)
  const [studentWorkRecords, setStudentWorkRecords] = useState<Record<number, StudentWorkRecord>>(() =>
    getSavedStudentWorkRecords()
  );

  const handleUpdateStudentWork = (studentId: number, decimas: number, trabajosRealizados: number) => {
    setStudentWorkRecords((prev) => {
      const next = {
        ...prev,
        [studentId]: { decimas, trabajosRealizados },
      };
      saveStudentWorkRecords(next);
      return next;
    });

    saveStudentWorkRecordToSupabase(
      selectedSection.codigo || courseCode,
      studentId,
      decimas,
      trabajosRealizados
    ).catch((err) => console.warn("Error guardando décimas en Supabase:", err));
  };

  // Cantidad global de trabajos realizados hasta la fecha para toda la sección (ej. 3)
  const [totalTrabajosRealizados, setTotalTrabajosRealizados] = useState<number>(() =>
    getSavedTotalTrabajos(selectedSectionId)
  );

  // Sincronizar trabajos de la sección cuando cambia el selector de sección
  useEffect(() => {
    setTotalTrabajosRealizados(getSavedTotalTrabajos(selectedSectionId));
  }, [selectedSectionId]);

  const handleUpdateTotalTrabajos = (total: number) => {
    setTotalTrabajosRealizados(total);
    saveTotalTrabajos(total, selectedSectionId);
  };

  // Escuchar actualizaciones de asistencia, décimas y trabajos en tiempo real
  useEffect(() => {
    const handleStorageUpdate = () => {
      const saved = getSavedAttendanceMap();
      if (saved && Object.keys(saved).length > 0) {
        setAttendanceMap(saved);
      }
      const savedWork = getSavedStudentWorkRecords();
      if (savedWork && Object.keys(savedWork).length > 0) {
        setStudentWorkRecords(savedWork);
      }
      setTotalTrabajosRealizados(getSavedTotalTrabajos(selectedSectionId));
    };

    const handleOverridesUpdate = () => {
      setSessionsBySection(() => {
        const map: Record<string, ClassSession[]> = {};
        sections.forEach((sec) => {
          const gen = generateSemesterSessions(sec);
          map[sec.id] = gen;
          map[sec.codigo] = gen;
        });
        return map;
      });
    };

    window.addEventListener("udp_attendance_updated", handleStorageUpdate);
    window.addEventListener("udp_student_work_updated", handleStorageUpdate);
    window.addEventListener("udp_total_trabajos_updated", handleStorageUpdate);
    window.addEventListener("udp_sessions_overrides_updated", handleOverridesUpdate);
    window.addEventListener("udp_pin_updated", handleStorageUpdate);
    window.addEventListener("storage", handleStorageUpdate);

    // Canal BroadcastChannel para sincronización instantánea entre pestañas
    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        channel = new BroadcastChannel("udp_attendance_channel");
        channel.onmessage = (event) => {
          if (event.data?.type === "ATTENDANCE_CHECKIN") {
            handleStorageUpdate();
          }
        };
      } catch {}
    }

    return () => {
      window.removeEventListener("udp_attendance_updated", handleStorageUpdate);
      window.removeEventListener("udp_student_work_updated", handleStorageUpdate);
      window.removeEventListener("udp_total_trabajos_updated", handleStorageUpdate);
      window.removeEventListener("udp_sessions_overrides_updated", handleOverridesUpdate);
      window.removeEventListener("udp_pin_updated", handleStorageUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
      if (channel) channel.close();
    };
  }, [selectedSectionId, sections]);

  // Sesiones de la sección actual
  const activeSessions = sessionsBySection[selectedSectionId] || [];

  // Filtrar sesiones según la pestaña activa (Cátedras vs Ayudantías) y corte hasta la fecha actual
  const filteredSessions = useMemo(() => {
    const todayStr = getTodayDateStr();
    return activeSessions.filter((s) => {
      if (filterType === "ayudantias" && s.tipo !== "ayudantia") return false;
      if (filterType === "catedras" && s.tipo !== "catedra") return false;
      if (showOnlyUpToToday && s.fecha > todayStr) return false;
      return true;
    });
  }, [activeSessions, filterType, showOnlyUpToToday]);

  // Alumnos activos de la sección (Memorizado para evitar renders y bucles infinitos)
  const currentRoster = useMemo(() => {
    return (
      canvasStudentsBySection[selectedSectionId] ||
      INITIAL_STUDENTS_ROSTER.filter((s) => s.seccionId === selectedSectionId)
    );
  }, [canvasStudentsBySection, selectedSectionId]);

  const sectionStudents = useMemo(() => {
    return currentRoster.filter((s) => {
      if (!searchTerm) return true;
      const lower = searchTerm.toLowerCase();
      return (
        s.nombres.toLowerCase().includes(lower) ||
        s.apellidos.toLowerCase().includes(lower) ||
        s.rut.toLowerCase().includes(lower)
      );
    });
  }, [currentRoster, searchTerm]);

  // Sincronizar curso, sección, estudiantes y sesiones con Supabase en segundo plano
  useEffect(() => {
    if (!isSupabaseConfigured() || sectionStudents.length === 0 || activeSessions.length === 0) return;

    let isMounted = true;
    (async () => {
      try {
        const { sectionId } = await syncCourseAndSectionToSupabase(
          courseCode,
          courseName,
          effectiveCanvasCourseId,
          selectedSection
        );

        if (sectionId && isMounted) {
          await syncStudentsAndSessionsToSupabase(sectionId, sectionStudents, activeSessions);

          // Cargar cualquier asistencia previamente guardada en Supabase y fusionar sin perder datos
          const cloudMap = await fetchAttendanceMapFromSupabase(selectedSection.codigo || courseCode);
          if (isMounted && Object.keys(cloudMap).length > 0) {
            setAttendanceMap((prev) => {
              const merged = { ...prev, ...cloudMap };
              saveAttendanceMap(merged);
              return merged;
            });
          }

          // Cargar cualquier registro de décimas y trabajos guardado en Supabase
          const cloudWorkRecords = await fetchStudentWorkRecordsFromSupabase(selectedSection.codigo || courseCode);
          if (isMounted && Object.keys(cloudWorkRecords).length > 0) {
            setStudentWorkRecords((prev) => {
              const merged = { ...prev, ...cloudWorkRecords };
              saveStudentWorkRecords(merged);
              return merged;
            });
          }
          setIsCloudSynced(true);
        }
      } catch (e) {
        console.warn("Aviso sync inicial Supabase:", e);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [courseCode, courseName, effectiveCanvasCourseId, selectedSection, sectionStudents, activeSessions]);

  // Cargar sesiones históricas que ya tengan marcajes de asistencia en Supabase
  // para garantizar que nunca desaparezcan al cambiar días u horarios
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    let isMounted = true;
    const secCode = selectedSection.codigo || courseCode;

    (async () => {
      try {
        const histSessions = await fetchHistoricalRecordedSessionsFromSupabase(secCode);
        if (isMounted && histSessions.length > 0) {
          setSessionsBySection((prev) => {
            const currentList = prev[selectedSectionId] || [];
            const map = new Map<string, ClassSession>();
            currentList.forEach((s) => map.set(s.id, s));
            let added = false;
            histSessions.forEach((hs) => {
              if (!map.has(hs.id)) {
                const dateExists = currentList.some((s) => s.fecha === hs.fecha && s.tipo === hs.tipo);
                if (!dateExists) {
                  map.set(hs.id, hs);
                  added = true;
                }
              }
            });
            if (!added) return prev;
            const sorted = Array.from(map.values()).sort((a, b) => a.fecha.localeCompare(b.fecha));
            return {
              ...prev,
              [selectedSectionId]: sorted,
              [selectedSection.id]: sorted,
              [selectedSection.codigo]: sorted,
            };
          });
        }
      } catch (err) {
        console.warn("Aviso cargando sesiones históricas:", err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [sections, selectedSection.codigo, selectedSection.id, selectedSectionId, courseCode]);


  // Polling automático cada 6 segundos desde Supabase para reflejar marcajes móviles en vivo en la sala
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const interval = setInterval(async () => {
      try {
        // Si el profesor/ayudante editó localmente hace menos de 6 segundos, proteger el estado local
        if (Date.now() - lastLocalEditTimeRef.current < 6000) return;

        const cloudMap = await fetchAttendanceMapFromSupabase(selectedSection.codigo || courseCode);
        if (Object.keys(cloudMap).length > 0) {
          setAttendanceMap((prev) => {
            const hasChanges = Object.keys(cloudMap).some((k) => prev[k] !== cloudMap[k]);
            if (!hasChanges) return prev;
            const merged = { ...prev, ...cloudMap };
            saveAttendanceMap(merged);
            return merged;
          });
        }
      } catch {}
    }, 6000);

    return () => clearInterval(interval);
  }, [selectedSection.codigo, courseCode]);

  // Calcular resúmenes de asistencia por alumno (evaluadas sobre clases realizadas hasta la fecha actual)
  const summaries: StudentAttendanceSummary[] = useMemo(() => {
    const todayStr = getTodayDateStr();
    const validSessions = activeSessions.filter(
      (s) => s.estado !== "cancelada" && s.fecha <= todayStr
    );
    const validAyud = validSessions.filter((s) => s.tipo === "ayudantia");
    const validCat = validSessions.filter((s) => s.tipo === "catedra");

    return sectionStudents.map((st) => {
      let ayudAsist = 0;
      let catAsist = 0;

      validSessions.forEach((s) => {
        const val = attendanceMap[`${s.id}_${st.canvas_id}`];
        if (val === 1) {
          if (s.tipo === "ayudantia") ayudAsist++;
          else catAsist++;
        }
      });

      const catVal = validCat.length;
      const ayudVal = validAyud.length;
      const catPct = catVal > 0 ? Math.round((catAsist / catVal) * 100) : 100;
      const ayudPct = ayudVal > 0 ? Math.round((ayudAsist / ayudVal) * 100) : 100;

      // Modo enfocado exclusivamente en Ayudantías:
      // Las asistencias, promedios y condición de riesgo RI se evalúan directamente sobre las ayudantías realizadas a la fecha
      const totalVal = ayudVal;
      const totalAsist = ayudAsist;
      const totalPct = ayudPct;
      const enRiesgoRI = totalVal > 0 ? totalPct < 75 : false;

      return {
        canvas_id: st.canvas_id,
        rut: st.rut,
        nombres: st.nombres,
        apellidos: st.apellidos,
        email: st.email,
        seccionId: st.seccionId,
        ayudantiasAsistidas: ayudAsist,
        ayudantiasValidas: ayudVal,
        ayudantiasPct: ayudPct,
        catedrasAsistidas: catAsist,
        catedrasValidas: catVal,
        catedrasPct: catPct,
        totalAsistidas: totalAsist,
        totalValidas: totalVal,
        totalPct,
        enRiesgoRI,
      };
    });
  }, [sectionStudents, activeSessions, attendanceMap, incluirAyudantiasEnFinal]);

  // Información de la sesión de ayudantía de hoy (según horario y día de la sección)
  const todaySessionInfo: TodaySessionInfo = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=Dom, 1=Lun, 2=Mar, 3=Mié, 4=Jue, 5=Vie, 6=Sáb
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const todayDateStr = `${y}-${m}-${d}`;

    const diasNombres = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const diaActualNombre = diasNombres[dayOfWeek];

    const ayudDias = selectedSection.horarioAyudantia?.dias || [3];
    const isScheduledDay = ayudDias.includes(dayOfWeek);

    // Buscar sesión de ayudantía de hoy en las sesiones de la sección
    const todaySession = activeSessions.find(
      (s) => s.fecha === todayDateStr && s.tipo === "ayudantia" && s.estado !== "cancelada"
    );

    // Próxima sesión cronológica de ayudantía
    const nextSession =
      activeSessions.find((s) => s.tipo === "ayudantia" && s.fecha >= todayDateStr && s.estado !== "cancelada") ||
      activeSessions.find((s) => s.tipo === "ayudantia" && s.estado !== "cancelada") ||
      null;

    return {
      todayDateStr,
      diaActualNombre,
      isScheduledDay,
      todaySession: todaySession || null,
      nextSession,
      horarioAyudantia: selectedSection.horarioAyudantia,
      diasConfigurados: ayudDias.map((d) => diasNombres[d]).join(", "),
    };
  }, [selectedSection, activeSessions]);

  const [quickNotification, setQuickNotification] = useState<{
    type: "success" | "warning" | "info";
    message: string;
  } | null>(null);

  // Contador de alumnos presentes hoy en sala en vivo
  const livePresentesCount = useMemo(() => {
    const todayStr = getTodayDateStr();
    const todaySess =
      activeSessions.find((s) => s.fecha === todayStr && s.tipo === "ayudantia") ||
      todaySessionInfo.todaySession;
    if (!todaySess) return 0;
    return sectionStudents.filter((st) => attendanceMap[`${todaySess.id}_${st.canvas_id}`] === 1).length;
  }, [activeSessions, todaySessionInfo.todaySession, sectionStudents, attendanceMap]);

  // Manejar regeneración de PIN para la sección activa
  const handleRegeneratePin = () => {
    const newPin = regenerateSectionPin(selectedSection.id, todaySessionInfo.todayDateStr);
    setSections(getSavedSections());
    setQuickNotification({
      type: "success",
      message: `🔑 Nuevo PIN generado para hoy en ${selectedSection.nombre}: ${newPin}. Proyéctalo o compártelo a los alumnos.`,
    });
    setTimeout(() => setQuickNotification(null), 5000);
  };

  // Sincronización protegida con la planilla Excel oficial:
  // Usa ref para evitar bucles infinitos (Maximum update depth exceeded)
  const lastSyncedRef = useRef<Record<number, number>>({});

  useEffect(() => {
    if (!onUpdateGrade || summaries.length === 0) return;

    summaries.forEach((sum) => {
      if (lastSyncedRef.current[sum.canvas_id] !== sum.totalPct) {
        lastSyncedRef.current[sum.canvas_id] = sum.totalPct;
        onUpdateGrade(sum.canvas_id, "asistencia_pct", sum.totalPct);
      }
    });
  }, [summaries, onUpdateGrade]);

  // Marcación rápida de asistencia de hoy (1 clic)
  const handleMarkTodayAttendance = (studentId: number, targetSessionId?: string) => {
    const sess = targetSessionId
      ? activeSessions.find((s) => s.id === targetSessionId)
      : todaySessionInfo.todaySession;

    if (!sess) {
      setQuickNotification({
        type: "warning",
        message: `Hoy (${todaySessionInfo.diaActualNombre}) no hay sesión de ayudantía configurada para ${selectedSection.nombre}. Horario oficial: ${todaySessionInfo.diasConfigurados} de ${selectedSection.horarioAyudantia.horaInicio} a ${selectedSection.horarioAyudantia.horaFin}.`,
      });
      setTimeout(() => setQuickNotification(null), 5000);
      return;
    }

    const key = `${sess.id}_${studentId}`;
    const currentVal = attendanceMap[key] ?? 0;
    const nextVal: AttendanceValue = currentVal === 1 ? 0 : 1;

    lastLocalEditTimeRef.current = Date.now();
    setAttendanceMap((prev) => {
      const next = { ...prev, [key]: nextVal };
      saveAttendanceMap(next);
      return next;
    });

    saveAttendanceMarkToSupabase(sess.id, studentId, nextVal).catch((err) =>
      console.warn("Error guardando en Supabase:", err)
    );

    const student = sectionStudents.find((s) => s.canvas_id === studentId);
    const stName = student ? `${student.nombres} ${student.apellidos}` : "Estudiante";

    setQuickNotification({
      type: "success",
      message:
        nextVal === 1
          ? `✓ Asistencia registrada: ${stName} quedó PRESENTE en ayudantía (${sess.fecha}).`
          : `Asistencia anulada: ${stName} quedó AUSENTE en ayudantía (${sess.fecha}).`,
    });
    setTimeout(() => setQuickNotification(null), 4000);
  };

  // Toggle de celda binaria 1 <-> 0 y persistencia local + Supabase
  const handleToggleAttendance = (sessionId: string, studentId: number) => {
    const key = `${sessionId}_${studentId}`;
    const current = attendanceMap[key] ?? 0;
    const nextVal: AttendanceValue = current === 1 ? 0 : 1;
    lastLocalEditTimeRef.current = Date.now();
    setAttendanceMap((prev) => {
      const next = { ...prev, [key]: nextVal };
      saveAttendanceMap(next);
      return next;
    });

    // Guardado asíncrono e instantáneo en Supabase
    saveAttendanceMarkToSupabase(sessionId, studentId, nextVal).catch((err) =>
      console.warn("Error guardando en Supabase:", err)
    );
  };

  const handleMarkAllPresent = (sessionId: string) => {
    lastLocalEditTimeRef.current = Date.now();
    const batch: Array<{ session_code: string; student_canvas_id: number; value: number }> = [];
    setAttendanceMap((prev) => {
      const next = { ...prev };
      sectionStudents.forEach((st) => {
        next[`${sessionId}_${st.canvas_id}`] = 1;
        batch.push({ session_code: sessionId, student_canvas_id: st.canvas_id, value: 1 });
      });
      saveAttendanceMap(next);
      return next;
    });

    if (batch.length > 0) {
      saveAttendanceBatchToSupabase(batch).catch((err) =>
        console.warn("Error batch Supabase:", err)
      );
    }
  };

  const handleMarkAllAbsent = (sessionId: string) => {
    const batch: Array<{ session_code: string; student_canvas_id: number; value: number }> = [];
    setAttendanceMap((prev) => {
      const next = { ...prev };
      sectionStudents.forEach((st) => {
        next[`${sessionId}_${st.canvas_id}`] = 0;
        batch.push({ session_code: sessionId, student_canvas_id: st.canvas_id, value: 0 });
      });
      saveAttendanceMap(next);
      return next;
    });

    if (batch.length > 0) {
      saveAttendanceBatchToSupabase(batch).catch((err) =>
        console.warn("Error batch Supabase:", err)
      );
    }
  };

  // Reiniciar todas las asistencias de la sección a 0
  const handleResetAllToZero = () => {
    const batch: Array<{ session_code: string; student_canvas_id: number; value: number }> = [];
    setAttendanceMap((prev) => {
      const next = { ...prev };
      activeSessions.forEach((sess) => {
        sectionStudents.forEach((st) => {
          next[`${sess.id}_${st.canvas_id}`] = 0;
          batch.push({ session_code: sess.id, student_canvas_id: st.canvas_id, value: 0 });
        });
      });
      saveAttendanceMap(next);
      return next;
    });

    if (batch.length > 0) {
      saveAttendanceBatchToSupabase(batch).catch((err) =>
        console.warn("Error reset batch Supabase:", err)
      );
    }
  };

  // Alternar modalidad Online / Presencial por sesión
  const handleToggleSessionModality = (sessionId: string) => {
    setSessionsBySection((prev) => ({
      ...prev,
      [selectedSectionId]: prev[selectedSectionId].map((s) => {
        if (s.id === sessionId) {
          const nextMod: "presencial" | "online" = s.modalidad === "online" ? "presencial" : "online";
          return { ...s, modalidad: nextMod };
        }
        return s;
      }),
    }));
  };

  // Cambiar modalidad de forma masiva (todas las ayudantías o todas las sesiones)
  const handleSetBulkModality = (target: "ayudantias" | "todas", mod: "presencial" | "online") => {
    setSessionsBySection((prev) => ({
      ...prev,
      [selectedSectionId]: prev[selectedSectionId].map((s) => {
        if (target === "todas" || (target === "ayudantias" && s.tipo === "ayudantia")) {
          return { ...s, modalidad: mod };
        }
        return s;
      }),
    }));
  };

  const handleConfirmCancel = (sessionId: string, motivo: string) => {
    saveSessionOverride(sessionId, "cancelada", motivo);
    updateSessionStatusInSupabase(sessionId, "cancelada", motivo).catch((err) =>
      console.warn("Error cancelando sesión en Supabase:", err)
    );

    setSessionsBySection((prev) => ({
      ...prev,
      [selectedSectionId]: (prev[selectedSectionId] || []).map((s) =>
        s.id === sessionId ? { ...s, estado: "cancelada", motivoCancelacion: motivo } : s
      ),
    }));

    const sess = activeSessions.find((s) => s.id === sessionId);
    setQuickNotification({
      type: "warning",
      message: `🚫 Sesión del ${sess?.fecha || "esta fecha"} marcada como NO REALIZADA (cancelada). No se contabilizará en el total de clases ni perjudicará a los estudiantes.`,
    });
    setTimeout(() => setQuickNotification(null), 5000);

    setCancelModalSession(null);
  };

  const handleReactivateSession = (sessionId: string) => {
    saveSessionOverride(sessionId, "programada", undefined);
    updateSessionStatusInSupabase(sessionId, "programada", undefined).catch((err) =>
      console.warn("Error reactivando sesión en Supabase:", err)
    );

    setSessionsBySection((prev) => ({
      ...prev,
      [selectedSectionId]: (prev[selectedSectionId] || []).map((s) =>
        s.id === sessionId ? { ...s, estado: "programada", motivoCancelacion: undefined } : s
      ),
    }));

    const sess = activeSessions.find((s) => s.id === sessionId);
    setQuickNotification({
      type: "success",
      message: `✓ Sesión del ${sess?.fecha || "esta fecha"} reactivada con éxito. Ya contabiliza en la asistencia normal.`,
    });
    setTimeout(() => setQuickNotification(null), 5000);

    setCancelModalSession(null);
  };

  const copyText = async (text: string): Promise<boolean> => {
    try {
      if (typeof navigator !== "undefined" && navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e) {
      console.warn("Clipboard API no disponible, usando fallback:", e);
    }
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textArea);
      return success;
    } catch (e) {
      console.error("Fallo al copiar texto:", e);
      return false;
    }
  };

  const handleCopyCheckinLink = async () => {
    const url = getPublicCheckinUrl(selectedSection.codigo || courseCode);
    const ok = await copyText(url);
    if (ok) {
      setCopiedCheckin(true);
      setTimeout(() => setCopiedCheckin(false), 2500);
    }
  };

  const handleCopyVisualLink = async () => {
    const url = getPublicVisualUrl(selectedSection.codigo || courseCode);
    const ok = await copyText(url);
    if (ok) {
      setCopiedVisual(true);
      setTimeout(() => setCopiedVisual(false), 2500);
    }
  };

  const effectivePin = getSectionDailyPin(selectedSection, todaySessionInfo.todayDateStr);

  const isOnlineAyudantia = selectedSection ? selectedSection.requiereGeolocalizacion === false : false;

  const handleToggleOnlineAyudantia = async () => {
    const nextIsOnline = !isOnlineAyudantia;
    const nextRequiereGeo = !nextIsOnline;

    const updatedSection: CourseSection = {
      ...selectedSection,
      requiereGeolocalizacion: nextRequiereGeo,
    };

    const updatedSections = sections.map((s) =>
      s.id === selectedSection.id || s.codigo === selectedSection.codigo
        ? updatedSection
        : s
    );

    setSections(updatedSections);
    saveSections(updatedSections);

    setQuickNotification({
      type: "success",
      message: nextIsOnline
        ? "🌐 Ayudantía marcada como ONLINE. Los alumnos ya NO verán el paso de verificar ubicación GPS."
        : "📍 Ayudantía marcada como PRESENCIAL. Los alumnos deberán verificar su ubicación GPS en el campus.",
    });
    setTimeout(() => setQuickNotification(null), 5000);

    const targetCode = selectedSection.codigo || courseCode;
    if (isSupabaseConfigured() && targetCode) {
      try {
        await updateSectionOnlineStatusInSupabase(targetCode, nextRequiereGeo);
      } catch (err) {
        console.warn("Aviso al actualizar modalidad en Supabase:", err);
      }
    }
  };

  const handleCopyPin = async () => {
    const ok = await copyText(effectivePin);
    if (ok) {
      setCopiedPin(true);
      setTimeout(() => setCopiedPin(false), 2000);
    }
  };

  const handleExportExcel = (scope: AttendanceExportScope = "ayudantias") => {
    exportAttendanceToExcel({
      cursoNombre: courseName,
      seccionNombre: `${courseCode} - ${selectedSection.nombre}`,
      sessions: activeSessions,
      summaries,
      attendanceMap,
      estudiantesNotas: estudiantesExcel,
      scope,
      incluirAyudantiasEnFinal,
      studentWorkRecords,
      totalTrabajosRealizados,
    });
  };

  return (
    <div className="space-y-3 animate-fadeIn">
      {/* Barra Principal Limpia: Identificación + 3 Acciones Clave solicitadas */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-3 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        {/* Izquierda: Sección + PIN */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[4px] bg-[#2D3B45] text-white flex items-center justify-center font-bold shrink-0">
            <GraduationCap size={16} className="text-purple-300" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-bold text-[#2D3B45]">Asistencia a Ayudantías</h2>
              <span className="px-2 py-0.5 bg-gray-100 text-[#55636E] text-[11px] font-medium rounded border border-gray-200">
                {sectionStudents.length} estudiantes • {selectedSection.nombre}
              </span>
              <button
                type="button"
                onClick={handleCopyPin}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded text-[11px] font-mono font-bold transition-colors cursor-pointer"
                title="PIN de sala. Clic para copiar"
              >
                <KeyRound size={12} className="text-amber-700" />
                <span>PIN: {effectivePin}</span>
                {copiedPin ? (
                  <Check size={11} className="text-emerald-600 stroke-[3]" />
                ) : (
                  <Copy size={11} className="text-amber-600 opacity-70" />
                )}
              </button>

              {/* Switch: ¿Ayudantía online? */}
              <button
                type="button"
                role="switch"
                aria-checked={isOnlineAyudantia}
                onClick={handleToggleOnlineAyudantia}
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] text-[11px] font-semibold border transition-all cursor-pointer ${
                  isOnlineAyudantia
                    ? "bg-blue-50 border-blue-300 text-[#008EE2] hover:bg-blue-100 shadow-2xs"
                    : "bg-gray-50 border-gray-300 text-[#55636E] hover:bg-gray-100"
                }`}
                title={
                  isOnlineAyudantia
                    ? "Ayudantía Online activa: Los alumnos NO necesitan verificar GPS. Clic para cambiar a Presencial."
                    : "Ayudantía Presencial: Los alumnos deben verificar ubicación GPS en campus. Clic para cambiar a Online."
                }
              >
                <span
                  className={`w-6 h-3 rounded-full p-[1px] flex items-center transition-colors ${
                    isOnlineAyudantia ? "bg-[#008EE2] justify-end" : "bg-gray-300 justify-start"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-white shadow-xs"></span>
                </span>
                <span className="flex items-center gap-1">
                  {isOnlineAyudantia ? (
                    <>
                      <Globe size={12} className="text-[#008EE2]" />
                      <span>¿Ayudantía online? <strong className="text-[#008EE2]">SÍ (sin GPS)</strong></span>
                    </>
                  ) : (
                    <>
                      <MapPin size={12} className="text-gray-400" />
                      <span>¿Ayudantía online? <span className="text-gray-500 font-normal">NO (con GPS)</span></span>
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Derecha: Buscador compacto + Las 3 Acciones Solicitadas */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Buscador de alumnos compacto */}
          <div className="relative w-36 sm:w-44">
            <Search size={13} className="absolute left-2.5 top-2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar alumno..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-7 pr-6 py-1 text-xs bg-gray-50 border border-gray-300 rounded-[4px] focus:bg-white focus:outline-hidden focus:border-[#008EE2] transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-1.5 text-gray-400 hover:text-gray-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* 1. Copiar link para llenar asistencia del día */}
          <button
            type="button"
            onClick={handleCopyCheckinLink}
            className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
              copiedCheckin
                ? "bg-emerald-600 text-white"
                : "bg-[#008EE2] hover:bg-[#0077BE] text-white"
            }`}
            title="Copia el enlace para que los estudiantes registren su asistencia de hoy en su teléfono o notebook"
          >
            {copiedCheckin ? <Check size={14} className="stroke-[2.5]" /> : <LinkIcon size={14} />}
            <span>{copiedCheckin ? "¡Link Asistencia Copiado!" : "Copiar Link Asistencia Hoy"}</span>
          </button>

          {/* 2. Copiar link para compartir el Excel hasta la fecha */}
          <button
            type="button"
            onClick={handleCopyVisualLink}
            className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs border cursor-pointer ${
              copiedVisual
                ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                : "bg-white hover:bg-gray-50 border-[#C7CDD1] text-[#2D3B45]"
            }`}
            title="Copia el enlace público para que los alumnos revisen su asistencia y décimas a la fecha"
          >
            {copiedVisual ? <Check size={14} className="text-emerald-600 stroke-[2.5]" /> : <Share2 size={14} />}
            <span>{copiedVisual ? "¡Link Planilla Copiado!" : "Copiar Link Planilla a la Fecha"}</span>
          </button>

          {/* 3. Descargar Excel Final */}
          <button
            type="button"
            onClick={() => handleExportExcel("ayudantias")}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-[4px] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            title="Descargar archivo Excel oficial (.xlsx) con notas y asistencias"
          >
            <Download size={14} />
            <span>Descargar Excel Final</span>
          </button>
        </div>
      </div>

      {/* Notificación rápida de acciones */}
      {quickNotification && (
        <div
          className={`p-2.5 rounded-[4px] text-xs font-medium border flex items-center justify-between shadow-2xs animate-fadeIn ${
            quickNotification.type === "success"
              ? "bg-emerald-50 border-emerald-300 text-emerald-900"
              : quickNotification.type === "warning"
              ? "bg-amber-50 border-amber-300 text-amber-900"
              : "bg-blue-50 border-blue-300 text-blue-900"
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{quickNotification.message}</span>
          </div>
          <button
            onClick={() => setQuickNotification(null)}
            className="text-gray-400 hover:text-gray-700 font-bold text-xs ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* Banner informativo si hoy no es el día programado de la clase */}
      {!todaySessionInfo.isScheduledDay && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-[4px] px-3 py-2 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="font-bold">📅 Programación semanal:</span>
            <span>
              Hoy es <strong>{todaySessionInfo.diaActualNombre}</strong>, mientras que la ayudantía está configurada los <strong>{todaySessionInfo.diasConfigurados}</strong> (próxima clase: {todaySessionInfo.nextSession ? todaySessionInfo.nextSession.fecha.split("-").reverse().slice(0, 2).join("/") : "próximamente"}). 
              Por defecto el Excel muestra sesiones pasadas hasta hoy.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowOnlyUpToToday((prev) => !prev)}
            className="px-2.5 py-1 bg-white hover:bg-gray-50 border border-amber-300 rounded text-[11px] font-semibold text-amber-900 shrink-0 cursor-pointer"
          >
            {showOnlyUpToToday ? "Ver calendario completo" : "Ver solo hasta hoy"}
          </button>
        </div>
      )}

      {/* Ver Detalles: Planilla y Matriz Interactiva de Asistencia */}
      <AttendanceMatrixTable
        sessions={filteredSessions}
        summaries={summaries}
        attendanceMap={attendanceMap}
        filterType={filterType}
        incluirAyudantiasEnFinal={incluirAyudantiasEnFinal}
        todaySessionInfo={todaySessionInfo}
        showOnlyUpToToday={showOnlyUpToToday}
        onToggleShowOnlyUpToToday={() => setShowOnlyUpToToday((prev) => !prev)}
        onToggleAttendance={handleToggleAttendance}
        onMarkAllPresent={handleMarkAllPresent}
        onMarkAllAbsent={handleMarkAllAbsent}
        onOpenCancelModal={(sess) => setCancelModalSession(sess)}
        onToggleModality={handleToggleSessionModality}
        studentWorkRecords={studentWorkRecords}
        totalTrabajosRealizados={totalTrabajosRealizados}
        onUpdateTotalTrabajos={handleUpdateTotalTrabajos}
        onUpdateWorkRecord={handleUpdateStudentWork}
      />

      {/* Modal de Cancelar / Reactivar Sesión */}
      {cancelModalSession && (
        <AttendanceCancelClassModal
          session={cancelModalSession}
          isOpen={Boolean(cancelModalSession)}
          onClose={() => setCancelModalSession(null)}
          onConfirmCancel={handleConfirmCancel}
          onReactivateSession={handleReactivateSession}
        />
      )}
    </div>
  );
};
