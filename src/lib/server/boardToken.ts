import { signPayload, verifyPayload } from "./session";

/**
 * Token del tablero público de una sección. Se entrega solo al ingresar el PIN semestral correcto
 * (validado en el servidor) y habilita únicamente la lectura de la planilla de ESA sección.
 */
export const BOARD_TTL_S = 60 * 60 * 12; // 12 h

interface BoardClaims {
  scope: "board";
  section: string;
  exp: number;
}

export async function createBoardToken(section: string, now = Math.floor(Date.now() / 1000)): Promise<string> {
  const claims: BoardClaims = { scope: "board", section, exp: now + BOARD_TTL_S };
  return signPayload(claims);
}

/** ¿El token es válido, vigente y de ESTA sección? (uno de otra sección no sirve) */
export async function verifyBoardToken(
  token: string | null | undefined,
  section: string,
  now = Math.floor(Date.now() / 1000)
): Promise<boolean> {
  const claims = (await verifyPayload(token || undefined)) as BoardClaims | null;
  return Boolean(claims && claims.scope === "board" && claims.section === section && typeof claims.exp === "number" && now < claims.exp);
}
