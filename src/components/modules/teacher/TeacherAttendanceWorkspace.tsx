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
  saveSessionOverride,
  regenerateSectionPin,
} from "@/services/attendanceStore";
import { exportAttendanceToExcel, AttendanceExportScope } from "@/services/excelExportService";
import {
  syncCourseAndSectionToSupabase,
  syncStudentsAndSessionsToSupabase,
  saveAttendanceMarkToSupabase,
  saveAttendanceBatchToSupabase,
  fetchAttendanceMapFromSupabase,
  saveStudentWorkRecordToSupabase,
  fetchStudentWorkRecordsFromSupabase,
  updateSessionStatusInSupabase,
  isSupabaseConfigured,
} from "@/services/attendanceDbService";
import { AttendanceFilterBar } from "./attendance/AttendanceFilterBar";
import { AttendanceSummaryCards } from "./attendance/AttendanceSummaryCards";
import { AttendanceMatrixTable } from "./attendance/AttendanceMatrixTable";
import { AttendanceScheduleModal } from "./attendance/AttendanceScheduleModal";
import { AttendanceCancelClassModal } from "./attendance/AttendanceCancelClassModal";
import { AttendanceCancellationHistory } from "./attendance/AttendanceCancellationHistory";
import { Table, CalendarX } from "lucide-react";
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

  // 1 curso = 1 sección (determinada por el código del curso Canvas)
  const matchedSectionId = useMemo(() => {
    const found = sections.find((s) => 
      s.codigo === courseCode || 
      courseCode.includes(s.codigo) ||
      (courseCode.includes("CIT2206") && s.codigo.includes("CIT2206")) ||
      (courseCode.includes("CIT3100") && s.codigo.includes("CIT3100")) ||
      (courseCode.includes("CA02") && s.codigo.includes("CA02")) ||
      (courseCode.includes("CA01") && s.codigo.includes("CA01"))
    );
    if (found) return found.id;
    if (courseCode.includes("CIT2206") || courseCode.includes("2206")) return "sec_gestion_org";
    if (courseCode.includes("CIT3100") || courseCode.includes("3100")) return "sec_arq_emergentes";
    if (courseCode.includes("CA02") || courseCode.includes("02")) return "sec_2";
    return "sec_1";
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

  // Modales
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [cancelModalSession, setCancelModalSession] = useState<ClassSession | null>(null);

  // Sub-tab dentro de Asistencia: Planilla vs Historial de Cancelaciones
  const [workspaceTab, setWorkspaceTab] = useState<"matrix" | "cancellations">("matrix");

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
    const newPin = regenerateSectionPin(selectedSection.id);
    setSections(getSavedSections());
    setQuickNotification({
      type: "success",
      message: `🔑 Nuevo PIN generado para ${selectedSection.nombre}: ${newPin}. Proyéctalo o compártelo a los alumnos.`,
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

  const handleSaveSectionConfig = (updated: CourseSection) => {
    const updatedSections = sections.map((s) => (s.id === updated.id ? updated : s));
    setSections(updatedSections);
    saveSections(updatedSections);
    // Regenerar sesiones con los nuevos días/horarios
    setSessionsBySection((prev) => ({
      ...prev,
      [updated.id]: generateSemesterSessions(updated),
    }));
  };

  const handleExportExcel = (scope: AttendanceExportScope = "ambas") => {
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

  const handleOpenPublicLink = () => {
    // Abre el enlace público específico del curso/sección
    window.open(`/asistencia/${selectedSection.codigo || courseCode}`, "_blank");
  };

  const todayStr = getTodayDateStr();
  const totalRealizadas = activeSessions.filter(
    (s) => s.tipo === "ayudantia" && s.estado !== "cancelada" && s.fecha <= todayStr
  ).length;

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Banner de Estado de Sincronización Oficial Canvas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-[#E0E3E6] rounded-[4px] px-3 sm:px-4 py-2 text-xs gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="font-semibold text-[#2D3B45]">
            Nómina Oficial Canvas UDP:
          </span>
          <span className="text-[#6B7780]">
            {isLoadingStudents ? (
              "Sincronizando estudiantes desde Canvas..."
            ) : (
              `${sectionStudents.length} estudiantes matriculados (excluye profesores y ayudantes)`
            )}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {isCloudSynced && (
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Supabase Activo
            </span>
          )}
          <span className="font-mono text-[11px] text-[#008EE2] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Canvas ID: {effectiveCanvasCourseId} • {selectedSection.nombre}
          </span>
        </div>
      </div>

      {/* 1. Barra de Filtros, Tabs y Acciones con Buscador y Marcación Rápida */}
      <AttendanceFilterBar
        filterType={filterType}
        onFilterTypeChange={setFilterType}
        sectionCode={selectedSection.codigo || courseCode}
        currentSection={selectedSection}
        activePin={selectedSection.pinActivo}
        onRegeneratePin={handleRegeneratePin}
        livePresentesCount={livePresentesCount}
        totalEstudiantesCount={sectionStudents.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenConfig={() => setIsConfigOpen(true)}
        onOpenPublicLink={handleOpenPublicLink}
        onExportExcel={handleExportExcel}
        onResetToZero={handleResetAllToZero}
        incluirAyudantiasEnFinal={incluirAyudantiasEnFinal}
        onToggleIncluirAyudantias={() => setIncluirAyudantiasEnFinal((prev) => !prev)}
        todaySessionInfo={todaySessionInfo}
        matchingSummaries={summaries}
        attendanceMap={attendanceMap}
        onMarkTodayAttendance={handleMarkTodayAttendance}
        studentWorkRecords={studentWorkRecords}
        totalTrabajosRealizados={totalTrabajosRealizados}
        onUpdateTotalTrabajos={handleUpdateTotalTrabajos}
        onUpdateWorkRecord={handleUpdateStudentWork}
      />

      {/* Notificación rápida de marcación */}
      {quickNotification && (
        <div
          className={`p-3 rounded-[4px] text-xs font-medium border flex items-center justify-between shadow-xs animate-fadeIn ${
            quickNotification.type === "success"
              ? "bg-emerald-50 border-emerald-300 text-emerald-900"
              : quickNotification.type === "warning"
              ? "bg-amber-50 border-amber-300 text-amber-900"
              : "bg-blue-50 border-blue-300 text-blue-900"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-bold">
              {quickNotification.type === "success"
                ? "✓"
                : quickNotification.type === "warning"
                ? "⚠"
                : "ℹ"}
            </span>
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

      {/* Selector de Pestañas: Planilla vs Historial de Cancelaciones */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#E0E3E6] pt-1 gap-2">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => setWorkspaceTab("matrix")}
            className={`px-3.5 py-2 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              workspaceTab === "matrix"
                ? "border-[#008EE2] text-[#008EE2] bg-white rounded-t-[4px] shadow-2xs"
                : "border-transparent text-[#6B7780] hover:text-[#2D3B45] hover:bg-gray-100/70"
            }`}
          >
            <Table size={14} />
            <span>Planilla de Asistencia</span>
          </button>

          <button
            type="button"
            onClick={() => setWorkspaceTab("cancellations")}
            className={`px-3.5 py-2 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              workspaceTab === "cancellations"
                ? "border-[#C8102E] text-[#C8102E] bg-white rounded-t-[4px] shadow-2xs"
                : "border-transparent text-[#6B7780] hover:text-[#2D3B45] hover:bg-gray-100/70"
            }`}
          >
            <CalendarX size={14} />
            <span>Historial de Cancelaciones</span>
            {activeSessions.filter((s) => s.estado === "cancelada").length > 0 && (
              <span className="ml-1 text-[10px] font-mono px-1.5 py-0.2 bg-red-100 text-red-800 font-bold rounded-full border border-red-200">
                {activeSessions.filter((s) => s.estado === "cancelada").length}
              </span>
            )}
          </button>
        </div>
      </div>

      {workspaceTab === "matrix" ? (
        <>
          {/* 2. Tarjetas Resumen KPI */}
          <AttendanceSummaryCards summaries={summaries} totalRealizadas={totalRealizadas} />

          {/* 3. Matriz Interactiva de Asistencia con Columna Hoy */}
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
        </>
      ) : (
        <AttendanceCancellationHistory
          sessions={activeSessions}
          section={selectedSection}
          onReactivateSession={handleReactivateSession}
          onOpenCancelModal={(sess) => setCancelModalSession(sess)}
          onBackToMatrix={() => setWorkspaceTab("matrix")}
        />
      )}

      {/* Modal de Configuración de Sección */}
      {isConfigOpen && (
        <AttendanceScheduleModal
          section={selectedSection}
          isOpen={isConfigOpen}
          onClose={() => setIsConfigOpen(false)}
          onSave={handleSaveSectionConfig}
        />
      )}

      {/* Modal de Cancelar Sesión */}
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
