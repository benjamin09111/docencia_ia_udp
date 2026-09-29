"use client";

import React, { useState } from "react";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import {
  CanvasTable,
  CanvasTableHeader,
  CanvasTableRow,
  CanvasTableCell,
} from "@/components/canvas/CanvasTable";
import {
  Layers,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Calendar,
} from "lucide-react";

interface OfficialDeliverableItem {
  id: string;
  numero: number;
  titulo: string;
  ponderacion: string;
  descripcion: string;
  defaultDueAt: string;
  defaultUnlockAt: string;
  points: number;
  canvasId?: number;
  canvasUrl?: string;
  estado: "pendiente" | "creado_borrador";
}

const initialDeliverablesList: OfficialDeliverableItem[] = [
  {
    id: "deliv_1",
    numero: 1,
    titulo: "Presentación e Informe Inicial",
    ponderacion: "20%",
    descripcion: "Descripción clara del tema seleccionado para el Proyecto del curso y alcance inicial con el mandante.",
    defaultDueAt: "2026-04-10T23:59",
    defaultUnlockAt: "2026-03-20T08:30",
    points: 7.0,
    estado: "pendiente",
  },
  {
    id: "deliv_2",
    numero: 2,
    titulo: "Solemne Oficial",
    ponderacion: "20%",
    descripcion: "Evaluación teórica individual sobre fundamentos PMBOK 7ma Edición y RAPs del proyecto.",
    defaultDueAt: "2026-05-15T23:59",
    defaultUnlockAt: "2026-05-01T08:30",
    points: 7.0,
    estado: "pendiente",
  },
  {
    id: "deliv_3",
    numero: 3,
    titulo: "Reporte de Avance 1",
    ponderacion: "20%",
    descripcion: "Reporte del trabajo realizado al primer mes de proyecto: arquitectura base, backlog priorizado y WBS/EDT.",
    defaultDueAt: "2026-05-29T23:59",
    defaultUnlockAt: "2026-05-15T08:30",
    points: 7.0,
    estado: "pendiente",
  },
  {
    id: "deliv_4",
    numero: 4,
    titulo: "Reporte de Avance 2",
    ponderacion: "20%",
    descripcion: "Reporte del trabajo al segundo mes: prototipo funcional (MVP), pruebas de integración y burndown chart.",
    defaultDueAt: "2026-06-26T23:59",
    defaultUnlockAt: "2026-06-10T08:30",
    points: 7.0,
    estado: "pendiente",
  },
  {
    id: "deliv_5",
    numero: 5,
    titulo: "Presentación Final y Reporte Escrito",
    ponderacion: "20%",
    descripcion: "Defensa oral final en Feria de Proyectos y reporte técnico exhaustivo con software desplegado ante comisión.",
    defaultDueAt: "2026-07-10T23:59",
    defaultUnlockAt: "2026-06-25T08:30",
    points: 7.0,
    estado: "pendiente",
  },
];

interface CourseDeliverablesViewProps {
  courseId: number;
  courseCode: string;
}

