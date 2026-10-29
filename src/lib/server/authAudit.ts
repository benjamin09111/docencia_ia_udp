import { getSupabaseAdmin } from "./supabaseAdmin";
import { securityFingerprint } from "./securityFingerprint";

type AuthEventType = "login_success" | "login_failed" | "logout";

interface AuthEventInput {
  type: AuthEventType;
  identifier?: string;
  ip: string;
  userId?: string;
}

/** Registra seguridad sin persistir correo, IP ni contenido de la sesión en texto plano. */
export async function recordAuthEvent({ type, identifier = "", ip, userId }: AuthEventInput): Promise<void> {
  try {
    const identifierHash = securityFingerprint(identifier.trim().toLowerCase());
    const ipHash = securityFingerprint(ip);
    if (!identifierHash || !ipHash) return;

    const { error } = await getSupabaseAdmin().from("auth_security_events").insert({
      event_type: type,
      user_id: userId || null,
      identifier_hash: identifierHash,
      ip_hash: ipHash,
    });
    if (error) throw error;
  } catch {
    // La auditoría no debe revelar detalles ni impedir un login válido durante una contingencia.
    console.error("[auth-audit] No fue posible registrar el evento de seguridad.");
  }
}
