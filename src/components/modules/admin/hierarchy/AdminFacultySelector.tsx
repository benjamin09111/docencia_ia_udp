"use client";

import React, { useMemo, useState } from "react";
import { InstitutionalFaculty, InstitutionalCareer, INSTITUTIONAL_FACULTIES } from "@/constants/institutionalHierarchy";
import { Building2, ChevronRight, BookOpen, Bot, MapPin, CheckCircle2, LayoutGrid, List, Search } from "lucide-react";
import { AdminQuickAccessNav } from "@/components/modules/admin/hierarchy/AdminQuickAccessNav";
import { CanvasTable, CanvasTableCell, CanvasTableHeader, CanvasTableRow } from "@/components/canvas/CanvasTable";

interface AdminFacultySelectorProps {
  onSelectFaculty: (faculty: InstitutionalFaculty) => void;
  onQuickSelect?: (faculty: InstitutionalFaculty, career: InstitutionalCareer) => void;
}

export const AdminFacultySelector: React.FC<AdminFacultySelectorProps> = ({
  onSelectFaculty,
  onQuickSelect,
}) => {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"table" | "cards">("table");
  const faculties = useMemo(() => INSTITUTIONAL_FACULTIES.filter((faculty) => faculty.nombre.toLowerCase().includes(query.trim().toLowerCase()) || faculty.sigla.toLowerCase().includes(query.trim().toLowerCase())), [query]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn pb-12">
      {/* Encabezado y Breadcrumb Oficial Canvas LMS */}
      <div className="border-b border-[#E0E3E6] pb-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#6B7780] mb-1">
          <span className="text-[#B71C1C] hover:underline cursor-pointer">UDP IA</span>
          <span>&gt;</span>
          <span className="text-[#2D3B45] font-bold">Facultades</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#2D3B45] flex items-center gap-2.5">
          <Building2 size={24} className="text-[#B71C1C]" />
          Facultades UDP
        </h1>
      </div>

      {/* Contenedor con Menú Lateral Izquierdo de Accesos Rápidos y Grid Principal */}
      <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
        {/* Menú lateral pequeño de Accesos Rápidos */}
        <AdminQuickAccessNav
          onQuickSelectCareer={(faculty, career) => {
            if (onQuickSelect) {
              onQuickSelect(faculty, career);
            } else {
              onSelectFaculty(faculty);
            }
          }}
        />

        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
            <label className="relative flex-1 max-w-md"><Search size={14} className="absolute left-2.5 top-2.5 text-[#6B7780]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar facultad por nombre..." className="w-full border border-[#C7CDD1] rounded-[4px] py-2 pl-8 pr-3 text-xs focus:outline-none focus:border-[#B71C1C]" /></label>
            <div className="flex border border-[#C7CDD1] rounded-[4px] overflow-hidden self-start"><button type="button" onClick={() => setView("table")} title="Vista tabla" className={`p-2 ${view === "table" ? "bg-[#424242] text-white" : "bg-white text-[#6B7780]"}`}><List size={15} /></button><button type="button" onClick={() => setView("cards")} title="Vista tarjetas" className={`p-2 border-l border-[#C7CDD1] ${view === "cards" ? "bg-[#424242] text-white" : "bg-white text-[#6B7780]"}`}><LayoutGrid size={15} /></button></div>
          </div>
          {view === "table" ? <CanvasTable><CanvasTableHeader><tr><th className="p-3 text-left">Facultad</th><th className="p-3 text-left">Campus</th><th className="p-3 text-center">Cursos</th><th className="p-3 text-center">Agentes</th><th className="p-3 text-right">Estado</th></tr></CanvasTableHeader><tbody>{faculties.map((fac) => <CanvasTableRow key={fac.id} onClick={() => fac.estado === "activo" && onSelectFaculty(fac)} className={fac.estado === "activo" ? "cursor-pointer" : "opacity-60"}><CanvasTableCell><div className="flex items-center gap-2"><span className="w-8 h-8 rounded bg-red-50 text-[#B71C1C] border border-red-200 flex items-center justify-center font-bold text-xs">{fac.sigla}</span><span className="font-semibold text-[#2D3B45]">{fac.nombre}</span></div></CanvasTableCell><CanvasTableCell>{fac.campus}</CanvasTableCell><CanvasTableCell align="center">{fac.cursosActivos}</CanvasTableCell><CanvasTableCell align="center">{fac.agentesActivos}</CanvasTableCell><CanvasTableCell align="right">{fac.estado === "activo" ? <span className="text-emerald-700 font-semibold">Ingresar →</span> : <span className="text-gray-500">Próximamente</span>}</CanvasTableCell></CanvasTableRow>)}</tbody></CanvasTable> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {faculties.map((fac) => {
          const isActive = fac.estado === "activo";
          return (
            <div
              key={fac.id}
              onClick={() => isActive && onSelectFaculty(fac)}
              className={`bg-white border rounded-[4px] p-5 transition-all select-none flex flex-col justify-between ${
                isActive
                  ? "border-[#C7CDD1] hover:border-[#B71C1C] hover:shadow-md cursor-pointer group shadow-canvas-card"
                  : "border-gray-200 opacity-60 cursor-not-allowed bg-gray-50/70"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`w-11 h-11 rounded-[4px] flex items-center justify-center font-bold text-base shrink-0 ${
                      isActive
                        ? "bg-red-50 text-[#B71C1C] border border-red-200 group-hover:bg-[#B71C1C] group-hover:text-white transition-colors"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {fac.sigla}
                  </div>
                  {isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 size={13} />
                      En Pilotaje IA
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-gray-200 text-gray-600">
                      Próximamente
                    </span>
                  )}
                </div>

                <div>
                  <h3
                    className={`text-base font-bold leading-snug ${
                      isActive ? "text-[#2D3B45] group-hover:text-[#B71C1C] transition-colors" : "text-gray-500"
                    }`}
                  >
                    {fac.nombre}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#6B7780] mt-1.5">
                    <MapPin size={13} className="shrink-0 text-gray-400" />
                    <span className="truncate">{fac.campus}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                {isActive ? (
                  <>
                    <div className="flex items-center gap-3 text-xs text-[#6B7780]">
                      <span className="flex items-center gap-1 font-semibold text-[#2D3B45]">
                        <BookOpen size={13} className="text-[#008EE2]" />
                        {fac.cursosActivos} cursos
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-[#2D3B45]">
                        <Bot size={13} className="text-purple-600" />
                        {fac.agentesActivos} agentes
                      </span>
                    </div>
                    <span className="text-[#B71C1C] font-bold text-sm flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      Ingresar <ChevronRight size={16} />
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-gray-400 italic">No habilitada en esta fase</span>
                )}
              </div>
            </div>
          );
        })}
        </div>}
        </div>
      </div>
    </div>
  );
};
