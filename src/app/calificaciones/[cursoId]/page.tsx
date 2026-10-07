"use client";

import React, { useState, useEffect, useMemo, use } from "react";
import Link from "next/link";
import {
  FileSpreadsheet,
  Search,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  GraduationCap,
  Percent,
  TrendingUp,
  Users,
  Award,
  ArrowLeft,
  Share2,
  Check,
} from "lucide-react";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { StudentExcelRow } from "@/types";
import { initialCourseData, getStoredCourseGrades } from "@/services/courseStore";
import { getSavedSections, getSectionByCourseCode } from "@/services/attendanceStore";
import { exportAnonymousGradesToExcel } from "@/services/excelExportService";
import { getHiddenColumns } from "@/services/gradesVisibilityStore";
import { EyeOff } from "lucide-react";

interface PublicGradesPageProps {
  params: Promise<{ cursoId: string }>;
}

export default function PublicGradesPage({ params }: PublicGradesPageProps) {
  const resolvedParams = use(params);
  const courseCode = decodeURIComponent(resolvedParams.cursoId);

  const [grades, setGrades] = useState<StudentExcelRow[]>([]);
  const [rutQuery, setRutQuery] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [hiddenCols, setHiddenCols] = useState<Record<string, boolean>>(() => getHiddenColumns(courseCode));

  // Cargar calificaciones sincronizadas desde store / localStorage
  useEffect(() => {
    const loadData = () => {
      const stored = getStoredCourseGrades(courseCode);
      if (stored && stored.length > 0) {
        setGrades(stored);
      } else {
        setGrades(initialCourseData.estudiantes_excel);
      }
      setHiddenCols(getHiddenColumns(courseCode));
    };

    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener("udp_grades_updated", handleUpdate);
    window.addEventListener("udp_hidden_columns_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("udp_grades_updated", handleUpdate);
      window.removeEventListener("udp_hidden_columns_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [courseCode]);

  // Información de la sección
  const sections = useMemo(() => getSavedSections(), []);
  const section = useMemo(() => getSectionByCourseCode(courseCode, sections), [courseCode, sections]);
  const courseTitle = section ? section.nombre : initialCourseData.nombre;

  // Limpieza de RUT para búsqueda flexible (con o sin puntos/guión)
  const cleanRut = (r: string) => r.replace(/[\.\-\s]/g, "").toUpperCase();

  // Filtrado de la nómina
  const filteredGrades = useMemo(() => {
    if (!rutQuery.trim()) return grades;
    const q = cleanRut(rutQuery);
    return grades.filter((g) => cleanRut(g.rut).includes(q));
  }, [grades, rutQuery]);

  // Alumno seleccionado específicamente si la búsqueda coincide
  const myStudentResult = useMemo(() => {
    if (!rutQuery.trim()) return null;
    const q = cleanRut(rutQuery);
    return grades.find((g) => cleanRut(g.rut) === q) || null;
  }, [grades, rutQuery]);

  // Métricas agregadas anónimas
  const stats = useMemo(() => {
    const total = grades.length || 1;
    const aprobados = grades.filter((g) => g.asistencia_pct >= 75 && g.nota_final >= 4.0).length;
    const reprobados = grades.filter((g) => g.asistencia_pct >= 75 && g.nota_final < 4.0).length;
    const ri = grades.filter((g) => g.asistencia_pct < 75).length;
    const promedio = (grades.reduce((acc, g) => acc + g.nota_final, 0) / total).toFixed(1);
    const tasaAprobacion = Math.round((aprobados / total) * 100);

    return { total, aprobados, reprobados, ri, promedio, tasaAprobacion };
  }, [grades]);

  const handleDownloadExcel = () => {
    exportAnonymousGradesToExcel({
      cursoCodigo: courseCode,
      cursoNombre: courseTitle,
      seccionNombre: section?.nombre,
      estudiantesExcel: grades,
    });
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col justify-between text-[#2D3B45] font-sans">
      {/* Header Institucional UDP */}
      <header className="bg-white border-b border-[#E0E3E6] shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#C8102E] text-white flex items-center justify-center font-bold shadow-xs">
              <GraduationCap size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#C8102E] uppercase tracking-wider">
                  Universidad Diego Portales
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                  Facultad de Ingeniería y Ciencias
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-[#2D3B45]">
                Planilla Oficial de Calificaciones Finales
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <CanvasButton
              variant="outline"
              size="sm"
              icon={copiedLink ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
              onClick={handleCopyLink}
            >
              {copiedLink ? "Enlace Copiado" : "Compartir Enlace"}
            </CanvasButton>

            <CanvasButton
              variant="outline"
              size="sm"
              icon={<Download size={14} />}
              onClick={handleDownloadExcel}
              className="text-emerald-800 border-emerald-300 hover:bg-emerald-50"
            >
              Descargar Excel (.xlsx)
            </CanvasButton>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6 flex-1">
        {/* Banner del Curso y Garantía de Privacidad */}
        <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono font-bold text-xs bg-blue-50 text-[#008EE2] px-2.5 py-0.5 rounded border border-blue-200">
                  {courseCode}
                </span>
                {section?.nombre && (
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">
                    {section.nombre}
                  </span>
                )}
                <span className="text-xs text-gray-500 font-medium">Primer Semestre 2026</span>
              </div>
              <h2 className="text-lg font-bold text-[#2D3B45]">{courseTitle}</h2>
              <p className="text-xs text-[#6B7780] mt-0.5">
                Escuela de Informática y Telecomunicaciones • Plataforma Oficial de Calificaciones
              </p>
            </div>

            {/* Sello de Privacidad */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-[4px] px-3.5 py-2 flex items-center gap-2 text-emerald-900 text-xs">
              <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-[11px] uppercase tracking-wide text-emerald-800">
                  Privacidad Garantizada (Ley N° 19.628)
                </p>
                <p className="text-[11px] text-emerald-700">
                  Publicación estrictamente anonimizada por RUT. Sin nombres ni apellidos.
                </p>
              </div>
            </div>
          </div>

          {/* Métricas Agregadas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="bg-[#F5F6F8] rounded-[4px] p-3 border border-gray-200">
              <span className="text-[11px] font-semibold text-[#6B7780] uppercase tracking-wider block">
                Total Estudiantes
              </span>
              <span className="text-xl font-bold text-[#2D3B45] mt-0.5 block">{stats.total}</span>
            </div>

            <div className="bg-[#F5F6F8] rounded-[4px] p-3 border border-gray-200">
              <span className="text-[11px] font-semibold text-[#6B7780] uppercase tracking-wider block">
                Tasa de Aprobación
              </span>
              <span className="text-xl font-bold text-emerald-700 mt-0.5 block">
                {stats.tasaAprobacion}%
              </span>
            </div>

            <div className="bg-[#F5F6F8] rounded-[4px] p-3 border border-gray-200">
              <span className="text-[11px] font-semibold text-[#6B7780] uppercase tracking-wider block">
                Promedio del Curso
              </span>
              <span className="text-xl font-bold text-[#008EE2] mt-0.5 block">{stats.promedio}</span>
            </div>

            <div className="bg-[#F5F6F8] rounded-[4px] p-3 border border-gray-200">
              <span className="text-[11px] font-semibold text-[#6B7780] uppercase tracking-wider block">
                Asistencia Exigida
              </span>
              <span className="text-xl font-bold text-amber-700 mt-0.5 block">≥ 75%</span>
            </div>
          </div>
        </div>

        {/* Buscador de RUT Personal */}
        <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card">
          <div className="max-w-xl">
            <label htmlFor="rut-search-input" className="block text-xs font-bold text-[#2D3B45] uppercase tracking-wider mb-1.5">
              Consulta tu Calificación Personal
            </label>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                id="rut-search-input"
                type="text"
                value={rutQuery}
                onChange={(e) => setRutQuery(e.target.value)}
                placeholder="Ingresa tu RUT (ej: 20.481.932-8 o 204819328)..."
                className="w-full pl-9 pr-24 py-2 border border-gray-300 rounded-[4px] text-xs focus:outline-none focus:ring-1 focus:ring-[#008EE2] focus:border-[#008EE2] font-mono"
              />
              {rutQuery && (
                <button
                  type="button"
                  onClick={() => setRutQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 px-1.5 py-0.5 rounded"
                >
                  Limpiar
                </button>
              )}
            </div>
            <p className="text-[11px] text-[#6B7780] mt-1.5">
              Ingresa los dígitos de tu RUT para filtrar y ubicar tu fila inmediatamente en la nómina.
            </p>
          </div>

          {/* Tarjeta de Resultado Individual si se encuentra coincidencia exacta */}
          {myStudentResult && (
            <div className="mt-4 p-4 rounded-[4px] border border-blue-200 bg-blue-50/50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-blue-100 pb-3">
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-[#008EE2]" />
                  <span className="text-xs font-bold text-[#2D3B45]">
                    Resultado Oficial para RUT:{" "}
                    <span className="font-mono text-[#008EE2] text-sm">{myStudentResult.rut}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <CanvasBadge
                    variant={
                      myStudentResult.asistencia_pct < 75
                        ? "danger"
                        : myStudentResult.nota_final >= 4.0
                        ? "success"
                        : "danger"
                    }
                  >
                    {myStudentResult.asistencia_pct < 75
                      ? "Reprobado por Inasistencia (RI)"
                      : myStudentResult.nota_final >= 4.0
                      ? "Aprobado"
                      : "Reprobado"}
                  </CanvasBadge>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 text-xs">
                <div className="bg-white p-2.5 rounded border border-blue-100">
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">
                    Informe Inicial
                  </span>
                  <span className="text-sm font-bold text-gray-800">
                    {myStudentResult.solemne_1.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-purple-700 block font-semibold">
                    +{myStudentResult.decimas_act1.toFixed(1)} décimas
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded border border-blue-100">
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">
                    Solemne Oficial
                  </span>
                  <span className="text-sm font-bold text-gray-800">
                    {myStudentResult.solemne_2.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-gray-400 block">20% Ponderación</span>
                </div>

                <div className="bg-white p-2.5 rounded border border-blue-100">
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">
                    Taller / Proyecto
                  </span>
                  <span className="text-sm font-bold text-gray-800">
                    {myStudentResult.taller_proyecto.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-gray-400 block">40% Ponderación</span>
                </div>

                <div className="bg-white p-2.5 rounded border border-blue-100">
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">
                    Asistencia
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      myStudentResult.asistencia_pct >= 75 ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    {myStudentResult.asistencia_pct}%
                  </span>
                  <span className="text-[10px] text-gray-500 block">
                    {myStudentResult.asistencia_pct >= 75 ? "Cumple (≥75%)" : "Insuficiente (<75%)"}
                  </span>
                </div>

                <div className="bg-yellow-50 p-2.5 rounded border border-yellow-200">
                  <span className="text-[10px] uppercase font-extrabold text-yellow-900 block">
                    Nota Final
                  </span>
                  <span className="text-lg font-extrabold text-yellow-950">
                    {myStudentResult.nota_final.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-yellow-800 block font-medium">
                    Escala de 1.0 a 7.0
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabla General de Calificaciones por RUT */}
        <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#2D3B45] flex items-center gap-2">
                <FileSpreadsheet size={16} className="text-emerald-700" />
                Nómina Oficial del Curso (Solo RUTs)
              </h3>
              <p className="text-xs text-[#6B7780]">
                Mostrando {filteredGrades.length} de {grades.length} registros. Solo se publican RUTs
                para resguardo de la privacidad estudiantil.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto border border-gray-300 rounded-[4px]">
            <table className="w-full text-left text-xs border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-100 text-gray-700 font-bold border-b border-gray-300 text-[11px] uppercase tracking-wider">
                  <th className="p-2.5 border-r border-gray-300 w-36">RUT</th>
                  <th className={`p-2.5 border-r border-gray-300 text-center ${hiddenCols["solemne_1"] ? "bg-amber-100/50" : "bg-blue-50/70"}`}>
                    <div>Informe Ini (20%)</div>
                    {hiddenCols["solemne_1"] && <span className="text-[9px] text-amber-800 font-bold block normal-case">En revisión</span>}
                  </th>
                  <th className={`p-2.5 border-r border-gray-300 text-center ${hiddenCols["decimas"] ? "bg-amber-100/50" : "bg-purple-50/70"}`}>
                    <div>+Décimas Ayud.</div>
                    {hiddenCols["decimas"] && <span className="text-[9px] text-amber-800 font-bold block normal-case">En revisión</span>}
                  </th>
                  <th className={`p-2.5 border-r border-gray-300 text-center ${hiddenCols["solemne_2"] ? "bg-amber-100/50" : ""}`}>
                    <div>Solemne (20%)</div>
                    {hiddenCols["solemne_2"] && <span className="text-[9px] text-amber-800 font-bold block normal-case">En revisión</span>}
                  </th>
                  <th className={`p-2.5 border-r border-gray-300 text-center ${hiddenCols["avance_1"] ? "bg-amber-100/50" : ""}`}>
                    <div>Avance 1 (20%)</div>
                    {hiddenCols["avance_1"] && <span className="text-[9px] text-amber-800 font-bold block normal-case">En revisión</span>}
                  </th>
                  <th className={`p-2.5 border-r border-gray-300 text-center ${hiddenCols["avance_2"] ? "bg-amber-100/50" : ""}`}>
                    <div>Avance 2 (20%)</div>
                    {hiddenCols["avance_2"] && <span className="text-[9px] text-amber-800 font-bold block normal-case">En revisión</span>}
                  </th>
                  <th className={`p-2.5 border-r border-gray-300 text-center ${hiddenCols["final"] ? "bg-amber-100/50" : ""}`}>
                    <div>Final (20%)</div>
                    {hiddenCols["final"] && <span className="text-[9px] text-amber-800 font-bold block normal-case">En revisión</span>}
                  </th>
                  <th className="p-2.5 border-r border-gray-300 text-center">Asist %</th>
                  <th className="p-2.5 border-r border-gray-300 text-center font-extrabold bg-yellow-100/60">
                    Nota Final
                  </th>
                  <th className="p-2.5 text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrades.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-gray-500 text-xs">
                      No se encontraron resultados para el RUT ingresado.
                    </td>
                  </tr>
                ) : (
                  filteredGrades.map((row) => {
                    const isSelected =
                      rutQuery.trim() && cleanRut(row.rut).includes(cleanRut(rutQuery));

                    return (
                      <tr
                        key={row.canvas_id}
                        className={`border-b border-gray-200 transition-colors ${
                          isSelected
                            ? "bg-blue-50/80 font-semibold"
                            : "hover:bg-gray-50/80"
                        }`}
                      >
                        <td className="p-2.5 font-mono font-bold text-[#2D3B45] border-r border-gray-200">
                          {row.rut}
                        </td>
                        <td className="p-2 text-center border-r border-gray-200 bg-blue-50/30 font-medium">
                          {hiddenCols["solemne_1"] ? (
                            <span className="text-gray-400 italic text-[11px]">En revisión</span>
                          ) : (
                            row.solemne_1.toFixed(1)
                          )}
                        </td>
                        <td className="p-2 text-center border-r border-gray-200 bg-purple-50/30">
                          {hiddenCols["decimas"] ? (
                            <span className="text-gray-400 italic text-[11px]">—</span>
                          ) : (
                            <span className="font-bold text-purple-800 px-2 py-0.5 bg-purple-100 rounded text-[11px]">
                              +{row.decimas_act1.toFixed(1)}
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 text-center border-r border-gray-200 font-medium">
                          {hiddenCols["solemne_2"] ? (
                            <span className="text-gray-400 italic text-[11px]">En revisión</span>
                          ) : (
                            row.solemne_2.toFixed(1)
                          )}
                        </td>
                        <td className="p-2.5 text-center border-r border-gray-200 text-gray-600">
                          {hiddenCols["avance_1"] ? (
                            <span className="text-gray-400 italic text-[11px]">En revisión</span>
                          ) : (
                            "6.0"
                          )}
                        </td>
                        <td className="p-2.5 text-center border-r border-gray-200 text-gray-600">
                          {hiddenCols["avance_2"] ? (
                            <span className="text-gray-400 italic text-[11px]">En revisión</span>
                          ) : (
                            "5.8"
                          )}
                        </td>
                        <td className="p-2.5 text-center border-r border-gray-200 font-medium">
                          {hiddenCols["final"] ? (
                            <span className="text-gray-400 italic text-[11px]">En revisión</span>
                          ) : (
                            row.taller_proyecto.toFixed(1)
                          )}
                        </td>
                        <td className="p-2.5 text-center border-r border-gray-200 font-semibold">
                          <span
                            className={
                              row.asistencia_pct < 75 ? "text-rose-600 font-bold" : "text-gray-700"
                            }
                          >
                            {row.asistencia_pct}%
                          </span>
                        </td>
                        <td className="p-2.5 text-center font-extrabold text-xs bg-yellow-50 border-r border-gray-200 text-yellow-950">
                          {row.nota_final.toFixed(1)}
                        </td>
                        <td className="p-2 text-center">
                          <CanvasBadge
                            variant={
                              row.asistencia_pct < 75
                                ? "danger"
                                : row.nota_final >= 4.0
                                ? "success"
                                : "danger"
                            }
                          >
                            {row.asistencia_pct < 75
                              ? "RI"
                              : row.nota_final >= 4.0
                              ? "Aprobado"
                              : "Reprobado"}
                          </CanvasBadge>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Nota al pie de asistencia y escala */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-[11px] text-[#6B7780] pt-2 gap-2">
            <div>
              <span className="font-semibold">Regla de Asistencia UDP:</span> Mínimo 75% obligatorio.
              RI = Reprobado por Inasistencia.
            </div>
            <div>
              <span className="font-semibold">Escala:</span> 1.0 a 7.0 • Aprobación con nota ≥ 4.0.
            </div>
          </div>
        </div>
      </main>

      {/* Footer Mínimo */}
      <footer className="text-center text-[11px] text-gray-500 py-4 border-t border-gray-200 bg-white">
        Universidad Diego Portales • Dirección de Docencia e Informática • Sistema Oficial Canvas UDP © 2026
      </footer>
    </div>
  );
}
