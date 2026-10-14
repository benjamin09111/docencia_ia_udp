import { SupabaseClient } from "@supabase/supabase-js";
import { checkRateLimit } from "../rateLimit";
import { DataOp, OpContext, OpError, todayChile, v } from "./types";

const WINDOW_MS = 10 * 60 * 1000;

// Columnas que ve un alumno de sus propias apelaciones (sin RUT)
const MINE_COLUMNS = "id, section_code, student_canvas_id, student_name, appeal_date, kind, comentario, status, created_at, resolved_at, request_id";

function limit(ctx: OpContext, section: string, studentId: number) {
  const ip = checkRateLimit(`ap:ip:${ctx.ip}`, 100, WINDOW_MS);
  const stu = checkRateLimit(`ap:stu:${section}:${studentId}`, 10, WINDOW_MS);
  if (!ip.allowed || !stu.allowed) {
    throw new OpError(429, "rate_limited", "Demasiados intentos. Espera unos minutos e inténtalo nuevamente.");
  }
}

/** El alumno debe estar matriculado en la sección. El nombre y el RUT salen de la base, nunca del navegador. */
async function enrolledStudent(admin: SupabaseClient, section: string, canvasId: number) {
  const { data, error } = await admin
    .from("enrollments")
    .select("students!inner(canvas_id, nombres, apellidos, rut), sections!inner(code)")
    .eq("sections.code", section)
    .eq("students.canvas_id", canvasId)
    .limit(1);
  if (error) throw error;
  const st = (data?.[0] as any)?.students;
  if (!st) throw new OpError(403, "not_enrolled", "No figuras matriculado en esta sección. Avisa al equipo docente.");
  return { name: `${st.nombres} ${st.apellidos}`.trim(), rut: st.rut as string | null };
}

export const appealOps: Record<string, DataOp> = {
  // Docente: todas las apelaciones de la sección
  "appeals.listAll": {
    access: "teacher",
    run: async ({ admin }, args) => {
      const { data, error } = await admin
        .from("attendance_appeals")
        .select("*")
        .eq("section_code", v.section(args.sectionCode))
        .order("created_at", { ascending: false })
        .limit(2000);
      if (error) throw error;
      return data ?? [];
    },
  },

  // Alumno: solo las apelaciones del alumno consultado (sin RUT)
  "appeals.listMine": {
    access: "public",
    run: async ({ admin }, args) => {
      const { data, error } = await admin
        .from("attendance_appeals")
        .select(MINE_COLUMNS)
        .eq("section_code", v.section(args.sectionCode))
        .eq("student_canvas_id", v.int(args.studentCanvasId, "alumno"))
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data ?? [];
    },
  },

  "appeals.create": {
    access: "public",
    run: async (ctx, args) => {
      const { admin } = ctx;
      const section = v.section(args.sectionCode);
      const studentId = v.int(args.studentCanvasId, "alumno");
      const dates = Array.from(new Set(v.array(args.dates, "fechas", 10).map((d) => v.date(d))));
      if (dates.length === 0) throw new OpError(400, "invalid", "Agrega al menos una fecha para apelar.");
      limit(ctx, section, studentId);
      const student = await enrolledStudent(admin, section, studentId);

      // Solo se puede apelar una ayudantía real, ya realizada y no suspendida
      const { data: sessions, error: sErr } = await admin
        .from("class_sessions")
        .select("date, sections!inner(code)")
        .eq("sections.code", section)
        .eq("type", "ayudantia")
        .neq("status", "cancelada")
        .lte("date", todayChile())
        .in("date", dates);
      if (sErr) throw sErr;
      const valid = new Set((sessions ?? []).map((s: any) => s.date as string));
      const invalid = dates.filter((d) => !valid.has(d));

      const { data: pending, error: pErr } = await admin
        .from("attendance_appeals")
        .select("appeal_date")
        .eq("section_code", section)
        .eq("student_canvas_id", studentId)
        .eq("kind", "asistencia")
        .eq("status", "pendiente")
        .in("appeal_date", dates);
      if (pErr) throw pErr;
      const pendingSet = new Set((pending ?? []).map((r: any) => r.appeal_date as string));

      const { data: present, error: rErr } = await admin
        .from("attendance_records")
        .select("class_sessions!inner(date, sections!inner(code)), students!inner(canvas_id)")
        .eq("class_sessions.sections.code", section)
        .eq("students.canvas_id", studentId)
        .eq("value", 1)
        .in("class_sessions.date", dates);
      if (rErr) throw rErr;
      const presentSet = new Set((present ?? []).map((r: any) => r.class_sessions?.date as string));

      const duplicates = dates.filter((d) => valid.has(d) && pendingSet.has(d));
      const alreadyPresent = dates.filter((d) => valid.has(d) && !pendingSet.has(d) && presentSet.has(d));
      const toInsert = dates.filter((d) => valid.has(d) && !pendingSet.has(d) && !presentSet.has(d));

      if (toInsert.length > 0) {
        const requestId = crypto.randomUUID();
        const { error } = await admin.from("attendance_appeals").insert(
          toInsert.map((date) => ({
            section_code: section,
            student_canvas_id: studentId,
            student_name: student.name.slice(0, 255),
            student_rut: student.rut,
            appeal_date: date,
            kind: "asistencia",
            request_id: requestId,
            comentario: null,
          }))
        );
        if (error) throw error;
      }
      return { inserted: toInsert, duplicates, invalid, alreadyPresent };
    },
  },

  "appeals.createDecimas": {
    access: "public",
    run: async (ctx, args) => {
      const { admin } = ctx;
      const section = v.section(args.sectionCode);
      const studentId = v.int(args.studentCanvasId, "alumno");
      const descripcion = v.str(args.descripcion, "descripción", 200, 5);
      limit(ctx, section, studentId);
      const student = await enrolledStudent(admin, section, studentId);
      const { error } = await admin.from("attendance_appeals").insert({
        section_code: section,
        student_canvas_id: studentId,
        student_name: student.name.slice(0, 255),
        student_rut: student.rut,
        appeal_date: todayChile(),
        kind: "decimas",
        request_id: crypto.randomUUID(),
        comentario: descripcion,
      });
      if (error) {
        if (error.code === "23505") return { duplicate: true };
        throw error;
      }
      return { duplicate: false };
    },
  },

  // Docente: resolución atómica (marca presente + historial + resuelve)
  "appeals.resolve": {
    access: "teacher",
    run: async ({ admin }, args) => {
      const { data, error } = await admin.rpc("resolve_attendance_appeals", {
        p_ids: v.uuidList(args.ids, "apelaciones"),
        p_resolved_by: "Docente",
      });
      if (error) throw error;
      return data ?? [];
    },
  },

  "appeals.setStatus": {
    access: "teacher",
    run: async ({ admin }, args) => {
      const { error } = await admin
        .from("attendance_appeals")
        .update({ status: v.oneOf(args.status, ["resuelta", "rechazada"] as const, "estado"), resolved_by: "Docente", resolved_at: new Date().toISOString() })
        .in("id", v.uuidList(args.ids, "apelaciones"))
        .eq("status", "pendiente");
      if (error) throw error;
      return {};
    },
  },
};
