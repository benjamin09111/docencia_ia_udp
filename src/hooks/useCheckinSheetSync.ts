"use client";

import { useState, useCallback, useMemo } from "react";
import { AttendanceValue } from "@/types/attendance";
import { CloudCheckinLog } from "@/services/attendanceCloudService";
import {
  getAttendanceValue,
  getSavedAttendanceMap,
  saveAttendanceMap,
  recordAttendanceSchedule,
} from "@/services/attendanceStore";
import { saveAttendanceMarkToSupabase, saveAttendanceBatchToSupabase } from "@/services/attendanceDbService";

interface UseCheckinSheetSyncParams {
  rows: CloudCheckinLog[];
  attendanceMap?: Record<string, AttendanceValue>;
  onMarkPresent?: (sessionCode: string, studentCanvasId: number) => Promise<boolean>;
  onSyncBatch?: (records: Array<{ sessionCode: string; studentCanvasId: number }>) => Promise<boolean>;
}

export function useCheckinSheetSync({
  rows,
  attendanceMap,
  onMarkPresent,
  onSyncBatch,
}: UseCheckinSheetSyncParams) {
  const [markingLogIds, setMarkingLogIds] = useState<Set<string>>(new Set());
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  // El mapa de asistencia proviene directamente de TeacherAttendanceWorkspace (SSOT).
  // Solo si no se proporciona, se recurre a la lectura directa de la caché guardada.
  const currentMap = useMemo(() => {
    return attendanceMap ?? getSavedAttendanceMap();
  }, [attendanceMap]);

  const isStudentPresentInSheet = useCallback(
    (sessionCode: string, studentCanvasId: number) => {
      return getAttendanceValue(currentMap, sessionCode, studentCanvasId) === 1;
    },
    [currentMap]
  );

  const missingInSheetLogs = useMemo(() => {
    return rows.filter((r) => !isStudentPresentInSheet(r.sessionCode, r.studentCanvasId));
  }, [rows, isStudentPresentInSheet]);

  const handleMarkSingle = async (log: CloudCheckinLog) => {
    setMarkingLogIds((prev) => new Set(prev).add(log.id));
    try {
      const isH2 = Boolean(log.scheduleLabel?.includes("Horario 2") || log.scheduleLabel?.includes("Secundario"));
      recordAttendanceSchedule(`${log.sessionCode}_${log.studentCanvasId}`, isH2 ? "H2" : "H1");
      if (onMarkPresent) {
        await onMarkPresent(log.sessionCode, log.studentCanvasId);
      } else {
        const res = await saveAttendanceMarkToSupabase(log.sessionCode, log.studentCanvasId, 1, "profesor");
        if (res.success) {
          const saved = getSavedAttendanceMap();
          saved[`${log.sessionCode}_${log.studentCanvasId}`] = 1;
          saveAttendanceMap(saved);
        }
      }
    } finally {
      setMarkingLogIds((prev) => {
        const next = new Set(prev);
        next.delete(log.id);
        return next;
      });
    }
  };

  const handleSyncAllMissing = async () => {
    if (missingInSheetLogs.length === 0) return;
    setIsSyncingAll(true);
    try {
      missingInSheetLogs.forEach((l) => {
        const isH2 = Boolean(l.scheduleLabel?.includes("Horario 2") || l.scheduleLabel?.includes("Secundario"));
        recordAttendanceSchedule(`${l.sessionCode}_${l.studentCanvasId}`, isH2 ? "H2" : "H1");
      });
      const items = missingInSheetLogs.map((l) => ({
        sessionCode: l.sessionCode,
        studentCanvasId: l.studentCanvasId,
      }));
      if (onSyncBatch) {
        await onSyncBatch(items);
      } else {
        const batch = items.map((it) => ({
          session_code: it.sessionCode,
          student_canvas_id: it.studentCanvasId,
          value: 1,
          marked_by: "profesor",
        }));
        await saveAttendanceBatchToSupabase(batch);
        const saved = getSavedAttendanceMap();
        items.forEach((it) => {
          saved[`${it.sessionCode}_${it.studentCanvasId}`] = 1;
        });
        saveAttendanceMap(saved);
      }
    } finally {
      setIsSyncingAll(false);
    }
  };

  return {
    isStudentPresentInSheet,
    missingInSheetLogs,
    markingLogIds,
    isSyncingAll,
    handleMarkSingle,
    handleSyncAllMissing,
  };
}
