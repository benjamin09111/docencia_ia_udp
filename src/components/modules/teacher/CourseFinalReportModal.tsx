"use client";

import React, { useState } from "react";
import { CanvasCourse } from "@/types";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import {
  FileText,
  Sparkles,
  Download,
  Send,
  X,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  CalendarCheck,
  Brain,
  Lightbulb,
  CheckSquare,
  Square,
  ShieldCheck,
  Layers,
  Clock,
} from "lucide-react";

interface CourseFinalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  course?: CanvasCourse;
}

export const CourseFinalReportModal: React.FC<CourseFinalReportModalProps> = ({
  isOpen,
  onClose,
  course,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [schoolSentSuccess, setSchoolSentSuccess] = useState(false);

  // Checkboxes de módulos a incluir en el informe
  const [includeStats, setIncludeStats] = useState(true);
  const [includeRaps, setIncludeRaps] = useState(true);
  const [includeAttendance, setIncludeAttendance] = useState(true);
  const [includeAiQueries, setIncludeAiQueries] = useState(true);
  const [includeImprovementPlan, setIncludeImprovementPlan] = useState(true);

  if (!isOpen) return null;

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handleSendSchool = () => {
    setSchoolSentSuccess(true);
    setTimeout(() => setSchoolSentSuccess(false), 5000);
  };

  const courseCode = course?.code || "CIT3000";
  const courseName = course?.name || "Proyecto de Innovación y Emprendimiento";

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-[#E0E3E6] rounded-[6px] shadow-2xl max-w-3xl w-full p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-start border-b border-gray-200 pb-3">
          <div className="flex items-start gap-2.5">
            <div className="p-2 bg-blue-50 text-[#008EE2] rounded border border-blue-200 shrink-0 mt-0.5">
              <FileText size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-[#2D3B45]">
                  Informe Final Consolidado del Curso
                </h3>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded border border-blue-200">
                  Cierre Semestral UDP
                </span>
                <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded border border-purple-200 flex items-center gap-1">
                  <Sparkles size={11} />
                  Analítica Multidimensional
                </span>
              </div>
              <p className="text-xs text-[#6B7780] mt-0.5">
                {courseCode} — {courseName} • Docente a cargo: <strong>Jorge Esteban Cruz León</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded"
          >
            <X size={18} />
          </button>
        </div>

        {/* Notificaciones de Acción */}
        {downloadSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>
              <strong>Dossier generado:</strong> Se ha descargado el informe ejecutivo completo en formato PDF oficial UDP con gráficos y plan de acción.
            </span>
          </div>
        )}

        {schoolSentSuccess && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-900 text-xs rounded flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={16} className="text-[#C8102E] shrink-0" />
            <span>
              <strong>Envío Formal Completado:</strong> Copia oficial radicada en la Secretaría de Estudios y Dirección de Escuela de Informática.
            </span>
          </div>
        )}

        {/* Propósito del Informe y Toma de Decisiones */}
        <div className="p-3.5 bg-[#F0F8FF] border border-[#B3E5FC] rounded-[4px] text-xs text-[#0277BD] space-y-1">
          <div className="flex items-center gap-2 font-bold text-[#01579B]">
            <Brain size={15} />
            <span>Propósito y Toma de Decisiones Curriculares</span>
          </div>
          <p className="text-[11px] leading-relaxed text-[#0277BD]">
            Este informe consolida de forma automática la evidencia de <strong>todas las pestañas y fuentes del curso</strong> durante este semestre (calificaciones finales anonimizadas, asistencia y riesgo RI, efectividad de décimas en ayudantía, cobertura de solemnes, interacciones con el agente tutor y cronograma ejecutado). Permite al equipo docente y a la Escuela tomar decisiones informadas para el siguiente ciclo académico.
          </p>
        </div>

        {/* Fuentes de Datos Consolidadas */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
            1. Fuentes de Datos Semestrales Integradas
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-2.5 bg-gray-50 border border-gray-200 rounded">
              <div className="flex items-center gap-1.5 font-bold text-gray-800">
                <BarChart3 size={14} className="text-emerald-600" />
                <span>Excel Final y Calificaciones</span>
              </div>
              <p className="text-[11px] text-gray-600 mt-1">
                Promedio general: <strong>5.5</strong> • Aprobación: <strong>85.7%</strong> • Solemne 1: 5.2 • Solemne 2: 5.6 • Entregable Final: 5.8.
              </p>
            </div>

            <div className="p-2.5 bg-gray-50 border border-gray-200 rounded">
              <div className="flex items-center gap-1.5 font-bold text-gray-800">
                <CalendarCheck size={14} className="text-blue-600" />
                <span>Asistencia y Riesgo RI</span>
              </div>
              <p className="text-[11px] text-gray-600 mt-1">
                Asistencia promedio: <strong>85.4%</strong> (+4.2% vs 2025). 1 alumno en alerta de riesgo RI (&lt;75%). 92% de correlación entre asistencia y aprobación.
              </p>
            </div>

            <div className="p-2.5 bg-gray-50 border border-gray-200 rounded">
              <div className="flex items-center gap-1.5 font-bold text-gray-800">
                <Sparkles size={14} className="text-purple-600" />
                <span>Actividades Extra y Décimas</span>
              </div>
              <p className="text-[11px] text-gray-600 mt-1">
                Participación del <strong>86%</strong> en desafíos cortos. Aporte promedio de <strong>+0.3 décimas</strong>, mejorando la motivación en ayudantía.
              </p>
            </div>

            <div className="p-2.5 bg-gray-50 border border-gray-200 rounded">
              <div className="flex items-center gap-1.5 font-bold text-gray-800">
                <Brain size={14} className="text-amber-600" />
                <span>Interacciones con Agente IA</span>
              </div>
              <p className="text-[11px] text-gray-600 mt-1">
                <strong>61 consultas resueltas</strong>. Tópico más recurrente: <em>"Estimación Story Points y Matriz de Riesgos"</em> (42% de dudas).
              </p>
            </div>
          </div>
        </div>

        {/* Recomendaciones Clave y Decisiones para el Próximo Semestre */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
            2. Decisiones Sugeridas por el Agente Docente para el Próximo Semestre
          </span>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded flex items-start gap-2">
              <Lightbulb size={16} className="text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-900 block">
                  Ajuste Curricular en Cronograma de Sesiones:
                </strong>
                <span className="text-[11px] text-amber-800 leading-tight block mt-0.5">
                  Adelantar en 1 semana la sesión de estimación de proyectos y Story Points previa a la Solemne 1, para absorber las dudas antes del hito evaluativo.
                </span>
              </div>
            </div>

            <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-900 block">
                  Validación del Esquema de Décimas en Ayudantía:
                </strong>
                <span className="text-[11px] text-emerald-800 leading-tight block mt-0.5">
                  La entrega de actividades formativas con tope de +0.3 décimas elevó la concurrencia a ayudantías en un 28%. Se recomienda mantener la política para 2026-2.
                </span>
              </div>
            </div>

            <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded flex items-start gap-2">
              <ShieldCheck size={16} className="text-blue-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-blue-900 block">
                  Rúbricas Oficiales y Transparencia en Apelaciones:
                </strong>
                <span className="text-[11px] text-blue-800 leading-tight block mt-0.5">
                  Las pautas estructuradas y el canal de apelaciones redujeron en un 65% las controversias de corrección manual.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Personalización de Secciones a Exportar */}
        <div className="space-y-2 border-t border-gray-100 pt-3">
          <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
            3. Secciones Seleccionadas para el Dossier
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeStats}
                onChange={(e) => setIncludeStats(e.target.checked)}
                className="rounded text-[#008EE2] focus:ring-[#008EE2]"
              />
              <span className="text-[11px]">Resumen Ejecutivo y Distribución de Notas</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeRaps}
                onChange={(e) => setIncludeRaps(e.target.checked)}
                className="rounded text-[#008EE2] focus:ring-[#008EE2]"
              />
              <span className="text-[11px]">Evaluación de RAPs (Perfil de Egreso UDP)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeAttendance}
                onChange={(e) => setIncludeAttendance(e.target.checked)}
                className="rounded text-[#008EE2] focus:ring-[#008EE2]"
              />
              <span className="text-[11px]">Reporte de Asistencia y Alerta Temprana RI</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeAiQueries}
                onChange={(e) => setIncludeAiQueries(e.target.checked)}
                className="rounded text-[#008EE2] focus:ring-[#008EE2]"
              />
              <span className="text-[11px]">Registro de Consultas Pedagógicas a IA</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeImprovementPlan}
                onChange={(e) => setIncludeImprovementPlan(e.target.checked)}
                className="rounded text-[#008EE2] focus:ring-[#008EE2]"
              />
              <span className="text-[11px]">Plan de Acción y Recomendaciones 2026-2</span>
            </label>
          </div>
        </div>

        {/* Footer con Acciones */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-3 border-t border-gray-200">
          <div className="text-[11px] text-gray-500 flex items-center gap-1.5 self-start sm:self-auto">
            <Clock size={13} className="text-gray-400" />
            <span>Documento generado con datos al día de hoy</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <CanvasButton
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Cerrar
            </CanvasButton>

            <CanvasButton
              variant="primary-canvas"
              size="sm"
              icon={<Download size={14} />}
              onClick={handleDownload}
            >
              Descargar Informe (PDF)
            </CanvasButton>

            <CanvasButton
              variant="primary-udp"
              size="sm"
              icon={<Send size={14} />}
              onClick={handleSendSchool}
              title="Enviar copia formal a la Dirección de Escuela"
            >
              Enviar a la Escuela
            </CanvasButton>
          </div>
        </div>
      </div>
    </div>
  );
};
