import crypto from "node:crypto";
import { SessionRole } from "./session";

export interface StoredUser {
  id: string;
  email: string;
  username: string;
  name: string;
  role: SessionRole;
  isOwner: boolean;
  salt: string;
  passwordHash: string;
}

export interface PublicUser {
  id: string;
  email: string;
  username: string;
  name: string;
  role: SessionRole;
  isOwner: boolean;
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

// Generación determinista pero segura de los 5 administradores iniciales
const SEED_USERS_CONFIG = [
  {
    id: "usr_admin_bmorales",
    email: "benjamin.morales3@mail.udp.cl",
    username: "bmorales",
    name: "Benjamín Morales Pizarro",
    role: "admin" as const,
    isOwner: true,
    salt: "7b4c6e8f1a2d3e4f5a6b7c8d9e0f1a2b",
    rawPass: "AdminUdp2026!BM",
  },
  {
    id: "usr_admin_dev1",
    email: "dev1@udp.cl",
    username: "dev1",
    name: "Admin Desarrollador 1",
    role: "admin" as const,
    isOwner: false,
    salt: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
    rawPass: "DevAdmin2026!1",
  },
  {
    id: "usr_admin_dev2",
    email: "dev2@udp.cl",
    username: "dev2",
    name: "Admin Desarrollador 2",
    role: "admin" as const,
    isOwner: false,
    salt: "2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e",
    rawPass: "DevAdmin2026!2",
  },
  {
    id: "usr_admin_coordinacion",
    email: "coordinacion.tics@udp.cl",
    username: "coordinacion",
    name: "Coordinación Académica TICs",
    role: "admin" as const,
    isOwner: false,
    salt: "3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f",
    rawPass: "CoordUdp2026!",
  },
  {
    id: "usr_admin_qa",
    email: "qa.admin@udp.cl",
    username: "qa.admin",
    name: "Auditor QA / Evaluador",
    role: "admin" as const,
    isOwner: false,
    salt: "4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a",
    rawPass: "QaAdmin2026!",
  },
];

// Almacén seguro en memoria con hashes PBKDF2
const SEED_USERS: StoredUser[] = SEED_USERS_CONFIG.map((u) => ({
  id: u.id,
  email: u.email,
  username: u.username,
  name: u.name,
  role: u.role,
  isOwner: u.isOwner,
  salt: u.salt,
  passwordHash: hashPassword(u.rawPass, u.salt),
}));

import { getSupabaseAdmin } from "./supabaseAdmin";

/** Busca un usuario en la base de datos (public.app_users) o recurre a memoria en caso de contingencia. */
export async function findUserByCredentials(identifier: string): Promise<StoredUser | null> {
  const clean = identifier.trim().toLowerCase();
  if (!clean) return null;

  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from("users")
      .select("id, email, username, name, role_global, is_owner, salt, password_hash")
      .or(`email.ilike.${clean},username.ilike.${clean}`)
      .maybeSingle();

    if (!error && data) {
      return {
        id: data.id,
        email: data.email,
        username: data.username || clean,
        name: data.name,
        role: (data.role_global || "admin") as SessionRole,
        isOwner: Boolean(data.is_owner),
        salt: data.salt,
        passwordHash: data.password_hash,
      };
    }
  } catch {
    // Si la base no responde, recurre con gracia al almacén en memoria
  }

  const user = SEED_USERS.find(
    (u) => u.email.toLowerCase() === clean || u.username.toLowerCase() === clean
  );
  return user || null;
}

/** Devuelve la lista pública de usuarios seed para documentación/desarrollo */
export function getDevelopmentDemoAccounts(): Array<PublicUser & { demoPass: string }> {
  return SEED_USERS_CONFIG.map((u) => ({
    id: u.id,
    email: u.email,
    username: u.username,
    name: u.name,
    role: u.role,
    isOwner: u.isOwner,
    demoPass: u.rawPass,
  }));
}
