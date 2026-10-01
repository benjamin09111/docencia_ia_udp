"use client";

import React, { useState } from "react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import {
  Megaphone,
  Send,
  X,
  CheckCircle2,
  Users,
  Mail,
  Clock,
  Filter,
} from "lucide-react";

interface AyudanteAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AyudanteAnnouncementModal: React.FC<AyudanteAnnouncementModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [targetGroup, setTargetGroup] = useState<"activos" | "historicos" | "postulantes" | "todos">("activos");
  const [asunto, setAsunto] = useState("Recordatorio: Plazos de entrega de décimas y cierre de actas");
  const [mensaje, setMensaje] = useState(
    "Estimados/as ayudantes de la Facultad de Ingeniería:\n\nLes recordamos que este viernes vence el plazo para cargar en el sistema las décimas correspondientes a las actividades de ayudantía de cara a la Solemne 1.\n\nPor favor validar que todas las pautas de corrección cuenten con la rúbrica oficial."
  );
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 2500);
  };

  const getRecipientCount = () => {
    switch (targetGroup) {
      case "activos": return 24;
      case "historicos": return 58;
      case "postulantes": return 19;
      case "todos": return 101;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-[#E0E3E6] rounded-[6px] shadow-2xl max-w-lg w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-start border-b border-gray-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-[#008EE2] rounded border border-blue-200">
              <Megaphone size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#2D3B45]">
                Anuncio Automatizado para Ayudantes
              </h3>
              <p className="text-xs text-[#6B7780]">
                Envío masivo oficial a correos institucionales (@mail.udp.cl)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded"
          >
            <X size={18} />
          </button>
        </div>

        {sentSuccess ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded text-emerald-900 text-xs flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
            <div>
              <strong className="block font-bold">¡Anuncio despachado exitosamente!</strong>
              <span>Se ha enviado la circular por correo a {getRecipientCount()} ayudantes registrados.</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                Destinatarios
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetGroup("activos")}
                  className={`p-2 rounded border text-left flex items-center justify-between ${
                    targetGroup === "activos"
                      ? "border-[#008EE2] bg-blue-50/70 text-[#008EE2] font-bold"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>Ayudantes Activos (2026-1)</span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-gray-200">24</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetGroup("postulantes")}
                  className={`p-2 rounded border text-left flex items-center justify-between ${
                    targetGroup === "postulantes"
                      ? "border-[#008EE2] bg-blue-50/70 text-[#008EE2] font-bold"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>Postulantes en Proceso</span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-gray-200">19</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetGroup("historicos")}
                  className={`p-2 rounded border text-left flex items-center justify-between ${
                    targetGroup === "historicos"
                      ? "border-[#008EE2] bg-blue-50/70 text-[#008EE2] font-bold"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>Históricos / Ex-Ayudantes</span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-gray-200">58</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetGroup("todos")}
                  className={`p-2 rounded border text-left flex items-center justify-between ${
                    targetGroup === "todos"
                      ? "border-[#008EE2] bg-blue-50/70 text-[#008EE2] font-bold"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>Todos los Registrados</span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-gray-200">101</span>
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                Asunto del Correo
              </label>
              <input
                type="text"
                required
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#008EE2] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                Cuerpo del Anuncio
              </label>
              <textarea
                required
                rows={5}
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded text-xs font-sans focus:ring-1 focus:ring-[#008EE2] focus:outline-none"
              />
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="text-[11px] text-gray-500 flex items-center gap-1">
                <Mail size={12} className="text-gray-400" />
                Se enviará con remitente: direccion.informatica@udp.cl
              </span>
              <div className="flex gap-2">
                <CanvasButton variant="outline" size="sm" onClick={onClose}>
                  Cancelar
                </CanvasButton>
                <CanvasButton variant="primary-canvas" size="sm" icon={<Send size={13} />}>
                  Enviar Anuncio
                </CanvasButton>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
