import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Download,
  Settings,
  Link as LinkIcon,
  RotateCcw,
  Check,
  Calendar,
  Zap,
  Users,
  AlertCircle,
  GraduationCap,
  Clock,
  Eye,
  Link2,
  Award,
  KeyRound,
  Tv,
  Copy,
  RefreshCw,
  QrCode,
  X,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { AttendanceExportScope } from "@/services/excelExportService";
import { StudentAttendanceSummary, TodaySessionInfo, AttendanceValue, StudentWorkRecord, CourseSection } from "@/types/attendance";
import { getPublicVisualUrl, getPublicCheckinUrl } from "@/utils/urlHelper";
import { AttendanceShareDailyModal } from "./AttendanceShareDailyModal";

interface AttendanceFilterBarProps {
  filterType: "catedras" | "ayudantias";
  onFilterTypeChange: (type: "catedras" | "ayudantias") => void;
  sectionCode?: string;
  currentSection?: CourseSection;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onOpenConfig?: () => void;
  onOpenPublicLink?: () => void;
  onExportExcel: (scope: AttendanceExportScope) => void;
  onResetToZero?: () => void;
  incluirAyudantiasEnFinal: boolean;
  onToggleIncluirAyudantias: () => void;
  // PIN y Control de Sala
  activePin?: string;
  onRegeneratePin?: () => void;
  livePresentesCount?: number;
  totalEstudiantesCount?: number;
  // Marcación Rápida
  todaySessionInfo?: TodaySessionInfo;
  matchingSummaries?: StudentAttendanceSummary[];
  attendanceMap?: Record<string, AttendanceValue>;
  studentWorkRecords?: Record<number, StudentWorkRecord>;
  totalTrabajosRealizados?: number;
  onUpdateTotalTrabajos?: (total: number) => void;
  onUpdateWorkRecord?: (studentId: number, decimas: number, trabajosRealizados: number) => void;
  onMarkTodayAttendance?: (studentId: number, targetSessionId?: string) => void;
}

