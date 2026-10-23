"use client";

import React, { useState } from "react";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import {
  CanvasTable,
  CanvasTableHeader,
  CanvasTableRow,
  CanvasTableCell,
} from "@/components/canvas/CanvasTable";
import { Brain, Lightbulb, CheckCircle2, Sparkles } from "lucide-react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasCourse } from "@/types";
import { CourseFinalReportModal } from "./CourseFinalReportModal";
import { MOCK_STUDENT_METRICS } from "@/constants/mockStudentMetrics";
import { MetricsKpiCardsSection } from "./metrics/MetricsKpiCardsSection";

interface CourseMetricsViewProps {
  course?: CanvasCourse;
}

export const CourseMetricsView: React.FC<CourseMetricsViewProps> = ({ course }) => {
  const [metricTab, setMetricTab] = useState<"generales" | "alumnos">("generales");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <div className="space-y-5">
      {/* Selector de Sub-tabs y Botón de Generar Informe Final */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-200 pb-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMetricTab("generales")}
            className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold transition-all cursor-pointer ${
              metricTab === "generales"
                ? "bg-[#2D3B45] text-white shadow-2xs"
                : "bg-white text-[#2D3B45] border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Métricas Generales del Curso
          </button>
          <button
            type="button"
            onClick={() => setMetricTab("alumnos")}
            className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold transition-all cursor-pointer ${
              metricTab === "alumnos"
                ? "bg-[#2D3B45] text-white shadow-2xs"
                : "bg-white text-[#2D3B45] border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Métricas Individuales por Alumno
          </button>
        </div>

        {/* Botón Automático: Generar informe final del curso */}
        <CanvasButton
          variant="primary-canvas"
          size="sm"
          icon={<Sparkles size={14} className="text-yellow-300" />}
          onClick={() => setIsReportModalOpen(true)}
          title="Generar informe final integral con evidencia del semestre para toma de decisiones"
        >
          Generar informe final del curso
        </CanvasButton>
      </div>

      {/* SUBTAB 1: Métricas Generales */}
      {metricTab === "generales" && (
        <div className="space-y-5">
          <MetricsKpiCardsSection />

          {/* Conclusiones Docentes de IA */}
          <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card space-y-3">
            <h3 className="text-sm font-bold text-[#2D3B45] flex items-center gap-2">
              <Brain size={18} className="text-[#008EE2]" />
              Conclusiones Pedagógicas del Agente para el Equipo Docente
            </h3>

            <div className="space-y-2.5">
              <div className="p-3 bg-[#F0F8FF] border border-[#B3E5FC] rounded-[4px] text-xs text-[#0277BD] flex items-start gap-2">
                <Lightbulb size={16} className="shrink-0 mt-0.5 text-[#008EE2]" />
                <div>
                  <strong>Alerta de Aprendizaje:</strong> El 42% de las preguntas de los estudiantes al agente tutor se concentraron en <em>&ldquo;Estimación de esfuerzo con Story Points y Matriz de Riesgos&rdquo;</em>. Se recomienda dedicar 15 minutos en la próxima cátedra para reforzar este concepto antes del Avance 1.
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[4px] text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600" />
                <div>
                  <strong>Impacto de Décimas en Asistencia:</strong> La asistencia a ayudantías aumentó un 28% tras publicar actividades con décimas acumulativas en Solemne 1.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: Métricas por Alumno */}
      {metricTab === "alumnos" && (
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs text-[#6B7780] font-medium">
              Seguimiento formativo individualizado (Nombres protegidos para privacidad)
            </span>
          </div>

          <CanvasTable tableClassName="min-w-[680px]">
            <CanvasTableHeader>
              <tr>
                <th className="p-3">Estudiante</th>
                <th className="p-3 text-center">Asistencia %</th>
                <th className="p-3 text-center">Consultas al Agente</th>
                <th className="p-3 text-center">Talleres Entregados</th>
                <th className="p-3 text-center">Décimas Ganadas</th>
                <th className="p-3 text-center font-bold">Nota Proyectada</th>
                <th className="p-3 text-center">Riesgo Académico</th>
              </tr>
            </CanvasTableHeader>
            <tbody>
              {MOCK_STUDENT_METRICS.map((s, idx) => (
                <CanvasTableRow key={idx} hoverable={false}>
                  <CanvasTableCell>
                    <span className="font-bold text-[#2D3B45] text-xs">{s.nombre}</span>
                  </CanvasTableCell>
                  <CanvasTableCell align="center">
                    <span className={`font-semibold ${s.asistenciaPct < 75 ? "text-[#C8102E] font-bold" : "text-gray-700"}`}>
                      {s.asistenciaPct}%
                    </span>
                  </CanvasTableCell>
                  <CanvasTableCell align="center">
                    <span className="px-2 py-0.5 bg-blue-50 text-[#008EE2] rounded font-semibold text-xs">
                      {s.consultasAgente} dudas
                    </span>
                  </CanvasTableCell>
                  <CanvasTableCell align="center">{s.actividadesEntregadas} / 2</CanvasTableCell>
                  <CanvasTableCell align="center">
                    <span className="font-bold text-purple-800">+{s.decimasGanadas.toFixed(1)}</span>
                  </CanvasTableCell>
                  <CanvasTableCell align="center">
                    <span className="font-extrabold text-xs text-[#2D3B45]">{s.notaProyectada.toFixed(1)}</span>
                  </CanvasTableCell>
                  <CanvasTableCell align="center">
                    <CanvasBadge variant={s.estadoRiesgo === "Crítico" ? "danger" : s.estadoRiesgo === "Medio" ? "warning" : "success"}>
                      {s.estadoRiesgo}
                    </CanvasBadge>
                  </CanvasTableCell>
                </CanvasTableRow>
              ))}
            </tbody>
          </CanvasTable>
        </div>
      )}

      {/* Modal: Generador de Informe Final del Curso */}
      <CourseFinalReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        course={course}
      />
    </div>
  );
};
