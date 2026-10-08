"use client";

import React, { useState, useMemo } from "react";
import { CanvasCourse } from "@/types";
import { CourseSection } from "@/types/attendance";
import { MOCK_LEARNING_PROFILES } from "@/constants/mockLearningData";
import { LearningPerformanceLevel, StudentLearningProfile } from "@/types/learning";
import { LearningMetricsSummaryBar } from "./LearningMetricsSummaryBar";
import { StudentLearningListItem } from "./StudentLearningListItem";
import { StudentLearningDetailCard } from "./StudentLearningDetailCard";
import { Search, GraduationCap, Filter, Sparkles, BookOpen } from "lucide-react";

interface CourseLearningTraceabilityViewProps {
  course: CanvasCourse;
  section: CourseSection;
}

export const CourseLearningTraceabilityView: React.FC<CourseLearningTraceabilityViewProps> = ({
  course,
  section,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState<string>("todos");
  const [selectedStudentId, setSelectedStudentId] = useState<number>(MOCK_LEARNING_PROFILES[0].studentId);

  const filteredProfiles = useMemo(() => {
    return MOCK_LEARNING_PROFILES.filter((p) => {
      if (filterLevel !== "todos" && p.nivelRendimiento !== filterLevel) {
        return false;
      }
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const fullName = `${p.nombres} ${p.apellidos}`.toLowerCase();
        return fullName.includes(term) || p.rut.toLowerCase().includes(term);
      }
      return true;
    });
  }, [searchTerm, filterLevel]);

  const selectedProfile = useMemo(() => {
    return (
      MOCK_LEARNING_PROFILES.find((p) => p.studentId === selectedStudentId) ||
      filteredProfiles[0] ||
      MOCK_LEARNING_PROFILES[0]
    );
  }, [selectedStudentId, filteredProfiles]);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Encabezado del Módulo Canvas */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#2D3B45] flex items-center gap-2.5">
              <GraduationCap size={24} className="text-[#B71C1C]" />
              Aprendizaje y Trazabilidad
            </h1>
            <p className="text-xs text-[#6B7780] mt-1">
              Seguimiento pedagógico profundo, reflexiones individuales, fortalezas, debilidades y orientaciones docentes con IA.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#C7CDD1] text-[#2D3B45] text-xs font-semibold rounded shadow-xs">
              <Sparkles size={13} className="text-[#008EE2]" />
              Copiloto Pedagógico Activo
            </span>
          </div>
        </div>
      </div>

      {/* Barra de Métricas Superiores */}
      <LearningMetricsSummaryBar profiles={MOCK_LEARNING_PROFILES} />

      {/* Toolbar Canvas: Filtros y Búsqueda */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-3 shadow-canvas-card flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-2.5 text-[#6B7780]" />
          <input
            type="text"
            placeholder="Buscar por estudiante o RUT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#C7CDD1] rounded text-[#2D3B45] focus:outline-none focus:ring-1 focus:ring-[#008EE2] focus:border-[#008EE2]"
          />
        </div>

        {/* Píldoras de Filtro por Nivel */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
          <Filter size={13} className="text-[#6B7780] shrink-0" />
          {[
            { id: "todos", label: "Todos" },
            { id: "en_riesgo", label: "En Riesgo" },
            { id: "atencion", label: "Atención" },
            { id: "favorable", label: "Favorable" },
            { id: "destacado", label: "Destacado" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilterLevel(item.id)}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                filterLevel === item.id
                  ? "bg-[#2D3B45] text-white border-[#2D3B45]"
                  : "bg-white text-[#6B7780] border-[#E0E3E6] hover:bg-gray-50 hover:text-[#2D3B45]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Layout Master-Detail (2 Columnas) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda: Lista de Alumnos */}
        <div className="lg:col-span-5 space-y-2 max-h-[700px] overflow-y-auto pr-1">
          <div className="text-xs font-bold text-[#6B7780] uppercase tracking-wider mb-2 flex items-center justify-between px-1">
            <span>Estudiantes ({filteredProfiles.length})</span>
            <span className="text-[10px] lowercase font-normal">selecciona para ver ficha</span>
          </div>

          {filteredProfiles.length === 0 ? (
            <div className="p-6 bg-white border border-[#E0E3E6] rounded-[4px] text-center text-xs text-[#6B7780]">
              No se encontraron estudiantes para los filtros seleccionados.
            </div>
          ) : (
            filteredProfiles.map((prof) => (
              <StudentLearningListItem
                key={prof.studentId}
                profile={prof}
                isSelected={prof.studentId === selectedProfile.studentId}
                onSelect={() => setSelectedStudentId(prof.studentId)}
              />
            ))
          )}
        </div>

        {/* Columna Derecha: Detalle Pedagógico del Alumno Seleccionado */}
        <div className="lg:col-span-7 sticky top-4">
          <StudentLearningDetailCard profile={selectedProfile} />
        </div>
      </div>
    </div>
  );
};
