"use client";

import React, { useState, useEffect } from "react";
import {
  getGradeScaleConfig,
  saveGradeScaleConfig,
} from "@/services/gradeScaleSettingsStore";
import {
  GradeScaleConfig,
  calculateGradeFromScore,
} from "@/utils/gradeScaleCalculator";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import {
  Scale,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Calculator,
  Sliders,
  Sparkles,
  Building2,
} from "lucide-react";

export const AdminGradeScaleTab: React.FC = () => {
  const [config, setConfig] = useState<GradeScaleConfig>(() => getGradeScaleConfig());
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
      {/* Encabezado */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-canvas-card flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#FFEBEE] text-[#C8102E] text-[10px] font-bold rounded uppercase tracking-wider">
              Estándar Institucional UDP
            </span>
            <CanvasBadge variant="success">Punto Base Oficial 1.0</CanvasBadge>
          </div>
          <h2 className="text-sm font-bold text-[#2D3B45] mt-1 flex items-center gap-2">
            <Scale size={16} className="text-[#008EE2]" />
            Parámetros de Escala de Calificaciones y Punto Base
          </h2>
          <p className="text-xs text-[#6B7780] mt-0.5">
            Configuración global de la escala chilena oficial (1.0 a 7.0) con punto base por defecto y exigencia curricular.
          </p>
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
          <span>✓ Parámetros de escala y punto base actualizados exitosamente para toda la plataforma.</span>
        </div>
      )}

      {/* Grid de Configuración y Simulador */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Panel de Configuración de Parámetros */}
        <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-canvas-card space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="font-bold text-[#2D3B45] flex items-center gap-1.5">
              <Sliders size={14} className="text-[#008EE2]" />
              Valores Oficiales de la Escala
            </h3>
            <span className="text-[11px] text-gray-500 font-mono">Reglamento de Docencia UDP</span>
          </div>

          <div className="space-y-3">
            {/* Punto Base */}
            <div>
              <label className="font-bold text-gray-700 flex items-center justify-between">
                <span>Punto Base (Nota mínima con 0 pts):</span>
                <span className="text-[11px] text-[#008EE2] font-mono font-bold">{config.puntoBase.toFixed(1)}</span>
              </label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  step="0.1"
                  min="0.0"
                  max="4.0"
                  value={config.puntoBase}
                  onChange={(e) => setConfig({ ...config, puntoBase: parseFloat(e.target.value) || 1.0 })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs font-semibold focus:ring-1 focus:ring-[#008EE2]"
                />
              </div>
              <span className="text-[10px] text-gray-500 block mt-0.5">
                En la UDP y universidades chilenas, el estándar obligatorio es <strong>1.0</strong>.
              </span>
            </div>

            {/* Exigencia */}
            <div>
              <label className="font-bold text-gray-700 flex items-center justify-between">
                <span>Porcentaje de Exigencia (% para Nota 4.0):</span>
                <span className="text-[11px] text-purple-700 font-mono font-bold">{config.exigenciaPct}%</span>
              </label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  step="1"
                  min="50"
                  max="80"
                  value={config.exigenciaPct}
                  onChange={(e) => setConfig({ ...config, exigenciaPct: parseInt(e.target.value, 10) || 60 })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs font-semibold focus:ring-1 focus:ring-[#008EE2]"
                />
              </div>
              <span className="text-[10px] text-gray-500 block mt-0.5">
                Nivel estándar para pregrado: <strong>60%</strong>.
              </span>
            </div>

            {/* Nota de Aprobación y Máxima */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-gray-700 block">Nota Aprobación:</label>
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
                <label className="font-bold text-gray-700 block">Nota Máxima:</label>
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

        {/* Simulador Interactivo de Escala */}
        <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-canvas-card space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="font-bold text-[#2D3B45] flex items-center gap-1.5">
              <Calculator size={14} className="text-emerald-700" />
              Simulador Interactivo de Cálculo
            </h3>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
              Fórmula en Tiempo Real
            </span>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-gray-700 block">Puntaje Máximo:</label>
                <input
                  type="number"
                  min="1"
                  value={testMaxScore}
                  onChange={(e) => setTestMaxScore(parseInt(e.target.value, 10) || 1)}
                  className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-gray-700 block">Puntaje Obtenido:</label>
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

            {/* Resultado Visual de la Nota Calculada */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-[4px] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-gray-500 block">Nota resultante:</span>
                <span className="text-2xl font-extrabold text-[#2D3B45]">{simulatedGrade.toFixed(1)}</span>
                <span className="text-[10px] text-gray-500 block">
                  Puntaje de corte (60%): {(testMaxScore * (config.exigenciaPct / 100)).toFixed(1)} pts
                </span>
              </div>
              <div>
                <CanvasBadge variant={simulatedGrade >= config.notaAprobacion ? "success" : "danger"}>
                  {simulatedGrade >= config.notaAprobacion ? "Aprobado (≥4.0)" : "Reprobado (<4.0)"}
                </CanvasBadge>
              </div>
            </div>

            <div className="p-2.5 bg-blue-50/60 border border-blue-200 rounded text-[11px] text-blue-950 flex items-start gap-2">
              <Sparkles size={14} className="text-[#008EE2] shrink-0 mt-0.5" />
              <span>
                <strong>Garantía de Fórmula UDP:</strong> Si un alumno obtiene 0 puntos, su nota es exactamente el <strong>Punto Base {config.puntoBase.toFixed(1)}</strong>. Al 60% obtiene <strong>4.0</strong>, y al puntaje máximo obtiene <strong>{config.notaMaxima.toFixed(1)}</strong>.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
