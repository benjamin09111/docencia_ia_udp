import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Quién puede ejecutar una operación:
 *  - "public":  cualquiera (alumnos). Debe devolver solo datos mínimos y validar todo lo que recibe.
 *  - "board":   docente con sesión, o alumno con el token del tablero de ESA sección (PIN semestral).
 *  - "teacher": solo docente con sesión válida.
 */
export type OpAccess = "public" | "board" | "teacher";

export interface OpContext {
  admin: SupabaseClient;
  ip: string;
  isTeacher: boolean;
}

export interface DataOp {
  access: OpAccess;
  run: (ctx: OpContext, args: Record<string, unknown>) => Promise<unknown>;
}

/** Error "esperado": se devuelve al cliente con su mensaje (que debe ser seguro de mostrar). */
export class OpError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
}

// ---------------------------------------------------------------------------
// Validadores: toda entrada del cliente es hostil hasta que se valida.
// ---------------------------------------------------------------------------
const bad = (what: string) => new OpError(400, "invalid", `Dato inválido: ${what}.`);

const SECTION_RE = /^[A-Za-z0-9_-]{3,40}$/;
const SESSION_RE = /^[A-Za-z0-9_.:-]{5,120}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const REVERSE_FRIENDLY_IDS: Record<string, string> = {
  sec_1: "CIT3203_CA01",
  sec_2: "CIT3203_CA02",
  sec_3: "CIT3203_CA03",
  sec_arq_emergentes: "CIT3100_CA02",
  sec_gestion_org: "CIT2206_CA01",
  sec_arq_soft: "CIT3000_CA02",
};

export function toCanonicalCode(raw: string): string {
  let out = raw;
  for (const [fr, real] of Object.entries(REVERSE_FRIENDLY_IDS)) {
    if (out === fr || out.includes(fr)) out = out.replace(fr, real);
  }
  return out;
}

export const v = {
  section: (x: unknown, what = "sección"): string => {
    if (typeof x !== "string" || !SECTION_RE.test(x)) throw bad(what);
    return toCanonicalCode(x);
  },
  sessionCode: (x: unknown): string => {
    if (typeof x !== "string" || !SESSION_RE.test(x)) throw bad("sesión");
    return toCanonicalCode(x);
  },
  date: (x: unknown, what = "fecha"): string => {
    if (typeof x !== "string" || !DATE_RE.test(x) || Number.isNaN(Date.parse(x))) throw bad(what);
    return x;
  },
  int: (x: unknown, what: string, min = 1, max = Number.MAX_SAFE_INTEGER): number => {
    if (typeof x !== "number" || !Number.isSafeInteger(x) || x < min || x > max) throw bad(what);
    return x;
  },
  num: (x: unknown, what: string, min: number, max: number): number => {
    if (typeof x !== "number" || !Number.isFinite(x) || x < min || x > max) throw bad(what);
    return x;
  },
  bool: (x: unknown, what: string): boolean => {
    if (typeof x !== "boolean") throw bad(what);
    return x;
  },
  oneOf: <T extends string>(x: unknown, allowed: readonly T[], what: string): T => {
    if (typeof x !== "string" || !(allowed as readonly string[]).includes(x)) throw bad(what);
    return x as T;
  },
  str: (x: unknown, what: string, max: number, min = 0): string => {
    if (typeof x !== "string") throw bad(what);
    const t = x.trim();
    if (t.length < min || t.length > max) throw bad(what);
    return t;
  },
  optStr: (x: unknown, what: string, max: number): string | null => {
    if (x === undefined || x === null || x === "") return null;
    return v.str(x, what, max);
  },
  array: (x: unknown, what: string, max: number): unknown[] => {
    if (!Array.isArray(x) || x.length > max) throw bad(what);
    return x;
  },
  uuidList: (x: unknown, what: string, max = 200): string[] => {
    const list = v.array(x, what, max);
    const re = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (list.length === 0 || !list.every((i) => typeof i === "string" && re.test(i))) throw bad(what);
    return list as string[];
  },
};

/** Fecha de hoy en Chile (YYYY-MM-DD). */
export const todayChile = () => new Date().toLocaleDateString("en-CA", { timeZone: "America/Santiago" });
