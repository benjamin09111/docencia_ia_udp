"use client";

import React, { useState, useEffect, useMemo } from "react";
import { BaseOfficialCourse, OfficialMaterial } from "@/types/officialMaterials";
import {
  getOfficialCourses,
  getStoredOfficialMaterials,
  addOfficialMaterial,
  toggleCanvasPublish,
  deleteOfficialMaterial,
} from "@/services/officialMaterialsStore";
import { OfficialMaterialGroup } from "./OfficialMaterialGroup";
import { AddOfficialMaterialModal } from "./AddOfficialMaterialModal";
import { OfficialMaterialDetailModal } from "./OfficialMaterialDetailModal";
import { CanvasToolbar } from "@/components/canvas/CanvasToolbar";
import { ShieldCheck, Info, UserCheck, ShieldAlert } from "lucide-react";

interface OfficialMaterialsViewProps {
  isAdmin?: boolean;
}

export const OfficialMaterialsView: React.FC<OfficialMaterialsViewProps> = ({
  isAdmin: initialIsAdmin = false,
}) => {
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin);
  const [courses, setCourses] = useState<BaseOfficialCourse[]>([]);
  const [materials, setMaterials] = useState<OfficialMaterial[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalDefaultCourse, setAddModalDefaultCourse] = useState<string | undefined>();
  const [selectedDetailMaterial, setSelectedDetailMaterial] = useState<OfficialMaterial | null>(null);

  useEffect(() => {
    setIsAdmin(initialIsAdmin);
  }, [initialIsAdmin]);

  useEffect(() => {
    setCourses(getOfficialCourses());
    setMaterials(getStoredOfficialMaterials());
    const handleUpdate = () => setMaterials(getStoredOfficialMaterials());
    window.addEventListener("udp_official_materials_updated", handleUpdate);
    return () => window.removeEventListener("udp_official_materials_updated", handleUpdate);
  }, []);

  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      if (selectedCourseFilter !== "all" && m.courseCode !== selectedCourseFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.courseCode.toLowerCase().includes(q) ||
        m.courseName.toLowerCase().includes(q) ||
        m.fileName.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
      );
    });
  }, [materials, searchQuery, selectedCourseFilter]);

  const materialsByCourse = useMemo(() => {
    const map = new Map<string, OfficialMaterial[]>();
    courses.forEach((c) => map.set(c.code, []));
    filteredMaterials.forEach((m) => {
      const list = map.get(m.courseCode) || [];
      list.push(m);
      map.set(m.courseCode, list);
    });
    return map;
  }, [courses, filteredMaterials]);

  const visibleCourses = useMemo(() => {
    if (selectedCourseFilter !== "all") {
      return courses.filter((c) => c.code === selectedCourseFilter);
    }
    return courses;
  }, [courses, selectedCourseFilter]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner de Identidad y Control de Roles */}
      <div className="p-4 bg-white border border-[#C7CDD1] rounded-[3px] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded bg-red-50 text-[#B71C1C] shrink-0 border border-red-200">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#2D3B45] flex items-center gap-2">
              Archivos e Información Oficial por Asignatura
              <span className="text-[11px] font-semibold bg-gray-100 text-[#2D3B45] px-2 py-0.5 rounded border border-gray-300">
                Control Curricular Transversal
              </span>
            </h2>
            <p className="text-xs text-[#6B7780] mt-1 max-w-3xl leading-relaxed">
              Repositorio centralizado de Escuela. Estandariza los materiales, pautas y syllabus entre secciones del
              mismo curso para garantizar equidad académica en las evaluaciones de Canvas LMS.
            </p>
          </div>
        </div>

        {/* Simulador / Selector de Rol de Acceso */}
        <div className="shrink-0 flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setIsAdmin(!isAdmin)}
            className={`px-3 py-1.5 rounded font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
              isAdmin
                ? "bg-red-50 text-[#B71C1C] border-red-300 hover:bg-red-100"
                : "bg-blue-50 text-[#008EE2] border-blue-200 hover:bg-blue-100"
            }`}
            title="Alternar rol para probar comportamiento de Administrador vs Profesor"
          >
            {isAdmin ? <ShieldAlert size={14} /> : <UserCheck size={14} />}
            <span>Rol: {isAdmin ? "Administrador (Gestión)" : "Profesor (Solo lectura)"}</span>
            <span className="text-[10px] underline ml-1 font-normal opacity-80">(Alternar)</span>
          </button>
        </div>
      </div>

      {/* Toolbar estilo Canvas */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <CanvasToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Buscar por título, código o categoría..."
            primaryButtonLabel={isAdmin ? "+ Agregar Material Oficial" : undefined}
            onPrimaryClick={isAdmin ? () => { setAddModalDefaultCourse(undefined); setIsAddModalOpen(true); } : undefined}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-[#6B7780] font-medium hidden sm:inline">Filtrar por curso:</label>
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-[#C7CDD1] rounded-[3px] bg-white text-[#2D3B45] font-medium focus:outline-none focus:border-[#B71C1C]"
          >
            <option value="all">Todas las asignaturas ({courses.length})</option>
            {courses.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grupos de Cursos con Archivos */}
      <div className="space-y-4">
        {visibleCourses.map((course) => (
          <OfficialMaterialGroup
            key={course.code}
            course={course}
            materials={materialsByCourse.get(course.code) || []}
            isAdmin={isAdmin}
            onTogglePublish={toggleCanvasPublish}
            onDelete={deleteOfficialMaterial}
            onViewDetails={(mat) => setSelectedDetailMaterial(mat)}
            onAddMaterialClick={(code) => {
              setAddModalDefaultCourse(code);
              setIsAddModalOpen(true);
            }}
          />
        ))}
      </div>

      {/* Modales Canónicos */}
      {isAdmin && (
        <AddOfficialMaterialModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          courses={courses}
          defaultCourseCode={addModalDefaultCourse}
          onAddMaterial={addOfficialMaterial}
        />
      )}

      <OfficialMaterialDetailModal
        material={selectedDetailMaterial}
        onClose={() => setSelectedDetailMaterial(null)}
        isAdmin={isAdmin}
        onTogglePublish={toggleCanvasPublish}
      />
    </div>
  );
};
