"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, ShieldCheck, Search, ArrowRight, BookOpen, Eye } from "lucide-react";
import { getSavedSections } from "@/services/attendanceStore";
import { CourseSection } from "@/types/attendance";
import { fetchSectionsFromSupabase, isSupabaseConfigured } from "@/services/attendanceDbService";

interface PublicAttendanceDirectoryPageProps {
  searchParams: Promise<{ sec?: string; curso?: string }>;
}

export default function PublicAttendanceDirectoryPage({
  searchParams,
}: PublicAttendanceDirectoryPageProps) {
  const router = useRouter();
  const resolvedSearch = use(searchParams);
  const [courseCodeInput, setCourseCodeInput] = useState("");
  const [sections, setSections] = useState<CourseSection[]>(() => getSavedSections());

  // Si viene con parámetro ?sec= o ?curso=, redirigir de inmediato a /asistencia/[cursoId]
  useEffect(() => {
    const directCode = resolvedSearch?.sec || resolvedSearch?.curso;
    if (directCode) {
      router.replace(`/asistencia/${encodeURIComponent(directCode)}`);
    }
  }, [resolvedSearch, router]);

  // Cargar secciones actualizadas desde Supabase
  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchSectionsFromSupabase().then((cloud) => {
        if (cloud && cloud.length > 0) setSections(cloud);
      });
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = courseCodeInput.trim();
    if (clean) {
      router.push(`/asistencia/${encodeURIComponent(clean)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Header Institucional */}
      <header className="max-w-2xl w-full mx-auto flex items-center justify-between border-b border-gray-200 pb-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#C8102E] text-white flex items-center justify-center font-bold">
            <GraduationCap size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
              Universidad Diego Portales
            </span>
            <h1 className="text-xs font-bold text-[#2D3B45]">
              Escuela de Informática y Telecomunicaciones
            </h1>
          </div>
        </div>
        <span className="text-[10px] text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded font-mono flex items-center gap-1">
          <ShieldCheck size={11} /> Seguro
        </span>
      </header>

      {/* Contenido Principal: Directorio y Selección de Curso */}
      <main className="flex-1 flex items-center justify-center py-4">
        <div className="max-w-2xl w-full bg-white border border-[#E0E3E6] rounded-[4px] p-5 sm:p-7 shadow-canvas-card space-y-6">
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 text-[#008EE2] flex items-center justify-center mb-2 border border-blue-100">
              <BookOpen size={22} />
            </div>
            <h2 className="text-lg font-bold text-[#2D3B45]">
              Portal de Asistencia Estudiantil UDP
            </h2>
            <p className="text-xs text-[#6B7780] max-w-md mx-auto">
              Cada curso cuenta con su propia nómina de estudiantes. Para marcar asistencia, ingresa el código de tu curso o selecciónalo en la lista a continuación:
            </p>
          </div>

          {/* Buscador / Entrada directa por Código */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Ingresa código (ej: CIT3203_CA01, CIT2206_CA01)..."
                value={courseCodeInput}
                onChange={(e) => setCourseCodeInput(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-[4px] focus:bg-white focus:outline-hidden focus:border-[#008EE2] transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={!courseCodeInput.trim()}
              className="px-4 py-2 bg-[#008EE2] hover:bg-[#0077BE] text-white text-xs font-bold rounded-[4px] flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <span>Ir al Curso</span>
              <ArrowRight size={13} />
            </button>
          </form>

          {/* Listado de Cursos Oficiales Disponibles */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">
              Cursos y Secciones Activas:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {sections.map((sec) => (
                <div
                  key={sec.id}
                  className="p-3 border border-gray-200 rounded-[4px] bg-gray-50/70 hover:bg-blue-50/40 hover:border-blue-300 transition-all flex flex-col justify-between gap-2.5"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-mono font-bold text-[11px] text-[#008EE2] bg-blue-100/70 px-1.5 py-0.2 rounded">
                        {sec.codigo}
                      </span>
                      <span className="text-[10px] text-gray-500 font-medium">
                        {sec.nombre}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-[#2D3B45] line-clamp-1">
                      {sec.cursoNombre}
                    </h3>
                    <p className="text-[11px] text-[#6B7780] line-clamp-1">
                      Docente: {sec.profesor}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-gray-200">
                    <Link
                      href={`/asistencia/${encodeURIComponent(sec.codigo)}`}
                      className="flex-1 py-1.5 px-2 bg-[#C8102E] hover:bg-[#A00D24] text-white text-[11px] font-bold rounded-[4px] flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>Marcar Asistencia</span>
                      <ArrowRight size={11} />
                    </Link>
                    <Link
                      href={`/asistencia/${encodeURIComponent(sec.codigo)}/visual`}
                      title="Ver planilla de notas y décimas"
                      className="p-1.5 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 rounded-[4px] transition-colors"
                    >
                      <Eye size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-[11px] text-gray-500 mt-6 py-3 border-t border-gray-200">
        Portal de Marcaje Asistido • Plataforma Docente UDP © 2026
      </footer>
    </div>
  );
}
