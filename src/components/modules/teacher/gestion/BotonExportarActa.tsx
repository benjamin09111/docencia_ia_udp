"use client";

import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import type { Alumno, CursoConEvaluaciones } from "@/types/gestion";
import type { ResultadoCalculo } from "@/utils/gestion/calcularNotaFinal";
import type { NotasPorAlumno } from "@/utils/gestion/calcularTabla";
import { descargarArchivo } from "@/utils/gestion/descargarArchivo";
import { mensajeDeError } from "@/services/gestion/clienteApi";

interface Props {
  curso: CursoConEvaluaciones;
  alumnos: Alumno[] | null;
  notas: NotasPorAlumno;
  resultados: Record<string, ResultadoCalculo>;
  /** En simulación no se exporta: el acta refleja solo notas guardadas. */
  simulacion: boolean;
}

/** Genera y descarga el acta oficial .xlsx (exceljs se carga recién al hacer clic). */
export const BotonExportarActa: React.FC<Props> = ({ curso, alumnos, notas, resultados, simulacion }) => {
  const [generando, setGenerando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sinAlumnos = !alumnos || alumnos.length === 0;

  const exportar = async () => {
    if (!alumnos) return;
    setGenerando(true);
    setError(null);
    try {
      const { construirActaExcel, nombreArchivoActa } = await import("@/utils/gestion/actaExcel");
      descargarArchivo(await construirActaExcel({ curso, alumnos, notas, resultados }), nombreArchivoActa(curso));
    } catch (e) {
      console.error("[gestion] exportar acta:", e);
      setError(`No se pudo generar el Excel. ${mensajeDeError(e)}`);
    } finally {
      setGenerando(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <CanvasButton
        variant="primary-udp"
        icon={generando ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
        onClick={() => void exportar()}
        disabled={generando || sinAlumnos || simulacion}
        title={simulacion ? "Sal del modo simulación para exportar las notas guardadas" : sinAlumnos ? "El curso no tiene alumnos" : undefined}
      >
        {generando ? "Generando…" : "Exportar Excel"}
      </CanvasButton>
      {error && <span className="text-[11px] text-[#C8102E]">{error}</span>}
    </div>
  );
};
