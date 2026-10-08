"use client";

import React from "react";
import { CourseDeliverable } from "@/types";
import { CanvasItemGroup, CanvasItemRow } from "@/components/canvas/CanvasItemGroup";
import {
  FileText,
  Sparkles,
  Brain,
  CalendarCheck,
  BookOpen,
  ArrowRight,
} from "lucide-react";

interface StudentHomeTabProps {
  entregables: CourseDeliverable[];
  onNavigateTab: (tab: string) => void;
}

export const StudentHomeTab: React.FC<StudentHomeTabProps> = ({
  entregables,
  onNavigateTab,
}) => {
  const sumativas = entregables.filter((e) => e.tipo === "tarea_oficial");
  const formativas = entregables.filter((e) => e.tipo === "actividad_ayudantia");

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner de Bienvenida Oficial Canvas */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card space-y-3">
        <div className="border-b border-[#E0E3E6] pb-3">
          <h2 className="text-base font-bold text-[#2D3B45]">
            Bienvenido al Curso de Arquitectura de Software & Gestión TIC
          </h2>
          <p className="text-xs text-[#6B7780] mt-1 leading-relaxed">
            Este curso aborda los fundamentos de diseño de arquitectura de software, atributos de calidad (NFR),
            patrones arquitectónicos y buenas prácticas de gestión de proyectos bajo el marco PMBOK 7ma Edición.
          </p>
        </div>

        {/* Accesos Rápidos de Canvas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <button
            type="button"
            onClick={() => onNavigateTab("sumativas")}
            className="p-3 bg-[#F5F6F8] hover:bg-gray-100 border border-[#C7CDD1] rounded-[3px] text-left transition-colors flex items-center justify-between group cursor-pointer"
          >
            <div>
              <span className="text-xs font-bold text-[#2D3B45] group-hover:text-[#B71C1C] flex items-center gap-1.5">
                <FileText size={14} className="text-[#B71C1C]" />
                Evaluaciones Sumativas
              </span>
              <span className="text-[11px] text-[#6B7780] block mt-0.5">
                {sumativas.length} evaluaciones oficiales
              </span>
            </div>
            <ArrowRight size={13} className="text-[#6B7780] group-hover:text-[#B71C1C]" />
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab("formativas")}
            className="p-3 bg-[#F5F6F8] hover:bg-gray-100 border border-[#C7CDD1] rounded-[3px] text-left transition-colors flex items-center justify-between group cursor-pointer"
          >
            <div>
              <span className="text-xs font-bold text-[#2D3B45] group-hover:text-[#B71C1C] flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#008EE2]" />
                Evaluaciones Formativas
              </span>
              <span className="text-[11px] text-[#6B7780] block mt-0.5">
                {formativas.length} talleres con décimas
              </span>
            </div>
            <ArrowRight size={13} className="text-[#6B7780] group-hover:text-[#B71C1C]" />
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab("aprendizaje")}
            className="p-3 bg-[#F5F6F8] hover:bg-gray-100 border border-[#C7CDD1] rounded-[3px] text-left transition-colors flex items-center justify-between group cursor-pointer"
          >
            <div>
              <span className="text-xs font-bold text-[#2D3B45] group-hover:text-[#B71C1C] flex items-center gap-1.5">
                <Brain size={14} className="text-[#2E7D32]" />
                Tutor IA del Curso
              </span>
              <span className="text-[11px] text-[#6B7780] block mt-0.5">
                Consultas pedagógicas 24/7
              </span>
            </div>
            <ArrowRight size={13} className="text-[#6B7780] group-hover:text-[#B71C1C]" />
          </button>
        </div>
      </div>

      {/* Módulo 0: Información General del Curso */}
      <CanvasItemGroup
        title="Módulo 0: Información General & Programa de Asignatura"
        countBadge="3 ítems"
        defaultExpanded={true}
      >
        <CanvasItemRow
          id="mod0_silabus"
          icon={<BookOpen size={16} />}
          title="Programa Oficial de Asignatura (Silabus 2026-2)"
          subtitle="4 Unidades Curriculares • Evaluaciones, Sistema de Aprobación y Rúbricas"
          isPublished={true}
        />
        <CanvasItemRow
          id="mod0_asistencia"
          icon={<CalendarCheck size={16} />}
          title="Reglamento de Asistencia & Justificaciones Médicas"
          subtitle="Mínimo 75% de asistencia requerido • Marcaje por PIN + Ubicación en sala"
          isPublished={true}
        />
        <CanvasItemRow
          id="mod0_ia"
          icon={<Sparkles size={16} />}
          title="Guía de Uso de Herramientas IA & Políticas de Integridad Académica"
          subtitle="Uso autorizado de LLMs como apoyo pedagógico y resolución de talleres"
          isPublished={true}
        />
      </CanvasItemGroup>

      {/* Módulo 1: Evaluaciones y Entregables Activos */}
      <CanvasItemGroup
        title="Módulo 1: Evaluaciones Oficiales & Talleres en Curso"
        countBadge={`${entregables.length} ítems`}
        defaultExpanded={true}
      >
        {entregables.map((item) => {
          const isSumativa = item.tipo === "tarea_oficial";
          return (
            <CanvasItemRow
              key={item.id}
              id={item.id}
              icon={isSumativa ? <FileText size={16} /> : <Sparkles size={16} />}
              title={item.titulo}
              subtitle={`${item.descripcion} • Plazo: ${item.fecha_limite}`}
              rightBadge={
                <span className="text-[11px] font-semibold text-[#6B7780] bg-[#F5F6F8] border border-[#C7CDD1] px-2 py-0.5 rounded-[3px]">
                  {isSumativa ? "Pond: " : "Incentivo: "}{item.ponderacion_o_decimas}
                </span>
              }
              isPublished={true}
              onClick={() => onNavigateTab(isSumativa ? "sumativas" : "formativas")}
            />
          );
        })}
      </CanvasItemGroup>
    </div>
  );
};
