"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Alumno, CursoConEvaluaciones } from "@/types/gestion";
import { guardarNotasApi, mensajeDeError, obtenerNotasApi } from "@/services/gestion/clienteApi";
import { agruparNotas, resumirTabla, type NotasPorAlumno } from "@/utils/gestion/calcularTabla";
import { calcularNotaFinal, type ResultadoCalculo } from "@/utils/gestion/calcularNotaFinal";
import { aplicarCambio, contarCambios, superponer } from "@/utils/gestion/mezclarNotas";

/** Valor que el docente está escribiendo (aún sin confirmar), para recalcular en vivo. */
export type Vivo =
  | { tipo: "nota"; alumnoId: string; evaluacionId: string; valor: number | null }
  | { tipo: "decimas"; alumnoId: string; valor: number };

const ordenar = (lista: Alumno[]) =>
  [...lista].sort((a, b) => a.apellidos.localeCompare(b.apellidos, "es") || a.nombres.localeCompare(b.nombres, "es"));

/**
 * Estado único de la tabla de notas: notas guardadas, capa de simulación y valor en edición.
 * La nota final se calcula siempre en el cliente con el motor puro (nunca se guarda).
 */
export function useTablaNotas(curso: CursoConEvaluaciones) {
  const [alumnos, setAlumnos] = useState<Alumno[] | null>(null);
  const [guardadas, setGuardadas] = useState<NotasPorAlumno>({});
  const [decimasGuardadas, setDecimasGuardadas] = useState<Record<string, number>>({});
  const [simulacion, setSimulacion] = useState(false);
  const [simNotas, setSimNotas] = useState<NotasPorAlumno>({});
  const [simDecimas, setSimDecimas] = useState<Record<string, number>>({});
  const [vivo, setVivo] = useState<Vivo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(0);

  const guardadasRef = useRef(guardadas);
  guardadasRef.current = guardadas;
  const decimasRef = useRef(decimasGuardadas);
  decimasRef.current = decimasGuardadas;

  const cargar = useCallback(async () => {
    try {
      const datos = await obtenerNotasApi(curso.id);
      setAlumnos(ordenar(datos.alumnos));
      setGuardadas(agruparNotas(datos.notas));
      setDecimasGuardadas(Object.fromEntries(datos.alumnos.map((a) => [a.id, a.decimas])));
      setError(null);
    } catch (e) {
      setError(mensajeDeError(e));
      setAlumnos((prev) => prev ?? []);
    }
  }, [curso.id]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const notas = useMemo(() => {
    const base = simulacion ? superponer(guardadas, simNotas) : guardadas;
    return vivo?.tipo === "nota" ? aplicarCambio(base, vivo.alumnoId, vivo.evaluacionId, vivo.valor) : base;
  }, [guardadas, simulacion, simNotas, vivo]);

  const decimas = useMemo(() => {
    const base = simulacion ? { ...decimasGuardadas, ...simDecimas } : decimasGuardadas;
    return vivo?.tipo === "decimas" ? { ...base, [vivo.alumnoId]: vivo.valor } : base;
  }, [decimasGuardadas, simulacion, simDecimas, vivo]);

  // Resultado por alumno con caché: si sus notas, décimas y la configuración no cambiaron, se
  // reutiliza el mismo objeto y su fila (React.memo) no se vuelve a dibujar al escribir en otra.
  const cache = useRef(new Map<string, { notas: unknown; decimas: number; curso: unknown; resultado: ResultadoCalculo }>());
  const resultados = useMemo(() => {
    const salida: Record<string, ResultadoCalculo> = {};
    for (const a of alumnos ?? []) {
      const n = notas[a.id];
      const d = decimas[a.id] ?? 0;
      const previo = cache.current.get(a.id);
      if (previo && previo.notas === n && previo.decimas === d && previo.curso === curso) {
        salida[a.id] = previo.resultado;
        continue;
      }
      const resultado = calcularNotaFinal({ config: curso, evaluaciones: curso.evaluaciones, notas: n ?? {}, decimas: d });
      cache.current.set(a.id, { notas: n, decimas: d, curso, resultado });
      salida[a.id] = resultado;
    }
    return salida;
  }, [alumnos, curso, decimas, notas]);

  const resumen = useMemo(() => resumirTabla(resultados), [resultados]);

  /** Guarda en el servidor con actualización optimista; si falla, revierte y avisa. */
  const guardar = useCallback(
    async (cambios: Parameters<typeof guardarNotasApi>[1], revertir: () => void) => {
      setGuardando((n) => n + 1);
      try {
        await guardarNotasApi(curso.id, cambios);
        setError(null);
      } catch (e) {
        revertir();
        setError(`No se guardó el último cambio: ${mensajeDeError(e)}`);
      } finally {
        setGuardando((n) => n - 1);
      }
    },
    [curso.id]
  );

  const confirmarNota = useCallback(
    (alumnoId: string, evaluacionId: string, valor: number | null) => {
      setVivo(null);
      if (simulacion) return setSimNotas((s) => aplicarCambio(s, alumnoId, evaluacionId, valor));
      const anterior = guardadasRef.current[alumnoId]?.[evaluacionId] ?? null;
      if (anterior === valor) return;
      setGuardadas((g) => aplicarCambio(g, alumnoId, evaluacionId, valor));
      void guardar({ notas: [{ evaluacion_id: evaluacionId, alumno_id: alumnoId, valor }], decimas: [] }, () =>
        setGuardadas((g) => aplicarCambio(g, alumnoId, evaluacionId, anterior))
      );
    },
    [simulacion, guardar]
  );

  const confirmarDecimas = useCallback(
    (alumnoId: string, valor: number) => {
      setVivo(null);
      if (simulacion) return setSimDecimas((s) => ({ ...s, [alumnoId]: valor }));
      const anterior = decimasRef.current[alumnoId] ?? 0;
      if (anterior === valor) return;
      setDecimasGuardadas((d) => ({ ...d, [alumnoId]: valor }));
      void guardar({ notas: [], decimas: [{ alumno_id: alumnoId, decimas: valor }] }, () =>
        setDecimasGuardadas((d) => ({ ...d, [alumnoId]: anterior }))
      );
    },
    [simulacion, guardar]
  );

  const descartarSimulacion = useCallback(() => {
    setSimNotas({});
    setSimDecimas({});
    setVivo(null);
  }, []);

  const alternarSimulacion = useCallback(() => {
    if (simulacion) descartarSimulacion(); // al salir, la simulación se descarta
    setSimulacion(!simulacion);
  }, [simulacion, descartarSimulacion]);

  return {
    alumnos,
    notas,
    decimas,
    resultados,
    resumen,
    error,
    guardando: guardando > 0,
    simulacion,
    simNotas,
    simDecimas,
    cambiosSimulados: contarCambios(simNotas, simDecimas),
    previsualizar: setVivo,
    confirmarNota,
    confirmarDecimas,
    alternarSimulacion,
    descartarSimulacion,
    recargar: cargar,
  };
}

export type TablaNotasApi = ReturnType<typeof useTablaNotas>;
