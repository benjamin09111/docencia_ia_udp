"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  INITIAL_SECTIONS,
  INITIAL_STUDENTS_ROSTER,
  StudentRosterItem,
  getSavedSections,
  getSectionByCourseCode,
  getTodayDateStr,
  getSavedAttendanceMap,
  getSavedStudentWorkRecords,
  getSavedTotalTrabajos,
  generateSemesterSessions,
} from "@/services/attendanceStore";
import {
  fetchAttendanceMapFromSupabase,
  fetchStudentWorkRecordsFromSupabase,
  isSupabaseConfigured,
} from "@/services/attendanceDbService";
import { CourseSection, ClassSession, StudentWorkRecord, AttendanceValue } from "@/types/attendance";
import {
  GraduationCap,
  Search,
  Award,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  User,
  Clock,
  ShieldCheck,
  Building2,
  X,
  Filter,
  Users,
  RefreshCw,
} from "lucide-react";

interface PublicAttendanceVisualViewProps {
  courseCode?: string;
  initialSectionId?: string;
}

export const PublicAttendanceVisualView: React.FC<PublicAttendanceVisualViewProps> = ({
  courseCode = "CIT3203_CA01",
  initialSectionId,
}) => {
  const [sections, setSections] = useState<CourseSection[]>(INITIAL_SECTIONS);

  // 1. Resolver sección exacta utilizando la función oficial y unificada
  const selectedSection = useMemo(() => {
    return getSectionByCourseCode(initialSectionId || courseCode, sections);
  }, [sections, initialSectionId, courseCode]);

  // Secciones hermanas del mismo curso para navegación rápida
  const siblingSections = useMemo(() => {
    if (selectedSection.codigo.includes("CIT3203") || selectedSection.cursoNombre?.includes("TICs")) {
      return sections.filter((s) => s.codigo.includes("CIT3203"));
    }
    if (selectedSection.codigo.includes("CIT2206") || selectedSection.cursoNombre?.includes("Gestión")) {
      return sections.filter((s) => s.codigo.includes("CIT2206"));
    }
    if (selectedSection.codigo.includes("CIT3100") || selectedSection.cursoNombre?.includes("Arquitecturas")) {
      return sections.filter((s) => s.codigo.includes("CIT3100"));
    }
    return sections.filter((s) => s.cursoNombre === selectedSection.cursoNombre);
  }, [sections, selectedSection]);

  // Mapeo preciso del Canvas Course ID según sección
  const effectiveCanvasCourseId = useMemo(() => {
    if (selectedSection.codigo === "CIT3203_CA01" || selectedSection.id === "sec_1") return 44999;
    if (selectedSection.codigo === "CIT3203_CA02" || selectedSection.id === "sec_2") return 45002;
    if (selectedSection.codigo === "CIT3203_CA03" || selectedSection.id === "sec_3") return 47552;
    if (selectedSection.codigo === "CIT2206_CA01" || selectedSection.id === "sec_gestion_org") return 47047;
    if (selectedSection.codigo === "CIT3100_CA02" || selectedSection.id === "sec_arq_emergentes") return 44988;
    return 44999;
  }, [selectedSection]);

  const [sessionUpdateCount, setSessionUpdateCount] = useState<number>(0);

  // Sesiones de la sección (filtradas a Ayudantías y estrictamente hasta la fecha actual)
  const sessions: ClassSession[] = useMemo(() => {
    const todayStr = getTodayDateStr();
    const all = generateSemesterSessions(selectedSection);
    const toDate = all.filter(
      (s) => s.tipo === "ayudantia" && s.estado !== "cancelada" && s.fecha <= todayStr
    );
    // Si el semestre apenas empieza y no hay clases pasadas, mostrar al menos 1 sesión para renderizar la tabla
    return toDate.length > 0
      ? toDate
      : all.filter((s) => s.tipo === "ayudantia" && s.estado !== "cancelada").slice(0, 1);
  }, [selectedSection, sessionUpdateCount]);

  // 2. Nómina Completa de Alumnos (Inicializada de forma segura para SSR sin mismatch)
  const [students, setStudents] = useState<StudentRosterItem[]>(() => {
    const matched = INITIAL_STUDENTS_ROSTER.filter((s) => s.seccionId === selectedSection.id);
    return matched.length > 0 ? matched : INITIAL_STUDENTS_ROSTER.slice(0, 12);
  });
  const [isLoadingStudents, setIsLoadingStudents] = useState<boolean>(true);

  // Asistencia y Décimas (Inicializadas con valores seguros y cargadas en cliente)
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceValue>>({});
  const [studentWorkRecords, setStudentWorkRecords] = useState<Record<number, StudentWorkRecord>>({});
  const [totalTrabajos, setTotalTrabajos] = useState<number>(3);

  // Cargar estado guardado en cliente de forma segura después de la hidratación
  useEffect(() => {
    setSections(getSavedSections());
    setAttendanceMap(getSavedAttendanceMap());
    setStudentWorkRecords(getSavedStudentWorkRecords());
    setTotalTrabajos(getSavedTotalTrabajos(selectedSection.id));

    if (typeof window !== "undefined") {
      const cached =
        localStorage.getItem(`udp_canvas_students_${effectiveCanvasCourseId}`) ||
        localStorage.getItem(`udp_canvas_students_${selectedSection.id}`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setStudents(parsed);
            setIsLoadingStudents(false);
          }
        } catch {}
      }
    }
  }, [effectiveCanvasCourseId, selectedSection.id]);

  // Cargar estudiantes oficiales de Canvas en vivo
  useEffect(() => {
    let isMounted = true;
    setIsLoadingStudents(true);

    fetch(`/api/canvas/courses/${effectiveCanvasCourseId}/students`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data) && data.length > 0) {
          const mapped: StudentRosterItem[] = data.map((u: any) => ({
            canvas_id: u.canvas_id,
            rut: u.rut,
            nombres: u.nombres,
            apellidos: u.apellidos,
            email: u.email,
            seccionId: selectedSection.id,
          }));

          setStudents(mapped);
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(`udp_canvas_students_${effectiveCanvasCourseId}`, JSON.stringify(mapped));
              localStorage.setItem(`udp_canvas_students_${selectedSection.id}`, JSON.stringify(mapped));
            } catch {}
          }
        }
      })
      .catch((err) => {
        console.warn("Aviso: usando nómina local de contingencia:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingStudents(false);
      });

    return () => {
      isMounted = false;
    };
  }, [effectiveCanvasCourseId, selectedSection.id]);

  // Cargar datos sincronizados desde Supabase si está disponible
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const secCode = selectedSection.codigo || courseCode;

    fetchAttendanceMapFromSupabase(secCode).then((map) => {
      if (Object.keys(map).length > 0) setAttendanceMap((prev) => ({ ...prev, ...map }));
    });

    fetchStudentWorkRecordsFromSupabase(secCode).then((records) => {
      if (Object.keys(records).length > 0) setStudentWorkRecords((prev) => ({ ...prev, ...records }));
    });
  }, [selectedSection, courseCode]);

  // Escuchar cambios locales en tiempo real (incluso entre pestañas del navegador)
  useEffect(() => {
    const handleSync = () => {
      setAttendanceMap(getSavedAttendanceMap());
      setStudentWorkRecords(getSavedStudentWorkRecords());
      setTotalTrabajos(getSavedTotalTrabajos(selectedSection.id));
      setSessionUpdateCount((c) => c + 1);
    };

    window.addEventListener("udp_attendance_updated", handleSync);
    window.addEventListener("udp_student_work_updated", handleSync);
    window.addEventListener("udp_total_trabajos_updated", handleSync);
    window.addEventListener("udp_canvas_students_updated", handleSync);
    window.addEventListener("udp_sessions_overrides_updated", handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      window.removeEventListener("udp_attendance_updated", handleSync);
      window.removeEventListener("udp_student_work_updated", handleSync);
      window.removeEventListener("udp_total_trabajos_updated", handleSync);
      window.removeEventListener("udp_canvas_students_updated", handleSync);
      window.removeEventListener("udp_sessions_overrides_updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [selectedSection.id]);

  // 3. Buscador y Filtros Inteligentes (tolerante a tildes, mayúsculas y formato de RUT)
  const [searchTerm, setSearchTerm] = useState("");
  const [conditionFilter, setConditionFilter] = useState<"all" | "ok" | "risk">("all");

  const normalizeStr = (str: string) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const normalizeRut = (rut: string) => rut.toLowerCase().replace(/[^0-9k]/g, "");

  const filteredStudents = useMemo(() => {
    const term = normalizeStr(searchTerm);
    const rutTerm = normalizeRut(searchTerm);

    return students.filter((s) => {
      // 1. Filtro de búsqueda por texto
      let matchesSearch = true;
      if (term) {
        const nomNorm = normalizeStr(s.nombres);
        const apeNorm = normalizeStr(s.apellidos);
        const fullNorm = `${nomNorm} ${apeNorm}`;
        const rutNorm = normalizeRut(s.rut);

        matchesSearch =
          nomNorm.includes(term) ||
          apeNorm.includes(term) ||
          fullNorm.includes(term) ||
          (rutTerm.length >= 2 && rutNorm.includes(rutTerm)) ||
          s.email.toLowerCase().includes(term);
      }

      if (!matchesSearch) return false;

      // 2. Filtro de condición (Al Día vs Riesgo)
      if (conditionFilter !== "all") {
        let asistidas = 0;
        sessions.forEach((sess) => {
          if (attendanceMap[`${sess.id}_${s.canvas_id}`] === 1) asistidas++;
        });
        const pct = sessions.length > 0 ? Math.round((asistidas / sessions.length) * 100) : 0;
        const isOk = pct >= 75;

        if (conditionFilter === "ok" && !isOk) return false;
        if (conditionFilter === "risk" && isOk) return false;
      }

      return true;
    });
  }, [students, searchTerm, conditionFilter, sessions, attendanceMap]);

  // Resumen calculado por cada estudiante filtrado
  const studentSummaries = useMemo(() => {
    return filteredStudents.map((st) => {
      let asistidas = 0;
      sessions.forEach((sess) => {
        if (attendanceMap[`${sess.id}_${st.canvas_id}`] === 1) asistidas++;
      });
      const validas = sessions.length;
      const pct = validas > 0 ? Math.round((asistidas / validas) * 100) : 0;
      const decimas = studentWorkRecords[st.canvas_id]?.decimas ?? 0;
      const ok = pct >= 75;

      return {
        ...st,
        asistidas,
        validas,
        pct,
        ok,
        decimas,
        trabajosRealizados: totalTrabajos,
      };
    });
  }, [filteredStudents, sessions, attendanceMap, studentWorkRecords, totalTrabajos]);

  // Alumno destacado cuando hay búsqueda precisa y coincide 1 estudiante
  const highlightedStudent = useMemo(() => {
    if (searchTerm.trim().length >= 3 && studentSummaries.length === 1) {
      return studentSummaries[0];
    }
    return null;
  }, [searchTerm, studentSummaries]);

  // Promedio de asistencia global de la nómina
  const promedioGeneralPct = useMemo(() => {
    if (studentSummaries.length === 0) return 0;
    const total = studentSummaries.reduce((acc, s) => acc + s.pct, 0);
    return Math.round(total / studentSummaries.length);
  }, [studentSummaries]);

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-4 sm:space-y-5 animate-fadeIn">
      {/* 1. Header Oficial Institucional */}
      <header className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-12 h-12 rounded-[4px] bg-[#C8102E] text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
              <GraduationCap size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Universidad Diego Portales • FING
                </span>
                <span className="text-[11px] font-mono text-[#008EE2] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-bold">
                  {selectedSection.codigo}
                </span>
                <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                  <ShieldCheck size={12} /> Solo Lectura Oficial
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-[#2D3B45] tracking-tight mt-0.5">
                {selectedSection.cursoNombre || "Asignatura UDP"} — {selectedSection.nombre}
              </h1>
              <p className="text-xs text-[#6B7780] mt-0.5">
                Ayudante: <span className="font-semibold text-[#2D3B45]">{selectedSection.ayudante}</span> • Profesor:{" "}
                <span className="font-semibold text-[#2D3B45]">{selectedSection.profesor}</span>
              </p>
            </div>
          </div>

          {/* Enlace para marcar asistencia con PIN */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <a
              href={`/asistencia/${selectedSection.codigo || courseCode}`}
              className="px-3.5 py-2 bg-[#008EE2] hover:bg-[#0077BE] text-white rounded-[4px] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Llenar Asistencia con PIN</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Selector de Sección si el curso cuenta con varias secciones (ej. TICs II) */}
        {siblingSections.length > 1 && (
          <div className="mt-4 pt-3 border-t border-[#E0E3E6] flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-[#6B7780] uppercase tracking-wider flex items-center gap-1">
              <Users size={12} /> Secciones del Curso:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {siblingSections.map((sec) => {
                const isCurrent = sec.id === selectedSection.id || sec.codigo === selectedSection.codigo;
                return (
                  <a
                    key={sec.id}
                    href={`/asistencia/${sec.codigo}/visual`}
                    className={`px-2.5 py-1 text-xs rounded-[3px] font-semibold border transition-all ${
                      isCurrent
                        ? "bg-[#2D3B45] text-white border-[#2D3B45] shadow-xs"
                        : "bg-gray-50 text-[#55636E] border-gray-200 hover:bg-white hover:text-[#2D3B45]"
                    }`}
                  >
                    {sec.nombre} ({sec.codigo})
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* 2. Tarjetas KPI de la Sección */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-3 shadow-xs">
          <span className="text-[11px] font-semibold text-[#6B7780] block uppercase tracking-wider">
            Trabajos en Ayudantía a la Fecha
          </span>
          <div className="flex items-center gap-2 mt-1">
            <Award size={18} className="text-amber-600" />
            <span className="text-xl font-bold text-amber-900">{totalTrabajos}</span>
            <span className="text-[11px] text-gray-500 font-medium">talleres</span>
          </div>
        </div>

        <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-3 shadow-xs">
          <span className="text-[11px] font-semibold text-[#6B7780] block uppercase tracking-wider">
            Sesiones a la Fecha
          </span>
          <div className="flex items-center gap-2 mt-1">
            <Calendar size={18} className="text-[#008EE2]" />
            <span className="text-xl font-bold text-[#2D3B45]">{sessions.length}</span>
            <span className="text-[11px] text-gray-500 font-medium">realizadas</span>
          </div>
        </div>

        <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-3 shadow-xs">
          <span className="text-[11px] font-semibold text-[#6B7780] block uppercase tracking-wider">
            Estudiantes Canvas
          </span>
          <div className="flex items-center gap-2 mt-1">
            <User size={18} className="text-[#2D3B45]" />
            <span className="text-xl font-bold text-[#2D3B45]">{students.length}</span>
            <span className="text-[11px] text-gray-500 font-medium">
              {isLoadingStudents ? "sincronizando..." : "matriculados"}
            </span>
          </div>
        </div>

        <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-3 shadow-xs">
          <span className="text-[11px] font-semibold text-[#6B7780] block uppercase tracking-wider">
            Promedio Sección
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-xl font-bold ${
                promedioGeneralPct >= 75 ? "text-emerald-700" : "text-amber-700"
              }`}
            >
              {promedioGeneralPct}%
            </span>
            <span className="text-[11px] text-gray-500 font-medium">asistencia</span>
          </div>
        </div>
      </div>

      {/* 3. Buscador y Filtro Personalizado para Estudiantes */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h2 className="text-sm font-bold text-[#2D3B45] flex items-center gap-1.5">
              <Search size={15} className="text-[#008EE2]" />
              <span>Búsqueda Rápida de Estudiante y Calificaciones</span>
            </h2>
            <p className="text-[11px] text-[#6B7780]">
              Escribe tu nombre, apellido o RUT para ubicar tu fila inmediatamente en la nómina oficial.
            </p>
          </div>

          {/* Barra de Búsqueda con Botón Limpiar */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full sm:w-80">
              <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por Nombre, Apellido o RUT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-8 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-[4px] text-[#2D3B45] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#008EE2] shadow-inner"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-2 text-gray-400 hover:text-gray-700"
                  title="Limpiar búsqueda"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filtros Rápidos */}
            <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-[4px] border border-gray-200 shrink-0">
              <button
                type="button"
                onClick={() => setConditionFilter("all")}
                className={`px-2 py-1 text-[11px] font-semibold rounded-[3px] transition-colors ${
                  conditionFilter === "all"
                    ? "bg-white text-[#2D3B45] shadow-xs"
                    : "text-[#6B7780] hover:text-[#2D3B45]"
                }`}
              >
                Todos ({students.length})
              </button>
              <button
                type="button"
                onClick={() => setConditionFilter("ok")}
                className={`px-2 py-1 text-[11px] font-semibold rounded-[3px] transition-colors ${
                  conditionFilter === "ok"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-emerald-700 hover:bg-emerald-50"
                }`}
                title="Filtrar alumnos con ≥75% de asistencia"
              >
                ≥75%
              </button>
              <button
                type="button"
                onClick={() => setConditionFilter("risk")}
                className={`px-2 py-1 text-[11px] font-semibold rounded-[3px] transition-colors ${
                  conditionFilter === "risk"
                    ? "bg-red-600 text-white shadow-xs"
                    : "text-red-700 hover:bg-red-50"
                }`}
                title="Filtrar alumnos con <75% de asistencia"
              >
                &lt;75%
              </button>
            </div>
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
          <span className="text-[#6B7780]">
            Mostrando <strong>{studentSummaries.length}</strong> de {students.length} estudiantes
            {searchTerm && ` para "${searchTerm}"`}
          </span>
          {isLoadingStudents && (
            <span className="text-[11px] text-[#008EE2] flex items-center gap-1 font-medium">
              <RefreshCw size={11} className="animate-spin" /> Actualizando desde Canvas UDP...
            </span>
          )}
        </div>

        {/* Tarjeta destacada cuando coincide 1 estudiante */}
        {highlightedStudent && (
          <div className="bg-blue-50/80 border border-blue-200 rounded-[4px] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
            <div>
              <span className="text-[10px] font-bold text-[#008EE2] uppercase tracking-wider block">
                Tu Ficha Oficial de Asistencia
              </span>
              <h3 className="text-sm font-bold text-[#2D3B45]">
                {highlightedStudent.apellidos}, {highlightedStudent.nombres}
              </h3>
              <p className="text-xs font-mono text-[#6B7780]">
                RUT: {highlightedStudent.rut} • {highlightedStudent.email}
              </p>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="text-center">
                <span className="text-[10px] text-gray-500 font-semibold block uppercase">Décimas</span>
                <span className="text-base font-black text-amber-800">
                  {highlightedStudent.decimas} déc.
                </span>
              </div>

              <div className="text-center">
                <span className="text-[10px] text-gray-500 font-semibold block uppercase">Trabajos</span>
                <span className="text-base font-black text-indigo-900">
                  {highlightedStudent.trabajosRealizados} / {totalTrabajos}
                </span>
              </div>

              <div className="text-center">
                <span className="text-[10px] text-gray-500 font-semibold block uppercase">Asistencia</span>
                <span
                  className={`text-base font-black ${
                    highlightedStudent.ok ? "text-emerald-700" : "text-red-700"
                  }`}
                >
                  {highlightedStudent.pct}% ({highlightedStudent.asistidas}/{highlightedStudent.validas})
                </span>
              </div>

              <div className="text-center">
                <span className="text-[10px] text-gray-500 font-semibold block uppercase">Condición</span>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold ${
                    highlightedStudent.ok
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-red-100 text-red-800 border border-red-300"
                  }`}
                >
                  {highlightedStudent.ok ? "✓ Al Día (OK)" : "⚠ Riesgo RI (<75%)"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Matriz Completa Estilo "Excel" en Solo Lectura */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] shadow-xs overflow-hidden">
        <div className="p-3 bg-[#FAFBFB] border-b border-[#E0E3E6] flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
          <span className="font-bold text-[#2D3B45] flex items-center gap-1.5">
            <Building2 size={14} className="text-[#008EE2]" />
            <span>Planilla Oficial de Ayudantías (A la fecha: {sessions.length} clases realizadas)</span>
          </span>
          <span className="text-[11px] text-[#6B7780]">
            Valores: 1 = Presente • 0 = Ausente • Exigencia reglamentaria UDP: 75% Asistencia
          </span>
        </div>

        {studentSummaries.length === 0 ? (
          <div className="py-12 px-4 text-center space-y-3 bg-white">
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 text-[#008EE2] flex items-center justify-center">
              <Search size={22} />
            </div>
            <h3 className="text-sm font-bold text-[#2D3B45]">
              No se encontraron alumnos para &quot;{searchTerm}&quot;
            </h3>
            <p className="text-xs text-[#6B7780] max-w-sm mx-auto">
              Verifica el texto ingresado o haz clic en limpiar para ver la nómina completa del curso.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setConditionFilter("all");
              }}
              className="px-3 py-1.5 bg-[#F5F6F8] hover:bg-gray-200 text-[#2D3B45] rounded-[4px] text-xs font-semibold border border-gray-300 transition-colors"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="overflow-y-auto overflow-x-auto max-h-[640px] xl:max-h-[720px] rounded-[4px] border-t border-[#E0E3E6]">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 z-20 bg-[#2D3B45] text-white shadow-xs">
                <tr>
                  <th className="p-2.5 border-r border-[#1E272E] sticky left-0 z-30 bg-[#2D3B45] w-12 min-w-[48px] max-w-[48px] text-center text-[10px] font-bold">
                    #
                  </th>
                  <th className="p-2.5 border-r border-[#1E272E] sticky left-12 z-30 bg-[#2D3B45] w-[280px] min-w-[240px] text-xs font-bold">
                    Estudiante (RUT)
                  </th>

                  {/* Columna Décimas / Trabajos */}
                  <th className="p-2 text-center border-r border-[#1E272E] w-[125px] min-w-[115px] text-xs font-bold bg-[#1E272E] text-amber-300">
                    <div className="flex flex-col items-center justify-center">
                      <span className="flex items-center gap-1 font-extrabold">
                        <Award size={13} /> Déc. / Trab.
                      </span>
                      <span className="text-[10px] text-gray-300 font-mono">
                        (Total: {totalTrabajos})
                      </span>
                    </div>
                  </th>

                  {/* Columnas de Sesiones de Ayudantía */}
                  {sessions.map((sess) => {
                    const parts = sess.fecha.split("-");
                    const diaMes = parts.length === 3 ? `${parts[2]}/${parts[1]}` : sess.fecha;
                    return (
                      <th
                        key={sess.id}
                        className="p-2 text-center border-r border-white/10 w-[55px] min-w-[48px] text-[11px] font-mono font-bold"
                        title={`Ayudantía del ${sess.fecha} (${sess.diaSemana})`}
                      >
                        <div className="flex flex-col items-center justify-center leading-none">
                          <span>{diaMes}</span>
                          <span className="text-[9px] text-gray-300 font-sans mt-0.5">Ayu</span>
                        </div>
                      </th>
                    );
                  })}

                  {/* Métricas Finales */}
                  <th className="p-2 text-center border-r border-[#1E272E] w-[60px] min-w-[55px] text-[11px] font-bold uppercase">
                    Asist.
                  </th>
                  <th className="p-2 text-center border-r border-[#1E272E] w-[60px] min-w-[55px] text-[11px] font-bold uppercase">
                    %
                  </th>
                  <th className="p-2 text-center w-[75px] min-w-[70px] text-[11px] font-bold uppercase">
                    Estado
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {studentSummaries.map((st, idx) => {
                  const isHighlighted = highlightedStudent?.canvas_id === st.canvas_id;
                  return (
                    <tr
                      key={st.canvas_id}
                      className={`group hover:bg-blue-50/50 transition-colors ${
                        isHighlighted ? "bg-blue-100/70 font-semibold" : ""
                      }`}
                    >
                      {/* Número de orden */}
                      <td
                        className={`p-2 text-center sticky left-0 z-10 border-r border-gray-200 text-gray-400 font-mono text-xs w-12 min-w-[48px] max-w-[48px] ${
                          isHighlighted ? "bg-blue-100" : "bg-white group-hover:bg-blue-50"
                        }`}
                      >
                        {idx + 1}
                      </td>

                      {/* Nombre y RUT (Sticky) */}
                      <td
                        className={`p-2 sticky left-12 z-10 border-r border-gray-200 w-[280px] min-w-[240px] ${
                          isHighlighted ? "bg-blue-100" : "bg-white group-hover:bg-blue-50"
                        }`}
                      >
                        <div className="font-bold text-[#2D3B45] text-xs">
                          {st.apellidos}, {st.nombres}
                        </div>
                        <span className="text-[10px] text-gray-500 font-mono block">
                          {st.rut}
                        </span>
                      </td>

                      {/* Décimas / Trabajos Realizados */}
                      <td className="p-1.5 text-center border-r border-gray-200 bg-amber-50/20">
                        <span className="font-mono text-xs font-bold text-amber-900 bg-amber-100/80 px-1.5 py-0.5 rounded border border-amber-300">
                          {st.decimas}d
                        </span>
                        <span className="text-gray-400 font-bold mx-1">/</span>
                        <span className="font-mono text-xs font-bold text-indigo-900 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                          {totalTrabajos}
                        </span>
                      </td>

                      {/* Asistencia por cada clase */}
                      {sessions.map((sess) => {
                        const val = attendanceMap[`${sess.id}_${st.canvas_id}`] ?? 0;
                        return (
                          <td
                            key={sess.id}
                            className={`p-1.5 text-center font-mono text-xs border-r border-gray-100 ${
                              val === 1
                                ? "bg-emerald-50/60 text-emerald-800 font-bold"
                                : "text-gray-300 font-normal"
                            }`}
                          >
                            {val === 1 ? "1" : "0"}
                          </td>
                        );
                      })}

                      {/* Asistidas */}
                      <td className="p-1.5 text-center font-mono text-xs font-bold text-[#2D3B45] border-r border-gray-200">
                        {st.asistidas}
                      </td>

                      {/* Porcentaje */}
                      <td
                        className={`p-1.5 text-center font-mono text-xs font-bold border-r border-gray-200 ${
                          st.ok ? "text-emerald-700 bg-emerald-50/30" : "text-red-700 bg-red-50/30"
                        }`}
                      >
                        {st.pct}%
                      </td>

                      {/* Estado */}
                      <td className="p-1.5 text-center">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            st.ok
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : "bg-red-100 text-red-800 border border-red-300"
                          }`}
                        >
                          {st.ok ? "OK" : "RI"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {/* Pie totalizador */}
              <tfoot className="sticky bottom-0 z-20 bg-[#FAFBFB] border-t-2 border-gray-300 font-bold text-xs text-[#2D3B45] shadow-xs">
                <tr>
                  <td colSpan={2} className="p-2.5 sticky left-0 z-30 bg-[#FAFBFB] border-r border-gray-300">
                    TOTAL ALUMNOS: {studentSummaries.length}
                  </td>
                  <td className="p-2 text-center border-r border-gray-300 bg-amber-50 text-amber-900 font-mono text-[11px]">
                    {studentSummaries.reduce((acc, s) => acc + s.decimas, 0)}d / {totalTrabajos}t
                  </td>
                  {sessions.map((sess) => {
                    const count = studentSummaries.filter(
                      (s) => (attendanceMap[`${sess.id}_${s.canvas_id}`] ?? 0) === 1
                    ).length;
                    return (
                      <td
                        key={sess.id}
                        className="p-1 text-center font-mono text-[11px] text-emerald-800 border-r border-gray-200"
                      >
                        {count}
                      </td>
                    );
                  })}
                  <td colSpan={3} className="p-2 text-center text-gray-500 font-normal text-[11px]">
                    Mínimo Reglamentario: 75%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* 5. Footer Institucional */}
      <footer className="text-center text-xs text-gray-500 py-3 border-t border-gray-200">
        Portal Oficial de Consulta Académica • Universidad Diego Portales © 2026
      </footer>
    </div>
  );
};
