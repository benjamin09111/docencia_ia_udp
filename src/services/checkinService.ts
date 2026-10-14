import { getDeviceFingerprint } from "@/utils/deviceFingerprint";

export interface CheckinParams {
  section: string;
  studentCanvasId: number;
  pin?: string;
  lat?: number;
  lng?: number;
}

export type CheckinResponse =
  | { ok: true; alreadyMarked: boolean; studentName: string; timestamp: string; distanciaMetros?: number }
  | { ok: false; code: string; message: string };

/** Envía el marcaje al servidor, que valida horario, PIN, GPS, matrícula y dispositivo. */
export async function submitCheckin(params: CheckinParams): Promise<CheckinResponse> {
  try {
    const deviceId = await getDeviceFingerprint();
    const res = await fetch("/api/attendance/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...params, deviceId }),
    });
    const data = await res.json().catch(() => null);
    if (data && typeof data.ok === "boolean") return data as CheckinResponse;
    return { ok: false, code: "server_error", message: "No se pudo registrar tu asistencia. Inténtalo nuevamente." };
  } catch {
    return { ok: false, code: "network", message: "No hay conexión con el servidor. Revisa tu internet e inténtalo nuevamente." };
  }
}
