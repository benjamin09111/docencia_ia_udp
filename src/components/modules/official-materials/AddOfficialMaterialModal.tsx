"use client";

import React, { useState } from "react";
import { CanvasModal } from "@/components/canvas/CanvasModal";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { BaseOfficialCourse, OfficialMaterialCategory } from "@/types/officialMaterials";
import { UploadCloud, CheckCircle2 } from "lucide-react";

interface AddOfficialMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: BaseOfficialCourse[];
  defaultCourseCode?: string;
  onAddMaterial: (data: {
    courseCode: string;
    courseName: string;
    title: string;
    category: OfficialMaterialCategory;
    description: string;
    fileName: string;
    fileSize: string;
    fileExtension: "pdf" | "docx" | "xlsx" | "zip";
    version: string;
    uploadedBy: string;
    isCanvasPublished: boolean;
    totalSections: number;
  }) => void;
}

export const AddOfficialMaterialModal: React.FC<AddOfficialMaterialModalProps> = ({
  isOpen,
  onClose,
  courses,
  defaultCourseCode,
  onAddMaterial,
}) => {
  const [courseCode, setCourseCode] = useState(defaultCourseCode || courses[0]?.code || "CIT3203");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<OfficialMaterialCategory>("guia_proyecto");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileExtension, setFileExtension] = useState<"pdf" | "docx" | "xlsx" | "zip">("pdf");
  const [version, setVersion] = useState("v1.0");
  const [isCanvasPublished, setIsCanvasPublished] = useState(true);

  React.useEffect(() => {
    if (defaultCourseCode) setCourseCode(defaultCourseCode);
  }, [defaultCourseCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !courseCode) return;

    const courseObj = courses.find((c) => c.code === courseCode);
    const finalCourseName = courseObj ? courseObj.name : "Asignatura UDP";
    const finalFileName = fileName.trim() || `${courseCode}_${title.replace(/\s+/g, "_")}.${fileExtension}`;

    onAddMaterial({
      courseCode,
      courseName: finalCourseName,
      title: title.trim(),
      category,
      description: description.trim() || "Material oficial institucional para todas las secciones.",
      fileName: finalFileName,
      fileSize: "1.9 MB",
      fileExtension,
      version: version.trim() || "v1.0",
      uploadedBy: "Administración EIT",
      isCanvasPublished,
      totalSections: courseObj ? courseObj.totalSections : 3,
    });

    // Reset y cerrar
    setTitle("");
    setDescription("");
    setFileName("");
    onClose();
  };

  const selectedCourse = courses.find((c) => c.code === courseCode);

  return (
    <CanvasModal
      isOpen={isOpen}
      onClose={onClose}
      title="Agregar Material Oficial de Asignatura"
      subtitle="El material agregado se aplicará de forma estandarizada a TODAS las secciones de este curso."
      maxWidth="lg"
      footer={
        <>
          <CanvasButton variant="ghost" onClick={onClose} size="sm">
            Cancelar
          </CanvasButton>
          <CanvasButton variant="primary" onClick={handleSubmit} size="sm" disabled={!title.trim()}>
            + Guardar Material Oficial
          </CanvasButton>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Asignatura Madre */}
        <div>
          <label className="block text-xs font-bold text-[#2D3B45] mb-1">
            Asignatura Base (Aplica a todas sus secciones)
          </label>
          <select
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-[#C7CDD1] rounded-[3px] focus:outline-none focus:border-[#B71C1C] bg-white font-medium"
          >
            {courses.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.name} ({c.totalSections} secciones: {c.sectionsList.join(", ")})
              </option>
            ))}
          </select>
          {selectedCourse && (
            <p className="text-[11px] text-[#6B7780] mt-1">
              Coordinador: {selectedCourse.coordinator}
            </p>
          )}
        </div>

        {/* Título */}
        <div>
          <label className="block text-xs font-bold text-[#2D3B45] mb-1">
            Título Oficial del Documento / Material *
          </label>
          <input
            type="text"
            required
            placeholder="Ej: Guía de Proyecto Final y Requerimientos de Arquitectura"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-[#C7CDD1] rounded-[3px] focus:outline-none focus:border-[#B71C1C]"
          />
        </div>

        {/* Categoría y Versión */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#2D3B45] mb-1">Categoría Pedagógica</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as OfficialMaterialCategory)}
              className="w-full px-3 py-2 text-xs border border-[#C7CDD1] rounded-[3px] focus:outline-none focus:border-[#B71C1C] bg-white"
            >
              <option value="syllabus">Syllabus Oficial (Programa)</option>
              <option value="guia_proyecto">Guía Hito / Proyecto</option>
              <option value="rubrica">Rúbrica Institucional</option>
              <option value="plantilla">Plantilla de Entrega Oficial</option>
              <option value="politicas">Políticas & Ética de IA</option>
              <option value="material_oficial">Material de Cátedra Estandarizado</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2D3B45] mb-1">Versión / Control de Cambios</label>
            <input
              type="text"
              placeholder="Ej: v1.0 o 2026-2"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#C7CDD1] rounded-[3px] focus:outline-none focus:border-[#B71C1C]"
            />
          </div>
        </div>

        {/* Nombre de archivo y formato */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-[#2D3B45] mb-1">Nombre del Archivo</label>
            <input
              type="text"
              placeholder="Ej: Pauta_Oficial_2026.pdf"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#C7CDD1] rounded-[3px] focus:outline-none focus:border-[#B71C1C] font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2D3B45] mb-1">Formato</label>
            <select
              value={fileExtension}
              onChange={(e) => setFileExtension(e.target.value as any)}
              className="w-full px-3 py-2 text-xs border border-[#C7CDD1] rounded-[3px] focus:outline-none focus:border-[#B71C1C] bg-white"
            >
              <option value="pdf">PDF (.pdf)</option>
              <option value="docx">Word (.docx)</option>
              <option value="xlsx">Excel (.xlsx)</option>
              <option value="zip">ZIP (.zip)</option>
            </select>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-xs font-bold text-[#2D3B45] mb-1">Descripción / Objetivos</label>
          <textarea
            rows={2}
            placeholder="Instrucciones transversales de la Escuela para que los profesores y estudiantes sigan la misma pauta..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-[#C7CDD1] rounded-[3px] focus:outline-none focus:border-[#B71C1C]"
          />
        </div>

        {/* Checkbox de Publicación Inmediata */}
        <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-[3px]">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isCanvasPublished}
              onChange={(e) => setIsCanvasPublished(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-[#2E7D32] rounded border-gray-300 focus:ring-[#2E7D32] cursor-pointer"
            />
            <div className="text-xs">
              <span className="font-bold text-[#2E7D32] block">
                Publicar automáticamente en todas las secciones de Canvas LMS
              </span>
              <span className="text-[#6B7780] text-[11px] block mt-0.5">
                Sincroniza este archivo a los espacios de Canvas de todas las secciones vinculadas.
              </span>
            </div>
          </label>
        </div>
      </form>
    </CanvasModal>
  );
};
