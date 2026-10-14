"use client";

import React, { useMemo } from "react";
import { InstruccionItem, ActivityAttachment } from "@/types/actividadesFormativas";
import { InstructionItemCard } from "./instructions/InstructionItemCard";
import { ScoreBalanceBanner } from "./instructions/ScoreBalanceBanner";
import { ActivityAttachmentsSection } from "./instructions/ActivityAttachmentsSection";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { ListOrdered, Sparkles, ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface StepInstruccionesProps {
  items: InstruccionItem[];
  setItems: (items: InstruccionItem[]) => void;
  attachments: ActivityAttachment[];
  setAttachments: (attachments: ActivityAttachment[]) => void;
  onGenerarIA: () => void;
  isGenerating: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export const StepInstrucciones: React.FC<StepInstruccionesProps> = ({
  items,
  setItems,
  attachments,
  setAttachments,
  onGenerarIA,
  isGenerating,
  onPrev,
  onNext,
}) => {
  const sumaActual = useMemo(() => {
    return items.reduce((acc, it) => acc + (Number(it.puntaje) || 0), 0);
  }, [items]);

  const esValido60 = sumaActual === 60;

  const handleAddItem = () => {
    const nextNum = items.length + 1;
    const faltante = Math.max(0, 60 - sumaActual);
    const nuevoPuntaje = faltante > 0 ? faltante : 10;

    const newItem: InstruccionItem = {
      id: `inst_${Date.now()}`,
      numero: nextNum,
      titulo: `Pregunta ${nextNum}: Nuevo Desafío / Ejercicio`,
      descripcion: "Describe la actividad que debe realizar el estudiante...",
      puntaje: nuevoPuntaje,
    };
    setItems([...items, newItem]);
  };

  const handleUpdateItem = (index: number, updated: InstruccionItem) => {
    const copy = [...items];
    copy[index] = updated;
    setItems(copy);
  };

  const handleDeleteItem = (index: number) => {
    if (items.length <= 1) return;
    const copy = items.filter((_, i) => i !== index);
    setItems(copy);
  };

  const handleAutoAjustar60 = () => {
    if (items.length === 0) return;
    const faltante = 60 - sumaActual;
    const copy = [...items];
    const ultimo = copy[copy.length - 1];
    const ajustado = Math.max(1, ultimo.puntaje + faltante);
    copy[copy.length - 1] = { ...ultimo, puntaje: ajustado };
    setItems(copy);
  };

  return (
    <div className="space-y-5">
      {/* Encabezado Canvas */}
      <div className="border-b border-[#E0E3E6] pb-3 flex justify-between items-start gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-[#2D3B45] flex items-center gap-2">
            <ListOrdered size={20} className="text-[#B71C1C]" />
            Paso 3: Instrucciones, Preguntas con Puntaje y Anexos
          </h2>
          <p className="text-sm text-[#6B7780] mt-0.5">
            Cada instrucción representa una pregunta o tarea evaluada. Asigna los puntajes hasta sumar exactamente 60 puntos.
          </p>
        </div>

        <CanvasButton
          variant="secondary"
          size="sm"
          onClick={onGenerarIA}
          disabled={isGenerating}
          icon={<Sparkles size={14} className="text-[#B71C1C]" />}
        >
          {isGenerating ? "Generando con IA..." : "Sugerir con IA (60 pts)"}
        </CanvasButton>
      </div>

      {/* Banner de Verificación de Puntaje en Tiempo Real */}
      <ScoreBalanceBanner
        sumaActual={sumaActual}
        esValido60={esValido60}
        onAutoAjustar={handleAutoAjustar60}
      />

      {/* Listado Controlado de Instrucciones / Preguntas */}
      <div className="space-y-3">
        {items.map((item, idx) => (
          <InstructionItemCard
            key={item.id}
            item={item}
            index={idx}
            canDelete={items.length > 1}
            onChange={(updated) => handleUpdateItem(idx, updated)}
            onDelete={() => handleDeleteItem(idx)}
          />
        ))}
      </div>

      {/* Botón para Añadir Nueva Instrucción */}
      <div className="flex justify-center pt-1">
        <CanvasButton
          variant="secondary"
          size="sm"
          onClick={handleAddItem}
          icon={<Plus size={14} className="text-[#B71C1C]" />}
        >
          + Agregar Instrucción / Pregunta
        </CanvasButton>
      </div>

      {/* Anexos y Material Complementario para el Estudiante */}
      <ActivityAttachmentsSection
        attachments={attachments}
        onChangeAttachments={setAttachments}
      />

      {/* Navegación del Wizard */}
      <div className="pt-4 border-t border-[#E0E3E6] flex items-center justify-between">
        <CanvasButton
          variant="secondary"
          size="sm"
          onClick={onPrev}
          icon={<ChevronLeft size={16} />}
        >
          Volver a Información
        </CanvasButton>

        <CanvasButton
          variant="primary-udp"
          size="sm"
          onClick={onNext}
          disabled={!esValido60}
          icon={<ChevronRight size={16} />}
          title={!esValido60 ? "Debes completar exactamente 60 puntos para avanzar" : undefined}
        >
          Continuar a Rúbrica
        </CanvasButton>
      </div>
    </div>
  );
};
