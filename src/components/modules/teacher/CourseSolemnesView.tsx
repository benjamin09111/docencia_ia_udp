"use client";

import React, { useState, useEffect } from "react";
import {
  CourseSolemne,
  CONTENIDOS_OFICIALES_PROGRAMA,
  getStoredSolemnes,
  saveStoredSolemnes,
} from "@/services/solemnesService";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import {
  Calendar,
  Clock,
  MapPin,
  Bot,
  Megaphone,
  CheckCircle2,
  X,
  FileText,
  Sparkles,
  Check,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

interface CourseSolemnesViewProps {
  courseCode: string;
  courseName: string;
}

export const CourseSolemnesView: React.FC<CourseSolemnesViewProps> = ({
  courseCode,
  courseName,
}) => {
  const [solemnes, setSolemnes] = useState<CourseSolemne[]>([]);
  const [activeModalSolemne, setActiveModalSolemne] = useState<CourseSolemne | null>(null);

  // Estados del modal de anuncio
  const [incluirContenidos, setIncluirContenidos] = useState(true);
  const [incluirFechaHora, setIncluirFechaHora] = useState(true);
  const [miniDescripcion, setMiniDescripcion] = useState("");
  const [publicadoFeedback, setPublicadoFeedback] = useState(false);
  const [guardadoToast, setGuardadoToast] = useState(false);

  useEffect(() => {
    setSolemnes(getStoredSolemnes(courseCode));
  }, [courseCode]);

  const handleUpdateSolemne = (id: string, updates: Partial<CourseSolemne>) => {
    setSolemnes((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...updates } : s));
      saveStoredSolemnes(courseCode, next);
      return next;
    });
  };

  const handleToggleContenidoOficial = (solemneId: string, item: string) => {
    const s = solemnes.find((sol) => sol.id === solemneId);
    if (!s) return;
    const exists = s.contenidosOficialesSeleccionados.includes(item);
    const updated = exists
      ? s.contenidosOficialesSeleccionados.filter((x) => x !== item)
      : [...s.contenidosOficialesSeleccionados, item];
    handleUpdateSolemne(solemneId, { contenidosOficialesSeleccionados: updated });
  };

  const openAnnouncementModal = (s: CourseSolemne) => {
    setActiveModalSolemne(s);
    setIncluirContenidos(s.incluirContenidosEnAnuncio ?? true);
    // Solo habilitado si la fecha y horario están completados
    const tieneFechaYHora = Boolean(s.fecha && s.hora);
    setIncluirFechaHora(tieneFechaYHora ? (s.incluirFechaHorarioEnAnuncio ?? true) : false);
    setMiniDescripcion(s.miniDescripcionAnuncio || "Entra desde la PPT1 a la PPT6");
    setPublicadoFeedback(false);
  };

  const tieneFechaYHoraCompleta = Boolean(
    activeModalSolemne?.fecha?.trim() && activeModalSolemne?.hora?.trim()
  );

  const previewAnnouncementText = () => {
    if (!activeModalSolemne) return "";
    let texto = `Estimadas y estimados estudiantes:\n\nSe informa la coordinación oficial para la ${activeModalSolemne.titulo} de ${courseName} (${courseCode}):\n\n`;

    if (incluirFechaHora && tieneFechaYHoraCompleta) {
      texto += `📅 Fecha: ${activeModalSolemne.fecha}\n⏰ Horario: ${activeModalSolemne.hora}\n📍 Sala: ${activeModalSolemne.sala || "Por confirmar"}\n\n`;
    }

    if (miniDescripcion.trim()) {
      texto += `📌 Indicaciones generales: ${miniDescripcion}\n\n`;
    }

    if (incluirContenidos) {
      texto += `📚 Contenidos a evaluar:\n`;
      if (activeModalSolemne.contenidosOficialesSeleccionados.length > 0) {
        activeModalSolemne.contenidosOficialesSeleccionados.forEach((c) => {
          texto += `  • ${c}\n`;
        });
      }
      if (activeModalSolemne.contenidosManuales) {
        texto += `  • Contenidos adicionales: ${activeModalSolemne.contenidosManuales}\n`;
      }
    }

    texto += `\nLos agentes asistentes de ayudantía en Canvas ya tienen cargadas estas delimitaciones para resolver consultas previas a la prueba.\n\nMucho éxito,\nEquipo Docente UDP`;
    return texto;
  };

  const handlePublishAnnouncement = () => {
    if (!activeModalSolemne) return;

    handleUpdateSolemne(activeModalSolemne.id, {
      anuncioPublicado: true,
      fechaUltimoAnuncio: new Date().toLocaleDateString("es-CL", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      miniDescripcionAnuncio: miniDescripcion,
      incluirContenidosEnAnuncio: incluirContenidos,
      incluirFechaHorarioEnAnuncio: incluirFechaHora,
    });

    setPublicadoFeedback(true);
    setTimeout(() => {
      setActiveModalSolemne(null);
      setPublicadoFeedback(false);
    }, 2000);
  };

  return (
    <div className="space-y-5">
      {/* Header Informativo */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-base font-bold text-[#2D3B45] flex items-center gap-2">
              <FileText size={18} className="text-[#008EE2]" />
              Delimitación y Coordinación de Solemnes
            </h2>
            <p className="text-xs text-[#6B7780] mt-0.5">
              Define los contenidos que entran en cada prueba oficial, fija fecha, horario y sala, y mantén sincronizados a los agentes del curso.
            </p>
          </div>

          <div className="bg-blue-50/80 border border-blue-200 rounded px-3 py-1.5 flex items-center gap-2 text-xs text-[#008EE2]">
            <Bot size={16} />
            <span className="font-medium text-[11px]">Agentes Evaluador & Asistente Conectados</span>
          </div>
        </div>
      </div>

      {guardadoToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>Configuración de solemnes guardada exitosamente.</span>
        </div>
      )}

      {/* Tarjetas de Solemnes */}
      <div className="space-y-4">
        {solemnes.map((s) => (
          <div
            key={s.id}
            className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card space-y-4"
          >
            {/* Cabecera de la Solemne */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-sm text-[#2D3B45]">{s.titulo}</span>
                <span className="text-xs font-mono font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-300">
                  {s.ponderacion}
                </span>
                {s.anuncioPublicado ? (
                  <CanvasBadge variant="success">
                    Anuncio publicado ({s.fechaUltimoAnuncio})
                  </CanvasBadge>
                ) : (
                  <CanvasBadge variant="warning">Anuncio no emitido</CanvasBadge>
                )}
              </div>

              <CanvasButton
                variant="primary-canvas"
                size="sm"
                icon={<Megaphone size={14} />}
                onClick={() => openAnnouncementModal(s)}
                title="Redactar y publicar anuncio oficial en Canvas"
              >
                Informar en anuncios
              </CanvasButton>
            </div>

            {/* Fila: Fecha, Hora y Sala */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50/70 p-3 rounded-[4px] border border-gray-200 text-xs">
              <div>
                <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5 mb-1">
                  <Calendar size={13} className="text-[#008EE2]" />
                  Fecha de la Solemne
                </label>
                <input
                  type="date"
                  value={s.fecha}
                  onChange={(e) => handleUpdateSolemne(s.id, { fecha: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#008EE2] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5 mb-1">
                  <Clock size={13} className="text-[#008EE2]" />
                  Horario
                </label>
                <input
                  type="text"
                  placeholder="Ej: 14:30 - 16:00"
                  value={s.hora}
                  onChange={(e) => handleUpdateSolemne(s.id, { hora: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#008EE2] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5 mb-1">
                  <MapPin size={13} className="text-[#008EE2]" />
                  Sala de Evaluación
                </label>
                <input
                  type="text"
                  placeholder="Ej: Auditorio 102 - Torre Central"
                  value={s.sala}
                  onChange={(e) => handleUpdateSolemne(s.id, { sala: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#008EE2] focus:outline-none"
                />
              </div>
            </div>

            {/* Contenidos a evaluar */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#2D3B45] block mb-1">
                  Contenidos Oficiales a Evaluar (del Programa PDF del curso):
                </label>
                <p className="text-[11px] text-[#6B7780] mb-2">
                  Marca las temáticas del programa oficial que entrarán en esta evaluación.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {CONTENIDOS_OFICIALES_PROGRAMA.map((item) => {
                    const isChecked = s.contenidosOficialesSeleccionados.includes(item);
                    return (
                      <label
                        key={item}
                        className={`flex items-start gap-2.5 p-2 rounded border cursor-pointer transition-colors ${
                          isChecked
                            ? "bg-blue-50/70 border-blue-300 text-blue-900"
                            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleContenidoOficial(s.id, item)}
                          className="mt-0.5 rounded text-[#008EE2] focus:ring-[#008EE2]"
                        />
                        <span className="text-[11px] leading-tight select-none">{item}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Contenidos manuales adicionales */}
              <div>
                <label className="text-xs font-bold text-[#2D3B45] block mb-1">
                  Especificación de Contenidos o Material Complementario (Manual):
                </label>
                <textarea
                  rows={2}
                  value={s.contenidosManuales}
                  onChange={(e) => handleUpdateSolemne(s.id, { contenidosManuales: e.target.value })}
                  placeholder="Ej: Entra desde la PPT1 a la PPT6. Capítulo 2 Bass y guía de ejercicios 1."
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#008EE2]"
                />
              </div>
            </div>

            {/* Sello de Sincronización con Agentes */}
            <div className="bg-emerald-50/60 border border-emerald-200 rounded p-2.5 flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <Bot size={16} className="text-emerald-700 shrink-0" />
                <span className="text-[11px]">
                  <strong>Agentes Sincronizados:</strong> El tutor de estudio y el agente evaluador conocen esta delimitación ({s.contenidosOficialesSeleccionados.length} tópicos oficiales seleccionados).
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setGuardadoToast(true);
                  setTimeout(() => setGuardadoToast(false), 2500);
                }}
                className="text-[11px] text-emerald-700 hover:underline font-semibold"
              >
                Guardar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Informar en Anuncios */}
      {activeModalSolemne && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E0E3E6] rounded-[4px] shadow-2xl max-w-xl w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start border-b border-gray-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#2D3B45] flex items-center gap-2">
                  <Megaphone size={16} className="text-[#008EE2]" />
                  Informar en Anuncios de Canvas — {activeModalSolemne.titulo}
                </h3>
                <p className="text-xs text-[#6B7780] mt-0.5">
                  Prepara y publica automáticamente el comunicado oficial para el curso.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalSolemne(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded"
              >
                <X size={18} />
              </button>
            </div>

            {/* Opciones y Checks del Modal */}
            <div className="space-y-3 text-xs">
              {/* Check 1: Incluir contenidos resumidos */}
              <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-800">
                <input
                  type="checkbox"
                  checked={incluirContenidos}
                  onChange={(e) => setIncluirContenidos(e.target.checked)}
                  className="rounded text-[#008EE2] focus:ring-[#008EE2]"
                />
                <span>Incluir en el anuncio los contenidos resumidos de la prueba</span>
              </label>

              {/* Mini descripción del profesor con placeholder solicitado */}
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  Descripción o alcance adicional del profesor:
                </label>
                <input
                  type="text"
                  value={miniDescripcion}
                  onChange={(e) => setMiniDescripcion(e.target.value)}
                  placeholder="Entra desde la PPT1 a la PPT6"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#008EE2]"
                />
              </div>

              {/* Check 2: Incluir fecha y horario (SOLO HABILITADO SI SE LLENA ANTERIORMENTE) */}
              <div>
                <label
                  className={`flex items-center gap-2 font-medium ${
                    tieneFechaYHoraCompleta
                      ? "cursor-pointer text-gray-800"
                      : "cursor-not-allowed text-gray-400"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={incluirFechaHora && tieneFechaYHoraCompleta}
                    disabled={!tieneFechaYHoraCompleta}
                    onChange={(e) => setIncluirFechaHora(e.target.checked)}
                    className="rounded text-[#008EE2] focus:ring-[#008EE2] disabled:opacity-40"
                  />
                  <span>Incluir en el anuncio la fecha, horario y sala de la solemne</span>
                </label>

                {!tieneFechaYHoraCompleta && (
                  <p className="text-[10px] text-amber-700 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    <span>
                      Opción bloqueada: Debes fijar la fecha y horario en la tarjeta de la solemne para activarla.
                    </span>
                  </p>
                )}
              </div>

              {/* Previsualización del Anuncio */}
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  Previsualización del Anuncio Canvas:
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded p-3 font-mono text-[11px] text-gray-700 whitespace-pre-line max-h-48 overflow-y-auto leading-relaxed select-all">
                  {previewAnnouncementText()}
                </div>
              </div>
            </div>

            {publicadoFeedback && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>¡Anuncio publicado exitosamente en Canvas y registrado en el historial!</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <CanvasButton
                variant="outline"
                size="sm"
                onClick={() => setActiveModalSolemne(null)}
              >
                Cancelar
              </CanvasButton>
              <CanvasButton
                variant="primary-canvas"
                size="sm"
                icon={<Megaphone size={14} />}
                onClick={handlePublishAnnouncement}
              >
                Publicar Anuncio en Canvas
              </CanvasButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
