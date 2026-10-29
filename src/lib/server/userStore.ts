import crypto from "node:crypto";
import type { SessionRole } from "./session";

export interface StoredUser {
  id: string;
  email: string;
  username: string;
  name: string;
  role: SessionRole;
  isOwner: boolean;
  salt: string;
  passwordHash: string;
  authVersion: number;
}

const ITERATIONS = 100_000;
const KEY_LEN = 64;
const DIGEST = "sha512";

export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, DIGEST).toString("hex");
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  try {
    const computed = hashPassword(password, salt);
    const a = Buffer.from(computed, "hex");
    const b = Buffer.from(expectedHash, "hex");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

import { getSupabaseAdmin } from "./supabaseAdmin";

const USER_COLUMNS = "id, email, username, name, role_global, is_owner, salt, password_hash, auth_version";

function toStoredUser(data: Record<string, unknown>, fallbackUsername: string): StoredUser | null {
  if (
    typeof data.id !== "string" ||
    typeof data.email !== "string" ||
    typeof data.name !== "string" ||
    typeof data.salt !== "string" ||
    typeof data.password_hash !== "string" ||
    !Number.isSafeInteger(data.auth_version) ||
    Number(data.auth_version) < 1 ||
    (data.role_global !== "admin" && data.role_global !== "docente")
  ) return null;

  return {
    id: data.id,
    email: data.email,
    username: typeof data.username === "string" ? data.username : fallbackUsername,
    name: data.name,
    role: data.role_global,
    isOwner: data.is_owner === true,
    salt: data.salt,
    passwordHash: data.password_hash,
    authVersion: Number(data.auth_version),
  };
}

/**
 * Busca un usuario exclusivamente en la base institucional.
 * Nunca se usan cuentas de respaldo en código: si la base no está disponible,
 * el acceso falla cerrado.
 */
export async function findUserByCredentials(identifier: string): Promise<StoredUser | null> {
  const clean = identifier.trim().toLowerCase();
  if (!clean) return null;

  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from("users")
      .select(USER_COLUMNS)
      .or(`email.ilike.${clean},username.ilike.${clean}`)
      .maybeSingle();

    if (!error && data) return toStoredUser(data, clean);
  } catch {
    console.error("[auth] No fue posible consultar el almacén de usuarios.");
  }

  return null;
}

/** Obtiene el perfil de una sesión sólo en servidor; no se guarda PII en la cookie firmada. */
export async function findUserById(userId: string): Promise<StoredUser | null> {
  if (!userId || userId.length > 120) return null;

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("users")
      .select(USER_COLUMNS)
      .eq("id", userId)
      .maybeSingle();
    return !error && data ? toStoredUser(data, userId) : null;
  } catch {
    console.error("[auth] No fue posible consultar el perfil de usuario.");
    return null;
  }
}

/** Valida que la contraseña no haya sido cambiada desde la emisión de la sesión. */
export async function isSessionVersionCurrent(userId: string, authVersion: number): Promise<boolean> {
  if (!userId || !Number.isSafeInteger(authVersion)) return false;
  try {
    const { data, error } = await getSupabaseAdmin().from("users").select("auth_version").eq("id", userId).maybeSingle();
    return !error && data?.auth_version === authVersion;
  } catch {
    console.error("[auth] No fue posible validar la versión de sesión.");
    return false;
  }
}
