"use client";

import React, { useState, useEffect } from "react";
import { QuickActivity } from "@/types/quickActivities";
import { getStoredQuickActivities } from "@/services/quickActivitiesService";
import { CanvasItemGroup, CanvasItemRow } from "@/components/canvas/CanvasItemGroup";
import { QuickActivityDetailModal } from "../teacher/quick-activities/QuickActivityDetailModal";
import { Zap, FileText, Link as LinkIcon, Download, ExternalLink } from "lucide-react";

interface StudentQuickActivitiesTabProps {
  courseCode?: string;
}

export const StudentQuickActivitiesTab: React.FC<StudentQuickActivitiesTabProps> = ({
  courseCode = "CIT3000_CA02",
}) => {
  const [activities, setActivities] = useState<QuickActivity[]>([]);
  const [selectedDetail, setSelectedDetail] = useState<QuickActivity | null>(null);

  useEffect(() => {
    const list = getStoredQuickActivities(courseCode).filter((a) => a.estado === "publicada");
    setActivities(list);
    const handleSync = () => {
      setActivities(getStoredQuickActivities(courseCode).filter((a) => a.estado === "publicada"));
    };
    window.addEventListener("udp_quick_activities_updated", handleSync);
    return () => window.removeEventListener("udp_quick_activities_updated", handleSync);
  }, [courseCode]);

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Banner Informativo para el Estudiante */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h2 className="text-base font-bold text-[#2D3B45] flex items-center gap-2">
              <Zap size={18} className="text-[#B71C1C]" />
              Actividades y Tareas Rápidas
            </h2>
            <p className="text-xs text-[#6B7780] mt-0.5">
              Guías de cátedra, enunciados y lecturas publicados por tu profesor. Haz clic para ver o descargar el archivo.
            </p>
          </div>
          <span className="text-xs text-[#2D3B45] bg-[#F5F6F8] border border-[#C7CDD1] px-2.5 py-1 rounded-[3px] font-semibold">
            {activities.length} {activities.length === 1 ? "tarea disponible" : "tareas disponibles"}
          </span>
        </div>
      </div>

      {/* Lista Canvas Oficial */}
      <CanvasItemGroup
        title="GUÍAS Y TAREAS ASIGNADAS"
        weightBadge="Material Directo"
      >
        {activities.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#6B7780] bg-[#F9FAFB]">
            No hay tareas o guías publicadas por el profesor en este momento.
          </div>
        ) : (
          activities.map((act) => (
            <CanvasItemRow
              key={act.id}
              id={act.id}
              indicatorColor="green"
              icon={act.tipoRecurso === "archivo" ? <FileText size={17} /> : <LinkIcon size={17} />}
              title={act.titulo}
              subtitle={
                <span className="flex items-center gap-2 flex-wrap">
                  <span>{act.fechaPublicacion}</span>
                  <span>•</span>
                  <span className="line-clamp-1">{act.descripcion}</span>
                </span>
              }
              isPublished={true}
              onClick={() => setSelectedDetail(act)}
              rightBadge={
                <div className="flex items-center gap-2">
                  {act.tipoRecurso === "archivo" && act.archivo && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDetail(act);
                      }}
                      className="text-xs text-[#B71C1C] hover:bg-red-50 font-semibold px-2.5 py-1 bg-white rounded-[3px] border border-red-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download size={13} />
                      <span>Descargar {act.archivo.size}</span>
                    </button>
                  )}
                  {act.tipoRecurso === "link" && act.enlaceUrl && (
                    <a
                      href={act.enlaceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs text-[#008EE2] hover:bg-blue-50 font-semibold px-2.5 py-1 bg-white rounded-[3px] border border-blue-200 flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink size={13} />
                      <span>Abrir enlace</span>
                    </a>
                  )}
                </div>
              }
            />
          ))
        )}
      </CanvasItemGroup>

      {/* Modal de Detalle / Visualizador */}
      <QuickActivityDetailModal
        activity={selectedDetail}
        isOpen={!!selectedDetail}
        onClose={() => setSelectedDetail(null)}
      />
    </div>
  );
};
