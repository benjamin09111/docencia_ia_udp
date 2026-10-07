"use client";

import React, { useState, useEffect } from "react";
import { Zap, Plus, Trash2, CheckCircle2, Play, ShieldAlert, Sparkles, Clock, Check } from "lucide-react";
import { AutomationRule, AutomationRuleType, RuleExecutionAffectedStudent } from "@/types/automations";
import { CourseGroup } from "@/types/groups";
import { ClassSession, AttendanceValue } from "@/types/attendance";
import { getSavedRules, createRule, deleteRule, toggleRuleEnabled, recordRuleExecution } from "@/services/automationsStore";
import { getSavedGroups } from "@/services/groupsStore";
import { getSavedAttendanceMap, saveAttendanceMap } from "@/services/attendanceStore";
import { saveAttendanceBatchToSupabase } from "@/services/attendanceDbService";
import { evaluateSharedAttendanceRule } from "@/utils/rulesEngine";
import { CreateAutomationRuleModal } from "./CreateAutomationRuleModal";

interface CourseAutomationsWorkspaceProps {
  courseCode: string;
  courseName: string;
  sessions: ClassSession[];
}

export const CourseAutomationsWorkspace: React.FC<CourseAutomationsWorkspaceProps> = ({
  courseCode,
  courseName,
  sessions,
}) => {
  const [rules, setRules] = useState<AutomationRule[]>(() => getSavedRules(courseCode));
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [executionResult, setExecutionResult] = useState<{ count: number; details: RuleExecutionAffectedStudent[] } | null>(null);

  const refreshRules = () => setRules(getSavedRules(courseCode));

  useEffect(() => {
    refreshRules();
    const handleUpdate = () => refreshRules();
    window.addEventListener("udp_rules_updated", handleUpdate);
    return () => window.removeEventListener("udp_rules_updated", handleUpdate);
  }, [courseCode]);

  const handleCreate = (data: { name: string; description: string; type: AutomationRuleType; sectionId: string; minPresentCount: number }) => {
    createRule(courseCode, {
      name: data.name,
      description: data.description,
      type: data.type,
      enabled: true,
      config: { sectionId: data.sectionId, minPresentCount: data.minPresentCount, onlyAyudantias: true },
    });
    refreshRules();
  };

  const handleExecuteAll = () => {
    const groups = getSavedGroups(courseCode);
    let currentMap = getSavedAttendanceMap();
    let totalModifications = 0;
    const allAffected: RuleExecutionAffectedStudent[] = [];
    const allBatch: Array<{ session_code: string; student_canvas_id: number; value: number }> = [];

    rules.filter((r) => r.enabled).forEach((rule) => {
      const outcome = evaluateSharedAttendanceRule(rule, groups, sessions, currentMap);
      currentMap = outcome.updatedAttendanceMap;
      totalModifications += outcome.modificationsCount;
      allAffected.push(...outcome.affectedDetails);
      allBatch.push(...outcome.batchPayload);
      recordRuleExecution(rule.id, { benefitedCount: outcome.modificationsCount, sessionsCount: outcome.affectedDetails.length });
    });

    if (totalModifications > 0) {
      saveAttendanceMap(currentMap);
      saveAttendanceBatchToSupabase(allBatch).catch((err) => console.warn("Error guardando lote:", err));
    }
    setExecutionResult({ count: totalModifications, details: allAffected });
    refreshRules();
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[4px] bg-[#2D3B45] text-amber-400 flex items-center justify-center font-bold">
            <Zap size={22} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#2D3B45]">Motor de Automatizaciones • {courseName}</h2>
            <p className="text-xs text-[#6B7780]">{rules.filter((r) => r.enabled).length} reglas activas</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExecuteAll}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-[4px] text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Play size={13} />
            <span>Ejecutar Reglas Ahora</span>
          </button>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="px-3.5 py-1.5 bg-[#C8102E] hover:bg-[#A00D24] text-white font-bold rounded-[4px] text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Plus size={14} />
            <span>Crear Regla</span>
          </button>
        </div>
      </div>

      {/* Reporte de Ejecución */}
      {executionResult && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-[4px] text-xs space-y-2 animate-fadeIn text-emerald-950">
          <div className="flex items-center justify-between">
            <span className="font-bold flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-700" />
              {executionResult.count > 0 ? `✓ Se aplicó asistencia compartida a ${executionResult.count} registros de estudiantes.` : "Todas las asistencias ya estaban al día según las reglas activas."}
            </span>
            <button type="button" onClick={() => setExecutionResult(null)} className="text-gray-400 hover:text-gray-700 font-bold">✕</button>
          </div>
          {executionResult.details.length > 0 && (
            <div className="max-h-28 overflow-y-auto space-y-1 pr-1">
              {executionResult.details.map((d, i) => (
                <div key={i} className="px-2 py-0.5 bg-white border border-emerald-200 rounded text-[11px] flex items-center justify-between">
                  <span><strong>{d.studentName}</strong> ({d.groupName})</span>
                  <span className="font-mono text-gray-500">Fecha: {d.sessionDate}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lista de Reglas */}
      <div className="space-y-2.5">
        {rules.map((rule) => (
          <div key={rule.id} className="bg-white border border-[#E0E3E6] rounded-[4px] p-3.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-[#2D3B45]">{rule.name}</span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 rounded">
                  {rule.config.sectionId === "sec_1" ? "Solo Sección 1" : "Todas las secciones"}
                </span>
              </div>
              <p className="text-xs text-[#6B7780]">{rule.description}</p>
              {rule.lastExecutedAt && (
                <span className="text-[10px] text-gray-400 block font-mono">
                  Última ejecución: {new Date(rule.lastExecutedAt).toLocaleTimeString("es-CL")}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => { toggleRuleEnabled(rule.id); refreshRules(); }}
                className={`px-3 py-1 rounded-[4px] text-xs font-bold transition-colors cursor-pointer border ${
                  rule.enabled ? "bg-emerald-50 border-emerald-300 text-emerald-800" : "bg-gray-100 border-gray-300 text-gray-500"
                }`}
              >
                {rule.enabled ? "✓ Activa" : "Inactiva"}
              </button>
              <button
                type="button"
                onClick={() => { deleteRule(rule.id); refreshRules(); }}
                className="p-1.5 text-gray-400 hover:text-rose-600 rounded hover:bg-rose-50 cursor-pointer"
                title="Eliminar regla"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <CreateAutomationRuleModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreateRule={handleCreate}
      />
    </div>
  );
};
