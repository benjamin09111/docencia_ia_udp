"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  StudentRosterItem,
  getSavedSections,
  getSectionByCourseCode,
  getTodayDateStr,
  getSavedAttendanceMap,
  getSavedStudentWorkRecords,
  getSavedTotalTrabajos,
  generateSemesterSessions,
  saveSections,
} from "@/services/attendanceStore";
import {
  fetchAttendanceMapFromSupabase,
  fetchStudentWorkRecordsFromSupabase,
  fetchSectionsFromSupabase,
  isSupabaseConfigured,
} from "@/services/attendanceDbService";
import { CourseSection, ClassSession, StudentWorkRecord, AttendanceValue } from "@/types/attendance";
import { PublicAttendancePinLockScreen } from "./PublicAttendancePinLockScreen";
import { PublicAttendanceVisualHeader } from "./PublicAttendanceVisualHeader";
import { PublicAttendanceRosterMatrix, StudentVisualRow } from "./PublicAttendanceRosterMatrix";

interface PublicAttendanceVisualViewProps {
  courseCode?: string;
  initialSectionId?: string;
}

export const PublicAttendanceVisualView: React.FC<PublicAttendanceVisualViewProps> = ({
  courseCode = "CIT3203_CA01",
  initialSectionId,
}) => {
  const [sections, setSections] = useState<CourseSection[]>(() => getSavedSections());

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

  const selectedSection = useMemo(() => {
    return getSectionByCourseCode(initialSectionId || courseCode, sections);
  }, [sections, initialSectionId, courseCode]);

  // Estado de desbloqueo mediante PIN semestral de la sección
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [hasCheckedUnlock, setHasCheckedUnlock] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const unlocked =
        localStorage.getItem(`udp_visual_unlocked_${selectedSection.codigo}`) === "true" ||
        localStorage.getItem(`udp_visual_unlocked_${selectedSection.id}`) === "true";
      setIsUnlocked(unlocked);
      setHasCheckedUnlock(true);
    }
  }, [selectedSection.codigo, selectedSection.id]);

  // Sesiones de ayudantía hasta la fecha
  const sessions: ClassSession[] = useMemo(() => {
    const todayStr = getTodayDateStr();
    const all = generateSemesterSessions(selectedSection);
    return all.filter(
      (s) => s.tipo === "ayudantia" && s.estado !== "cancelada" && s.fecha <= todayStr
    );
  }, [selectedSection]);

  const [students, setStudents] = useState<StudentRosterItem[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceValue>>({});
  const [studentWorkRecords, setStudentWorkRecords] = useState<Record<number, StudentWorkRecord>>({});
  const [totalTrabajos, setTotalTrabajos] = useState<number>(() => getSavedTotalTrabajos(selectedSection.id));

  // Cargar datos locales y remotos
  useEffect(() => {
    setAttendanceMap(getSavedAttendanceMap());
    setStudentWorkRecords(getSavedStudentWorkRecords());
    setTotalTrabajos(getSavedTotalTrabajos(selectedSection.id));

    // Cargar alumnos desde API Canvas
    const courseIdMap: Record<string, number> = { CIT3203_CA01: 44999, CIT3203_CA02: 45002, CIT3203_CA03: 47552, CIT3100_CA02: 44988 };
    const effectiveCourseId = courseIdMap[selectedSection.codigo] || 44999;

    fetch(`/api/canvas/courses/${effectiveCourseId}/students`)
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setStudents(data); })
      .catch(() => {});

    if (isSupabaseConfigured()) {
      const secCode = selectedSection.codigo || courseCode;
      fetchAttendanceMapFromSupabase(secCode).then((map) => {
        if (Object.keys(map).length > 0) setAttendanceMap((prev) => ({ ...prev, ...map }));
      });
      fetchStudentWorkRecordsFromSupabase(secCode).then((rec) => {
        if (Object.keys(rec).length > 0) setStudentWorkRecords((prev) => ({ ...prev, ...rec }));
      });
    }
  }, [selectedSection, courseCode]);

  // Buscador por Nombre y Filtro de Condición
  const [searchTerm, setSearchTerm] = useState("");
  const [conditionFilter, setConditionFilter] = useState<"all" | "ok" | "risk">("all");
  const normalizeRut = (rut: string) => (rut || "").toLowerCase().replace(/[^0-9k]/g, "");

  const studentSummaries: StudentVisualRow[] = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return students
      .map((st) => {
        let asistidas = 0;
        sessions.forEach((sess) => {
          if (attendanceMap[`${sess.id}_${st.canvas_id}`] === 1) asistidas++;
        });
        const validas = sessions.length;
        const pct = validas > 0 ? Math.round((asistidas / validas) * 100) : 0;
        const ok = pct >= 75;
        const work = studentWorkRecords[st.canvas_id];
        const trabCount = work ? (work.trabajosRealizados ?? 0) : 0;
        const decimas = Math.round(trabCount * 0.2 * 10) / 10;
        const fullName = `${st.nombres || ""} ${st.apellidos || ""}`.trim() || (st as any).name || st.rut || `Estudiante ${st.canvas_id}`;

        return {
          canvas_id: st.canvas_id,
          nombreCompleto: fullName,
          nombres: st.nombres,
          apellidos: st.apellidos,
          rut: st.rut || "",
          asistidas,
          validas,
          pct,
          ok,
          decimas,
          trabajosRealizados: trabCount,
        };
      })
      .filter((st) => {
        if (query) {
          const matchName = st.nombreCompleto.toLowerCase().includes(query);
          const matchRut = normalizeRut(st.rut || "").includes(normalizeRut(searchTerm));
          if (!matchName && !matchRut) return false;
        }
        if (conditionFilter === "ok" && !st.ok) return false;
        if (conditionFilter === "risk" && st.ok) return false;
        return true;
      });
  }, [students, sessions, attendanceMap, studentWorkRecords, searchTerm, conditionFilter]);

  const highlightedStudent = useMemo(() => {
    if (searchTerm.trim().length >= 3 && studentSummaries.length === 1) return studentSummaries[0];
    return null;
  }, [searchTerm, studentSummaries]);

  if (!hasCheckedUnlock) return null;
  if (!isUnlocked) {
    return <PublicAttendancePinLockScreen section={selectedSection} onUnlocked={() => setIsUnlocked(true)} />;
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-4 animate-fadeIn pb-12">
      <PublicAttendanceVisualHeader
        section={selectedSection}
        totalStudents={students.length}
        filteredCount={studentSummaries.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        conditionFilter={conditionFilter}
        onConditionChange={setConditionFilter}
        highlightedStudent={highlightedStudent}
        totalTrabajos={totalTrabajos}
      />

      <PublicAttendanceRosterMatrix
        sessions={sessions}
        studentSummaries={studentSummaries}
        attendanceMap={attendanceMap}
        totalTrabajos={totalTrabajos}
        highlightedStudentId={highlightedStudent?.canvas_id}
      />
    </div>
  );
};