export const AttendanceFilterBar: React.FC<AttendanceFilterBarProps> = ({
  filterType,
  onFilterTypeChange,
  sectionCode,
  currentSection,
  searchTerm,
  onSearchChange,
  onOpenConfig,
  onOpenPublicLink,
  onExportExcel,
  onResetToZero,
  incluirAyudantiasEnFinal,
  onToggleIncluirAyudantias,
  activePin,
  onRegeneratePin,
  livePresentesCount = 0,
  totalEstudiantesCount = 0,
  todaySessionInfo,
  matchingSummaries = [],
  attendanceMap = {},
  studentWorkRecords = {},
  totalTrabajosRealizados = 3,
  onUpdateTotalTrabajos,
  onUpdateWorkRecord,
  onMarkTodayAttendance,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [copiedVisual, setCopiedVisual] = useState(false);
  const [copiedCheckin, setCopiedCheckin] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showDailyShareModal, setShowDailyShareModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const effectivePin = activePin || currentSection?.pinActivo || "4821";
  const checkinUrl = getPublicCheckinUrl(sectionCode || currentSection?.codigo || "CIT3203_CA01");

  const handleCopyVisualLink = () => {
    const url = getPublicVisualUrl(sectionCode || currentSection?.codigo || "CIT3203_CA01");
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setCopiedVisual(true);
    setTimeout(() => setCopiedVisual(false), 2500);
  };

  const handleCopyCheckinLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(checkinUrl);
    }
    setCopiedCheckin(true);
    setTimeout(() => setCopiedCheckin(false), 2500);
  };

  const handleCopyPin = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(effectivePin);
    }
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2500);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasSessionToday = Boolean(todaySessionInfo?.todaySession);

  return (
    <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-3 shadow-canvas-card space-y-3">
      {/* Fila Principal: Tabs Clases + Selector Global de Trabajos + Acciones */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-3">
        {/* Módulo de Ayudantías Activo y Trabajos Globales */}
        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
          <div className="flex items-center gap-1.5 p-1 bg-purple-50 rounded-[4px] border border-purple-200">
            <div className="px-3 py-1.5 rounded-[3px] text-xs font-bold flex items-center gap-2 bg-[#2D3B45] text-white shadow-xs">
              <GraduationCap size={15} className="text-purple-300" />
              <span>Asistencia a Ayudantías</span>
            </div>

            {/* Indicador de estado de la sesión de hoy */}
            {todaySessionInfo && (
              <div
                className={`px-2.5 py-1 rounded-[3px] text-[11px] font-semibold flex items-center gap-1.5 ${
                  hasSessionToday
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-gray-100 text-[#55636E] border border-gray-200"
                }`}
              >
                <Clock size={12} className={hasSessionToday ? "text-emerald-600" : "text-gray-500"} />
                <span>
                  {hasSessionToday
                    ? `Hoy clase activa (${todaySessionInfo.todayDateStr.slice(5)})`
                    : `Próxima: ${todaySessionInfo.nextSession?.fecha.slice(5) || "Sin fecha"} (${todaySessionInfo.diasConfigurados})`}
                </span>
              </div>
            )}
          </div>

          {/* Control Global: Trabajos en ayudantía realizados a la fecha para toda la sección */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-300 rounded-[4px] shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <Award size={14} className="text-amber-700" />
              <span>Trabajos en ayudantía a la fecha:</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onUpdateTotalTrabajos && onUpdateTotalTrabajos(Math.max(0, totalTrabajosRealizados - 1))}
                className="w-5 h-5 flex items-center justify-center bg-white border border-amber-300 rounded text-amber-800 hover:bg-amber-100 font-bold text-xs transition-colors"
                title="Restar 1 trabajo total a la fecha"
              >
                -
              </button>
              <input
                type="number"
                min={0}
                max={50}
                value={totalTrabajosRealizados}
                onChange={(e) => onUpdateTotalTrabajos && onUpdateTotalTrabajos(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-11 h-6 text-center text-xs font-black bg-white border border-amber-400 rounded text-amber-950 focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-inner"
                title="Trabajos en ayudantía realizados hasta la fecha (se aplica automáticamente a todos los alumnos)"
              />
              <button
                type="button"
                onClick={() => onUpdateTotalTrabajos && onUpdateTotalTrabajos(totalTrabajosRealizados + 1)}
                className="w-5 h-5 flex items-center justify-center bg-white border border-amber-300 rounded text-amber-800 hover:bg-amber-100 font-bold text-xs transition-colors"
                title="Sumar 1 trabajo total a la fecha"
              >
                +
              </button>
            </div>
            <span className="text-[10px] text-amber-700 font-semibold bg-amber-100/70 px-1.5 py-0.5 rounded">
              Aplica a todos
            </span>
          </div>
        </div>

        {/* Botones de Acción Oficiales */}
        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
          {/* 1. Compartir link del día & PIN de pizarra */}
          <button
            type="button"
            onClick={() => setShowDailyShareModal(true)}
            className="px-3 py-1.5 rounded-[4px] text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs bg-[#2D3B45] hover:bg-[#1E272E] text-white"
            title="Genera el link del día y muestra el PIN de 4 dígitos para escribirlo en la pizarra"
          >
            <KeyRound size={14} className="text-amber-300" />
            <span>PIN Pizarra</span>
          </button>

          {/* 2. Copiar enlace visual */}
          <button
            type="button"
            onClick={handleCopyVisualLink}
            className={`px-3 py-1.5 rounded-[4px] text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs ${
              copiedVisual
                ? "bg-emerald-600 text-white border border-emerald-600"
                : "bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#008EE2]"
            }`}
            title="Copia el enlace de solo lectura para que los alumnos revisen su asistencia y décimas"
          >
            {copiedVisual ? <Check size={14} /> : <Eye size={14} />}
            <span>{copiedVisual ? "Copiado" : "Ver pública"}</span>
          </button>

          {/* 3. Descargar Excel */}
          <button
            type="button"
            onClick={() => onExportExcel("ayudantias")}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-[4px] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            title="Descargar planilla Excel oficial (.xlsx) de ayudantías"
          >
            <Download size={13} />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* Fila Especial: Acceso Rápido a PIN de Pizarra y Comparador en Vivo */}
      <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-2.5 p-2.5 bg-gradient-to-r from-amber-50/70 via-blue-50/40 to-purple-50/60 border border-amber-200/80 rounded-[4px] shadow-2xs">
        {/* Acceso rápido a PIN de Pizarra */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowDailyShareModal(true)}
            className="flex items-center gap-2 px-3 py-1 bg-white hover:bg-amber-50 border border-amber-300 rounded-[3px] shadow-2xs transition-colors cursor-pointer group"
            title="Haz clic para ver el PIN en grande y copiar el link del día para la pizarra"
          >
            <KeyRound size={13} className="text-amber-600 shrink-0" />
            <span className="text-[11px] font-bold text-amber-950">PIN Pizarra Hoy:</span>
            <span className="px-2 py-0.5 bg-amber-100 text-[#2D3B45] font-mono font-black text-xs rounded border border-amber-300 tracking-wider group-hover:bg-amber-200 transition-colors">
              {effectivePin}
            </span>
            <span className="text-[10px] text-[#008EE2] underline font-semibold ml-1">
              Ver Link & Proyectar
            </span>
          </button>

          {onRegeneratePin && (
            <button
              type="button"
              onClick={onRegeneratePin}
              className="px-2 py-1 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-[3px] text-[11px] font-semibold flex items-center gap-1 transition-colors"
              title="Generar un nuevo PIN aleatorio para esta sesión"
            >
              <RefreshCw size={11} className="text-gray-500" />
              <span>Nuevo PIN</span>
            </button>
          )}
        </div>

        {/* Comparador de Asistencia en Vivo (Estudiantes presentes en sala vs marcados) */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-emerald-300 rounded-[3px] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-[11px] font-bold text-emerald-950">Presentes Hoy en Sala:</span>
            <span className="px-2 py-0.2 bg-emerald-100 text-emerald-900 font-mono font-black text-xs rounded border border-emerald-300">
              {livePresentesCount} / {totalEstudiantesCount}
            </span>
            <span className="text-[10px] text-gray-500 hidden sm:inline">
              ({totalEstudiantesCount > 0 ? Math.round((livePresentesCount / totalEstudiantesCount) * 100) : 0}%)
            </span>
          </div>

          {onOpenConfig && (
            <button
              type="button"
              onClick={onOpenConfig}
              className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-gray-300 rounded-[3px] text-[11px] font-semibold text-gray-700 flex items-center gap-1 transition-colors"
              title="Modificar ubicación GPS, radio de cobertura o días y horarios de la sección"
            >
              <Settings size={12} className="text-[#008EE2]" />
              <span>Configurar</span>
            </button>
          )}
        </div>
      </div>

      {/* Fila 2: Buscador */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-2 border-t border-gray-100 text-xs">
        <span className="text-[11px] text-[#6B7780] font-medium">
          Busca un alumno por nombre o RUT para marcar su asistencia de forma instantánea.
        </span>

        {/* Buscador de estudiantes */}
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar alumno (ej. Benjamín, Valentina, RUT)..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-8 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-[4px] focus:bg-white focus:outline-hidden focus:border-[#008EE2] transition-colors"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Panel de Marcación Rápida cuando hay búsqueda activa */}
      {searchTerm.trim().length > 0 && (
        <div className="bg-[#F0F8FF] border border-[#B3E5FC] rounded-[4px] p-3 space-y-2.5 animate-fadeIn">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold flex items-center gap-1.5 text-[#008EE2]">
              <Users size={14} />
              {matchingSummaries.length}{" "}
              {matchingSummaries.length === 1 ? "alumno coincidente" : "alumnos coincidentes"}
            </span>
            <span className="text-[11px] text-[#6B7780]">
              Haz clic en <strong>Marcar Asistencia Hoy</strong> para registrar o alternar su presencia
            </span>
          </div>

          {matchingSummaries.length === 0 ? (
            <div className="py-2 text-center text-xs text-gray-500">
              No se encontraron alumnos con el criterio &quot;{searchTerm}&quot;.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {matchingSummaries.slice(0, 6).map((st) => {
                const targetSession = todaySessionInfo?.todaySession || todaySessionInfo?.nextSession;
                const currentVal = targetSession ? attendanceMap[`${targetSession.id}_${st.canvas_id}`] ?? 0 : 0;
                const isPresent = currentVal === 1;

                return (
                  <div
                    key={st.canvas_id}
                    className="bg-white border border-gray-200 hover:border-[#008EE2] rounded-[4px] p-2.5 flex items-center justify-between gap-2 shadow-2xs transition-all"
                  >
                    <div className="min-w-0 pr-1 space-y-1">
                      <div>
                        <span className="font-bold text-xs text-[#2D3B45] truncate block">
                          {st.nombres} {st.apellidos}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono block">
                          {st.rut} • {st.ayudantiasPct}% asist.
                        </span>
                      </div>

                      {/* Inputs Décimas / Trabajos Realizados */}
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <span className="text-[10px] text-[#6B7780] font-semibold">Déc / Trab:</span>
                        <div className="flex items-center gap-1 font-mono">
                          <input
                            type="number"
                            min={0}
                            max={99}
                            value={studentWorkRecords[st.canvas_id]?.decimas ?? 0}
                            onChange={(e) =>
                              onUpdateWorkRecord &&
                              onUpdateWorkRecord(
                                st.canvas_id,
                                Math.max(0, parseInt(e.target.value, 10) || 0),
                                totalTrabajosRealizados
                              )
                            }
                            className="w-10 h-5 text-center font-bold text-amber-950 bg-amber-100/70 border border-amber-300 rounded focus:bg-white text-[11px]"
                            title="Décimas acumuladas del estudiante"
                          />
                          <span className="text-gray-400 font-bold text-xs">/</span>
                          <span
                            className="px-1.5 py-0.5 text-center font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 rounded text-[11px]"
                            title={`Trabajos realizados a la fecha: ${totalTrabajosRealizados} (configurado para todos)`}
                          >
                            {totalTrabajosRealizados}
                          </span>
                        </div>
                      </div>
                    </div>

                    {hasSessionToday ? (
                      <button
                        type="button"
                        onClick={() => onMarkTodayAttendance && onMarkTodayAttendance(st.canvas_id, targetSession?.id)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-[3px] flex items-center gap-1.5 transition-all shrink-0 active:scale-95 ${
                          isPresent
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs"
                            : "bg-white border-2 border-[#008EE2] text-[#008EE2] hover:bg-blue-50"
                        }`}
                        title={isPresent ? "Hacer clic para desmarcar (poner 0)" : "Hacer clic para marcar Presente (1)"}
                      >
                        {isPresent ? <Check size={13} className="stroke-[3]" /> : <Zap size={13} />}
                        <span>{isPresent ? "Presente Hoy" : "Marcar Asistencia Hoy"}</span>
                      </button>
                    ) : (
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-[10px] text-amber-900 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-semibold">
                          Hoy no hay clase ({todaySessionInfo?.diaActualNombre})
                        </span>
                        {todaySessionInfo?.nextSession && (
                          <button
                            type="button"
                            onClick={() =>
                              onMarkTodayAttendance &&
                              onMarkTodayAttendance(st.canvas_id, todaySessionInfo.nextSession?.id)
                            }
                            className={`text-[10px] px-2 py-0.5 rounded border transition-colors flex items-center gap-1 font-semibold ${
                              isPresent
                                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                : "bg-gray-100 hover:bg-blue-50 text-[#008EE2] border-gray-300"
                            }`}
                            title={`Marcar para la sesión programada del ${todaySessionInfo.nextSession.fecha}`}
                          >
                            {isPresent && <Check size={10} />}
                            <span>Marcar próx. ({todaySessionInfo.nextSession.fecha.slice(5)})</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal de Proyección de PIN para Pantalla Gigante en Sala */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 sm:p-8 animate-fadeIn">
          <div className="bg-white border border-[#E0E3E6] rounded-[6px] shadow-canvas-modal max-w-2xl w-full p-6 sm:p-8 space-y-6 text-center relative">
            <button
              onClick={() => setShowProjectModal(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              title="Cerrar proyección"
            >
              <X size={20} />
            </button>

            {/* Cabecera Proyector */}
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <span className="px-2.5 py-0.5 bg-[#FFEBEE] text-[#C8102E] font-bold text-xs uppercase tracking-wider rounded">
                  Universidad Diego Portales
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  Escuela de Informática y Telecomunicaciones
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2D3B45] pt-1">
                {currentSection?.cursoNombre || "PROYECTO EN TICS II"}
              </h2>
              <p className="text-sm font-semibold text-[#008EE2]">
                {currentSection?.nombre || "Sección 1"} ({sectionCode || "CIT3203_CA01"}) • Registro Oficial de Asistencia
              </p>
            </div>

            {/* Tarjeta Gigante con PIN */}
            <div className="p-6 sm:p-8 bg-gradient-to-b from-amber-50 to-orange-50/60 border-2 border-amber-300 rounded-[8px] space-y-2 shadow-inner">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-widest block">
                PIN de Marcaje en Sala:
              </span>
              <div className="text-6xl sm:text-7xl font-mono font-black tracking-widest text-[#2D3B45] py-2">
                {effectivePin}
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-amber-900 font-semibold">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Válido exclusivamente para la sesión de hoy en el campus UDP</span>
              </div>
            </div>

            {/* Instrucciones Claras para los Alumnos en la Sala */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-[4px] space-y-1">
                <span className="w-5 h-5 rounded-full bg-[#008EE2] text-white text-[11px] font-bold flex items-center justify-center">1</span>
                <strong className="text-xs text-[#2D3B45] block">Abre el Link</strong>
                <p className="text-[11px] text-gray-600 leading-tight">
                  Ingresa desde tu teléfono a la URL de asistencia compartida por el profesor.
                </p>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-[4px] space-y-1">
                <span className="w-5 h-5 rounded-full bg-purple-700 text-white text-[11px] font-bold flex items-center justify-center">2</span>
                <strong className="text-xs text-[#2D3B45] block">Busca tu Nombre</strong>
                <p className="text-[11px] text-gray-600 leading-tight">
                  Escribe tu apellido o RUT en el buscador oficial de la nómina Canvas.
                </p>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-[4px] space-y-1">
                <span className="w-5 h-5 rounded-full bg-[#C8102E] text-white text-[11px] font-bold flex items-center justify-center">3</span>
                <strong className="text-xs text-[#2D3B45] block">PIN + Ubicación GPS</strong>
                <p className="text-[11px] text-gray-600 leading-tight">
                  Escribe el PIN <strong>{effectivePin}</strong> y valida tu presencia en la facultad.
                </p>
              </div>
            </div>

            {/* Barra Inferior del Proyector: Contador en Vivo */}
            <div className="pt-2 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-[#2D3B45]">
                  Alumnos Registrados en Tiempo Real:
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 font-mono font-bold rounded">
                  {livePresentesCount} / {totalEstudiantesCount}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCheckinLink}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#008EE2] border border-blue-200 rounded text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Copy size={13} />
                  <span>{copiedCheckin ? "¡Link Copiado!" : "Copiar Link Alumnos"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-1.5 bg-[#2D3B45] hover:bg-[#1E272E] text-white rounded text-xs font-bold transition-colors"
                >
                  Volver a Planilla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Pase de Asistencia del Día (PIN Pizarra y Link del Día) */}
      {showDailyShareModal && currentSection && (
        <AttendanceShareDailyModal
          section={currentSection}
          todayDateStr={todaySessionInfo?.todayDateStr || new Date().toISOString().split("T")[0]}
          isOpen={showDailyShareModal}
          onClose={() => setShowDailyShareModal(false)}
          pin={effectivePin}
          onRegeneratePin={onRegeneratePin}
        />
      )}
    </div>
  );
};

