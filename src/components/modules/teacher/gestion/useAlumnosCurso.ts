"use client";

import { useCallback, useEffect, useState } from "react";
import type { Alumno, AlumnoNuevo } from "@/types/gestion";
import {
  actualizarAlumnoApi,
  crearAlumnosApi,
  eliminarAlumnoApi,
  listarAlumnosApi,
  mensajeDeError,
} from "@/services/gestion/clienteApi";

const ordenar = (lista: Alumno[]) =>
  [...lista].sort(
    (a, b) => a.apellidos.localeCompare(b.apellidos, "es") || a.nombres.localeCompare(b.nombres, "es")
  );

/** Estado único de la nómina del curso (lista + acciones que la mantienen sincronizada). */
export function useAlumnosCurso(cursoId: string) {
  const [alumnos, setAlumnos] = useState<Alumno[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    try {
      setAlumnos(ordenar(await listarAlumnosApi(cursoId)));
      setError(null);
    } catch (e) {
      setError(mensajeDeError(e));
      setAlumnos((prev) => prev ?? []);
    }
  }, [cursoId]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  /** Lanza el error de la API para que el modal lo muestre. */
  const agregar = useCallback(
    async (nuevos: AlumnoNuevo[]) => {
      const creados = await crearAlumnosApi(cursoId, nuevos);
      setAlumnos((prev) => ordenar([...(prev ?? []), ...creados]));
      return creados.length;
    },
    [cursoId]
  );

  const actualizar = useCallback(
    async (alumnoId: string, datos: AlumnoNuevo) => {
      const alumno = await actualizarAlumnoApi(cursoId, alumnoId, datos);
      setAlumnos((prev) => ordenar((prev ?? []).map((a) => (a.id === alumno.id ? alumno : a))));
    },
    [cursoId]
  );

  const eliminar = useCallback(
    async (alumnoId: string) => {
      await eliminarAlumnoApi(cursoId, alumnoId);
      setAlumnos((prev) => (prev ?? []).filter((a) => a.id !== alumnoId));
    },
    [cursoId]
  );

  return { alumnos, error, cargar, agregar, actualizar, eliminar };
}
