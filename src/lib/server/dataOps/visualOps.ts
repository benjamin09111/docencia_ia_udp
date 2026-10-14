import { timingSafeEqual } from "node:crypto";
import { createBoardToken } from "../boardToken";
import { checkRateLimit } from "../rateLimit";
import { DataOp, OpError, v } from "./types";

const WINDOW_MS = 10 * 60 * 1000;

const sameText = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

export const visualOps: Record<string, DataOp> = {
  // Desbloqueo del tablero público: el PIN semestral se valida AQUÍ (antes se comparaba en el navegador
  // contra un valor escrito en el código). Entrega un token firmado que solo sirve para esa sección.
  "visual.unlock": {
    access: "public",
    run: async ({ admin, ip }, args) => {
      const section = v.section(args.sectionCode);
      const pin = v.str(args.pin, "PIN", 12, 1);

      // Por IP y por sección: el campus comparte WiFi, pero un PIN de 4 dígitos no debe poder adivinarse
      if (!checkRateLimit(`vis:ip:${ip}:${section}`, 30, WINDOW_MS).allowed || !checkRateLimit(`vis:sec:${section}`, 200, WINDOW_MS).allowed) {
        throw new OpError(429, "rate_limited", "Demasiados intentos. Espera unos minutos e inténtalo nuevamente.");
      }

      const { data, error } = await admin.from("sections").select("pin_activo").eq("code", section).maybeSingle();
      if (error) throw error;
      const expected = (data?.pin_activo as string | null) ?? "";
      // Sin PIN configurado la planilla NO se abre: es más seguro que dejarla pública
      if (!expected || !sameText(expected, pin)) return { ok: false };
      return { ok: true, token: await createBoardToken(section) };
    },
  },
};
