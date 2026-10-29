import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/server/auth";
import { findUserById, generateSalt, hashPassword, verifyPassword } from "@/lib/server/userStore";
import { passwordPolicyError } from "@/lib/server/passwordPolicy";
import { getSupabaseAdmin } from "@/lib/server/supabaseAdmin";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/server/session";
import { revokeSession } from "@/lib/server/sessionRevocation";
import { invalidRequestOriginResponse, isTrustedMutation } from "@/lib/server/requestSecurity";

export async function POST(req: NextRequest) {
  const auth = await requireRole(req);
  if ("response" in auth) return auth.response;
  if (!isTrustedMutation(req)) return invalidRequestOriginResponse();

  try {
    const body = await req.json().catch(() => null);
    const currentPassword = typeof body?.currentPassword === "string" ? body.currentPassword : "";
    const newPassword = typeof body?.newPassword === "string" ? body.newPassword : "";
    if (!currentPassword || !newPassword || currentPassword.length > 200 || newPassword.length > 200) {
      return NextResponse.json({ error: "Completa ambos campos de contraseña." }, { status: 400 });
    }

    const user = await findUserById(auth.session.userId || "");
    if (!user || !verifyPassword(currentPassword, user.salt, user.passwordHash)) {
      return NextResponse.json({ error: "La contraseña actual no es correcta." }, { status: 401 });
    }
    const policyError = passwordPolicyError(newPassword, user.email);
    if (policyError) return NextResponse.json({ error: policyError }, { status: 400 });
    if (verifyPassword(newPassword, user.salt, user.passwordHash)) {
      return NextResponse.json({ error: "La nueva contraseña debe ser diferente a la actual." }, { status: 400 });
    }

    const salt = generateSalt();
    const nextVersion = user.authVersion + 1;
    const { error } = await getSupabaseAdmin()
      .from("users")
      .update({ salt, password_hash: hashPassword(newPassword, salt), auth_version: nextVersion })
      .eq("id", user.id);
    if (error) throw error;

    await revokeSession(auth.session.jti, auth.session.exp);
    const token = await createSessionToken({ userId: user.id, role: user.role, isOwner: user.isOwner, authVersion: nextVersion });
    const response = NextResponse.json({ success: true, message: "Contraseña actualizada. Las demás sesiones fueron cerradas." }, { headers: { "Cache-Control": "no-store" } });
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return response;
  } catch {
    console.error("[auth] No fue posible cambiar la contraseña.");
    return NextResponse.json({ error: "No fue posible actualizar la contraseña en este momento." }, { status: 500 });
  }
}
