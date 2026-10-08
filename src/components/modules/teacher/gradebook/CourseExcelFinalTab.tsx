"use client";

import React, { useState, useMemo, useEffect } from "react";
import { CanvasCourse, StudentExcelRow } from "@/types";
import { CourseSection } from "@/types/attendance";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { TeacherGradebookTableView } from "./TeacherGradebookTableView";
import { SendSchoolGradesModal } from "./SendSchoolGradesModal";
import { ShareGradesPublicModal } from "./ShareGradesPublicModal";
import { exportAnonymousGradesToExcel } from "@/services/excelExportService";
import {
  FileSpreadsheet,
  Send,
  Edit3,
  Check,
  Download,
  Share2,
  Search,
  X,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface CourseExcelFinalTabProps {
  course: CanvasCourse;
  section?: CourseSection;
  estudiantesExcel: StudentExcelRow[];
  onUpdateGrade: (canvasId: number, field: keyof StudentExcelRow, value: number) => void;
}

export const CourseExcelFinalTab: React.FC<CourseExcelFinalTabProps> = ({
  course,
  section,
  estudiantesExcel,
  onUpdateGrade,
}) => {
  const [isEditingExcel, setIsEditingExcel] = useState(false);
  const [showSendSchoolModal, setShowSendSchoolModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [schoolSendSuccess, setSchoolSendSuccess] = useState(false);
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);
  const [excelSuccess, setExcelSuccess] = useState(false);
  const [excelRutFilter, setExcelRutFilter] = useState("");

  const [publicShareUrl, setPublicShareUrl] = useState(`/calificaciones/${encodeURIComponent(course.code)}`);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setPublicShareUrl(`${window.location.origin}/calificaciones/${encodeURIComponent(course.code)}`);
    }
  }, [course.code]);

  const handleDownloadExcel = () => {
    exportAnonymousGradesToExcel({
      cursoCodigo: course.code,
      cursoNombre: course.name,
      seccionNombre: section?.nombre,
      estudiantesExcel,
    });
    setExcelSuccess(true);
    setTimeout(() => setExcelSuccess(false), 3500);
  };

  const handleSaveExcelEdits = () => {
    setIsEditingExcel(false);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 3000);
  };

  const handleConfirmSendToSchool = () => {
    setShowSendSchoolModal(false);
    setSchoolSendSuccess(true);
    setTimeout(() => setSchoolSendSuccess(false), 6000);
  };

  const filteredExcelStudents = useMemo(() => {
    if (!excelRutFilter.trim()) return estudiantesExcel;
    const cleanSearch = excelRutFilter.trim().toLowerCase();
    return estudiantesExcel.filter((s) => {
      const name = `${s.nombres} ${s.apellidos}`.toLowerCase();
      return name.includes(cleanSearch) || (s.rut && s.rut.replace(/[\.\-\s]/g, "").toLowerCase().includes(cleanSearch));
    });
  }, [estudiantesExcel, excelRutFilter]);

  return (
    <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4">
        <div>
          <h3 className="text-sm font-bold text-[#2D3B45] flex items-center gap-2">
            <FileSpreadsheet size={18} className="text-emerald-700" />
            Planilla Oficial del Curso (Excel Final UDP)
          </h3>
          <p className="text-xs text-[#6B7780]">
            Publicación anonimizada: solo se exhiben RUTs para resguardar la privacidad (Ley N° 19.628). Asistencia mínima: 75%.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <CanvasButton
            variant="primary-udp"
            size="sm"
            onClick={() => setShowSendSchoolModal(true)}
            icon={<Send size={14} />}
            title="Enviar la planilla oficial consolidada a la Dirección de Escuela"
          >
            Enviar Excel a la Escuela
          </CanvasButton>

          {!isEditingExcel ? (
            <CanvasButton
              variant="outline"
              size="sm"
              onClick={() => setIsEditingExcel(true)}
              icon={<Edit3 size={14} />}
              title="Habilitar edición de calificaciones oficiales"
            >
              Modo Edición
            </CanvasButton>
          ) : (
            <>
              <CanvasButton
                variant="primary-canvas"
                size="sm"
                onClick={handleSaveExcelEdits}
                icon={<Check size={14} />}
                title="Guardar cambios en la planilla oficial"
              >
                Guardar
              </CanvasButton>
              <CanvasButton
                variant="outline"
                size="sm"
                onClick={() => setIsEditingExcel(false)}
              >
                Cancelar
              </CanvasButton>
            </>
          )}

          <CanvasButton
            variant="outline"
            size="sm"
            onClick={handleDownloadExcel}
            icon={<Download size={14} />}
            title="Descargar la nómina oficial en formato .xlsx con fórmulas"
          >
            Descargar Excel UDP
          </CanvasButton>

          <CanvasButton
            variant="outline"
            size="sm"
            onClick={() => setShowShareModal(true)}
            icon={<Share2 size={14} />}
            title="Generar enlace público anónimo para compartir con los estudiantes"
          >
            Compartir con Estudiantes
          </CanvasButton>
        </div>
      </div>

      {saveSuccessToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>Calificaciones guardadas exitosamente y recalculadas para la entrega oficial.</span>
        </div>
      )}

      {schoolSendSuccess && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-900 text-xs rounded flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#C8102E] shrink-0" />
            <span>
              <strong>Acta Despachada:</strong> Planilla oficial enviada con éxito a la Escuela de Informática y Telecomunicaciones (Acta N° ACTA-2026-CIT3000-02). Comprobante emitido con firma digital docente.
            </span>
          </div>
        </div>
      )}

      {excelSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>Planilla descargada con fórmulas oficiales UDP anonimizada por RUT (sin nombres).</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={excelRutFilter}
            onChange={(e) => setExcelRutFilter(e.target.value)}
            placeholder="Filtrar por estudiante..."
            className="w-full pl-8 pr-7 py-1.5 border border-gray-300 rounded-[4px] text-xs focus:outline-none focus:ring-1 focus:ring-[#008EE2]"
          />
          {excelRutFilter && (
            <button
              type="button"
              onClick={() => setExcelRutFilter("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div className="text-[11px] text-[#6B7780] flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>
            Mostrando {filteredExcelStudents.length} de {estudiantesExcel.length} estudiantes • {isEditingExcel ? "Modo Edición Activo" : "Solo Lectura Oficial"}
          </span>
        </div>
      </div>

      <TeacherGradebookTableView
        courseCode={course.code}
        filteredExcelStudents={filteredExcelStudents}
        isEditingExcel={isEditingExcel}
        onUpdateGrade={onUpdateGrade}
        onNotify={() => {
          setSaveSuccessToast(true);
          setTimeout(() => setSaveSuccessToast(false), 3500);
        }}
      />

      <SendSchoolGradesModal
        isOpen={showSendSchoolModal}
        onClose={() => setShowSendSchoolModal(false)}
        course={course}
        estudiantesExcel={estudiantesExcel}
        onConfirmSend={handleConfirmSendToSchool}
      />

      <ShareGradesPublicModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        course={course}
        publicShareUrl={publicShareUrl}
      />
    </div>
  );
};
