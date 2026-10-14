/**
 * Cliente de la puerta única de datos (/api/data). Reemplaza el acceso directo a Supabase desde el navegador:
 * la base ya no recibe la clave pública, todo pasa por el servidor, que valida y autoriza cada operación.
 */

export class GatewayError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
}

export const BOARD_LOCKED_EVENT = "udp_board_locked";
const boardKey = (section: string) => `udp_board_token_${section}`;

export function getBoardToken(section: string): string | null {
  try {
    return localStorage.getItem(boardKey(section));
  } catch {
    return null;
  }
}

export function setBoardToken(section: string, token: string): void {
  try {
    localStorage.setItem(boardKey(section), token);
  } catch {}
}

export function clearBoardToken(section: string): void {
  try {
    localStorage.removeItem(boardKey(section));
  } catch {}
}

export const hasBoardToken = (section: string) => Boolean(getBoardToken(section));

/**
 * Ejecuta una operación del servidor. `boardSection`: envía el token del tablero de esa sección
 * (para operaciones de lectura de la planilla pública).
 */
export async function callOp<T = unknown>(
  op: string,
  args: Record<string, unknown> = {},
  opts: { boardSection?: string } = {}
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = opts.boardSection ? getBoardToken(opts.boardSection) : null;
  if (token) headers["x-board-token"] = token;

  const res = await fetch("/api/data", { method: "POST", headers, body: JSON.stringify({ op, args }) });
  const body = await res.json().catch(() => null);

  if (!res.ok || !body?.ok) {
    const code = body?.code || "server_error";
    // Token vencido o inválido: se borra y la planilla vuelve a pedir el PIN
    if (code === "board_locked" && opts.boardSection) {
      clearBoardToken(opts.boardSection);
      if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(BOARD_LOCKED_EVENT, { detail: opts.boardSection }));
    }
    throw new GatewayError(res.status, code, body?.message || "No se pudo procesar la solicitud en este momento.");
  }
  return body.data as T;
}
