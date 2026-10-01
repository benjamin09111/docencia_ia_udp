"use client";

import React, { useState } from "react";
import { CourseFrontPageData } from "@/services/courseFrontPageService";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { Plus, Trash2, User, Clock, AlertCircle, Calendar, Sparkles } from "lucide-react";

interface CourseHomePageEditorProps {
  data: CourseFrontPageData;
  onChange: (updated: CourseFrontPageData) => void;
}

export const CourseHomePageEditor: React.FC<CourseHomePageEditorProps> = ({
  data,
  onChange,
}) => {
  const [subTab, setSubTab] = useState<"general" | "docentes" | "asistencia" | "evaluacion" | "cronograma" | "ia">("general");

  const handleUpdate = <K extends keyof CourseFrontPageData>(field: K, value: CourseFrontPageData[K]) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card space-y-4">
      {/* Sub-tabs del editor estructurado */}
      <div className="flex gap-2 border-b border-gray-200 pb-2 text-xs font-semibold overflow-x-auto no-scrollbar">
        <button
          onClick={() => setSubTab("general")}
          className={`px-3 py-1.5 rounded-[3px] transition-colors ${
            subTab === "general"
              ? "bg-[#2D3B45] text-white"
              : "text-[#55636E] hover:bg-gray-100"
          }`}
        >
          Bienvenida y Resumen
        </button>
        <button
          onClick={() => setSubTab("docentes")}
          className={`px-3 py-1.5 rounded-[3px] transition-colors ${
            subTab === "docentes"
              ? "bg-[#2D3B45] text-white"
              : "text-[#55636E] hover:bg-gray-100"
          }`}
        >
          Docentes y Ayudantes
        </button>
        <button
          onClick={() => setSubTab("asistencia")}
          className={`px-3 py-1.5 rounded-[3px] transition-colors ${
            subTab === "asistencia"
              ? "bg-[#2D3B45] text-white"
              : "text-[#55636E] hover:bg-gray-100"
          }`}
        >
          Regla de Asistencia
        </button>
        <button
          onClick={() => setSubTab("evaluacion")}
          className={`px-3 py-1.5 rounded-[3px] transition-colors ${
            subTab === "evaluacion"
              ? "bg-[#2D3B45] text-white"
              : "text-[#55636E] hover:bg-gray-100"
          }`}
        >
          Evaluaciones y Fórmula
        </button>
        <button
          onClick={() => setSubTab("cronograma")}
          className={`px-3 py-1.5 rounded-[3px] transition-colors ${
            subTab === "cronograma"
              ? "bg-[#2D3B45] text-white"
              : "text-[#55636E] hover:bg-gray-100"
          }`}
        >
          Cronograma Semanal
        </button>
        <button
          onClick={() => setSubTab("ia")}
          className={`px-3 py-1.5 rounded-[3px] transition-colors ${
            subTab === "ia"
              ? "bg-[#2D3B45] text-white"
              : "text-[#55636E] hover:bg-gray-100"
          }`}
        >
          Política de IA UDP
        </button>
      </div>

      {/* SUB-TAB 1: BIENVENIDA Y GENERAL */}
      {subTab === "general" && (
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#2D3B45] mb-1">
              Título del Curso en Canvas
            </label>
            <input
              type="text"
              value={data.courseName}
              onChange={(e) => handleUpdate("courseName", e.target.value)}
              className="w-full border border-gray-300 rounded-[3px] p-2 text-xs focus:border-[#008EE2] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-bold text-[#2D3B45] mb-1">
              Descripción Ejecutiva de Bienvenida
            </label>
            <textarea
              rows={4}
              value={data.descripcionBienvenida}
              onChange={(e) => handleUpdate("descripcionBienvenida", e.target.value)}
              className="w-full border border-gray-300 rounded-[3px] p-2 text-xs focus:border-[#008EE2] focus:outline-hidden leading-relaxed"
              placeholder="Explica a los estudiantes qué aprenderán sin que tengan que leer el PDF..."
            />
          </div>

          <div>
            <label className="block font-bold text-[#2D3B45] mb-1">
              Resultados de Aprendizaje Principales (RAPs del Programa)
            </label>
            <div className="space-y-2">
              {data.objetivosPrincipales.map((obj, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={obj}
                    onChange={(e) => {
                      const updated = [...data.objetivosPrincipales];
                      updated[i] = e.target.value;
                      handleUpdate("objetivosPrincipales", updated);
                    }}
                    className="flex-1 border border-gray-300 rounded-[3px] p-2 text-xs focus:border-[#008EE2] focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = data.objetivosPrincipales.filter((_, idx) => idx !== i);
                      handleUpdate("objetivosPrincipales", updated);
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                    title="Eliminar RAP"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  handleUpdate("objetivosPrincipales", [
                    ...data.objetivosPrincipales,
                    "Nuevo resultado de aprendizaje...",
                  ])
                }
                className="text-[11px] font-bold text-[#008EE2] hover:underline flex items-center gap-1 mt-1"
              >
                <Plus size={12} /> Agregar RAP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: DOCENTES */}
      {subTab === "docentes" && (
        <div className="space-y-4 text-xs">
          <p className="text-[#6B7780]">
            Ficha de contacto que los alumnos verán inmediatamente en la portada de Canvas para evitar consultas repetitivas de correos o salas:
          </p>

          <div className="space-y-3">
            {data.docentes.map((doc, i) => (
              <div key={i} className="p-3 border border-gray-200 rounded-[4px] bg-gray-50/50 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#2D3B45] flex items-center gap-1.5">
                    <User size={14} className="text-[#008EE2]" />
                    <span>Docente / Ayudante #{i + 1}</span>
                  </span>
                  {data.docentes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = data.docentes.filter((_, idx) => idx !== i);
                        handleUpdate("docentes", updated);
                      }}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-gray-500 font-medium">Nombre completo</label>
                    <input
                      type="text"
                      value={doc.nombre}
                      onChange={(e) => {
                        const updated = [...data.docentes];
                        updated[i].nombre = e.target.value;
                        handleUpdate("docentes", updated);
                      }}
                      className="w-full border border-gray-300 rounded-[3px] p-1.5 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-500 font-medium">Rol</label>
                    <input
                      type="text"
                      value={doc.rol}
                      onChange={(e) => {
                        const updated = [...data.docentes];
                        updated[i].rol = e.target.value as any;
                        handleUpdate("docentes", updated);
                      }}
                      className="w-full border border-gray-300 rounded-[3px] p-1.5 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-500 font-medium">Correo institucional UDP</label>
                    <input
                      type="email"
                      value={doc.email}
                      onChange={(e) => {
                        const updated = [...data.docentes];
                        updated[i].email = e.target.value;
                        handleUpdate("docentes", updated);
                      }}
                      className="w-full border border-gray-300 rounded-[3px] p-1.5 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-500 font-medium">Horario y lugar de atención</label>
                    <input
                      type="text"
                      value={doc.horarioAtencion}
                      onChange={(e) => {
                        const updated = [...data.docentes];
                        updated[i].horarioAtencion = e.target.value;
                        handleUpdate("docentes", updated);
                      }}
                      className="w-full border border-gray-300 rounded-[3px] p-1.5 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                handleUpdate("docentes", [
                  ...data.docentes,
                  {
                    nombre: "Nuevo Ayudante / Profesor",
                    rol: "Ayudante de Cátedra",
                    email: "ayudante@mail.udp.cl",
                    horarioAtencion: "A coordinar",
                    salaAtencion: "Facultad EIT",
                  },
                ])
              }
              className="text-[11px] font-bold text-[#008EE2] hover:underline flex items-center gap-1"
            >
              <Plus size={12} /> Agregar Docente o Ayudante
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ASISTENCIA */}
      {subTab === "asistencia" && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#2D3B45] mb-1">
                Porcentaje Mínimo Requerido (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={data.reglasAsistencia.porcentajeMinimo}
                onChange={(e) =>
                  handleUpdate("reglasAsistencia", {
                    ...data.reglasAsistencia,
                    porcentajeMinimo: Number(e.target.value),
                  })
                }
                className="w-full border border-gray-300 rounded-[3px] p-2 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#2D3B45] mb-1">
              Modalidad de Toma de Asistencia en Aula
            </label>
            <input
              type="text"
              value={data.reglasAsistencia.modalidadToma}
              onChange={(e) =>
                handleUpdate("reglasAsistencia", {
                  ...data.reglasAsistencia,
                  modalidadToma: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-[3px] p-2 text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-[#2D3B45] mb-1">
              Procedimiento de Justificación Médica / Académica
            </label>
            <textarea
              rows={3}
              value={data.reglasAsistencia.politicaJustificacion}
              onChange={(e) =>
                handleUpdate("reglasAsistencia", {
                  ...data.reglasAsistencia,
                  politicaJustificacion: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-[3px] p-2 text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-[#2D3B45] mb-1">
              Consecuencia Reglamentaria por No Cumplimiento
            </label>
            <input
              type="text"
              value={data.reglasAsistencia.consecuenciaReprobacion}
              onChange={(e) =>
                handleUpdate("reglasAsistencia", {
                  ...data.reglasAsistencia,
                  consecuenciaReprobacion: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-[3px] p-2 text-xs"
            />
          </div>
        </div>
      )}

      {/* SUB-TAB 4: EVALUACIONES Y FÓRMULA */}
      {subTab === "evaluacion" && (
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#2D3B45] mb-1">
              Fórmula Visual de Presentación
            </label>
            <input
              type="text"
              value={data.sistemaEvaluacion.formulaVisual}
              onChange={(e) =>
                handleUpdate("sistemaEvaluacion", {
                  ...data.sistemaEvaluacion,
                  formulaVisual: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-[3px] p-2 text-xs font-mono font-bold text-[#008EE2]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#2D3B45] mb-1">
              Explicación de la Fórmula y Reglas de Examen
            </label>
            <textarea
              rows={2}
              value={data.sistemaEvaluacion.explicacionFormula}
              onChange={(e) =>
                handleUpdate("sistemaEvaluacion", {
                  ...data.sistemaEvaluacion,
                  explicacionFormula: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-[3px] p-2 text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-[#2D3B45] mb-2">
              Desglose de Hitos y Ponderaciones
            </label>
            <div className="space-y-2">
              {data.sistemaEvaluacion.items.map((it, idx) => (
                <div key={it.id || idx} className="grid grid-cols-12 gap-2 items-center p-2 bg-gray-50 border border-gray-200 rounded">
                  <div className="col-span-4">
                    <input
                      type="text"
                      value={it.nombre}
                      onChange={(e) => {
                        const updated = [...data.sistemaEvaluacion.items];
                        updated[idx].nombre = e.target.value;
                        handleUpdate("sistemaEvaluacion", { ...data.sistemaEvaluacion, items: updated });
                      }}
                      className="w-full border border-gray-300 rounded p-1 text-xs bg-white font-medium"
                      placeholder="Nombre evaluación"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={it.ponderacion}
                      onChange={(e) => {
                        const updated = [...data.sistemaEvaluacion.items];
                        updated[idx].ponderacion = e.target.value;
                        handleUpdate("sistemaEvaluacion", { ...data.sistemaEvaluacion, items: updated });
                      }}
                      className="w-full border border-gray-300 rounded p-1 text-xs bg-white text-center font-bold text-red-600"
                      placeholder="20%"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={it.fechaEstimada}
                      onChange={(e) => {
                        const updated = [...data.sistemaEvaluacion.items];
                        updated[idx].fechaEstimada = e.target.value;
                        handleUpdate("sistemaEvaluacion", { ...data.sistemaEvaluacion, items: updated });
                      }}
                      className="w-full border border-gray-300 rounded p-1 text-xs bg-white"
                      placeholder="Fecha estimada"
                    />
                  </div>
                  <div className="col-span-2">
                    <select
                      value={it.caracter}
                      onChange={(e) => {
                        const updated = [...data.sistemaEvaluacion.items];
                        updated[idx].caracter = e.target.value as any;
                        handleUpdate("sistemaEvaluacion", { ...data.sistemaEvaluacion, items: updated });
                      }}
                      className="w-full border border-gray-300 rounded p-1 text-xs bg-white"
                    >
                      <option value="Individual">Individual</option>
                      <option value="Grupal">Grupal</option>
                    </select>
                  </div>
                  <div className="col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = data.sistemaEvaluacion.items.filter((_, i) => i !== idx);
                        handleUpdate("sistemaEvaluacion", { ...data.sistemaEvaluacion, items: updated });
                      }}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: CRONOGRAMA */}
      {subTab === "cronograma" && (
        <div className="space-y-3 text-xs">
          <p className="text-[#6B7780]">
            Cronograma semana a semana de cátedras y laboratorios/ayudantías:
          </p>
          <div className="max-h-[350px] overflow-y-auto space-y-2 border border-gray-200 rounded p-2">
            {data.cronograma.map((c, idx) => (
              <div key={idx} className="flex gap-2 items-center text-xs p-2 bg-gray-50 rounded border border-gray-200">
                <span className="w-16 font-bold text-gray-700 shrink-0">Sem {c.semana}</span>
                <input
                  type="text"
                  value={c.fechas}
                  onChange={(e) => {
                    const updated = [...data.cronograma];
                    updated[idx].fechas = e.target.value;
                    handleUpdate("cronograma", updated);
                  }}
                  className="w-28 border border-gray-300 rounded p-1 text-[11px] bg-white font-mono"
                  placeholder="Fechas"
                />
                <input
                  type="text"
                  value={c.temaCatedra}
                  onChange={(e) => {
                    const updated = [...data.cronograma];
                    updated[idx].temaCatedra = e.target.value;
                    handleUpdate("cronograma", updated);
                  }}
                  className="flex-1 border border-gray-300 rounded p-1 text-[11px] bg-white"
                  placeholder="Cátedra"
                />
                <input
                  type="text"
                  value={c.hitoEvaluacion || ""}
                  onChange={(e) => {
                    const updated = [...data.cronograma];
                    updated[idx].hitoEvaluacion = e.target.value;
                    handleUpdate("cronograma", updated);
                  }}
                  className="w-32 border border-gray-300 rounded p-1 text-[11px] bg-white text-red-600 font-bold"
                  placeholder="Hito / Solemne"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 6: POLÍTICA IA */}
      {subTab === "ia" && (
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#2D3B45] mb-1">
              Directriz Oficial de Uso de IA en la Asignatura
            </label>
            <input
              type="text"
              value={data.politicaIA.nivel}
              onChange={(e) =>
                handleUpdate("politicaIA", {
                  ...data.politicaIA,
                  nivel: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-[3px] p-2 text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-[#2D3B45] mb-1">
              Declaración y Normas Éticas para el Estudiante
            </label>
            <textarea
              rows={4}
              value={data.politicaIA.declaracion}
              onChange={(e) =>
                handleUpdate("politicaIA", {
                  ...data.politicaIA,
                  declaracion: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-[3px] p-2 text-xs leading-relaxed"
            />
          </div>
        </div>
      )}
    </div>
  );
};
