import fs from "node:fs";
import path from "node:path";
import { getSupabaseAdmin } from "./supabaseAdmin";

const TOKENS_FILE = path.join(process.cwd(), ".tokens_cache.json");
const memoryTokens = new Map<string, string>();

function loadTokensFromDisk(): void {
  try {
    if (fs.existsSync(TOKENS_FILE)) {
      const raw = fs.readFileSync(TOKENS_FILE, "utf-8");
      const data = JSON.parse(raw);
      if (typeof data === "object" && data !== null) {
        for (const [k, v] of Object.entries(data)) {
          if (typeof v === "string") memoryTokens.set(k, v);
        }
      }
    }
  } catch (err) {
    console.warn("[userTokenStore] No se pudo leer tokens de disco:", err);
  }
}

function persistTokensToDisk(): void {
  try {
    const obj: Record<string, string> = {};
    for (const [k, v] of memoryTokens.entries()) obj[k] = v;
    fs.writeFileSync(TOKENS_FILE, JSON.stringify(obj, null, 2), "utf-8");
  } catch (err) {
    console.warn("[userTokenStore] No se pudo guardar tokens en disco:", err);
  }
}

// Carga inicial
loadTokensFromDisk();

export function maskToken(token: string): string {
  if (!token || token.length < 10) return "";
  const prefix = token.slice(0, 4);
  const suffix = token.slice(-4);
  return `${prefix}••••••••${suffix}`;
}

export async function getUserCanvasToken(userId: string, isOwner = false): Promise<string | null> {
  if (!userId) return null;

  // 1. Token en memoria / almacén de cuentas
  if (memoryTokens.has(userId)) {
    const tok = memoryTokens.get(userId);
    if (tok && tok.trim().length > 10) return tok.trim();
  }

  // 2. Intentar leer de base de datos Supabase si la columna existe
  try {
    const { data } = await getSupabaseAdmin()
      .from("users")
      .select("canvas_token")
      .eq("id", userId)
      .maybeSingle();

    if (data && typeof (data as Record<string, unknown>).canvas_token === "string") {
      const dbTok = ((data as Record<string, unknown>).canvas_token as string).trim();
      if (dbTok.length > 10) {
        memoryTokens.set(userId, dbTok);
        persistTokensToDisk();
        return dbTok;
      }
    }
  } catch {}

  // 3. Fallback al titular institucional sólo si es el propietario
  if (isOwner && process.env.CANVAS_API_TOKEN && process.env.CANVAS_API_TOKEN.trim().length > 10) {
    return process.env.CANVAS_API_TOKEN.trim();
  }

  return null;
}

export async function setUserCanvasToken(userId: string, token: string): Promise<boolean> {
  const cleanToken = token.trim();
  if (!userId || cleanToken.length < 10) return false;

  memoryTokens.set(userId, cleanToken);
  persistTokensToDisk();

  // Intentar persistir en Supabase oportunistamente
  try {
    await getSupabaseAdmin()
      .from("users")
      .update({ canvas_token: cleanToken })
      .eq("id", userId);
  } catch {}

  return true;
}

export async function removeUserCanvasToken(userId: string): Promise<boolean> {
  if (!userId) return false;
  memoryTokens.delete(userId);
  persistTokensToDisk();

  try {
    await getSupabaseAdmin()
      .from("users")
      .update({ canvas_token: null })
      .eq("id", userId);
  } catch {}

  return true;
}

export interface VerifyCanvasTokenResult {
  valid: boolean;
  user?: {
    id: number;
    name: string;
    email?: string;
  };
  error?: string;
}

export async function verifyCanvasToken(token: string): Promise<VerifyCanvasTokenResult> {
  const baseUrl = process.env.CANVAS_BASE_URL || "https://udp.instructure.com";
  try {
    const res = await fetch(`${baseUrl}/api/v1/users/self`, {
      headers: {
        Authorization: `Bearer ${token.trim()}`,
      },
      cache: "no-store",
    });

    if (res.status === 401) {
      return { valid: false, error: "Token inválido o expirado en Canvas UDP." };
    }

    if (!res.ok) {
      return { valid: false, error: `Error de Canvas UDP (${res.status}).` };
    }

    const data = await res.json();
    return {
      valid: true,
      user: {
        id: data.id,
        name: data.name || data.short_name || "Usuario Canvas",
        email: data.primary_email || data.login_id || "usuario@mail.udp.cl",
      },
    };
  } catch (err) {
    console.error("[verifyCanvasToken] Error de red:", err);
    return { valid: false, error: "No fue posible conectar con el servidor de Canvas UDP." };
  }
}

