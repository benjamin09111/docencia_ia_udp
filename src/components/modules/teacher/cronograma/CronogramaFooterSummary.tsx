"use client";

import React from "react";

export const CronogramaFooterSummary: React.FC = () => {
  return (
    <div className="mt-3 p-3 bg-amber-50/70 border border-gray-400 rounded text-xs text-gray-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-amber-200 pb-2 mb-2">
        <span className="font-mono font-bold text-xs text-amber-900">
          Versión 1.2 (Planificación oficial aprobada por Dirección de Escuela)
        </span>
        <span className="text-xs text-gray-600 italic">
          La planificación de solemnes es referencial y podría sufrir modificaciones por contingencia institucional.
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div>
          <span className="font-bold text-gray-700">Solemne 1: </span>
          <span className="font-mono font-semibold">24 – 30 septiembre</span>
        </div>
        <div>
          <span className="font-bold text-gray-700">Solemne 2: </span>
          <span className="font-mono font-semibold">23 – 27 noviembre</span>
        </div>
        <div>
          <span className="font-bold text-gray-700">Fin de clases: </span>
          <span className="font-mono font-semibold">4 de diciembre</span>
        </div>
        <div>
          <span className="font-bold text-gray-700">Exámenes: </span>
          <span className="font-mono font-semibold">9 – 18 diciembre</span>
        </div>
      </div>
    </div>
  );
};
