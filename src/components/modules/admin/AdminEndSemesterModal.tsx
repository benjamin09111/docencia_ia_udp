"use client";

import React, { useState } from "react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import {
  CalendarX,
  CheckCircle2,
  AlertTriangle,
  Database,
  ShieldCheck,
  Brain,
  Clock,
  Layers,
  FileSpreadsheet,
  Trash2,
  RefreshCw,
  ArrowRight,
  X,
  Archive,
  BookOpen,
  Sparkles,
} from "lucide-react";

interface AdminEndSemesterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminEndSemesterModal: React.FC<AdminEndSemesterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [modalTab, setModalTab] = useState<"limpieza" | "retencion" | "mejora">("limpieza");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Opciones de automatización seleccionables
  const [archiveCourses, setArchiveCourses] = useState(true);
  const [purgeEphemeralCache, setPurgeEphemeralCache] = useState(true);
  const [transferAgentMemory, setTransferAgentMemory] = useState(true);
  const [notifyTeachers, setNotifyTeachers] = useState(true);
  const [exportConsolidatedReport, setExportConsolidatedReport] = useState(true);

  if (!isOpen) return null;

  const handleExecuteEndSemester = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);
    }, 1800);
  };

  const handleReset = () => {
    setIsCompleted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-[#E0E3E6] rounded-[6px] shadow-2xl max-w-3xl w-full p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-start border-b border-gray-200 pb-3">
          <div className="flex items-start gap-2.5">
            <div className="p-2 bg-red-50 text-[#C8102E] rounded border border-red-200 shrink-0 mt-0.5">
              <CalendarX size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-[#2D3B45]">
                  Protocolo Institucional: Terminar Semestre (2026-1)
                </h3>
                <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded border border-red-200">
                  Gobernanza UDP
                </span>
                <span className="text-[10px] bg-blue-100 text-[#008EE2] font-bold px-2 py-0.5 rounded border border-blue-200">
                  Transición 2026-2
                </span>
              </div>
              <p className="text-xs text-[#6B7780] mt-0.5">
                Automatización de limpieza de datos, políticas de retención y síntesis de mejora continua para el siguiente ciclo.
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

        {/* Notificación de Ejecución Exitosa */}
        {isCompleted ? (
          <div className="space-y-4 py-2">
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-[4px] space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span>¡Cierre Semestral 2026-1 Ejecutado Exitosamente!</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                El ecosistema académico ha completado el protocolo automatizado:
              </p>
              <ul className="text-xs space-y-1 text-emerald-900 list-disc list-inside">
                <li><strong>3 cursos oficiales</strong> archivados en estado Solo Lectura en Canvas.</li>
                <li><strong>5 actas oficiales</strong> consolidadas en bóveda digital segura (retención legal 5 años).</li>
                <li><strong>Memoria semántica y preguntas frecuentes</strong> transferidas al agente de inducción 2026-2.</li>
                <li>Salas y bloques horarios liberados para el proceso de inscripción del segundo semestre.</li>
              </ul>
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <CanvasButton variant="primary-canvas" size="sm" onClick={handleReset}>
                Entendido y Finalizar
              </CanvasButton>
            </div>
          </div>
        ) : (
          <>
            {/* Banner de Concepto y Automatización */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-[4px] text-xs text-amber-900 flex items-start gap-2.5">
              <AlertTriangle size={16} className="text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-amber-950 font-bold">
                  Automatización del Ciclo de Vida Académico
                </strong>
                <span className="text-[11px] text-amber-800 block mt-0.5 leading-relaxed">
                  Para no acumular desorden semestre a semestre, este proceso define qué datos se purgan de inmediato, cuáles se resguardan legalmente en frío y cómo consolidamos la experiencia de los agentes para arrancar el próximo semestre con un estándar superior.
                </span>
              </div>
            </div>

            {/* Sub-tabs del Protocolo */}
            <div className="flex gap-2 border-b border-gray-200 pb-1 text-xs">
              <button
                type="button"
                onClick={() => setModalTab("limpieza")}
                className={`px-3 py-1.5 font-bold rounded-t-[3px] border-b-2 transition-all ${
                  modalTab === "limpieza"
                    ? "border-[#C8102E] text-[#C8102E] bg-red-50/60"
                    : "border-transparent text-[#6B7780] hover:text-[#2D3B45]"
                }`}
              >
                1. Limpieza y Cursos
              </button>
              <button
                type="button"
                onClick={() => setModalTab("retencion")}
                className={`px-3 py-1.5 font-bold rounded-t-[3px] border-b-2 transition-all ${
                  modalTab === "retencion"
                    ? "border-[#C8102E] text-[#C8102E] bg-red-50/60"
                    : "border-transparent text-[#6B7780] hover:text-[#2D3B45]"
                }`}
              >
                2. Política de Retención (Qué y Cuánto)
              </button>
              <button
                type="button"
                onClick={() => setModalTab("mejora")}
                className={`px-3 py-1.5 font-bold rounded-t-[3px] border-b-2 transition-all ${
                  modalTab === "mejora"
                    ? "border-[#C8102E] text-[#C8102E] bg-red-50/60"
                    : "border-transparent text-[#6B7780] hover:text-[#2D3B45]"
                }`}
              >
                3. Síntesis para el Próximo Semestre
              </button>
            </div>

            {/* CONTENIDO TAB 1: Limpieza y Cursos */}
            {modalTab === "limpieza" && (
              <div className="space-y-3 text-xs">
                <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                  Acciones Automatizadas de Fin de Periodo
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-gray-800">
                      <Archive size={14} className="text-[#008EE2]" />
                      <span>Archivado de Cursos Canvas</span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-normal">
                      Los cursos activos (CIT3203, CIT2206, CIT3100) pasan a modo archivo. Los alumnos conservan acceso de solo lectura y se bloquea la modificación de notas.
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 border border-gray-200 rounded space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-gray-800">
                      <Trash2 size={14} className="text-red-600" />
                      <span>Purga de Caché Efímera</span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-normal">
                      Eliminación de borradores de rúbricas no publicadas, tokens de sesión transitorios y logs de terminal para liberar almacenamiento en base de datos.
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 border border-gray-200 rounded space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-gray-800">
                      <RefreshCw size={14} className="text-purple-600" />
                      <span>Liberación de Horarios y Salas</span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-normal">
                      Los bloques de cátedra y laboratorios quedan desasignados en el catálogo central para coordinar el nuevo plan de salas del semestre 2026-2.
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 border border-gray-200 rounded space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-gray-800">
                      <Brain size={14} className="text-amber-600" />
                      <span>Desvinculación de Agentes de Sección</span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-normal">
                      Los bots tutores dejan de atender consultas activas de alumnos y sincronizan sus métricas al repositorio institucional.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CONTENIDO TAB 2: Política de Retención */}
            {modalTab === "retencion" && (
              <div className="space-y-3 text-xs">
                <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                  Matriz de Gobernanza y Plazos de Conservación UDP
                </span>

                <div className="overflow-x-auto border border-gray-200 rounded">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-gray-100 text-gray-700 font-bold border-b border-gray-200 text-[11px] uppercase">
                      <tr>
                        <th className="p-2.5">Tipo de Información</th>
                        <th className="p-2.5">Destino / Tratamiento</th>
                        <th className="p-2.5">Plazo de Retención</th>
                        <th className="p-2.5 text-center">Fundamento</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="p-2.5 font-semibold text-gray-900 flex items-center gap-1.5">
                          <FileSpreadsheet size={13} className="text-emerald-600" />
                          Actas y Planillas Excel
                        </td>
                        <td className="p-2.5 text-gray-600">Bóveda digital inmutable (PDF/XLSX con firma)</td>
                        <td className="p-2.5 font-bold text-[#C8102E]">5 años</td>
                        <td className="p-2.5 text-center text-[10px] text-gray-500">Reglamento UDP / Ley 21.091</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold text-gray-900 flex items-center gap-1.5">
                          <ShieldCheck size={13} className="text-blue-600" />
                          Identidad Nominal de Alumnos
                        </td>
                        <td className="p-2.5 text-gray-600">Disociación tras cierre; solo persiste RUT anonimizado</td>
                        <td className="p-2.5 font-bold text-gray-700">90 días</td>
                        <td className="p-2.5 text-center text-[10px] text-gray-500">Ley N° 19.628 (Privacidad)</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold text-gray-900 flex items-center gap-1.5">
                          <Brain size={13} className="text-purple-600" />
                          Chats e Interacciones con IA
                        </td>
                        <td className="p-2.5 text-gray-600">Eliminación de prompts crudos; extracción de tópicos</td>
                        <td className="p-2.5 font-bold text-gray-700">1 año</td>
                        <td className="p-2.5 text-center text-[10px] text-gray-500">Mejora Continua CREA</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold text-gray-900 flex items-center gap-1.5">
                          <Layers size={13} className="text-amber-600" />
                          Entregables y Rúbricas
                        </td>
                        <td className="p-2.5 text-gray-600">Almacenamiento comprimido para apelaciones</td>
                        <td className="p-2.5 font-bold text-gray-700">2 semestres</td>
                        <td className="p-2.5 text-center text-[10px] text-gray-500">Auditoría CNA</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CONTENIDO TAB 3: Síntesis para el Próximo Semestre */}
            {modalTab === "mejora" && (
              <div className="space-y-3 text-xs">
                <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                  Herencia Pedagógica para el Siguiente Ciclo (2026-2)
                </span>

                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded text-blue-900 space-y-1">
                    <strong className="block text-blue-950 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-[#008EE2]" />
                      1. Transferencia Automática de Preguntas Frecuentes
                    </strong>
                    <p className="text-[11px] text-blue-900 leading-relaxed">
                      Las 61 consultas estudiantiles resueltas este semestre se incorporan como casos de estudio resueltos en el corpus base del agente 2026-2, evitando que los nuevos alumnos tropiecen con las mismas dudas iniciales.
                    </p>
                  </div>

                  <div className="p-3 bg-purple-50 border border-purple-200 rounded text-purple-900 space-y-1">
                    <strong className="block text-purple-950 flex items-center gap-1.5">
                      <Brain size={14} className="text-purple-700" />
                      2. Calibración Predictiva de Cronogramas
                    </strong>
                    <p className="text-[11px] text-purple-900 leading-relaxed">
                      El sistema propone a los nuevos coordinadores ajustar automáticamente 1 semana la planificación de temas complejos (como Story Points y Gestión de Riesgos) antes de fijar las fechas de solemnes.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Opciones de Selección del Administrador */}
            <div className="space-y-2 border-t border-gray-100 pt-3 text-xs text-gray-700">
              <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                Confirmación de Opciones de Ejecución
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={archiveCourses}
                    onChange={(e) => setArchiveCourses(e.target.checked)}
                    className="rounded text-[#C8102E] focus:ring-[#C8102E]"
                  />
                  <span className="text-[11px]">Archivar cursos y congelar actas</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={purgeEphemeralCache}
                    onChange={(e) => setPurgeEphemeralCache(e.target.checked)}
                    className="rounded text-[#C8102E] focus:ring-[#C8102E]"
                  />
                  <span className="text-[11px]">Purgar caché efímera y borradores</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={transferAgentMemory}
                    onChange={(e) => setTransferAgentMemory(e.target.checked)}
                    className="rounded text-[#C8102E] focus:ring-[#C8102E]"
                  />
                  <span className="text-[11px]">Transferir memoria semántica al 2026-2</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={exportConsolidatedReport}
                    onChange={(e) => setExportConsolidatedReport(e.target.checked)}
                    className="rounded text-[#C8102E] focus:ring-[#C8102E]"
                  />
                  <span className="text-[11px]">Consolidar acta en bóveda legal (5 años)</span>
                </label>
              </div>
            </div>

            {/* Footer con Acciones */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-3 border-t border-gray-200">
              <div className="text-[11px] text-gray-500 flex items-center gap-1.5 self-start sm:self-auto">
                <Clock size={13} className="text-gray-400" />
                <span>Periodo activo: Semestre Otoño 2026</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <CanvasButton variant="outline" size="sm" onClick={onClose}>
                  Cancelar
                </CanvasButton>

                <CanvasButton
                  variant="primary-udp"
                  size="sm"
                  icon={isProcessing ? <RefreshCw size={14} className="animate-spin" /> : <CalendarX size={14} />}
                  onClick={handleExecuteEndSemester}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Procesando Cierre..." : "Ejecutar Cierre de Semestre"}
                </CanvasButton>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
