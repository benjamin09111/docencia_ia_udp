import { DataOp, v } from "./types";

// El docente solo puede marcar como equipo docente o sistema: nunca "alumno_*" (eso solo lo escribe el check-in del servidor)
const TEACHER_MARKERS = ["profesor", "ayudante", "sistema"] as const;
const PAGE = 1000; // PostgREST corta en 1000 filas por consulta: se pagina para no perder datos en cursos grandes
const MAX_ROWS = 30000;

async function fetchAll<T>(page: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: unknown }>): Promise<T[]> {
  const out: T[] = [];
  for (let from = 0; from < MAX_ROWS; from += PAGE) {
    const { data, error } = await page(from, from + PAGE - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    out.push(...data);
    if (data.length < PAGE) break;
  }
  return out;
}

export const attendanceOps: Record<string, DataOp> = {
  // Planilla de asistencia: docente o alumno con el token del tablero de esa sección
  "attendance.map": {
    access: "board",
    run: async ({ admin }, args) => {
      const sectionCode = v.section(args.sectionCode);
      return fetchAll((from, to) => admin.rpc("get_section_attendance_map", { p_section_code: sectionCode }).range(from, to));
    },
  },

  "attendance.mark": {
    access: "teacher",
    run: async ({ admin }, args) => {
      const { error } = await admin.rpc("upsert_attendance_by_code", {
        p_session_code: v.sessionCode(args.sessionCode),
        p_student_canvas_id: v.int(args.studentCanvasId, "alumno"),
        p_value: v.oneOf(String(args.value), ["0", "1"] as const, "valor") === "1" ? 1 : 0,
        p_marked_by: args.markedBy === undefined ? "profesor" : v.oneOf(args.markedBy, TEACHER_MARKERS, "origen"),
      });
      if (error) throw error;
      return {};
    },
  },

  "attendance.batch": {
    access: "teacher",
    run: async ({ admin }, args) => {
      const records = v.array(args.records, "registros", 3000).map((item) => {
        const r = item as Record<string, unknown>;
        return {
          session_code: v.sessionCode(r.session_code),
          student_canvas_id: v.int(r.student_canvas_id, "alumno"),
          value: v.oneOf(String(r.value), ["0", "1"] as const, "valor") === "1" ? 1 : 0,
          marked_by: r.marked_by === undefined ? "profesor" : v.oneOf(r.marked_by, TEACHER_MARKERS, "origen"),
        };
      });
      if (records.length === 0) return {};
      const { error } = await admin.rpc("upsert_attendance_batch_by_codes", { records_json: records });
      if (error) throw error;
      return {};
    },
  },

  "work.records": {
    access: "board",
    run: async ({ admin }, args) => {
      const { data, error } = await admin.rpc("get_section_work_records", { p_section_code: v.section(args.sectionCode) });
      if (error) throw error;
      return data ?? [];
    },
  },

  "work.save": {
    access: "teacher",
    run: async ({ admin }, args) => {
      const { error } = await admin.rpc("upsert_student_work_record", {
        p_section_code: v.section(args.sectionCode),
        p_student_canvas_id: v.int(args.studentCanvasId, "alumno"),
        p_decimas: v.num(args.decimas, "décimas", 0, 99.99),
        p_trabajos: v.int(args.trabajos, "trabajos", 0, 999),
      });
      if (error) throw error;
      return {};
    },
  },

  "history.page": {
    access: "teacher",
    run: async ({ admin }, args) => {
      const pageSize = v.int(args.pageSize, "tamaño de página", 1, 100);
      const page = v.int(args.page, "página", 1, 100000);
      if (args.date !== undefined && args.date !== null && args.date !== "") v.date(args.date);
      const { data, error } = await admin.rpc("get_checkin_history", {
        p_section_code: v.section(args.sectionCode),
        p_date: args.date ? v.date(args.date) : null,
        p_search: args.search ? v.str(args.search, "búsqueda", 80) : null,
        p_limit: pageSize,
        p_offset: (page - 1) * pageSize,
      });
      if (error) throw error;
      return data ?? [];
    },
  },

  "history.dates": {
    access: "teacher",
    run: async ({ admin }, args) => {
      const { data, error } = await admin.rpc("get_checkin_history_dates", { p_section_code: v.section(args.sectionCode) });
      if (error) throw error;
      return data ?? [];
    },
  },
};

