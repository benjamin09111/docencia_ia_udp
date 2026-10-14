import { DataOp, v } from "./types";

const STATUSES = ["programada", "realizada", "cancelada"] as const;
const MODALITIES = ["presencial", "online"] as const;

async function updateSession(
  admin: Parameters<DataOp["run"]>[0]["admin"],
  sessionCode: string,
  patch: Record<string, unknown>
) {
  const { error } = await admin.from("class_sessions").update(patch).eq("session_code", sessionCode);
  if (error) throw error;
  return {};
}

export const sessionOps: Record<string, DataOp> = {
  // Estado de las clases (canceladas / online / opcionales): lo necesita también el alumno para ver el mismo porcentaje
  "sessions.states": {
    access: "public",
    run: async ({ admin }, args) => {
      const { data, error } = await admin
        .from("class_sessions")
        .select("session_code, status, motivo_cancelacion, modality, is_optional, sections!inner(code)")
        .eq("sections.code", v.section(args.sectionCode))
        .limit(1000);
      if (error) throw error;
      return (data ?? []).map((r: any) => ({
        session_code: r.session_code,
        status: r.status,
        motivo_cancelacion: r.motivo_cancelacion,
        modality: r.modality,
        is_optional: r.is_optional,
      }));
    },
  },

  "sessions.setStatus": {
    access: "teacher",
    run: ({ admin }, args) =>
      updateSession(admin, v.sessionCode(args.sessionCode), {
        status: v.oneOf(args.status, STATUSES, "estado"),
        motivo_cancelacion: v.optStr(args.motivo, "motivo", 300),
      }),
  },

  "sessions.setModality": {
    access: "teacher",
    run: ({ admin }, args) =>
      updateSession(admin, v.sessionCode(args.sessionCode), { modality: v.oneOf(args.modality, MODALITIES, "modalidad") }),
  },

  "sessions.setOptional": {
    access: "teacher",
    run: ({ admin }, args) =>
      updateSession(admin, v.sessionCode(args.sessionCode), { is_optional: v.bool(args.esOpcional, "esOpcional") }),
  },

  // Clases de la sección que ya tienen asistencia registrada (sin traer miles de registros)
  "sessions.recorded": {
    access: "teacher",
    run: async ({ admin }, args) => {
      const { data, error } = await admin
        .from("class_sessions")
        .select("session_code, date, type, dia_semana, modality, status, motivo_cancelacion, start_time, end_time, room, sections!inner(code), attendance_records(id)")
        .eq("sections.code", v.section(args.sectionCode))
        .limit(1, { foreignTable: "attendance_records" });
      if (error) throw error;
      return (data ?? [])
        .filter((r: any) => Array.isArray(r.attendance_records) && r.attendance_records.length > 0)
        .map(({ attendance_records, sections, ...session }: any) => session);
    },
  },
};
