"use client";

import React, { useState } from "react";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import {
  CanvasTable,
  CanvasTableHeader,
  CanvasTableRow,
  CanvasTableCell,
} from "@/components/canvas/CanvasTable";
import {
  BarChart3,
  Users,
  AlertTriangle,
  Bot,
  TrendingUp,
  Brain,
  Lightbulb,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasCourse } from "@/types";
import { CourseFinalReportModal } from "./CourseFinalReportModal";

interface StudentMetric {
  nombre: string;
  asistenciaPct: number;
  consultasAgente: number;
  actividadesEntregadas: number;
  decimasGanadas: number;
  notaProyectada: number;
  estadoRiesgo: "Bajo" | "Medio" | "Crítico";
}

const mockStudentMetrics: StudentMetric[] = [
  { nombre: "Benjamín", asistenciaPct: 0, consultasAgente: 14, actividadesEntregadas: 2, decimasGanadas: 0.3, notaProyectada: 6.2, estadoRiesgo: "Bajo" },
  { nombre: "Víctor", asistenciaPct: 0, consultasAgente: 9, actividadesEntregadas: 2, decimasGanadas: 0.3, notaProyectada: 5.9, estadoRiesgo: "Bajo" },
  { nombre: "Laura", asistenciaPct: 0, consultasAgente: 16, actividadesEntregadas: 2, decimasGanadas: 0.3, notaProyectada: 6.5, estadoRiesgo: "Bajo" },
  { nombre: "Francisco", asistenciaPct: 0, consultasAgente: 7, actividadesEntregadas: 1, decimasGanadas: 0.3, notaProyectada: 5.3, estadoRiesgo: "Bajo" },
  { nombre: "Camila", asistenciaPct: 0, consultasAgente: 2, actividadesEntregadas: 0, decimasGanadas: 0.0, notaProyectada: 4.1, estadoRiesgo: "Crítico" },
  { nombre: "Martín", asistenciaPct: 0, consultasAgente: 5, actividadesEntregadas: 1, decimasGanadas: 0.2, notaProyectada: 4.6, estadoRiesgo: "Medio" },
  { nombre: "Sebastián", asistenciaPct: 0, consultasAgente: 8, actividadesEntregadas: 2, decimasGanadas: 0.3, notaProyectada: 5.5, estadoRiesgo: "Bajo" },
];

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
            onClick={() => setMetricTab("generales")}
            className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold transition-all ${
              metricTab === "generales"
                ? "bg-[#2D3B45] text-white shadow-sm"
                : "bg-white text-[#2D3B45] border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Métricas Generales del Curso
          </button>
          <button
            onClick={() => setMetricTab("alumnos")}
            className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold transition-all ${
              metricTab === "alumnos"
                ? "bg-[#2D3B45] text-white shadow-sm"
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
          {/* Tarjetas KPI Superiores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-canvas-card">
              <span className="text-[11px] text-[#6B7780] font-bold uppercase block">Asistencia Promedio</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-extrabold text-[#2D3B45]">85.4%</span>
                <span className="text-xs text-emerald-700 font-semibold">+4.2% vs 2025</span>
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">Meta institucional UDP: &gt; 75%</span>
            </div>

            <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-canvas-card">
              <span className="text-[11px] text-[#6B7780] font-bold uppercase block">Alumnos en Riesgo RI (&lt; 75%)</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-extrabold text-[#C8102E]">1 Alumno</span>
                <CanvasBadge variant="danger">Alerta Temprana</CanvasBadge>
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">Camila (68% de asistencia)</span>
            </div>

            <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-canvas-card">
              <span className="text-[11px] text-[#6B7780] font-bold uppercase block">Interacción con Agente IA</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-extrabold text-[#008EE2]">61 Dudas</span>
                <span className="text-xs text-blue-700 font-semibold">86% Alumnos</span>
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">Promedio: 8.7 consultas/alumno</span>
            </div>

            <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-canvas-card">
              <span className="text-[11px] text-[#6B7780] font-bold uppercase block">Nota Promedio Proyectada</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-extrabold text-emerald-700">5.5</span>
                <span className="text-xs text-gray-500">Escala 1.0 a 7.0</span>
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">Con +0.3 décimas aplicadas</span>
            </div>
          </div>

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
                  <strong>Alerta de Aprendizaje:</strong> El 42% de las preguntas de los estudiantes al agente tutor se concentraron en <em>"Estimación de esfuerzo con Story Points y Matriz de Riesgos"</em>. Se recomienda dedicar 15 minutos en la próxima cátedra para reforzar este concepto antes del Avance 1.
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
              {mockStudentMetrics.map((s, idx) => (
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
