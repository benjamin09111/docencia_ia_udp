"use client";

import React from "react";
import { InstitutionalFaculty, InstitutionalCareer, INSTITUTIONAL_CAREERS } from "@/constants/institutionalHierarchy";
import { GraduationCap, ChevronRight, BookOpen, Bot, Users, ArrowLeft, CheckCircle2 } from "lucide-react";

interface AdminCareerSelectorProps {
  faculty: InstitutionalFaculty;
  onSelectCareer: (career: InstitutionalCareer) => void;
  onBack: () => void;
}

export const AdminCareerSelector: React.FC<AdminCareerSelectorProps> = ({
  faculty,
  onSelectCareer,
  onBack,
}) => {
  const careers = INSTITUTIONAL_CAREERS.filter((c) => c.facultadId === faculty.id);

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn pb-12">
      {/* Encabezado y Breadcrumb */}
      <div className="border-b border-[#E0E3E6] pb-4">
        <div className="flex items-center justify-between gap-3 mb-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B71C1C] hover:underline cursor-pointer"
          >
            <ArrowLeft size={14} /> Volver a Facultades
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#6B7780] mb-1">
          <span className="text-[#B71C1C]">UDP IA</span>
          <span>&gt;</span>
          <span className="text-[#B71C1C] hover:underline cursor-pointer" onClick={onBack}>
            {faculty.nombre}
          </span>
          <span>&gt;</span>
          <span className="text-[#2D3B45]">Carreras</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-[#2D3B45] flex items-center gap-2.5">
          <GraduationCap size={24} className="text-[#B71C1C]" />
          Selecciona una Carrera
        </h1>
        <p className="text-xs text-[#6B7780] mt-1">
          Paso 2 de 3: {faculty.nombre}. Selecciona la carrera para inspeccionar sus asignaturas, secciones y agentes desplegados.
        </p>
      </div>

      {/* Grid de Carreras */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {careers.map((car) => {
          const isActive = car.estado === "activo";
          return (
            <div
              key={car.id}
              onClick={() => isActive && onSelectCareer(car)}
              className={`bg-white border rounded-[4px] p-5 transition-all select-none flex flex-col justify-between ${
                isActive
                  ? "border-[#C7CDD1] hover:border-[#B71C1C] hover:shadow-md cursor-pointer group shadow-canvas-card"
                  : "border-gray-200 opacity-60 cursor-not-allowed bg-gray-50/70"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`px-2 py-1 rounded-[3px] font-mono font-bold text-xs shrink-0 ${
                      isActive
                        ? "bg-red-50 text-[#B71C1C] border border-red-200 group-hover:bg-[#B71C1C] group-hover:text-white transition-colors"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    Código {car.codigo}
                  </div>
                  {isActive ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 size={11} />
                      IA Activa
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-200 text-gray-600">
                      Próximamente
                    </span>
                  )}
                </div>

                <div>
                  <h3
                    className={`text-sm font-bold leading-snug ${
                      isActive ? "text-[#2D3B45] group-hover:text-[#B71C1C] transition-colors" : "text-gray-500"
                    }`}
                  >
                    {car.nombre}
                  </h3>
                  <div className="text-[11px] text-[#6B7780] mt-1 font-medium">
                    {car.grado} • {car.semestres} semestres
                  </div>
                </div>

                <div className="text-[11px] text-[#6B7780]">
                  <span className="font-semibold text-gray-700">Unidad:</span> {car.director}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                {isActive ? (
                  <>
                    <div className="flex items-center gap-2.5 text-[11px] text-[#6B7780]">
                      <span className="flex items-center gap-1 font-semibold text-[#2D3B45]">
                        <BookOpen size={12} className="text-[#008EE2]" />
                        {car.cursosActivos} cursos
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-[#2D3B45]">
                        <Bot size={12} className="text-purple-600" />
                        {car.agentesActivos} agentes
                      </span>
                    </div>
                    <span className="text-[#B71C1C] font-bold text-xs flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      Ver Espacio <ChevronRight size={14} />
                    </span>
                  </>
                ) : (
                  <span className="text-[11px] text-gray-400 italic">Incorporación próxima</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
