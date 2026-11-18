"use client";

import { useCallback, useMemo, useState } from "react";
import {
  evaluacionVacia,
  restriccionVacia,
  validarBorrador,
  type CursoBorrador,
  type EvaluacionBorrador,
  type RestriccionBorrador,
} from "@/utils/gestion/borradorCurso";
import { ponderacionesSuman100, sumaPonderaciones } from "@/utils/gestion/ponderaciones";

/** Estado del formulario del curso. Para reiniciarlo, el padre cambia la `key` del formulario. */
export function useCursoForm(inicial: CursoBorrador) {
  const [borrador, setBorrador] = useState<CursoBorrador>(inicial);

  const validacion = useMemo(() => validarBorrador(borrador), [borrador]);

  const ponderaciones = useMemo(() => {
    const items = borrador.evaluaciones.map((e) => ({ ponderacion: e.ponderacion ?? 0 }));
    return { suma: sumaPonderaciones(items), ok: ponderacionesSuman100(items) };
  }, [borrador.evaluaciones]);

  const actualizar = useCallback(<K extends keyof CursoBorrador>(campo: K, valor: CursoBorrador[K]) => {
    setBorrador((b) => ({ ...b, [campo]: valor }));
  }, []);

  const actualizarEvaluacion = useCallback((clave: string, cambios: Partial<EvaluacionBorrador>) => {
    setBorrador((b) => ({
      ...b,
      evaluaciones: b.evaluaciones.map((e) => (e.clave === clave ? { ...e, ...cambios } : e)),
    }));
  }, []);

  const agregarEvaluacion = useCallback(() => {
    setBorrador((b) => ({ ...b, evaluaciones: [...b.evaluaciones, evaluacionVacia("tarea")] }));
  }, []);

  const quitarEvaluacion = useCallback((clave: string) => {
    setBorrador((b) => ({ ...b, evaluaciones: b.evaluaciones.filter((e) => e.clave !== clave) }));
  }, []);

  const actualizarRestriccion = useCallback((clave: string, cambios: Partial<RestriccionBorrador>) => {
    setBorrador((b) => ({
      ...b,
      restricciones: b.restricciones.map((r) => (r.clave === clave ? { ...r, ...cambios } : r)),
    }));
  }, []);

  const agregarRestriccion = useCallback(() => {
    setBorrador((b) => ({ ...b, restricciones: [...b.restricciones, restriccionVacia()] }));
  }, []);

  const quitarRestriccion = useCallback((clave: string) => {
    setBorrador((b) => ({ ...b, restricciones: b.restricciones.filter((r) => r.clave !== clave) }));
  }, []);

  return {
    borrador,
    validacion,
    ponderaciones,
    actualizar,
    actualizarEvaluacion,
    agregarEvaluacion,
    quitarEvaluacion,
    actualizarRestriccion,
    agregarRestriccion,
    quitarRestriccion,
  };
}

export type CursoFormApi = ReturnType<typeof useCursoForm>;
