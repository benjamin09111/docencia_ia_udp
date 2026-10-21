"use client";

import React, { useState } from "react";
import { FileSpreadsheet, FileText, FileCode2, Loader2, Download, CheckCircle2 } from "lucide-react";
import { CanvasModal } from "@/components/canvas/CanvasModal";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CourseSection } from "@/types/attendance";
import { generateSectionsAttendanceSummary } from "@/services/attendanceReportService";
import { exportSummaryToCSV, exportSummaryToExcel, exportSummaryToPDF } from "@/utils/exportFormats";

interface ExportAttendanceSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subjectName: string;
  sections: CourseSection[];
}

type ExportFormat = "excel" | "csv" | "pdf";

export const ExportAttendanceSummaryModal: React.FC<ExportAttendanceSummaryModalProps> = ({
  isOpen,
  onClose,
  title,
  subjectName,
  sections,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("excel");
  const [isLoading, setIsLoading] = useState(false);
  const [statusText, setStatusText] = useState("");

  const handleDownload = async () => {
    setIsLoading(true);
    setStatusText("Consolidando registros de asistencia de las secciones...");
    try {
      const reports = await generateSectionsAttendanceSummary(sections);
      const cleanSubject = subjectName.toLowerCase().replace(/[^a-z0-9]/g, "_");
      const dateStr = new Date().toISOString().slice(0, 10);
      const baseFilename = `resumen_asistencia_${cleanSubject}_${dateStr}`;

      setStatusText("Generando archivo descargable...");
      if (selectedFormat === "csv") {
        exportSummaryToCSV(reports, `${baseFilename}.csv`);
      } else if (selectedFormat === "excel") {
        exportSummaryToExcel(reports, `${baseFilename}.xls`);
      } else if (selectedFormat === "pdf") {
        exportSummaryToPDF(reports, `${title} — ${subjectName}`);
      }
      setTimeout(() => {
        setIsLoading(false);
        setStatusText("");
        onClose();
      }, 700);
    } catch (e) {
      console.error("Error al exportar resumen:", e);
      setStatusText("Ocurrió un error al generar el reporte. Intenta nuevamente.");
      setIsLoading(false);
    }
  };

  const formats = [
    {
      id: "excel" as const,
      name: "Microsoft Excel (.xls)",
      desc: "Planilla estructurada con resumen ejecutivo por sección y nómina detallada.",
      icon: <FileSpreadsheet size={24} className="text-emerald-700" />,
      tag: "Recomendado",
    },
    {
      id: "csv" as const,
      name: "CSV Estándar (.csv)",
      desc: "Separado por punto y coma (BOM UTF-8) compatible con Excel y sistemas SIS.",
      icon: <FileCode2 size={24} className="text-[#008EE2]" />,
    },
    {
      id: "pdf" as const,
      name: "Documento Formal PDF (.pdf)",
      desc: "Formato oficial UDP con membrete listo para impresión y envío a dirección de escuela.",
      icon: <FileText size={24} className="text-[#B71C1C]" />,
    },
  ];

  return (
    <CanvasModal
      isOpen={isOpen}
      onClose={() => !isLoading && onClose()}
      title={title}
      subtitle={`Asignatura: ${subjectName} • ${sections.length} ${sections.length === 1 ? "sección" : "secciones"}`}
      maxWidth="md"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-[11px] text-[#6B7780]">
            {isLoading ? statusText : `${sections.length} secciones incluidas`}
          </span>
          <div className="flex gap-2">
            <CanvasButton
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </CanvasButton>
            <CanvasButton
              variant="primary-udp"
              onClick={handleDownload}
              disabled={isLoading || sections.length === 0}
              icon={isLoading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            >
              {isLoading ? "Cargando..." : "Descargar Resumen"}
            </CanvasButton>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Lista de Secciones Seleccionadas */}
        <div className="bg-[#F8F9FA] border border-[#E0E3E6] rounded p-2.5">
          <p className="text-[11px] font-bold text-[#2D3B45] uppercase tracking-wider mb-1.5">
            Secciones a consolidar:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {sections.map((sec) => (
              <span
                key={sec.id || sec.codigo}
                className="inline-flex items-center gap-1 bg-white border border-[#C7CDD1] px-2 py-0.5 rounded text-[11px] font-medium text-[#2D3B45]"
              >
                <CheckCircle2 size={12} className="text-[#2E7D32]" />
                <span>{sec.codigo} ({sec.nombre || "Sección"})</span>
              </span>
            ))}
          </div>
        </div>

        {/* Selector de Formato */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#2D3B45]">
            Selecciona el formato de exportación:
          </label>
          <div className="space-y-2">
            {formats.map((fmt) => {
              const isSelected = selectedFormat === fmt.id;
              return (
                <div
                  key={fmt.id}
                  onClick={() => !isLoading && setSelectedFormat(fmt.id)}
                  className={`flex items-start gap-3 p-3 rounded-[3px] border cursor-pointer transition-all ${
                    isSelected
                      ? "border-[#008EE2] bg-blue-50/50 shadow-2xs"
                      : "border-[#E0E3E6] hover:bg-gray-50"
                  }`}
                >
                  <div className="shrink-0 mt-0.5">{fmt.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#2D3B45]">{fmt.name}</span>
                      {fmt.tag && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded">
                          {fmt.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#6B7780] mt-0.5">{fmt.desc}</p>
                  </div>
                  <input
                    type="radio"
                    name="exportFormat"
                    checked={isSelected}
                    onChange={() => setSelectedFormat(fmt.id)}
                    className="mt-1 accent-[#008EE2]"
                    disabled={isLoading}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Estado de carga */}
        {isLoading && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded p-3 text-xs flex items-center gap-2 animate-pulse">
            <Loader2 size={16} className="animate-spin text-amber-700 shrink-0" />
            <div>
              <p className="font-bold">Cargando y procesando datos...</p>
              <p className="text-[11px] text-amber-800">{statusText}</p>
            </div>
          </div>
        )}
      </div>
    </CanvasModal>
  );
};
