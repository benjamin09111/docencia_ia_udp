import { z } from "zod";
import type { AlumnoNuevo } from "@/types/gestion";
import { normalizarRut } from "./rut";

/**
 * Validación de alumnos (función pura): la usan la vista previa del Excel, el alta
 * manual y el servidor, así todos marcan exactamente los mismos errores.
 */

export interface FilaAlumnoCruda {
  /** Número de fila en el Excel (o 1 en el alta manual). */
  fila: number;
  nombres: string;
  apellidos: string;
  rut: string;
  correo: string;
}

export interface FilaValidada {
  fila: number;
  /** Datos normalizados (RUT cuerpo-DV, correo en minúsculas, espacios limpios). */
  datos: AlumnoNuevo;
  errores: string[];
  valida: boolean;
}

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_TEXTO = 100;

const limpiar = (s: unknown) => String(s ?? "").replace(/\s+/g, " ").trim();

export function normalizarAlumno(f: Omit<FilaAlumnoCruda, "fila">): AlumnoNuevo {
  const rut = limpiar(f.rut);
  return {
    nombres: limpiar(f.nombres),
    apellidos: limpiar(f.apellidos),
    rut: normalizarRut(rut) ?? rut,
    correo: limpiar(f.correo).toLowerCase(),
  };
}

/**
 * Valida cada fila: campos obligatorios, RUT (módulo 11), correo, y duplicados
 * dentro del archivo y contra los alumnos que ya están en el curso.
 */
export function validarFilasAlumnos(
  filas: ReadonlyArray<FilaAlumnoCruda>,
  existentes: ReadonlyArray<Pick<AlumnoNuevo, "rut" | "correo">> = []
): FilaValidada[] {
  const normalizadas = filas.map((f) => ({ fila: f.fila, datos: normalizarAlumno(f), rutValido: normalizarRut(limpiar(f.rut)) !== null }));

  const filasPorRut = new Map<string, number[]>();
  const filasPorCorreo = new Map<string, number[]>();
  for (const n of normalizadas) {
    if (n.rutValido) filasPorRut.set(n.datos.rut, [...(filasPorRut.get(n.datos.rut) ?? []), n.fila]);
    if (n.datos.correo) filasPorCorreo.set(n.datos.correo, [...(filasPorCorreo.get(n.datos.correo) ?? []), n.fila]);
  }
  const rutsExistentes = new Set(existentes.map((e) => e.rut));
  const correosExistentes = new Set(existentes.map((e) => e.correo.toLowerCase()));

  return normalizadas.map(({ fila, datos, rutValido }) => {
    const errores: string[] = [];
    if (!datos.nombres) errores.push("Faltan los nombres.");
    if (!datos.apellidos) errores.push("Faltan los apellidos.");
    if (datos.nombres.length > MAX_TEXTO || datos.apellidos.length > MAX_TEXTO) errores.push("Nombre demasiado largo.");

    if (!datos.rut) errores.push("Falta el RUT.");
    else if (!rutValido) errores.push("RUT inválido (dígito verificador incorrecto).");
    else if (rutsExistentes.has(datos.rut)) errores.push("El RUT ya está en el curso.");
    else if ((filasPorRut.get(datos.rut)?.length ?? 0) > 1) {
      errores.push(`RUT duplicado en el archivo (filas ${filasPorRut.get(datos.rut)!.join(", ")}).`);
    }

    if (!datos.correo) errores.push("Falta el correo.");
    else if (!CORREO.test(datos.correo) || datos.correo.length > 254) errores.push("Correo inválido.");
    else if (correosExistentes.has(datos.correo)) errores.push("El correo ya está en el curso.");
    else if ((filasPorCorreo.get(datos.correo)?.length ?? 0) > 1) {
      errores.push(`Correo duplicado en el archivo (filas ${filasPorCorreo.get(datos.correo)!.join(", ")}).`);
    }

    return { fila, datos, errores, valida: errores.length === 0 };
  });
}

/** Body de POST /alumnos: la validación completa se repite en el servidor con validarFilasAlumnos. */
export const crearAlumnosSchema = z.object({
  alumnos: z
    .array(
      z.object({
        nombres: z.string().max(200),
        apellidos: z.string().max(200),
        rut: z.string().max(20),
        correo: z.string().max(300),
      })
    )
    .min(1, "No hay alumnos para cargar.")
    .max(500, "Carga como máximo 500 alumnos por vez."),
});

export const alumnoSchema = crearAlumnosSchema.shape.alumnos.element;
