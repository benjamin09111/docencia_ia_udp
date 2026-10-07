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
import { PublicStudentPortalNav, PublicMainModule, PublicAttendanceSubmodule } from "./PublicStudentPortalNav";
import { PublicLockedModuleCard } from "./PublicLockedModuleCard";
import { PublicStudentAppealModal } from "./PublicStudentAppealModal";

interface PublicAttendanceVisualViewProps {
  courseCode?: string;
  initialSectionId?: string;
}

export const PublicAttendanceVisualView: React.FC<PublicAttendanceVisualViewProps> = ({
  courseCode = "CIT3203_CA01",
  initialSectionId,
}) => {
  const [sections, setSections] = useState<CourseSection[]>(() => getSavedSections());
  const [activeMainModule, setActiveMainModule] = useState<PublicMainModule>("asistencia");
  const [activeAttendanceSub, setActiveAttendanceSub] = useState<PublicAttendanceSubmodule>("ayudantias");
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);

  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchSectionsFromSupabase().then((cloudSections) => {
        if (cloudSections?.length) {
          setSections(cloudSections);
          saveSections(cloudSections);
        }
      });
    }
  }, []);

  const selectedSection = useMemo(
    () => getSectionByCourseCode(initialSectionId || courseCode, sections),
    [sections, initialSectionId, courseCode]
  );

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [hasCheckedUnlock, setHasCheckedUnlock] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const unlocked =
        localStorage.getItem(`udp_visual_unlocked_${selectedSection.codigo}`) === "true" ||
        localStorage.getItem(`udp_visual_unlocked_${selectedSection.id}`) === "true";
      setIsUnlocked(unlocked);
      setHasCheckedUnlock(true);
    }
  }, [selectedSection.codigo, selectedSection.id]);

  const sessions: ClassSession[] = useMemo(() => {
    const todayStr = getTodayDateStr();
    return generateSemesterSessions(selectedSection).filter(
      (s) => s.tipo === "ayudantia" && s.estado !== "cancelada" && s.fecha <= todayStr
    );
  }, [selectedSection]);

  const [students, setStudents] = useState<StudentRosterItem[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceValue>>({});
  const [studentWorkRecords, setStudentWorkRecords] = useState<Record<number, StudentWorkRecord>>({});
  const [totalTrabajos, setTotalTrabajos] = useState(() => getSavedTotalTrabajos(selectedSection.id));

  useEffect(() => {
    setAttendanceMap(getSavedAttendanceMap());
    setStudentWorkRecords(getSavedStudentWorkRecords());
    setTotalTrabajos(getSavedTotalTrabajos(selectedSection.id));

    const courseIdMap: Record<string, number> = { CIT3203_CA01: 44999, CIT3203_CA02: 45002, CIT3203_CA03: 47552, CIT3100_CA02: 44988 };
    const effectiveCourseId = courseIdMap[selectedSection.codigo] || 44999;
    fetch(`/api/canvas/courses/${effectiveCourseId}/students`)
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setStudents(data); })
      .catch(() => {});

    if (isSupabaseConfigured()) {
      const secCode = selectedSection.codigo || courseCode;
      fetchAttendanceMapFromSupabase(secCode).then((map) => { if (Object.keys(map).length > 0) setAttendanceMap((prev) => ({ ...prev, ...map })); });
      fetchStudentWorkRecordsFromSupabase(secCode).then((rec) => { if (Object.keys(rec).length > 0) setStudentWorkRecords((prev) => ({ ...prev, ...rec })); });
    }
  }, [selectedSection, courseCode]);

  const [searchTerm, setSearchTerm] = useState("");
  const [conditionFilter, setConditionFilter] = useState<"all" | "ok" | "risk">("all");

  const studentSummaries: StudentVisualRow[] = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return students
      .map((st) => {
        const asistidas = sessions.filter((sess) => attendanceMap[`${sess.id}_${st.canvas_id}`] === 1).length;
        const validas = sessions.length;
        const pct = validas > 0 ? Math.round((asistidas / validas) * 100) : 0;
        const work = studentWorkRecords[st.canvas_id];
        const trabCount = work ? (work.trabajosRealizados ?? 0) : 0;
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
          ok: pct >= 75,
          decimas: Math.round(trabCount * 0.2 * 10) / 10,
          trabajosRealizados: trabCount,
        };
      })
      .filter((st) => {
        if (query && !st.nombreCompleto.toLowerCase().includes(query)) return false;
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
  if (!isUnlocked) return <PublicAttendancePinLockScreen section={selectedSection} onUnlocked={() => setIsUnlocked(true)} />;

  const courseTitle = selectedSection.cursoNombre || selectedSection.codigo || "Asignatura UDP";
  const resetToAyudantias = () => { setActiveMainModule("asistencia"); setActiveAttendanceSub("ayudantias"); };

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-4 animate-fadeIn pb-12">
      <PublicStudentPortalNav
        section={selectedSection}
        activeMainModule={activeMainModule}
        onSelectMainModule={setActiveMainModule}
        activeAttendanceSub={activeAttendanceSub}
        onSelectAttendanceSub={setActiveAttendanceSub}
      />

      {activeMainModule === "notas" && <PublicLockedModuleCard moduleName={courseTitle} moduleType="notas" onReturnToAyudantias={resetToAyudantias} />}
      {activeMainModule === "resumen" && <PublicLockedModuleCard moduleName={courseTitle} moduleType="resumen" onReturnToAyudantias={resetToAyudantias} />}
      {activeMainModule === "asistencia" && activeAttendanceSub === "catedras" && <PublicLockedModuleCard moduleName={courseTitle} moduleType="catedra" onReturnToAyudantias={resetToAyudantias} />}
      {activeMainModule === "asistencia" && activeAttendanceSub === "resumen" && <PublicLockedModuleCard moduleName={courseTitle} moduleType="resumen_asistencia" onReturnToAyudantias={resetToAyudantias} />}

      {activeMainModule === "asistencia" && activeAttendanceSub === "ayudantias" && (
        <>
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
            onOpenAppealModal={() => setIsAppealModalOpen(true)}
          />
          <PublicAttendanceRosterMatrix
            sessions={sessions}
            studentSummaries={studentSummaries}
            attendanceMap={attendanceMap}
            totalTrabajos={totalTrabajos}
            highlightedStudentId={highlightedStudent?.canvas_id}
          />
          <PublicStudentAppealModal
            isOpen={isAppealModalOpen}
            onClose={() => setIsAppealModalOpen(false)}
            section={selectedSection}
            students={students}
            sessions={sessions}
          />
        </>
      )}
    </div>
  );
};
