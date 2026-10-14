"use client";

import React, { useState } from "react";
import { Eye, X, KeyRound, ShieldCheck, Lock, Unlock, ArrowRight } from "lucide-react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { StudentPreviewContent } from "./StudentPreviewContent";
import { InstruccionItem, ActivityAttachment } from "@/types/actividadesFormativas";
import { MetodologiaDocente } from "@/constants/metodologiasDocentes";
import { RubricMatrixRubro } from "@/components/canvas/CanvasOfficialRubricTable";

interface StudentActivityPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  metodologia: MetodologiaDocente;
  titulo: string;
  descripcion: string;
  fecha: string;
  pin: string;
  items: InstruccionItem[];
  attachments: ActivityAttachment[];
  matrizRubros: RubricMatrixRubro[];
  modalidad: "decimas" | "nota";
  decimas: string;
  pointsPossible: number;
}

export const StudentActivityPreviewModal: React.FC<StudentActivityPreviewModalProps> = ({
  isOpen,
  onClose,
  metodologia,
  titulo,
  descripcion,
  fecha,
  pin,
  items,
  attachments,
  matrizRubros,
  modalidad,
  decimas,
  pointsPossible,
}) => {
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  if (!isOpen) return null;

  const handleTestPin = () => {
    if (pinInput.toUpperCase().trim() === pin.toUpperCase().trim()) {
      setIsUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-[4px] border border-gray-300 w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Modal Canvas UDP */}
        <div className="bg-[#2D3B45] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white/10 rounded">
              <Eye size={18} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#B71C1C] px-2 py-0.5 rounded">
                  Vista Previa Estudiantil
                </span>
                <span className="text-xs text-gray-300 font-mono">
                  PIN: {pin}
                </span>
              </div>
              <h3 className="text-sm font-bold mt-0.5">
                Simulación: Lo que verá el estudiante al abrir el link en Canvas
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsUnlocked(!isUnlocked);
                setPinError(false);
              }}
              className="text-xs font-semibold px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Alternar entre pantalla de bloqueo PIN y tarea desbloqueada"
            >
              {isUnlocked ? <Lock size={13} /> : <Unlock size={13} />}
              {isUnlocked ? "Probar Bloqueo PIN" : "Desbloquear Vista"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-gray-300 hover:text-white rounded hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Barra de Enlace Informativo */}
        <div className="bg-[#F5F6F8] border-b border-[#C7CDD1] px-4 py-2 flex items-center justify-between text-xs text-[#6B7780] flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#2D3B45]">Enlace en Módulo Canvas:</span>
            <code className="bg-white border border-[#C7CDD1] px-2 py-0.5 rounded text-[11px] text-[#008EE2] font-mono">
              https://canvas.udp.cl/courses/3000/modules/activity/{pin.toLowerCase()}
            </code>
          </div>
          <span className="flex items-center gap-1 text-[#2E7D32] font-medium text-[11px]">
            <ShieldCheck size={13} /> Acceso protegido por PIN institucional
          </span>
        </div>

        {/* Cuerpo del Modal: Pantalla de Bloqueo o Contenido */}
        {!isUnlocked ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-red-50 text-[#B71C1C] border border-red-100 flex items-center justify-center mx-auto shadow-sm">
              <KeyRound size={28} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#2D3B45]">
                Taller Protegido por PIN de Clase
              </h2>
              <p className="text-xs text-[#6B7780] mt-1 leading-relaxed">
                El docente ha bloqueado esta actividad. Ingresa el PIN de 6 caracteres compartido en la cátedra para comenzar a resolver.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <input
                type="text"
                maxLength={6}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value.toUpperCase());
                  setPinError(false);
                }}
                placeholder="Ej: ABC123"
                className="font-mono text-2xl font-black text-center text-[#2D3B45] tracking-[0.25em] w-44 py-2 border-2 border-[#C7CDD1] focus:border-[#B71C1C] rounded-[4px] uppercase focus:outline-none"
              />

              {pinError && (
                <p className="text-xs text-[#B71C1C] font-semibold">
                  PIN incorrecto. El código configurado es: <span className="font-mono">{pin}</span>
                </p>
              )}
            </div>

            <div className="flex justify-center gap-2 pt-1">
              <CanvasButton
                variant="primary-udp"
                size="sm"
                onClick={handleTestPin}
                icon={<ArrowRight size={14} />}
              >
                Ingresar a la Actividad
              </CanvasButton>
            </div>
          </div>
        ) : (
          <StudentPreviewContent
            metodologia={metodologia}
            titulo={titulo}
            descripcion={descripcion}
            fecha={fecha}
            pin={pin}
            items={items}
            attachments={attachments}
            matrizRubros={matrizRubros}
            modalidad={modalidad}
            decimas={decimas}
            pointsPossible={pointsPossible}
          />
        )}

        {/* Footer del Modal */}
        <div className="p-3 bg-white border-t border-[#E0E3E6] flex justify-end">
          <CanvasButton variant="secondary" size="sm" onClick={onClose}>
            Cerrar Vista Previa
          </CanvasButton>
        </div>
      </div>
    </div>
  );
};
