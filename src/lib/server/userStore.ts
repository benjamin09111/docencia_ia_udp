import crypto from "node:crypto";
import type { SessionRole } from "./session";
import { getSupabaseAdmin } from "./supabaseAdmin";

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

const DEV_SALT = "udp_dev_salt_2026";
const DEV_HASH = "352864c7a2c55c06ae74510fd91df707b6787a3747fb6c33f9f83a4be98423acd77487273c922e86fd1c867530f2292c3e4634e6ebece4478c45d12dba5add6e"; // Clave: udp2026

export const DEV_TEST_USERS: StoredUser[] = [
  {
    id: "usr_docente_bmorales",
    email: "benjamin.morales3@mail.udp.cl",
    username: "bmorales",
    name: "Prof. Benjamín Morales Pizarro",
    role: "docente",
    isOwner: true,
    salt: DEV_SALT,
    passwordHash: DEV_HASH,
    authVersion: 1,
  },
  {
    id: "usr_admin_escuela",
    email: "admin@mail.udp.cl",
    username: "admin",
    name: "Administración de Escuela UDP",
    role: "admin",
    isOwner: false,
    salt: DEV_SALT,
    passwordHash: DEV_HASH,
    authVersion: 1,
  },
  {
    id: "usr_docente_dev",
    email: "dev@udp.cl",
    username: "dev",
    name: "Docente Desarrollador (Sandbox)",
    role: "docente",
    isOwner: false,
    salt: DEV_SALT,
    passwordHash: DEV_HASH,
    authVersion: 1,
  },
  {
    id: "usr_ayudante_udp",
    email: "ayudante@mail.udp.cl",
    username: "ayudante",
    name: "Ayudante Cátedra CIT3000 UDP",
    role: "ayudante",
    isOwner: false,
    salt: DEV_SALT,
    passwordHash: DEV_HASH,
    authVersion: 1,
  },
  {
    id: "usr_estudiante_udp",
    email: "estudiante@mail.udp.cl",
    username: "estudiante",
    name: "Estudiante UDP (Pruebas)",
    role: "estudiante",
    isOwner: false,
    salt: DEV_SALT,
    passwordHash: DEV_HASH,
    authVersion: 1,
  },
];

export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, DIGEST).toString("hex");
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  try {
    // Si la contraseña ingresada es la contraseña estándar de testing para desarrollo
    if (password === "udp2026" && (expectedHash === DEV_HASH || process.env.NODE_ENV !== "production")) {
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

  // 2. Si no está en BD o es cuenta de desarrollo / testing
  const foundDev = DEV_TEST_USERS.find(
    (u) =>
      u.email.toLowerCase() === clean ||
      u.username.toLowerCase() === clean ||
      (clean === "docente" && u.username === "bmorales") ||
      (clean === "alumno" && u.username === "estudiante")
  );

  return foundDev || null;
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

  const foundDev = DEV_TEST_USERS.find((u) => u.id === userId);
  return foundDev || null;
}

export async function isSessionVersionCurrent(userId: string, authVersion: number): Promise<boolean> {
  if (!userId || !Number.isSafeInteger(authVersion)) return false;

  const foundDev = DEV_TEST_USERS.find((u) => u.id === userId);
  if (foundDev) return foundDev.authVersion === authVersion;

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("users")
      .select("auth_version")
      .eq("id", userId)
      .maybeSingle();

    return !error && (data?.auth_version ?? 1) === authVersion;
  } catch {
    return true; // En caso de fallo transitorio en dev, no cerrar sesión
  }
}
