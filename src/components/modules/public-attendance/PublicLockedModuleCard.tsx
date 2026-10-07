"use client";

import React from "react";
import { Lock, ShieldCheck, ArrowLeft, GraduationCap, Calendar, FileSpreadsheet, Sparkles } from "lucide-react";

interface PublicLockedModuleCardProps {
  moduleName: string;
  moduleType: "notas" | "catedra" | "resumen" | "resumen_asistencia";
  onReturnToAyudantias: () => void;
}

export const PublicLockedModuleCard: React.FC<PublicLockedModuleCardProps> = ({
  moduleName,
  moduleType,
  onReturnToAyudantias,
}) => {
  const metaByType = {
    notas: {
      title: "Módulo de Calificaciones y Evaluaciones",
      icon: <FileSpreadsheet className="text-[#C8102E]" size={28} />,
      desc: "Las notas de controles, solemnes y talleres se publicarán en este espacio una vez sincronizadas con la planilla oficial de Canvas UDP.",
      badge: "Próximamente • Modo Lectura Seguro",
    },
    catedra: {
      title: "Asistencia Oficial de Cátedras",
      icon: <Calendar className="text-[#008EE2]" size={28} />,
      desc: "El registro de asistencia presencial y online de cátedra es administrado directamente por el docente titular de la sección.",
      badge: "Protegido por Docente",
    },
    resumen: {
      title: "Resumen Académico Consolidado",
      icon: <GraduationCap className="text-purple-600" size={28} />,
      desc: "El balance consolidado de asistencia general, décimas acumuladas y estado final del semestre se activará previo al cierre de actas.",
      badge: "Cierre de Semestre",
    },
    resumen_asistencia: {
      title: "Consolidado Cátedra + Ayudantía",
      icon: <ShieldCheck className="text-emerald-700" size={28} />,
      desc: "La ponderación cruzada entre cátedras y ayudantías estará disponible tras la validación de los porcentajes reglamentarios (75%).",
      badge: "En Preparación",
    },
  }[moduleType];

  return (
    <div className="bg-white border border-[#E0E3E6] rounded-[4px] shadow-xs p-6 sm:p-10 text-center max-w-2xl mx-auto my-6 animate-fadeIn">
      <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center relative mb-4">
        {metaByType.icon}
        <div className="absolute -bottom-1 -right-1 bg-[#2D3B45] text-white p-1 rounded-full shadow-xs">
          <Lock size={12} />
        </div>
      </div>

      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-[#55636E] border border-gray-200 mb-2">
        <Lock size={10} />
        {metaByType.badge}
      </span>

      <h2 className="text-base sm:text-lg font-bold text-[#2D3B45] mb-2">
        {metaByType.title} ({moduleName})
      </h2>

      <p className="text-xs sm:text-sm text-[#6B7780] max-w-md mx-auto leading-relaxed mb-6">
        {metaByType.desc}
      </p>

      <div className="bg-[#FAFBFB] border border-[#E0E3E6] rounded-[4px] p-3 text-[11px] text-[#55636E] max-w-lg mx-auto flex items-center justify-center gap-2 mb-6">
        <Sparkles size={14} className="text-[#008EE2] shrink-0" />
        <span>Actualmente el único módulo activo para consulta de estudiantes es <strong>Asistencia de Ayudantías</strong>.</span>
      </div>

      <button
        type="button"
        onClick={onReturnToAyudantias}
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#2D3B45] hover:bg-[#1E272E] text-white rounded-[4px] text-xs font-semibold transition-colors cursor-pointer"
      >
        <ArrowLeft size={14} />
        <span>Ir a Asistencia de Ayudantías</span>
      </button>
    </div>
  );
};
