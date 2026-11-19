/**
 * Errores del Módulo 1 con un mensaje SEGURO para el cliente (Regla 12):
 * el detalle técnico solo va a console.error en el servidor.
 */

export type TipoErrorGestion = "invalido" | "no_encontrado" | "conflicto" | "interno";

export class ErrorGestion extends Error {
  constructor(
    public readonly tipo: TipoErrorGestion,
    public readonly mensajePublico: string,
    detalle?: unknown
  ) {
    super(mensajePublico);
    this.name = "ErrorGestion";
    if (detalle !== undefined) this.cause = detalle;
  }
}

/** Código de Postgres para violación de UNIQUE. */
const UNIQUE_VIOLATION = "23505";

type ErrorSupabase = { code?: string; message?: string } | null;

/** Convierte un error de Supabase en ErrorGestion, sin exponer el mensaje de la base. */
export function errorDeBase(operacion: string, error: ErrorSupabase, mensajeConflicto?: string): ErrorGestion {
  if (error?.code === UNIQUE_VIOLATION && mensajeConflicto) {
    return new ErrorGestion("conflicto", mensajeConflicto, error);
  }
  console.error(`[gestion] ${operacion}:`, error?.code, error?.message);
  return new ErrorGestion("interno", "No se pudo procesar la solicitud en este momento.", error);
}
