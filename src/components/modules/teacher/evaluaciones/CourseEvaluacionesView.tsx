"use client";

import React, { useState } from "react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import { CanvasActionMenu } from "@/components/canvas/CanvasActionMenu";
import {
  FileText,
  Plus,
  Sparkles,
  Printer,
  UploadCloud,
  ExternalLink,
  Clock,
  Calendar,
  CheckCircle2,
  Filter,
  Layers,
  Award,
} from "lucide-react";
import { EvaluationCreateModal, EvaluationCategory } from "./EvaluationCreateModal";
import { EvaluationPdfPreviewModal } from "./EvaluationPdfPreviewModal";

interface EvaluationItem {
  id: string;
  titulo: string;
  tipo: EvaluationCategory;
  codigo: string;
  curso: string;
  ponderacion: string;
  tiempo: string;
  fecha: string;
  canvasSync: boolean;
  canvasId?: number;
  preguntasCount: number;
  puntajeTotal: number;
}

const INITIAL_EVALUATIONS: EvaluationItem[] = [
  {
    id: "ev1",
    titulo: "Control 1: Fundamentos de Gestión y Ciclos de Vida",
    tipo: "Control",
    codigo: "CIT3203",
    curso: "Proyecto en TICs II",
    ponderacion: "5%",
    tiempo: "30 min",
    fecha: "2026-04-03",
    canvasSync: true,
    canvasId: 44101,
    preguntasCount: 3,
    puntajeTotal: 30,
  },
  {
    id: "ev2",
    titulo: "Laboratorio 1: Modelado de Casos y WBS en Jira",
    tipo: "Laboratorio",
    codigo: "CIT3203",
    curso: "Proyecto en TICs II",
    ponderacion: "10%",
    tiempo: "90 min",
    fecha: "2026-04-17",
    canvasSync: true,
    canvasId: 44102,
    preguntasCount: 4,
    puntajeTotal: 50,
  },
  {
    id: "ev3",
    titulo: "Solemne Oficial 1: Arquitectura y Gestión Ágil",
    tipo: "Solemne",
    codigo: "CIT3203",
    curso: "Proyecto en TICs II",
    ponderacion: "20%",
    tiempo: "90 min",
    fecha: "2026-05-15",
    canvasSync: true,
    canvasId: 44103,
    preguntasCount: 4,
    puntajeTotal: 70,
  },
  {
    id: "ev4",
    titulo: "Tarea / Investigación: Estado del Arte de Tecnologías Cloud",
    tipo: "Tarea / Investigación",
    codigo: "CIT3203",
    curso: "Proyecto en TICs II",
    ponderacion: "15%",
    tiempo: "2 semanas",
    fecha: "2026-05-29",
    canvasSync: true,
    canvasId: 44104,
    preguntasCount: 2,
    puntajeTotal: 70,
  },
  {
    id: "ev5",
    titulo: "Avance 1: Backlog Priorizado y Prototipo Wireframe",
    tipo: "Avances",
    codigo: "CIT3203",
    curso: "Proyecto en TICs II",
    ponderacion: "20%",
    tiempo: "Hito",
    fecha: "2026-06-12",
    canvasSync: true,
    canvasId: 44105,
    preguntasCount: 3,
    puntajeTotal: 70,
  },
  {
    id: "ev6",
    titulo: "Proyecto Final: Despliegue en Producción y Defensa",
    tipo: "Proyecto",
    codigo: "CIT3203",
    curso: "Proyecto en TICs II",
    ponderacion: "30%",
    tiempo: "Comisión",
    fecha: "2026-07-03",
    canvasSync: true,
    canvasId: 44106,
    preguntasCount: 5,
    puntajeTotal: 70,
  },
];

interface CourseEvaluacionesViewProps {
  courseCode: string;
  courseName: string;
}

