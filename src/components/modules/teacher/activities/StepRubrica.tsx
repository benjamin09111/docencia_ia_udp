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
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-bold text-[#2D3B45] flex items-center gap-2">
          <Award size={16} className="text-[#008EE2]" />
          Paso 4: Matriz Oficial de Evaluación y Modalidad Extra
        </h2>
        <p className="text-xs text-[#6B7780] mt-0.5">
          Estructura jerárquica oficial de la pauta. Los talleres otorgan décimas o evaluación formativa extra sin alterar ponderaciones del curso.
        </p>
      </div>

      {/* Selector de Modalidad */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setModalidad("decimas")}
          className={`p-3 rounded-[4px] border text-left transition-all cursor-pointer ${
            modalidad === "decimas"
              ? "border-purple-400 bg-purple-50 ring-1 ring-purple-400"
              : "border-gray-200 bg-white hover:bg-gray-50"
          }`}
        >
          <span className="text-xs font-bold text-purple-950 block">
            Bonificación de Décimas
          </span>
          <span className="text-[11px] text-[#6B7780] mt-0.5 block">
            Suma directamente a la nota final de un entregable oficial.
          </span>
        </button>

        <button
          type="button"
          onClick={() => setModalidad("nota")}
          className={`p-3 rounded-[4px] border text-left transition-all cursor-pointer ${
            modalidad === "nota"
              ? "border-blue-400 bg-blue-50 ring-1 ring-blue-400"
              : "border-gray-200 bg-white hover:bg-gray-50"
          }`}
        >
          <span className="text-xs font-bold text-blue-950 block">
            Evaluación Formativa (1.0 - 7.0)
          </span>
          <span className="text-[11px] text-[#6B7780] mt-0.5 block">
            Registro de nota extra en el libro de ayudantía sin alterar ponderaciones oficiales.
          </span>
        </button>
      </div>

      {/* Detalle según modalidad */}
      {modalidad === "decimas" ? (
        <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-[4px] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="font-bold text-purple-950 block mb-1">
              Cantidad de Décimas a Bonificar
            </label>
            <div className="flex items-center gap-2">
              <span className="font-bold text-purple-950 text-sm">+</span>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="1.0"
                value={decimas}
                onChange={(e) => setDecimas(e.target.value)}
                className="w-24 text-xs font-bold border border-purple-300 rounded-[4px] p-1.5 bg-white text-purple-950 text-center"
              />
              <span className="text-[#6B7780]">décimas</span>
            </div>
          </div>

          <div>
            <label className="font-bold text-purple-950 block mb-1">
              Hito Oficial al que se Sumarán
            </label>
            <select
              value={targetEvaluacion}
              onChange={(e) => setTargetEvaluacion(e.target.value)}
              className="w-full text-xs border border-purple-300 rounded-[4px] p-1.5 bg-white font-medium text-purple-950"
            >
              <option value="Presentación e informe inicial">Presentación e informe inicial</option>
              <option value="Solemne Oficial">Solemne Oficial</option>
              <option value="Reporte de Avance 1">Reporte de Avance 1</option>
              <option value="Reporte de Avance 2">Reporte de Avance 2</option>
              <option value="Presentación Final">Presentación Final</option>
            </select>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-[4px] text-xs text-blue-950">
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
          subtituloPauta="Matriz institucional de rubros, criterios y subcriterios de desempeño"
        />
      </div>

      <div className="pt-3 border-t flex justify-between">
        <CanvasButton variant="outline" size="sm" onClick={onPrev} icon={<ChevronLeft size={14} />}>
          Volver a Instrucciones
        </CanvasButton>
        <CanvasButton variant="primary-udp" size="sm" onClick={onNext} icon={<ChevronRight size={14} />}>
          Continuar a Resumen
        </CanvasButton>
      </div>
    </div>
  );
};
