"use client";

import React, { useState, useEffect } from "react";
import {
  getGradeScaleConfig,
  saveGradeScaleConfig,
} from "@/services/gradeScaleSettingsStore";
import {
  GradeScaleConfig,
  DEFAULT_GRADE_SCALE_CONFIG,
  calculateGradeFromScore,
} from "@/utils/gradeScaleCalculator";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import { Scale, CheckCircle2, Calculator, Sliders } from "lucide-react";

export const AdminGradeScaleTab: React.FC = () => {
  const [config, setConfig] = useState<GradeScaleConfig>(DEFAULT_GRADE_SCALE_CONFIG);
  const [testScore, setTestScore] = useState<number>(42);
  const [testMaxScore, setTestMaxScore] = useState<number>(70);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setConfig(getGradeScaleConfig());
  }, []);

  const simulatedGrade = calculateGradeFromScore(testScore, testMaxScore, config);

  const handleSave = () => {
    saveGradeScaleConfig(config);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleResetUDPDefault = () => {
    const defaultConfig: GradeScaleConfig = {
      puntoBase: 1.0,
      notaMaxima: 7.0,
      notaAprobacion: 4.0,
      exigenciaPct: 60,
    };
    setConfig(defaultConfig);
    saveGradeScaleConfig(defaultConfig);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Encabezado Canvas */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-canvas-card flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-red-50 text-[#C8102E] border border-red-200 text-xs font-bold rounded">
              Estándar UDP
            </span>
            <CanvasBadge variant="success">Punto Base 1.0</CanvasBadge>
          </div>
          <h2 className="text-base font-bold text-[#2D3B45] mt-1.5 flex items-center gap-2">
            <Scale size={18} className="text-[#008EE2]" />
            Escala de Calificaciones
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <CanvasButton variant="outline" size="sm" onClick={handleResetUDPDefault}>
            Restablecer Estándar UDP
          </CanvasButton>
          <CanvasButton variant="primary-canvas" size="sm" onClick={handleSave}>
            Guardar Parámetros
          </CanvasButton>
        </div>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-[4px] text-xs font-semibold text-emerald-900 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-700" />
          <span>✓ Parámetros actualizados exitosamente para toda la plataforma.</span>
        </div>
      )}

      {/* Grid de Configuración y Simulador */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Panel de Configuración */}
        <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-canvas-card space-y-4 text-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="font-bold text-[#2D3B45] flex items-center gap-1.5 text-sm">
              <Sliders size={16} className="text-[#008EE2]" />
              Valores Oficiales
            </h3>
            <span className="text-xs text-gray-500 font-mono">Reglamento UDP</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-gray-700 flex items-center justify-between">
                <span>Punto Base (Nota mínima 0 pts):</span>
                <span className="text-xs text-[#008EE2] font-mono font-bold">{config.puntoBase.toFixed(1)}</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0.0"
                max="4.0"
                value={config.puntoBase}
                onChange={(e) => setConfig({ ...config, puntoBase: parseFloat(e.target.value) || 1.0 })}
                className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded text-xs font-semibold focus:ring-1 focus:ring-[#008EE2]"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 flex items-center justify-between">
                <span>Porcentaje de Exigencia (% para Nota 4.0):</span>
                <span className="text-xs text-purple-700 font-mono font-bold">{config.exigenciaPct}%</span>
              </label>
              <input
                type="number"
                step="1"
                min="50"
                max="80"
                value={config.exigenciaPct}
                onChange={(e) => setConfig({ ...config, exigenciaPct: parseInt(e.target.value, 10) || 60 })}
                className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded text-xs font-semibold focus:ring-1 focus:ring-[#008EE2]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-gray-700 block">Nota Aprobación:</label>
                <input
                  type="number"
                  step="0.1"
                  min="3.0"
                  max="5.0"
                  value={config.notaAprobacion}
                  onChange={(e) => setConfig({ ...config, notaAprobacion: parseFloat(e.target.value) || 4.0 })}
                  className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded text-xs font-semibold"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 block">Nota Máxima:</label>
                <input
                  type="number"
                  step="0.1"
                  min="5.0"
                  max="10.0"
                  value={config.notaMaxima}
                  onChange={(e) => setConfig({ ...config, notaMaxima: parseFloat(e.target.value) || 7.0 })}
                  className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded text-xs font-semibold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Simulador Interactivo */}
        <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-canvas-card space-y-4 text-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="font-bold text-[#2D3B45] flex items-center gap-1.5 text-sm">
              <Calculator size={16} className="text-emerald-700" />
              Simulador de Cálculo
            </h3>
            <span className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold px-2 py-0.5 rounded">
              Tiempo Real
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-gray-700 block">Puntaje Máximo:</label>
                <input
                  type="number"
                  min="1"
                  value={testMaxScore}
                  onChange={(e) => setTestMaxScore(parseInt(e.target.value, 10) || 1)}
                  className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 block">Puntaje Obtenido:</label>
                <input
                  type="number"
                  min="0"
                  max={testMaxScore}
                  value={testScore}
                  onChange={(e) => setTestScore(parseInt(e.target.value, 10) || 0)}
                  className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded text-xs"
                />
              </div>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-[4px] flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500 block">Nota resultante:</span>
                <span className="text-2xl font-bold text-[#2D3B45]">{simulatedGrade.toFixed(1)}</span>
                <span className="text-xs text-gray-500 block">
                  Corte 60%: {(testMaxScore * (config.exigenciaPct / 100)).toFixed(1)} pts
                </span>
              </div>
              <div>
                <CanvasBadge variant={simulatedGrade >= config.notaAprobacion ? "success" : "danger"}>
                  {simulatedGrade >= config.notaAprobacion ? "Aprobado (≥4.0)" : "Reprobado (<4.0)"}
                </CanvasBadge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
