"use client";

import React, { useState } from "react";
import { CourseDeliverable, StudentSubmission } from "@/types";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import {
  CanvasTable,
  CanvasTableHeader,
  CanvasTableRow,
  CanvasTableCell,
} from "@/components/canvas/CanvasTable";
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  Eye,
  AlertCircle,
  Send,
  Bot,
  Sparkles,
  Quote,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

interface StudentActivitiesTabProps {
  entregables: CourseDeliverable[];
  entregasAlumnos: StudentSubmission[];
  onSubmitActivity: (deliverableId: string, solutionText: string) => void;
  onSendAppeal: (submissionId: string, appealText: string) => void;
}

export const StudentActivitiesTab: React.FC<StudentActivitiesTabProps> = ({
  entregables,
  entregasAlumnos,
  onSubmitActivity,
  onSendAppeal,
}) => {
  const actividades = entregables.filter((e) => e.tipo === "actividad_ayudantia");
  const [selectedActivityId, setSelectedActivityId] = useState<string>(
    actividades[0]?.id || "act_1"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [appealInput, setAppealInput] = useState("");
  const [appealSuccess, setAppealSuccess] = useState(false);

  // Chat con el agente de la actividad seleccionada
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "agent"; text: string }>>([
    {
      sender: "agent",
      text: "¡Hola Benjamín! Soy el Agente de la Actividad. Conozco las reglas de esta dinámica, la rúbrica con la que serás evaluado y los estándares PMBOK requeridos. ¿En qué duda puedo orientarte antes de tu entrega?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  const selectedActivity = actividades.find((a) => a.id === selectedActivityId) || actividades[0];
  const userSubmission = entregasAlumnos.find((s) => s.deliverable_id === selectedActivity?.id);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const query = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: query }]);
    setChatInput("");

    setTimeout(() => {
      let reply =
        "Para obtener el puntaje completo según la rúbrica, asegúrate de justificar tu propuesta con métricas cuantificables y mencionar al menos un plan de contingencia formal.";
      const lower = query.toLowerCase();
      if (lower.includes("puntos") || lower.includes("rubrica") || lower.includes("criterio")) {
        reply =
          "La rúbrica asigna 50 pts a la justificación técnica de trade-offs de arquitectura y 50 pts a la aplicación de la matriz de riesgos PMBOK. No olvides redactar la mitigación de fallos.";
      } else if (lower.includes("plazo") || lower.includes("fecha")) {
        reply = `El plazo vence el ${selectedActivity?.fecha_limite || "18 de octubre"} a las 23:59 hrs.`;
      }
      setChatMessages((prev) => [...prev, { sender: "agent", text: reply }]);
    }, 700);
  };

  // Entrega rápida de mock con auto-corrección inmediata
  const handleQuickSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const mockSolution =
        "Solución oficial del Grupo 1 (Benjamín Morales): Para la crisis de presupuesto del mandante, aplicamos la matriz de riesgos PMBOK categorizando el retraso con severidad Alta. Reducimos el alcance de los módulos secundarios (reportes avanzados) priorizando la arquitectura base transaccional con RTO de 1.8 segundos y RPO=0. Se acordó con el mandante adelantar la versión MVP sin comprometer la seguridad ni el testing automatizado.";
      onSubmitActivity(selectedActivity.id, mockSolution);
      setIsSubmitting(false);
    }, 1200);
  };

  const handleConfirmAppeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealInput.trim() || !userSubmission) return;

    onSendAppeal(userSubmission.id, appealInput);
    setAppealSuccess(true);
    setTimeout(() => {
      setAppealSuccess(false);
      setShowAppealModal(false);
      setAppealInput("");
    }, 1500);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* 1. Tabla Oficial de Actividades */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-sm font-bold text-[#2D3B45]">
              Actividades Dinámicas y Talleres Prácticos del Curso
            </h2>
            <p className="text-xs text-[#6B7780] mt-0.5">
              Haz clic en cualquier actividad para revisar sus instrucciones, consultar al agente o entregar tu solución.
            </p>
          </div>
          <span className="text-xs text-[#008EE2] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded font-semibold">
            {actividades.length} Actividades Disponibles
          </span>
        </div>

        <CanvasTable>
          <CanvasTableHeader>
            <tr>
              <th className="p-3">Nombre de la Actividad</th>
              <th className="p-3 text-center">Incentivo</th>
              <th className="p-3 text-center">Fecha Límite</th>
              <th className="p-3 text-center">Estado Entrega</th>
              <th className="p-3 text-right">Acción</th>
            </tr>
          </CanvasTableHeader>
          <tbody>
            {actividades.map((act) => {
              const isSelected = selectedActivity?.id === act.id;
              const sub = entregasAlumnos.find((s) => s.deliverable_id === act.id);

              return (
                <CanvasTableRow
                  key={act.id}
                  onClick={() => setSelectedActivityId(act.id)}
                  className={isSelected ? "bg-blue-50/40" : ""}
                >
                  <CanvasTableCell>
                    <div>
                      <strong className="text-xs text-[#2D3B45] block hover:text-[#008EE2] transition-colors">
                        {act.titulo}
                      </strong>
                      <span className="text-[11px] text-[#6B7780] line-clamp-1">{act.descripcion}</span>
                    </div>
                  </CanvasTableCell>

                  <CanvasTableCell align="center">
                    <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                      {act.ponderacion_o_decimas}
                    </span>
                  </CanvasTableCell>

                  <CanvasTableCell align="center">
                    <span className="text-xs text-[#55636E]">{act.fecha_limite}</span>
                  </CanvasTableCell>

                  <CanvasTableCell align="center">
                    {sub ? (
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded flex items-center justify-center gap-1">
                        <CheckCircle2 size={12} /> Revisado ({sub.decimas_sugeridas ? `+${sub.decimas_sugeridas} décimas` : sub.nota_sugerida})
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded flex items-center justify-center gap-1">
                        <Clock size={12} /> Pendiente de Entrega
                      </span>
                    )}
                  </CanvasTableCell>

                  <CanvasTableCell align="right">
                    <button
                      onClick={() => setSelectedActivityId(act.id)}
                      className={`text-xs px-2.5 py-1 rounded font-semibold border transition-all ${
                        isSelected
                          ? "bg-[#008EE2] text-white border-[#0077BE]"
                          : "bg-white text-[#2D3B45] border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {isSelected ? "Seleccionada" : "Ver Detalle"}
                    </button>
                  </CanvasTableCell>
                </CanvasTableRow>
              );
            })}
          </tbody>
        </CanvasTable>
      </div>

      {/* 2. Workspace de la Actividad Seleccionada */}
      {selectedActivity && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Panel Izquierdo: Detalle, Entrega y Calificación Inmediata (7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card space-y-4">
            <div className="flex justify-between items-start border-b border-gray-200 pb-3">
              <div>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded uppercase">
                  Taller de Ayudantía Seleccionado
                </span>
                <h3 className="text-base font-bold text-[#2D3B45] mt-1">{selectedActivity.titulo}</h3>
              </div>
              <span className="text-xs font-bold text-purple-900 bg-purple-100 px-2.5 py-1 rounded">
                Incentivo: {selectedActivity.ponderacion_o_decimas}
              </span>
            </div>

            <p className="text-xs text-gray-700 leading-relaxed bg-[#F9FAFB] p-3 rounded border border-gray-200">
              {selectedActivity.descripcion}
            </p>

            {/* Rúbrica con la que se evalúa */}
            <div>
              <span className="text-xs font-bold text-[#2D3B45] block mb-1.5">
                Rúbrica con la que el Agente Corrector evalúa tu entrega:
              </span>
              <div className="space-y-1.5">
                {selectedActivity.rubrica.map((r) => (
                  <div key={r.id} className="p-2.5 rounded border border-gray-200 text-xs bg-white flex justify-between items-center">
                    <div>
                      <strong className="text-[#2D3B45]">• {r.descripcion}</strong>
                      <p className="text-[11px] text-[#6B7780]">{r.indicadores[0]?.detalle}</p>
                    </div>
                    <span className="font-bold text-[#008EE2] ml-2 shrink-0">{r.puntaje_max} pts</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Estado de Entrega / Botón de Mock Subir PDF */}
            <div className="pt-2 border-t border-gray-200">
              {userSubmission ? (
                <div className="p-4 bg-emerald-50/70 border border-emerald-300 rounded-[4px] space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-900 bg-emerald-200 px-2 py-0.5 rounded uppercase">
                        Entrega Procesada
                      </span>
                      <h4 className="text-xs font-bold text-emerald-950 mt-1">
                        Archivo: {userSubmission.archivo_nombre}
                      </h4>
                      <span className="text-[11px] text-emerald-800">
                        Entregado el: {userSubmission.fecha_entrega}
                      </span>
                    </div>

                    {/* Badge Mandatorio */}
                    <div className="text-right">
                      <span className="px-2.5 py-1 bg-white border border-emerald-400 text-emerald-800 rounded text-xs font-bold shadow-xs block">
                        Revisado automáticamente según la rúbrica
                      </span>
                      <span className="text-xs font-extrabold text-purple-900 mt-1 block">
                        Calificación: +{userSubmission.decimas_sugeridas || 0.3} décimas acreditadas
                      </span>
                    </div>
                  </div>

                  {/* Alerta de Apelación si existe */}
                  {userSubmission.apelacion && (
                    <div className="p-2.5 bg-amber-50 border border-amber-300 rounded text-xs text-amber-900 space-y-0.5">
                      <strong className="flex items-center gap-1">
                        <AlertCircle size={13} /> Apelación Enviada al Docente:
                      </strong>
                      <p className="text-[11px] text-amber-800 italic">
                        &quot;{userSubmission.apelacion.motivo}&quot;
                      </p>
                      <span className="text-[10px] text-amber-700 block font-bold">
                        Estado: {userSubmission.apelacion.estado === "pendiente" ? "Pendiente de revisión docente" : userSubmission.apelacion.estado}
                      </span>
                    </div>
                  )}

                  {/* Botones de Ver Revisión y Apelar */}
                  <div className="flex justify-end gap-2 pt-1 border-t border-emerald-200">
                    {!userSubmission.apelacion && (
                      <CanvasButton
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAppealModal(true)}
                        icon={<ShieldAlert size={13} className="text-amber-600" />}
                      >
                        Apelar Calificación
                      </CanvasButton>
                    )}
                    <CanvasButton
                      variant="primary-canvas"
                      size="sm"
                      onClick={() => setShowReviewModal(true)}
                      icon={<Eye size={13} />}
                    >
                      Ver Revisión Detallada con Citas
                    </CanvasButton>
                  </div>
                </div>
              ) : (
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-[4px] text-center space-y-3 bg-[#FAFBFD]">
                  <Upload size={24} className="mx-auto text-gray-400" />
                  <div>
                    <h4 className="text-xs font-bold text-[#2D3B45]">Subir Solución del Taller (PDF o Documento)</h4>
                    <p className="text-[11px] text-[#6B7780] mt-0.5">
                      Para la demo: presiona &quot;Entregar Solución (Mock)&quot; para simular la entrega y obtener revisión instantánea.
                    </p>
                  </div>

                  <CanvasButton
                    variant="primary-udp"
                    size="md"
                    onClick={handleQuickSubmit}
                    disabled={isSubmitting}
                    icon={<Send size={13} />}
                  >
                    {isSubmitting ? "Agente Corrector Evaluando Rúbrica..." : "Entregar Solución (Mock con Corrección Inmediata)"}
                  </CanvasButton>
                </div>
              )}
            </div>
          </div>

          {/* Panel Derecho: Chat con el Agente de la Actividad (5 Cols) */}
          <div className="lg:col-span-5 bg-white border border-[#E0E3E6] rounded-[4px] shadow-canvas-card flex flex-col h-[520px]">
            <div className="p-3.5 border-b border-gray-200 bg-[#F9FAFB] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
                  <Bot size={15} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#2D3B45]">Tutor de la Actividad</h3>
                  <span className="text-[10px] text-emerald-700 font-medium">● Te guía en los criterios de entrega</span>
                </div>
              </div>
              <span className="text-[10px] bg-purple-100 text-purple-900 px-1.5 py-0.5 rounded font-bold">
                Ayuda IA
              </span>
            </div>

            {/* Mensajes del chat */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
              {chatMessages.map((m, idx) => (
                <div key={idx} className={`flex gap-2 ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                  {m.sender === "agent" && (
                    <div className="w-5 h-5 rounded-full bg-purple-50 text-purple-800 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                      IA
                    </div>
                  )}
                  <div
                    className={`p-2.5 rounded-[6px] max-w-[85%] leading-relaxed ${
                      m.sender === "user" ? "bg-[#008EE2] text-white" : "bg-gray-100 text-[#2D3B45] border border-gray-200"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Sugerencias Rápidas */}
            <div className="p-2 border-t border-gray-200 bg-gray-50 flex flex-wrap gap-1 text-[11px]">
              <button
                onClick={() => setChatInput("¿Qué criterios exige la rúbrica para obtener el puntaje máximo?")}
                className="bg-white border border-gray-300 hover:bg-purple-50 px-2 py-0.5 rounded text-[#2D3B45]"
              >
                📝 Criterios de la Rúbrica
              </button>
              <button
                onClick={() => setChatInput("¿Cómo justifico la matriz de riesgos en este caso?")}
                className="bg-white border border-gray-300 hover:bg-purple-50 px-2 py-0.5 rounded text-[#2D3B45]"
              >
                🛡️ Matriz de Riesgos
              </button>
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 flex gap-2 bg-white">
              <input
                type="text"
                placeholder="Pregúntale al tutor sobre la actividad..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 text-xs border border-gray-300 rounded-[4px] px-2.5 py-1.5 focus:ring-1 focus:ring-[#008EE2]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#2D3B45] hover:bg-[#1E272E] text-white rounded-[4px] text-xs font-semibold"
              >
                <Send size={12} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ver Revisión Detallada con Citas */}
      {showReviewModal && userSubmission && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[6px] max-w-2xl w-full p-6 shadow-xl border border-gray-200 space-y-4 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Revisado automáticamente según la rúbrica
                </span>
                <h3 className="text-base font-bold text-[#2D3B45] mt-1">
                  Dictamen de Evaluación: {userSubmission.archivo_nombre}
                </h3>
              </div>
              <button onClick={() => setShowReviewModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">
                ✕
              </button>
            </div>

            <div className="p-3 bg-[#F9FAFB] rounded border border-gray-200 text-xs text-gray-700 leading-relaxed">
              <strong>Resumen General del Agente Corrector:</strong> {userSubmission.feedback_ia.resumen}
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-[#2D3B45] block">
                Desglose Objetivo por Criterios de la Rúbrica:
              </span>
              {userSubmission.feedback_ia.criterios_evaluados.map((c, i) => (
                <div key={i} className="p-3 border border-gray-200 rounded text-xs space-y-2 bg-white">
                  <div className="flex justify-between items-center font-bold text-[#2D3B45]">
                    <span>• {c.criterio}</span>
                    <span className="text-[#008EE2] bg-blue-50 px-2 py-0.5 rounded">
                      {c.puntaje_obtenido} / {c.puntaje_max} pts
                    </span>
                  </div>
                  <div className="bg-blue-50/50 p-2.5 rounded border border-blue-200 text-[11.5px] text-[#0277BD] space-y-1">
                    <span className="font-bold flex items-center gap-1">
                      <Quote size={12} /> Cita Textual de tu Solución:
                    </span>
                    <p className="italic font-serif text-[#01579B]">&quot;{c.cita_textual}&quot;</p>
                  </div>
                  <p className="text-[11px] text-[#55636E]">
                    <strong>Comentario Técnico:</strong> {c.comentario}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-xs font-bold text-purple-900">
                Incentivo Final Acreditado: +{userSubmission.decimas_sugeridas || 0.3} décimas
              </span>
              <CanvasButton variant="outline" size="sm" onClick={() => setShowReviewModal(false)}>
                Cerrar
              </CanvasButton>
            </div>
          </div>
        </div>
      )}

      {/* Modal / Panel de Apelación */}
      {showAppealModal && userSubmission && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[6px] max-w-lg w-full p-6 shadow-xl border border-gray-200 space-y-4 animate-scaleUp">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-[#2D3B45]">Solicitud de Apelación al Docente</h3>
                <p className="text-xs text-[#6B7780] mt-0.5">
                  Si consideras que un criterio fue calificado con demasiado rigor, argumenta tu defensa.
                </p>
              </div>
              <button onClick={() => setShowAppealModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmAppeal} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#2D3B45]">Fundamentación de tu Apelación</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explica qué criterio deseas que el docente revise y por qué tu solución cumple con el estándar..."
                  value={appealInput}
                  onChange={(e) => setAppealInput(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded-[4px] p-2.5 focus:ring-1 focus:ring-[#008EE2]"
                />
              </div>

              {appealSuccess && (
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> ¡Apelación enviada! El profesor la verá en su panel de actividades.
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t">
                <CanvasButton variant="outline" size="sm" onClick={() => setShowAppealModal(false)}>
                  Cancelar
                </CanvasButton>
                <CanvasButton variant="primary-udp" size="sm" type="submit" disabled={appealSuccess}>
                  Enviar Apelación al Docente
                </CanvasButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
