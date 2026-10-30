"use client";

import React, { useState } from "react";
import { BookOpen, Sparkles, Layers, Megaphone, Users, Download, Copy, Video, CheckCircle2 } from "lucide-react";
import { CanvasItemGroup, CanvasItemRow } from "@/components/canvas/CanvasItemGroup";
import { SubjectCourseGroup, EnrichedCourseSection } from "@/utils/courseGrouping";
import { ExportAttendanceSummaryModal } from "@/components/modules/common/ExportAttendanceSummaryModal";
import { PublishClassLinkModal } from "./announcements/PublishClassLinkModal";
import { getSectionByCourseCode } from "@/services/attendanceStore";
import { copyGroupAttendanceInfo, publishGroupAttendanceAnnouncement } from "@/utils/courseAttendanceAnnounceHelper";

interface TeacherSubjectGroupCardProps {
  group: SubjectCourseGroup;
  onOpenCourse: (courseId: number) => void;
  onAnnounceCourses: (courseIds: number[]) => void;
}

export const TeacherSubjectGroupCard: React.FC<TeacherSubjectGroupCardProps> = ({
  group,
  onOpenCourse,
  onAnnounceCourses,
}) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isMultiSection = group.sectionsCount > 1;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCopyAttendance = async () => {
    const ok = await copyGroupAttendanceInfo(group);
    if (ok) showToast("✓ Información de asistencia de hoy copiada al portapapeles.");
  };

  const handlePublishAttendanceAnnouncement = async () => {
    const count = await publishGroupAttendanceAnnouncement(group);
    showToast(`✓ Anuncio de asistencia de hoy publicado con éxito en las ${count} secciones.`);
  };

  const headerActions = [
    { label: "Copiar información de Asistencia de hoy", icon: <Copy size={14} className="text-[#2E7D32]" />, onClick: handleCopyAttendance },
    { label: "Mandar anuncio con información de Asistencia de hoy", icon: <Sparkles size={14} className="text-[#B71C1C]" />, onClick: handlePublishAttendanceAnnouncement },
    { label: "Mandar anuncios con link de la clase", icon: <Video size={14} className="text-[#008EE2]" />, onClick: () => setIsLinkModalOpen(true) },
    { label: isMultiSection ? `Descargar resumen de asistencia (${group.sectionsCount} secciones)` : "Descargar resumen de asistencia", icon: <Download size={14} className="text-[#008EE2]" />, onClick: () => setIsExportModalOpen(true) },
    { label: isMultiSection ? `Enviar anuncio general (${group.sectionsCount} secciones)` : "Enviar anuncio general", icon: <Megaphone size={14} className="text-[#6B7780]" />, onClick: () => onAnnounceCourses(group.sections.map((s) => s.id)) },
  ];

  return (
    <CanvasItemGroup
      title={`${group.subjectName} (${group.subjectCode})`}
      weightBadge={`${group.sectionsCount} ${group.sectionsCount === 1 ? "sección" : "secciones"} • ${group.totalStudents} estudiantes`}
      headerActions={headerActions}
      defaultExpanded={false}
      className="transition-shadow hover:shadow-sm"
    >
      {toastMessage && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Banner de Sincronización y Acciones Rápidas Multisección */}
      <div className="bg-[#F8F9FA] px-4 py-2 border-b border-[#E0E3E6] flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-[#55636E]">
          {isMultiSection && (
            <span className="inline-flex items-center gap-1 font-semibold text-[#008EE2] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              <Layers size={12} />
              <span>Multisección</span>
            </span>
          )}
          <span className="text-xs text-[#6B7780]">
            Acciones rápidas para {group.sectionsCount === 1 ? "esta sección" : `las ${group.sectionsCount} secciones`}:
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={handleCopyAttendance}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#2D3B45] hover:text-[#B71C1C] bg-white hover:bg-gray-100 border border-gray-300 px-2.5 py-1 rounded transition-colors cursor-pointer"
            title="Copiar enlaces, pin y plantilla de asistencia de hoy"
          >
            <Copy size={13} className="text-[#2E7D32]" />
            <span>Copiar Asistencia</span>
          </button>
          <button
            type="button"
            onClick={handlePublishAttendanceAnnouncement}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#B71C1C] hover:text-[#8E1010] bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1 rounded transition-colors cursor-pointer"
            title="Publica automáticamente el anuncio de asistencia de hoy en cada sección"
          >
            <Sparkles size={13} />
            <span>Anunciar Asistencia (1 clic)</span>
          </button>
          <button
            type="button"
            onClick={() => setIsLinkModalOpen(true)}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#008EE2] hover:text-[#0077BE] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded transition-colors cursor-pointer"
            title="Abre modal para pegar y publicar el link de la clase de hoy"
          >
            <Video size={13} />
            <span>Mandar Link Clase</span>
          </button>
        </div>
      </div>

      {/* Filas de Secciones: cliqueables directo sin menú de 3 puntos */}
      {group.sections.map((sec: EnrichedCourseSection) => (
        <CanvasItemRow
          key={sec.id}
          id={sec.id}
          icon={<BookOpen size={18} className="text-[#008EE2]" />}
          indicatorColor="green"
          isPublished={true}
          title={
            <span className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-[#2D3B45] hover:underline">{sec.sectionName}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-[#55636E] border border-gray-200">{sec.code}</span>
              <span className="text-xs font-normal text-[#6B7780] flex items-center gap-1"><Users size={13} /><span>{sec.students_count || 0} alumnos</span></span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${sec.source === "sandbox" ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-emerald-50 text-emerald-800 border-emerald-200"}`}>{sec.source === "sandbox" ? "SANDBOX" : "CANVAS"}</span>
              <span className="text-xs bg-blue-50 text-[#008EE2] px-2 py-0.5 rounded font-medium border border-blue-200 flex items-center gap-1"><Sparkles size={11} /><span>{sec.agentName}</span></span>
            </span>
          }
          subtitle={
            <span suppressHydrationWarning className="text-xs text-[#6B7780]">
              Profesor: <strong className="text-[#2D3B45]">{sec.profesor}</strong> • Ayudante: {sec.ayudante} • Horario Ayudantía: {sec.ayudantiaFormatted} • Cátedra: {sec.catedraFormatted} • Sala: <strong className="text-[#2D3B45]">{sec.salaFormatted}</strong>
            </span>
          }
          onClick={() => onOpenCourse(sec.id)}
        />
      ))}

      {/* Modal Canónico de Exportación de Asistencia Multisección */}
      <ExportAttendanceSummaryModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title={isMultiSection ? `Resumen de Asistencia Multisección` : `Resumen de Asistencia`}
        subjectName={group.subjectName}
        sections={group.sections.map((s) => s.sectionDetails || getSectionByCourseCode(s.code))}
      />

      {/* Modal para Mandar Anuncios con Link de la Clase */}
      <PublishClassLinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        sections={group.sections.map((s) => ({ code: s.code, name: s.sectionName }))}
        courseDisplayName={group.subjectName}
        onPublished={(cnt) => showToast(`✓ Link de la clase publicado con éxito en las ${cnt} secciones.`)}
      />
    </CanvasItemGroup>
  );
};
