import { getDeviceSignals } from "@/utils/deviceFingerprint";

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

/** Envía el marcaje solicitando primero un ticket criptográfico firmado de hardware */
export async function submitCheckin(params: CheckinParams): Promise<CheckinResponse> {
  try {
    // 1. Recopilar señales inmutables de hardware (audio, webgl, canvas, pantalla)
    const signals = await getDeviceSignals();

    // 2. Solicitar ticket firmado de un solo uso vinculado a este hardware
    const ticketRes = await fetch("/api/attendance/ticket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: params.section, signals }),
    });

    const ticketData = await ticketRes.json().catch(() => null);
    if (!ticketRes.ok || !ticketData?.ok) {
      return {
        ok: false,
        code: ticketData?.code || "ticket_error",
        message: ticketData?.message || "No se pudo verificar este dispositivo. Inténtalo de nuevo.",
      };
    }

    // 3. Ejecutar marcaje atómico con el ticket emitido
    const res = await fetch("/api/attendance/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...params, ticket: ticketData.ticket }),
    });

    const data = await res.json().catch(() => null);
    if (data && typeof data.ok === "boolean") return data as CheckinResponse;
    return { ok: false, code: "server_error", message: "No se pudo registrar tu asistencia. Inténtalo nuevamente." };
  } catch {
    return { ok: false, code: "network", message: "No hay conexión con el servidor. Revisa tu internet e inténtalo nuevamente." };
  }
}
