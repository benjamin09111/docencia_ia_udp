"use client";

import React from "react";
import { CanvasModal } from "@/components/canvas/CanvasModal";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { OfficialMaterial } from "@/types/officialMaterials";
import { Download, FileText, CheckCircle2, CircleSlash, ShieldAlert, Layers } from "lucide-react";

interface OfficialMaterialDetailModalProps {
  material: OfficialMaterial | null;
  onClose: () => void;
  isAdmin: boolean;
  onTogglePublish?: (id: string) => void;
}

export const OfficialMaterialDetailModal: React.FC<OfficialMaterialDetailModalProps> = ({
  material,
  onClose,
  isAdmin,
  onTogglePublish,
}) => {
  if (!material) return null;

  return (
    <CanvasModal
      isOpen={Boolean(material)}
      onClose={onClose}
      title={material.title}
      subtitle={`${material.courseCode} — ${material.courseName}`}
      maxWidth="md"
      footer={
        <div className="flex items-center justify-between w-full">
          {isAdmin && onTogglePublish ? (
            <CanvasButton
              variant={material.isCanvasPublished ? "ghost" : "primary"}
              size="sm"
              onClick={() => onTogglePublish(material.id)}
            >
              {material.isCanvasPublished ? "Despublicar de Canvas" : "Publicar en Canvas"}
            </CanvasButton>
          ) : (
            <div />
          )}

          <div className="flex gap-2">
            <CanvasButton variant="ghost" size="sm" onClick={onClose}>
              Cerrar
            </CanvasButton>
            <CanvasButton
              variant="secondary"
              size="sm"
              icon={<Download size={14} />}
              onClick={() => alert(`Descargando: ${material.fileName}`)}
            >
              Descargar {material.fileExtension.toUpperCase()}
            </CanvasButton>
          </div>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Banner de estandarización */}
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-[3px] space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#2D3B45]">Asignatura Base</span>
            <span className="font-mono bg-white px-2 py-0.5 rounded border border-gray-200 text-[#B71C1C] font-bold">
              {material.courseCode}
            </span>
          </div>
          <p className="text-[11px] text-[#6B7780]">
            Este documento rige de manera obligatoria y transversal para todas las secciones inscritas.
          </p>
        </div>

        {/* Estado en Canvas */}
        <div className="flex items-center justify-between p-3 rounded-[3px] border bg-white">
          <div className="flex items-center gap-2">
            {material.isCanvasPublished ? (
              <CheckCircle2 size={18} className="text-[#2E7D32]" />
            ) : (
              <CircleSlash size={18} className="text-gray-400" />
            )}
            <div>
              <span className="font-bold text-[#2D3B45] block">
                {material.isCanvasPublished ? "Publicado en Canvas LMS" : "No publicado en Canvas"}
              </span>
              <span className="text-[11px] text-[#6B7780]">
                {material.isCanvasPublished
                  ? `Sincronizado a ${material.syncedSections}/${material.totalSections} secciones de forma automática.`
                  : "Archivo retenido como borrador o documento de uso interno de la Escuela."}
              </span>
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <h4 className="font-bold text-[#2D3B45] mb-1">Descripción pedagógica</h4>
          <p className="text-[#4b5563] leading-relaxed bg-gray-50/70 p-3 rounded border border-gray-200 text-xs">
            {material.description}
          </p>
        </div>

        {/* Metadatos técnicos */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-[#6B7780] bg-gray-50 p-2.5 rounded border border-gray-200">
          <div><strong className="text-[#2D3B45]">Archivo:</strong> {material.fileName}</div>
          <div><strong className="text-[#2D3B45]">Tamaño:</strong> {material.fileSize}</div>
          <div><strong className="text-[#2D3B45]">Versión:</strong> {material.version}</div>
          <div><strong className="text-[#2D3B45]">Subido por:</strong> {material.uploadedBy}</div>
        </div>
      </div>
    </CanvasModal>
  );
};