export const CourseDeliverablesView: React.FC<CourseDeliverablesViewProps> = ({
  courseId,
  courseCode,
}) => {
  const [deliverables, setDeliverables] = useState<OfficialDeliverableItem[]>(initialDeliverablesList);
  const [selectedToCreate, setSelectedToCreate] = useState<OfficialDeliverableItem | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formDueAt, setFormDueAt] = useState("");
  const [formUnlockAt, setFormUnlockAt] = useState("");
  const [formPoints, setFormPoints] = useState(7.0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<{ title: string; url: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const openCreateModal = (item: OfficialDeliverableItem) => {
    setSelectedToCreate(item);
    setFormName(`${item.titulo} (${courseCode})`);
    setFormDesc(
      `<p><strong>${item.titulo}</strong></p><p>${item.descripcion}</p><p><em>Ponderación oficial: ${item.ponderacion} de la nota final.</em></p><p>Entrega en formato PDF.</p>`
    );
    setFormDueAt(item.defaultDueAt);
    setFormUnlockAt(item.defaultUnlockAt);
    setFormPoints(item.points);
    setErrorMessage(null);
  };

  const handleConfirmCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedToCreate) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/canvas/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: courseId,
          name: formName,
          description: formDesc,
          dueAt: formDueAt ? new Date(formDueAt).toISOString() : null,
          unlockAt: formUnlockAt ? new Date(formUnlockAt).toISOString() : null,
          pointsPossible: formPoints,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo crear en Canvas");
      }

      // Actualizamos el entregable con el estado creado
      setDeliverables((prev) =>
        prev.map((item) =>
          item.id === selectedToCreate.id
            ? {
                ...item,
                estado: "creado_borrador",
                canvasId: data.assignmentId,
                canvasUrl: data.htmlUrl,
              }
            : item
        )
      );

      setSuccessMessage({
        title: formName,
        url: data.htmlUrl,
      });

      setSelectedToCreate(null);
    } catch (err: any) {
      setErrorMessage(err.message || "Error al conectar con la API de Canvas UDP");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Banner Informativo */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#E3F2FD] text-[#0277BD] text-[11px] font-bold rounded uppercase">
              Módulo de Tareas Canvas UDP
            </span>
            <span className="text-xs text-[#6B7780]">Integración Bidireccional</span>
          </div>
          <h2 className="text-base font-bold text-[#2D3B45] mt-1">
            Entregables Oficiales del Semestre (5 Hitos x 20%)
          </h2>
          <p className="text-xs text-[#6B7780] mt-0.5">
            Crea cada entregable directamente en el módulo nativo de <strong>Tareas de Canvas</strong>. Se crearán como <strong>borradores ocultos</strong> (no publicados).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <CanvasBadge variant="warning">
            🛡️ Creación en Borrador (Sin Publicar)
          </CanvasBadge>
        </div>
      </div>

      {/* Alerta de Éxito con Link a Canvas */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-[4px] text-xs space-y-1 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2 font-bold text-emerald-800">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>¡Tarea creada con éxito en Canvas UDP! (Borrador no publicado)</span>
          </div>
          <p className="text-emerald-800">
            La tarea <strong>"{successMessage.title}"</strong> ya existe dentro de tu curso en Canvas.
          </p>
          <div className="pt-1">
            <a
              href={successMessage.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-[#008EE2] hover:underline"
            >
              <span>Ver en Canvas Tareas ↗</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      )}

      {/* Tabla Oficial de Entregables */}
      <CanvasTable>
        <CanvasTableHeader>
          <tr>
            <th className="p-3 w-16 text-center">Hito</th>
            <th className="p-3">Nombre del Entregable</th>
            <th className="p-3 text-center">Ponderación</th>
            <th className="p-3">Descripción Oficial UDP</th>
            <th className="p-3 text-center">Estado Canvas</th>
            <th className="p-3 text-right">Acción</th>
          </tr>
        </CanvasTableHeader>
        <tbody>
          {deliverables.map((item) => (
            <CanvasTableRow key={item.id} hoverable={false}>
              <CanvasTableCell align="center">
                <span className="w-7 h-7 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center font-bold text-xs text-[#2D3B45] mx-auto">
                  {item.numero}
                </span>
              </CanvasTableCell>

              <CanvasTableCell>
                <div className="space-y-0.5">
                  <span className="font-bold text-[#2D3B45] text-xs block">{item.titulo}</span>
                  <span className="text-[11px] text-gray-500 font-mono">Puntos: {item.points.toFixed(1)}</span>
                </div>
              </CanvasTableCell>

              <CanvasTableCell align="center">
                <span className="font-extrabold text-[#C8102E] text-xs px-2 py-0.5 bg-red-50 rounded border border-red-200">
                  {item.ponderacion}
                </span>
              </CanvasTableCell>

              <CanvasTableCell>
                <p className="text-xs text-[#55636E] max-w-md leading-relaxed">{item.descripcion}</p>
              </CanvasTableCell>

              <CanvasTableCell align="center">
                {item.estado === "creado_borrador" ? (
                  <CanvasBadge variant="success">✓ Creado en Canvas (Borrador)</CanvasBadge>
                ) : (
                  <CanvasBadge variant="neutral">No Creado Aún</CanvasBadge>
                )}
              </CanvasTableCell>

              <CanvasTableCell align="right">
                {item.estado === "creado_borrador" ? (
                  <a
                    href={item.canvasUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#C7CDD1] text-[#2D3B45] hover:text-[#008EE2] hover:border-[#008EE2] text-xs font-semibold rounded-[4px] shadow-sm transition-all"
                  >
                    <span>Ver en Canvas</span>
                    <ExternalLink size={13} />
                  </a>
                ) : (
                  <CanvasButton
                    variant="primary-udp"
                    size="sm"
                    onClick={() => openCreateModal(item)}
                    icon={<Sparkles size={13} />}
                  >
                    Crear en Tareas
                  </CanvasButton>
                )}
              </CanvasTableCell>
            </CanvasTableRow>
          ))}
        </tbody>
      </CanvasTable>

      {/* Modal Crear en Tareas de Canvas */}
      {selectedToCreate && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[6px] max-w-lg w-full p-6 shadow-xl border border-gray-200 space-y-4 animate-scaleUp">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-[#2D3B45] flex items-center gap-2">
                  <Sparkles size={18} className="text-[#C8102E]" />
                  Crear Tarea en Canvas UDP
                </h3>
                <p className="text-xs text-[#6B7780] mt-0.5">
                  Se enviará a la API de Canvas para este curso con la configuración oficial.
                </p>
              </div>
              <button
                onClick={() => setSelectedToCreate(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Aviso Importante de Borrador */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-[4px] text-xs text-amber-900 flex items-start gap-2">
              <AlertTriangle size={16} className="text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Modo Prueba Seguro:</strong> La tarea se creará con <code>published: false</code> (Borrador no publicado). Los estudiantes <strong>no podrán verla</strong> en Canvas hasta que tú decidas publicarla.
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleConfirmCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-[#2D3B45] block mb-1">Nombre de la Tarea en Canvas:</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full border border-gray-300 rounded-[4px] p-2 focus:ring-1 focus:ring-[#008EE2]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#2D3B45] block mb-1">Fecha de Entrega (Due At):</label>
                  <input
                    type="datetime-local"
                    value={formDueAt}
                    onChange={(e) => setFormDueAt(e.target.value)}
                    className="w-full border border-gray-300 rounded-[4px] p-1.5 focus:ring-1 focus:ring-[#008EE2]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#2D3B45] block mb-1">Fecha de Apertura (Unlock At):</label>
                  <input
                    type="datetime-local"
                    value={formUnlockAt}
                    onChange={(e) => setFormUnlockAt(e.target.value)}
                    className="w-full border border-gray-300 rounded-[4px] p-1.5 focus:ring-1 focus:ring-[#008EE2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#2D3B45] block mb-1">Puntos Máximos (Escala):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formPoints}
                    onChange={(e) => setFormPoints(parseFloat(e.target.value) || 7.0)}
                    className="w-full border border-gray-300 rounded-[4px] p-1.5 focus:ring-1 focus:ring-[#008EE2]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#2D3B45] block mb-1">Formato Permitido:</label>
                  <div className="p-1.5 bg-gray-100 rounded text-gray-700 font-mono text-[11px]">
                    Solo archivos .PDF
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <CanvasButton
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setSelectedToCreate(null)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </CanvasButton>
                <CanvasButton
                  variant="primary-udp"
                  size="sm"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creando en Canvas..." : "Confirmar y Crear en Canvas Tareas"}
                </CanvasButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
