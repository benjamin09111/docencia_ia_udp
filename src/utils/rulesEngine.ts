import { AttendanceValue, ClassSession } from "@/types/attendance";
import { CourseGroup } from "@/types/groups";
import { AutomationRule, RuleExecutionAffectedStudent, RuleExecutionResult } from "@/types/automations";

export interface EvaluatedRuleOutcome {
  rule: AutomationRule;
  updatedAttendanceMap: Record<string, AttendanceValue>;
  modificationsCount: number;
  affectedDetails: RuleExecutionAffectedStudent[];
  batchPayload: Array<{ session_code: string; student_canvas_id: number; value: number }>;
}

export function evaluateSharedAttendanceRule(
  rule: AutomationRule,
  groups: CourseGroup[],
  sessions: ClassSession[],
  currentAttendanceMap: Record<string, AttendanceValue>
): EvaluatedRuleOutcome {
  const updatedMap: Record<string, AttendanceValue> = { ...currentAttendanceMap };
  const affectedDetails: RuleExecutionAffectedStudent[] = [];
  const batchPayload: Array<{ session_code: string; student_canvas_id: number; value: number }> = [];

  if (!rule.enabled || rule.type !== "asistencia_compartida") {
    return {
      rule,
      updatedAttendanceMap: currentAttendanceMap,
      modificationsCount: 0,
      affectedDetails: [],
      batchPayload: [],
    };
  }

  const { sectionId, minPresentCount = 2, minPresentPct = 50, onlyAyudantias = true } = rule.config;

  // Filtrar grupos aplicables según la sección de la regla
  const applicableGroups = groups.filter((g) => {
    if (!sectionId || sectionId === "all") return true;
    return !g.sectionId || g.sectionId === sectionId || g.sectionId === "all";
  });

  // Filtrar sesiones aplicables
  const applicableSessions = sessions.filter((s) => {
    if (s.estado === "cancelada") return false;
    if (onlyAyudantias && s.tipo !== "ayudantia") return false;
    if (sectionId && sectionId !== "all" && s.seccionId && s.seccionId !== sectionId) return false;
    return true;
  });

  applicableSessions.forEach((sess) => {
    applicableGroups.forEach((grp) => {
      if (grp.members.length === 0) return;

      // Contar cuántos miembros asistieron
      const presentMembers = grp.members.filter(
        (m) => currentAttendanceMap[`${sess.id}_${m.canvas_id}`] === 1
      );

      const presentCount = presentMembers.length;
      const totalMembers = grp.members.length;
      const presentPct = (presentCount / totalMembers) * 100;

      const meetsQuorum =
        presentCount >= minPresentCount || presentPct >= minPresentPct;

      if (meetsQuorum && presentCount < totalMembers) {
        // Completar asistencia a los miembros restantes del grupo
        grp.members.forEach((member) => {
          const key = `${sess.id}_${member.canvas_id}`;
          if (updatedMap[key] !== 1) {
            updatedMap[key] = 1;
            affectedDetails.push({
              studentName: `${member.nombres} ${member.apellidos}`.trim(),
              canvasId: member.canvas_id,
              sessionId: sess.id,
              sessionDate: sess.fecha,
              groupName: grp.name,
            });
            batchPayload.push({
              session_code: sess.id,
              student_canvas_id: member.canvas_id,
              value: 1,
            });
          }
        });
      }
    });
  });

  return {
    rule,
    updatedAttendanceMap: updatedMap,
    modificationsCount: affectedDetails.length,
    affectedDetails,
    batchPayload,
  };
}
