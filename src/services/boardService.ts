import { callOp, GatewayError, setBoardToken } from "./dataGateway";

export type UnlockResult = "ok" | "invalid" | "rate_limited" | "error";

/** Desbloquea la planilla pública de una sección: el PIN semestral se valida en el servidor. */
export async function unlockBoard(sectionCode: string, pin: string): Promise<UnlockResult> {
  try {
    const res = await callOp<{ ok: boolean; token?: string }>("visual.unlock", { sectionCode, pin });
    if (!res.ok || !res.token) return "invalid";
    setBoardToken(sectionCode, res.token);
    return "ok";
  } catch (e) {
    return e instanceof GatewayError && e.code === "rate_limited" ? "rate_limited" : "error";
  }
}
