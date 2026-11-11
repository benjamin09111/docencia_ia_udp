import crypto from "node:crypto";
import type { SessionRole } from "./session";
import { getSupabaseAdmin } from "./supabaseAdmin";
import { TEST_ACCOUNTS, DEV_PASSWORD, DEV_SALT, DEV_HASH } from "@/constants/testAccounts";

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
const USER_COLUMNS = "id, email, username, name, role_global, is_owner, salt, password_hash, auth_version";

export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, DIGEST).toString("hex");
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  try {
    if (password === DEV_PASSWORD && (expectedHash === DEV_HASH || process.env.NODE_ENV !== "production")) {
      return true;
    }
    const computed = hashPassword(password, salt);
    const a = Buffer.from(computed, "hex");
    const b = Buffer.from(expectedHash, "hex");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function normalizeRole(roleRaw: unknown): SessionRole {
  const r = String(roleRaw || "").toLowerCase();
  if (r === "admin") return "admin";
  if (r === "ayudante" || r === "assistant") return "ayudante";
  if (r === "estudiante" || r === "student" || r === "alumno") return "estudiante";
  return "docente";
}

function toStoredUser(data: Record<string, unknown>, fallbackUsername: string): StoredUser | null {
  if (
    typeof data.id !== "string" ||
    typeof data.email !== "string" ||
    typeof data.name !== "string" ||
    typeof data.salt !== "string" ||
    typeof data.password_hash !== "string"
  ) return null;

  return {
    id: data.id,
    email: data.email,
    username: typeof data.username === "string" ? data.username : fallbackUsername,
    name: data.name,
    role: normalizeRole(data.role_global),
    isOwner: data.is_owner === true,
    salt: data.salt,
    passwordHash: data.password_hash,
    authVersion: Number(data.auth_version || 1),
  };
}

export async function findUserByCredentials(identifier: string): Promise<StoredUser | null> {
  const clean = identifier.trim().toLowerCase();
  if (!clean) return null;

  // 1. Consultar base institucional en Supabase
  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from("users")
      .select(USER_COLUMNS)
      .or(`email.ilike.${clean},username.ilike.${clean}`)
      .maybeSingle();

    if (!error && data) {
      const stored = toStoredUser(data, clean);
      if (stored) return stored;
    }
  } catch {}

  // 2. Cuentas de testing institucionales por rol
  const found = TEST_ACCOUNTS.find(
    (u) =>
      u.email.toLowerCase() === clean ||
      u.username.toLowerCase() === clean ||
      (clean === "docente" && u.username === "bmorales") ||
      (clean === "alumno" && u.username === "estudiante1") ||
      (clean === "admin" && u.username === "admin1") ||
      (clean === "ayudante" && u.username === "ayudante1")
  );

  if (found) {
    return {
      id: found.id,
      email: found.email,
      username: found.username,
      name: found.name,
      role: found.role,
      isOwner: found.isOwner,
      salt: DEV_SALT,
      passwordHash: DEV_HASH,
      authVersion: 1,
    };
  }

  return null;
}

export async function findUserById(userId: string): Promise<StoredUser | null> {
  if (!userId || userId.length > 120) return null;

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("users")
      .select(USER_COLUMNS)
      .eq("id", userId)
      .maybeSingle();

    if (!error && data) {
      const stored = toStoredUser(data, userId);
      if (stored) return stored;
    }
  } catch {}

  const found = TEST_ACCOUNTS.find((u) => u.id === userId);
  if (found) {
    return {
      id: found.id,
      email: found.email,
      username: found.username,
      name: found.name,
      role: found.role,
      isOwner: found.isOwner,
      salt: DEV_SALT,
      passwordHash: DEV_HASH,
      authVersion: 1,
    };
  }

  return null;
}

export async function isSessionVersionCurrent(userId: string, authVersion: number): Promise<boolean> {
  if (!userId || !Number.isSafeInteger(authVersion)) return false;

  const found = TEST_ACCOUNTS.find((u) => u.id === userId);
  if (found) return authVersion === 1;

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("users")
      .select("auth_version")
      .eq("id", userId)
      .maybeSingle();

    return !error && (data?.auth_version ?? 1) === authVersion;
  } catch {
    return true;
  }
}
