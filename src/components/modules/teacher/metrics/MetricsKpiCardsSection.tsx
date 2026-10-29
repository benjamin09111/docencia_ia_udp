"use client";

import React from "react";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";

export const MetricsKpiCardsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-canvas-card">
        <span className="text-xs text-[#6B7780] font-bold uppercase block">Asistencia Promedio</span>
        <div className="flex items-baseline justify-between mt-1">
          <span className="text-2xl font-extrabold text-[#2D3B45]">85.4%</span>
          <span className="text-xs text-emerald-700 font-semibold">+4.2% vs 2025</span>
        </div>
        <span className="text-xs text-gray-500 mt-1 block">Meta institucional UDP: &gt; 75%</span>
      </div>

      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-canvas-card">
        <span className="text-xs text-[#6B7780] font-bold uppercase block">Alumnos en Riesgo RI (&lt; 75%)</span>
        <div className="flex items-baseline justify-between mt-1">
          <span className="text-2xl font-extrabold text-[#C8102E]">1 Alumno</span>
          <CanvasBadge variant="danger">Alerta Temprana</CanvasBadge>
        </div>
        <span className="text-xs text-gray-500 mt-1 block">Camila (68% de asistencia)</span>
      </div>

      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-canvas-card">
        <span className="text-xs text-[#6B7780] font-bold uppercase block">Interacción con Agente IA</span>
        <div className="flex items-baseline justify-between mt-1">
          <span className="text-2xl font-extrabold text-[#008EE2]">61 Dudas</span>
          <span className="text-xs text-blue-700 font-semibold">86% Alumnos</span>
        </div>
        <span className="text-xs text-gray-500 mt-1 block">Promedio: 8.7 consultas/alumno</span>
      </div>

      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-canvas-card">
        <span className="text-xs text-[#6B7780] font-bold uppercase block">Nota Promedio Proyectada</span>
        <div className="flex items-baseline justify-between mt-1">
          <span className="text-2xl font-extrabold text-emerald-700">5.5</span>
          <span className="text-xs text-gray-500">Escala 1.0 a 7.0</span>
        </div>
        <span className="text-xs text-gray-500 mt-1 block">Con +0.3 décimas aplicadas</span>
      </div>
    </div>
  );
};
