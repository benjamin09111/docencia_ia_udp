"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  StudentRosterItem, getSavedSections, getSectionByCourseCode, getTodayDateStr,
  getSavedAttendanceMap, getSavedStudentWorkRecords, getSavedTotalTrabajos,
  generateSemesterSessions, saveSections, mergeRemoteSessionOverrides,
} from "@/services/attendanceStore";
import { fetchSectionSessionStates } from "@/services/attendanceCloudService";
import { BOARD_LOCKED_EVENT, hasBoardToken } from "@/services/dataGateway";
import { usePublicAttendanceSummaries } from "@/hooks/usePublicAttendanceSummaries";
import {
  fetchAttendanceMapFromSupabase, fetchStudentWorkRecordsFromSupabase,
  fetchSectionsFromSupabase, isSupabaseConfigured,
} from "@/services/attendanceDbService";
import { CourseSection, ClassSession, StudentWorkRecord, AttendanceValue } from "@/types/attendance";
import { PublicAttendancePinLockScreen } from "./PublicAttendancePinLockScreen";
import { PublicAttendanceVisualHeader } from "./PublicAttendanceVisualHeader";
import { PublicAttendanceRosterMatrix } from "./PublicAttendanceRosterMatrix";
import { PublicStudentPortalNav, PublicMainModule, PublicAttendanceSubmodule } from "./PublicStudentPortalNav";
import { PublicLockedModuleCard } from "./PublicLockedModuleCard";
import { PublicStudentAppealModal } from "./PublicStudentAppealModal";
import { PublicMobileStudentView } from "./PublicMobileStudentView";

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

  // Desbloqueo = token firmado por el servidor (ya no una bandera editable en localStorage).
  // Si el servidor lo rechaza (vencido o inválido), la planilla vuelve a pedir el PIN.
  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsUnlocked(hasBoardToken(selectedSection.codigo));
    setHasCheckedUnlock(true);
    const onLocked = (e: Event) => {
      if ((e as CustomEvent<string>).detail === selectedSection.codigo) setIsUnlocked(false);
    };
    window.addEventListener(BOARD_LOCKED_EVENT, onLocked);
    return () => window.removeEventListener(BOARD_LOCKED_EVENT, onLocked);
  }, [selectedSection.codigo]);

  // Estados de clase compartidos (canceladas / online / opcionales) desde la nube:
  // el alumno debe ver el mismo porcentaje que el docente.
  const [sessionStatesVersion, setSessionStatesVersion] = useState(0);
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    let alive = true;
    fetchSectionSessionStates(selectedSection.codigo).then((states) => {
      if (alive && mergeRemoteSessionOverrides(states)) setSessionStatesVersion((v) => v + 1);
    });
    return () => { alive = false; };
  }, [selectedSection.codigo]);

  const sessions: ClassSession[] = useMemo(() => {
    const todayStr = getTodayDateStr();
    return generateSemesterSessions(selectedSection).filter(
      (s) => s.tipo === "ayudantia" && s.estado !== "cancelada" && s.fecha <= todayStr
    );
  }, [selectedSection, sessionStatesVersion]);

  const [students, setStudents] = useState<StudentRosterItem[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceValue>>({});
  const [studentWorkRecords, setStudentWorkRecords] = useState<Record<number, StudentWorkRecord>>({});
  const [totalTrabajos, setTotalTrabajos] = useState<number>(1);

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

    if (isSupabaseConfigured() && isUnlocked) {
      const secCode = selectedSection.codigo || courseCode;
      fetchAttendanceMapFromSupabase(secCode).then((map) => {
        if (map && Object.keys(map).length > 0) setAttendanceMap((prev) => ({ ...prev, ...map }));
      });
      fetchStudentWorkRecordsFromSupabase(secCode).then((rec) => {
        if (rec && Object.keys(rec).length > 0) setStudentWorkRecords((prev) => ({ ...prev, ...rec }));
      });
    }
  }, [selectedSection, courseCode, isUnlocked]);

  const [searchTerm, setSearchTerm] = useState("");
  const [conditionFilter, setConditionFilter] = useState<"all" | "ok" | "risk">("all");

  const { studentSummaries, highlightedStudent } = usePublicAttendanceSummaries({
    students,
    sessions,
    attendanceMap,
    studentWorkRecords,
    searchTerm,
    conditionFilter,
  });

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
          {/* Vista para Computador / Desktop (Tabla Completa + Filtros) */}
          <div className="hidden md:block space-y-4">
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
          </div>

          {/* Vista Exclusiva para Dispositivos Móviles (Buscador + Ficha Individual) */}
          <div className="block md:hidden">
            <PublicMobileStudentView
              students={studentSummaries}
              sessions={sessions}
              attendanceMap={attendanceMap}
              totalTrabajos={totalTrabajos}
              onOpenAppealModal={() => setIsAppealModalOpen(true)}
            />
          </div>

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
