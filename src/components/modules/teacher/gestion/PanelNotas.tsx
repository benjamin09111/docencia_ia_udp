"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FlaskConical, Loader2 } from "lucide-react";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasToolbar } from "@/components/canvas/CanvasToolbar";
import { ETIQUETAS_NOTAS_FALTANTES } from "@/constants/gestion";
import type { CursoConEvaluaciones } from "@/types/gestion";
import { esNotaValida, tieneDecimales } from "@/utils/gestion/validacionNota";
import { formatearNota } from "@/utils/gestion/redondeo";
import { useTablaNotas } from "./useTablaNotas";
import { TablaNotas } from "./TablaNotas";
import { BotonExportarActa } from "./BotonExportarActa";
import type { AccionesCeldas, ReglasCeldas } from "./FilaNotas";
import { Aviso } from "./piezasFormulario";

interface Props {
  curso: CursoConEvaluaciones;
  onIrAAlumnos: () => void;
}

const normalizar = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Pestaña Notas: tabla editable con nota final en vivo, guardado automático y modo simulación. */
export const PanelNotas: React.FC<Props> = ({ curso, onIrAAlumnos }) => {
  const tabla = useTablaNotas(curso);
  const [busqueda, setBusqueda] = useState("");
  const [avisoInvalido, setAvisoInvalido] = useState<string | null>(null);

  useEffect(() => {
    if (!avisoInvalido) return;
    const t = setTimeout(() => setAvisoInvalido(null), 7000);
    return () => clearTimeout(t);
  }, [avisoInvalido]);

  const tope = curso.decimas_totales;
  const reglas = useMemo<ReglasCeldas>(
    () => ({
      esNotaValida: (n) => esNotaValida(n, curso.nota_minima, curso.nota_maxima),
      mensajeNota: `La nota debe estar entre ${formatearNota(curso.nota_minima)} y ${formatearNota(curso.nota_maxima)}, con un decimal.`,
      esDecimaValida: (n) => n >= 0 && n <= (tope ?? 0) && tieneDecimales(n, 1),
      mensajeDecimas: `Las décimas van de 0.0 a ${formatearNota(tope ?? 0)} (en puntos de nota).`,
      conDecimas: (tope ?? 0) > 0,
      conExamen: curso.evaluaciones.some((e) => e.tipo === "examen"),
    }),
    [curso, tope]
  );

  const { previsualizar, confirmarNota, confirmarDecimas } = tabla;
  const acciones = useMemo<AccionesCeldas>(
    () => ({ previsualizar, confirmarNota, confirmarDecimas, avisarInvalido: setAvisoInvalido }),
    [previsualizar, confirmarNota, confirmarDecimas]
  );

  const filtrados = useMemo(() => {
    const q = normalizar(busqueda.trim());
    const lista = tabla.alumnos ?? [];
    return q ? lista.filter((a) => normalizar(`${a.nombres} ${a.apellidos} ${a.rut}`).includes(q)) : lista;
  }, [tabla.alumnos, busqueda]);

  const { resumen } = tabla;
  return (
    <div className="space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-start gap-2">
        <div className="flex-1">
          <CanvasToolbar
            searchQuery={busqueda}
            onSearchChange={setBusqueda}
            searchPlaceholder="Buscar alumno o RUT..."
            secondaryButtonLabel={tabla.simulacion ? "Salir de simulación" : "Simular escenarios"}
            onSecondaryClick={tabla.alternarSimulacion}
          />
        </div>
        <div className="lg:pt-0.5">
          <BotonExportarActa
            curso={curso}
            alumnos={tabla.alumnos}
            notas={tabla.notas}
            resultados={tabla.resultados}
            simulacion={tabla.simulacion}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <CanvasBadge size="md">{resumen.total} alumnos</CanvasBadge>
        <CanvasBadge size="md" variant="success">{resumen.aprobados} aprobados</CanvasBadge>
        <CanvasBadge size="md" variant="danger">{resumen.reprobados} reprobados</CanvasBadge>
        <CanvasBadge size="md" variant="warning">{resumen.pendientes} pendientes</CanvasBadge>
        <CanvasBadge size="md" variant="info">Promedio {formatearNota(resumen.promedio)}</CanvasBadge>
        {!tabla.simulacion && (
          <span className="text-[#6B7780] ml-auto" aria-live="polite">
            {tabla.guardando ? "Guardando…" : "Los cambios se guardan automáticamente"}
          </span>
        )}
      </div>

      {tabla.simulacion && (
        <Aviso tipo="advertencia">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
            <span className="flex items-center gap-2">
              <FlaskConical size={15} className="shrink-0" />
              <span>
                <strong>Modo simulación:</strong> cambia notas para probar escenarios. Nada se guarda.{" "}
                {tabla.cambiosSimulados} cambio(s) simulados (resaltados en amarillo).
              </span>
            </span>
            <CanvasButton variant="outline" size="sm" onClick={tabla.descartarSimulacion} disabled={tabla.cambiosSimulados === 0}>
              Descartar cambios
            </CanvasButton>
          </div>
        </Aviso>
      )}
      {tabla.error && <Aviso tipo="error">{tabla.error}</Aviso>}
      {avisoInvalido && <Aviso tipo="error">{avisoInvalido}</Aviso>}

      {tabla.alumnos === null ? (
        <div className="flex items-center gap-2 text-xs text-[#6B7780] p-6">
          <Loader2 size={16} className="animate-spin text-[#B71C1C]" /> Cargando notas…
        </div>
      ) : tabla.alumnos.length === 0 ? (
        <Aviso tipo="info">
          El curso aún no tiene alumnos.{" "}
          <button type="button" className="underline font-semibold cursor-pointer" onClick={onIrAAlumnos}>
            Cargar alumnos
          </button>
        </Aviso>
      ) : (
        <TablaNotas
          alumnos={filtrados}
          evaluaciones={curso.evaluaciones}
          notas={tabla.notas}
          decimas={tabla.decimas}
          resultados={tabla.resultados}
          decimasTope={tope}
          reglas={reglas}
          acciones={acciones}
          simNotas={tabla.simNotas}
          simDecimas={tabla.simDecimas}
        />
      )}

      <p className="text-[11px] text-[#6B7780] leading-relaxed">
        Escala {formatearNota(curso.nota_minima)}–{formatearNota(curso.nota_maxima)} · aprobación{" "}
        {formatearNota(curso.nota_aprobacion)} · {ETIQUETAS_NOTAS_FALTANTES[curso.notas_faltantes]}. Escribe la nota y
        presiona Enter (baja) o Tab (derecha); Escape deshace. Redondeo a un decimal: 3.95 → 4.0.
      </p>
    </div>
  );
};
