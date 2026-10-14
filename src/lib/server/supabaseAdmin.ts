import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase con la clave service_role: SOLO para rutas de servidor.
 * Ignora RLS, por eso nunca debe importarse desde código del navegador ni usar prefijo NEXT_PUBLIC_.
 */
export class AdminConfigError extends Error {}

let client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new AdminConfigError("SUPABASE_SERVICE_ROLE_KEY no configurada.");
  if (!client) {
    client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  }
  return client;
}
