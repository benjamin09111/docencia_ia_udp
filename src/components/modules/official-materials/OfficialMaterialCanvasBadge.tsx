"use client";

import React from "react";
import { CheckCircle2, CircleSlash, RefreshCw } from "lucide-react";

interface OfficialMaterialCanvasBadgeProps {
  isPublished: boolean;
  totalSections: number;
  syncedSections: number;
  isAdmin: boolean;
  onTogglePublish?: () => void;
}

export const OfficialMaterialCanvasBadge: React.FC<OfficialMaterialCanvasBadgeProps> = ({
  isPublished,
  totalSections,
  syncedSections,
  isAdmin,
  onTogglePublish,
}) => {
  if (isAdmin) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onTogglePublish?.();
        }}
        className={`group inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border transition-all cursor-pointer ${
          isPublished
            ? "bg-emerald-50 text-[#2E7D32] border-emerald-300 hover:bg-emerald-100/80"
            : "bg-gray-100 text-[#6B7780] border-gray-300 hover:bg-gray-200"
        }`}
        title={
          isPublished
            ? `Publicado en Canvas: Sincronizado en ${syncedSections}/${totalSections} secciones. Clic para despublicar.`
            : `Borrador: No publicado en Canvas. Clic para sincronizar y publicar en las ${totalSections} secciones.`
        }
      >
        {isPublished ? (
          <>
            <CheckCircle2 size={13} className="text-[#2E7D32] shrink-0" />
            <span className="font-semibold">Publicado en Canvas</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-bold">
              {syncedSections}/{totalSections} sec
            </span>
          </>
        ) : (
          <>
            <CircleSlash size={13} className="text-[#6B7780] shrink-0" />
            <span>No publicado</span>
            <span className="text-[10px] bg-gray-200 text-gray-700 px-1 py-0.2 rounded font-bold">
              0/{totalSections} sec
            </span>
          </>
        )}
      </button>
    );
  }

  // Vista Profesor (Solo Lectura)
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border select-none ${
        isPublished
          ? "bg-emerald-50 text-[#2E7D32] border-emerald-300"
          : "bg-gray-100 text-[#6B7780] border-gray-300"
      }`}
      title={
        isPublished
          ? `Publicado institucionalmente en Canvas (${syncedSections}/${totalSections} secciones sincronizadas)`
          : `Material oficial en revisión / Borrador (No publicado en Canvas)`
      }
    >
      {isPublished ? (
        <>
          <CheckCircle2 size={13} className="text-[#2E7D32] shrink-0" />
          <span className="font-semibold">Publicado en Canvas</span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-bold">
            {syncedSections}/{totalSections}
          </span>
        </>
      ) : (
        <>
          <CircleSlash size={13} className="text-[#6B7780] shrink-0" />
          <span>No publicado</span>
        </>
      )}
    </div>
  );
};
