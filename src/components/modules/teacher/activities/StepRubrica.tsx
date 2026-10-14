"use client";

import React from "react";
import { Award, ChevronLeft, ChevronRight } from "lucide-react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import {
  CanvasOfficialRubricTable,
  RubricMatrixRubro,
} from "@/components/canvas/CanvasOfficialRubricTable";
import { MetodologiaDocente } from "@/constants/metodologiasDocentes";

interface StepRubricaProps {
  metodologia: MetodologiaDocente;
  modalidad: "decimas" | "nota";
  setModalidad: (m: "decimas" | "nota") => void;
  decimas: string;
  setDecimas: (v: string) => void;
  targetEvaluacion: string;
  setTargetEvaluacion: (v: string) => void;
  matrizRubros: RubricMatrixRubro[];
  setMatrizRubros: (r: RubricMatrixRubro[]) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const StepRubrica: React.FC<StepRubricaProps> = ({
  metodologia,
  modalidad,
  setModalidad,
  decimas,
  setDecimas,
  targetEvaluacion,
  setTargetEvaluacion,
  matrizRubros,
  setMatrizRubros,
  onPrev,
  onNext,
}) => {
  return (
    <div className="space-y-5">
      <div className="border-b border-[#E0E3E6] pb-3">
        <h2 className="text-xl font-bold text-[#2D3B45] flex items-center gap-2">
          <Award size={20} className="text-[#B71C1C]" />
          Paso 4: Matriz Oficial de Evaluación y Modalidad Extra
        </h2>
        <p className="text-sm text-[#6B7780] mt-0.5">
          Estructura jerárquica oficial de la pauta. Los talleres otorgan décimas o evaluación formativa extra sin alterar ponderaciones del curso.
        </p>
      </div>

      {/* Selector de Modalidad Estilo Canvas */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setModalidad("decimas")}
          className={`p-3 rounded-[3px] border text-left transition-all cursor-pointer ${
            modalidad === "decimas"
              ? "border-[#B71C1C] bg-red-50/40 ring-1 ring-[#B71C1C]"
              : "border-[#C7CDD1] bg-white hover:bg-[#F9FAFB]"
          }`}
        >
          <span className="text-xs font-bold text-[#2D3B45] block">
            Bonificación de Décimas
          </span>
          <span className="text-[11px] text-[#6B7780] mt-0.5 block">
            Suma directamente a la nota final de un entregable oficial.
          </span>
        </button>

        <button
          type="button"
          onClick={() => setModalidad("nota")}
          className={`p-3 rounded-[3px] border text-left transition-all cursor-pointer ${
            modalidad === "nota"
              ? "border-[#2D3B45] bg-[#F5F6F8] ring-1 ring-[#2D3B45]"
              : "border-[#C7CDD1] bg-white hover:bg-[#F9FAFB]"
          }`}
        >
          <span className="text-xs font-bold text-[#2D3B45] block">
            Evaluación Formativa (1.0 - 7.0)
          </span>
          <span className="text-[11px] text-[#6B7780] mt-0.5 block">
            Registro de nota formativa en el libro sin alterar ponderaciones oficiales.
          </span>
        </button>
      </div>

      {/* Detalle según modalidad */}
      {modalidad === "decimas" ? (
        <div className="p-3 bg-[#F9FAFB] border border-[#C7CDD1] rounded-[3px] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="font-bold text-[#2D3B45] block mb-1">
              Cantidad de Décimas a Bonificar
            </label>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#2D3B45] text-sm">+</span>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="1.0"
                value={decimas}
                onChange={(e) => setDecimas(e.target.value)}
                className="w-24 text-xs font-bold border border-[#C7CDD1] rounded-[3px] p-1.5 bg-white text-[#2D3B45] text-center focus:outline-none focus:border-[#B71C1C]"
              />
              <span className="text-[#6B7780]">décimas</span>
            </div>
          </div>

          <div>
            <label className="font-bold text-[#2D3B45] block mb-1">
              Hito Oficial al que se Sumarán
            </label>
            <select
              value={targetEvaluacion}
              onChange={(e) => setTargetEvaluacion(e.target.value)}
              className="w-full text-xs border border-[#C7CDD1] rounded-[3px] p-1.5 bg-white font-medium text-[#2D3B45] focus:outline-none focus:border-[#B71C1C]"
            >
              <option value="Solemne 1">Solemne 1</option>
              <option value="Solemne 2">Solemne 2</option>
              <option value="Reporte de Avance 1">Reporte de Avance 1</option>
              <option value="Reporte de Avance 2">Reporte de Avance 2</option>
              <option value="Presentación Final">Presentación Final</option>
            </select>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-[#F9FAFB] border border-[#C7CDD1] rounded-[3px] text-xs text-[#2D3B45]">
          <span>
            La actividad se evaluará en escala 1.0 a 7.0 para retroalimentación formativa de los estudiantes. No modifica la ponderación oficial del 100% de los entregables del curso.
          </span>
        </div>
      )}

      {/* Matriz Oficial de Evaluación en Tabla Formal */}
      <div className="pt-2">
        <CanvasOfficialRubricTable
          rubros={matrizRubros}
          onChangeRubros={setMatrizRubros}
          isEditable={true}
          tituloPauta={`PAUTA OFICIAL: ${metodologia.nombreCorto.toUpperCase()}`}
          subtituloPauta="Matriz institucional de rubros y criterios estructurados a partir de las instrucciones (Puntaje Máximo: 60 pts)"
        />
      </div>

      <div className="pt-3 border-t border-[#E0E3E6] flex justify-between">
        <CanvasButton variant="secondary" size="sm" onClick={onPrev} icon={<ChevronLeft size={14} />}>
          Volver a Instrucciones
        </CanvasButton>
        <CanvasButton variant="primary-udp" size="sm" onClick={onNext} icon={<ChevronRight size={14} />}>
          Continuar a Resumen
        </CanvasButton>
      </div>
    </div>
  );
};