export const CourseEvaluacionesView: React.FC<CourseEvaluacionesViewProps> = ({
  courseCode,
  courseName,
}) => {
  const [evaluations, setEvaluations] = useState<EvaluationItem[]>(INITIAL_EVALUATIONS);
  const [selectedFilter, setSelectedFilter] = useState<string>("todas");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [pdfPreviewItem, setPdfPreviewItem] = useState<EvaluationItem | null>(null);

  const categories: { key: string; label: string }[] = [
    { key: "todas", label: `Todas (${evaluations.length})` },
    { key: "Control", label: "Control" },
    { key: "Laboratorio", label: "Laboratorio" },
    { key: "Solemne", label: "Solemne" },
    { key: "Tarea / Investigación", label: "Tarea / Inv." },
    { key: "Proyecto", label: "Proyecto" },
    { key: "Avances", label: "Avances" },
  ];

  const filtered = evaluations.filter((ev) => {
    if (selectedFilter === "todas") return true;
    return ev.tipo === selectedFilter;
  });

  const handleAddEvaluation = (newEval: EvaluationItem) => {
    setEvaluations([newEval, ...evaluations]);
  };

  return (
    <div className="space-y-4">
      {/* Banner Superior de Estandarización de Evaluaciones */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-canvas-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#FFEBEE] text-[#C8102E] text-[10px] font-bold rounded uppercase tracking-wider">
              Estándar Institucional UDP
            </span>
            <span className="text-xs text-[#6B7780]">Conectado con Tareas de Canvas</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#2D3B45] mt-1 flex items-center gap-2">
            <FileText size={18} className="text-[#008EE2]" />
            Módulo Oficial de Evaluaciones Sumativas y Pruebas Colegiadas
          </h2>
          <p className="text-xs text-[#6B7780] mt-0.5 max-w-3xl leading-relaxed">
            Plataforma sistematizada para que los equipos docentes diseñen evaluaciones estándar con asistencia de creatividad IA (variaciones de pruebas anteriores), formato listo para imprimir y sincronización directa con Tareas de Canvas.
          </p>
        </div>

        <CanvasButton
          variant="primary-canvas"
          size="sm"
          icon={<Plus size={14} />}
          onClick={() => setIsCreateModalOpen(true)}
          title="Crear nueva evaluación con estándar UDP"
        >
          Nueva evaluación
        </CanvasButton>
      </div>

      {/* Nota Pedagógica Explicativa */}
      <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-[4px] text-xs text-purple-900 flex items-start gap-2.5">
        <Sparkles size={16} className="text-purple-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="block text-purple-950 font-bold">
            Distinción Fundamental de la Plataforma:
          </strong>
          <span className="text-[11px] block mt-0.5">
            <strong>Evaluaciones Oficiales:</strong> Hitos formales que componen la nota final del curso (100% oficial) conectados a Tareas de Canvas. <em>No confundir con Actividades Extra</em>, las cuales son desafíos formativos de ayudantía para ganar décimas o retroalimentación sin ponderación formal obligatoria.
          </span>
        </div>
      </div>

      {/* Filtro por Categorías Oficiales */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar border-b border-gray-200 pb-2 text-xs">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setSelectedFilter(cat.key)}
            className={`px-3 py-1.5 rounded-[4px] font-semibold transition-all whitespace-nowrap ${
              selectedFilter === cat.key
                ? "bg-[#2D3B45] text-white shadow-2xs"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Lista de Evaluaciones Oficiales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-white border border-[#E0E3E6] rounded-[4px] shadow-canvas-card hover:border-blue-300 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-bold rounded uppercase">
                    {item.tipo}
                  </span>
                  <span className="px-2 py-0.5 bg-blue-50 text-[#008EE2] text-[10px] font-bold rounded">
                    {item.ponderacion}
                  </span>
                </div>
                <CanvasBadge variant={item.canvasSync ? "success" : "neutral"}>
                  {item.canvasSync ? "✓ Tarea Canvas" : "Pendiente"}
                </CanvasBadge>
              </div>

              <h3 className="font-bold text-sm text-[#2D3B45] leading-snug">
                {item.titulo}
              </h3>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 pt-1">
                <div className="flex items-center gap-1">
                  <Calendar size={12} className="text-gray-400" />
                  <span>Fecha: {item.fecha}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} className="text-gray-400" />
                  <span>Tiempo: {item.tiempo}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2.5 border-t border-gray-100">
              <span className="text-[11px] font-mono text-gray-400">
                Puntaje: {item.puntajeTotal} pts • {item.preguntasCount} preg.
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPdfPreviewItem(item)}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 flex items-center gap-1"
                  title="Imprimir prueba en formato oficial UDP"
                >
                  <Printer size={12} />
                  <span>Imprimir PDF</span>
                </button>

                <a
                  href={`https://udp.instructure.com/courses/44999/assignments`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 text-[11px] font-semibold rounded bg-blue-50 text-[#008EE2] hover:bg-blue-100 flex items-center gap-1"
                  title="Ver en módulo de Tareas de Canvas"
                >
                  <ExternalLink size={12} />
                  <span>Canvas</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Creación */}
      <EvaluationCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        courseCode={courseCode}
        courseName={courseName}
        onSave={handleAddEvaluation}
      />

      {/* Modal de Impresión PDF */}
      {pdfPreviewItem && (
        <EvaluationPdfPreviewModal
          isOpen={Boolean(pdfPreviewItem)}
          onClose={() => setPdfPreviewItem(null)}
          evaluacion={pdfPreviewItem}
        />
      )}
    </div>
  );
};
