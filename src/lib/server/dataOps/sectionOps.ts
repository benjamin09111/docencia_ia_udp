import { DataOp, OpError, v } from "./types";

const TIME_RE = /^\d{2}:\d{2}(:\d{2})?$/;
const PIN_RE = /^\d{4,8}$/;

// Columnas que el público NO debe ver (PIN semestral del tablero y correos del equipo docente)
const PUBLIC_SECTION_COLUMNS =
  "id, course_id, code, name, teacher_name, assistant_name, horario_catedra_dias, horario_catedra_inicio, " +
  "horario_catedra_fin, horario_catedra_sala, horario_ayudantia_dias, horario_ayudantia_inicio, " +
  "horario_ayudantia_fin, horario_ayudantia_sala, horario_ayudantia2, requiere_pin, requiere_geo";

const time = (x: unknown, what: string) => {
  if (typeof x !== "string" || !TIME_RE.test(x)) throw new OpError(400, "invalid", `Dato inválido: ${what}.`);
  return x;
};

function schedule(x: unknown, what: string) {
  const s = (x ?? {}) as Record<string, unknown>;
  const dias = v.array(s.dias, `${what}.dias`, 7).map((d) => v.int(d, `${what}.dias`, 0, 6));
  return { dias, inicio: time(s.horaInicio, `${what}.inicio`), fin: time(s.horaFin, `${what}.fin`), sala: v.optStr(s.sala, `${what}.sala`, 60) };
}

/** Fila de `sections` a partir de la sección que envía el docente. */
function sectionRow(raw: unknown) {
  const s = (raw ?? {}) as Record<string, unknown>;
  const cat = schedule(s.horarioCatedra, "horarioCatedra");
  const ayu = schedule(s.horarioAyudantia ?? { dias: [3], horaInicio: "16:00", horaFin: "17:20" }, "horarioAyudantia");
  const row: Record<string, unknown> = {
    name: v.str(s.nombre, "nombre", 120, 1),
    teacher_name: v.optStr(s.profesor, "profesor", 120),
    assistant_name: v.optStr(s.ayudante, "ayudante", 120),
    horario_catedra_dias: cat.dias,
    horario_catedra_inicio: cat.inicio,
    horario_catedra_fin: cat.fin,
    horario_catedra_sala: cat.sala,
    horario_ayudantia_dias: ayu.dias,
    horario_ayudantia_inicio: ayu.inicio,
    horario_ayudantia_fin: ayu.fin,
    horario_ayudantia_sala: ayu.sala,
    requiere_pin: v.bool(s.requierePin, "requierePin"),
    requiere_geo: v.bool(s.requiereGeolocalizacion, "requiereGeolocalizacion"),
  };
  if (s.horarioAyudantia2) {
    const ayu2 = schedule(s.horarioAyudantia2, "horarioAyudantia2");
    row.horario_ayudantia2 = {
      dias: ayu2.dias,
      horaInicio: ayu2.inicio,
      horaFin: ayu2.fin,
      sala: ayu2.sala,
    };
  } else if (s.horarioAyudantia2 === null) {
    row.horario_ayudantia2 = null;
  }
  if (s.pinActivo !== undefined && s.pinActivo !== null && s.pinActivo !== "") {
    if (typeof s.pinActivo !== "string" || !PIN_RE.test(s.pinActivo)) throw new OpError(400, "invalid", "Dato inválido: PIN.");
    row.pin_activo = s.pinActivo;
  }
  return { row, code: v.section(s.codigo, "código de sección") };
}

/** Sesiones de clase generadas por el cliente → filas de `class_sessions` (sin estado: ese solo lo cambian acciones explícitas). */
export function sessionRows(sectionId: string, raw: unknown) {
  return v.array(raw, "sesiones", 600).map((item) => {
    const s = item as Record<string, unknown>;
    return {
      section_id: sectionId,
      session_code: v.sessionCode(s.id),
      date: v.date(s.fecha),
      dia_semana: v.str(s.diaSemana, "día", 20),
      type: v.oneOf(s.tipo, ["catedra", "ayudantia"] as const, "tipo"),
      start_time: s.horaInicio ? time(s.horaInicio, "inicio") : null,
      end_time: s.horaFin ? time(s.horaFin, "fin") : null,
      room: v.optStr(s.sala, "sala", 60),
    };
  });
}

export const sectionOps: Record<string, DataOp> = {
  "sections.list": {
    access: "public",
    run: async ({ admin, isTeacher }) => {
      const { data, error } = await admin.from("sections").select(isTeacher ? "*" : PUBLIC_SECTION_COLUMNS);
      if (error) throw error;
      return data ?? [];
    },
  },

  "sections.updateSchedule": {
    access: "teacher",
    run: async ({ admin }, args) => {
      const { row, code } = sectionRow(args.section);
      const { data, error } = await admin
        .from("sections")
        .update({ ...row, updated_at: new Date().toISOString() })
        .eq("code", code)
        .select("id");
      if (error) throw error;
      const sectionId = data?.[0]?.id;
      if (sectionId && args.sessions !== undefined) {
        const rows = sessionRows(sectionId, args.sessions);
        if (rows.length > 0) {
          const { error: sErr } = await admin.from("class_sessions").upsert(rows, { onConflict: "section_id,date,type" });
          if (sErr) throw sErr;
        }
      }
      return { sectionId: sectionId ?? null };
    },
  },

  "sections.updateOnline": {
    access: "teacher",
    run: async ({ admin }, args) => {
      const { error } = await admin
        .from("sections")
        .update({ requiere_geo: v.bool(args.requiereGeo, "requiereGeo"), updated_at: new Date().toISOString() })
        .eq("code", v.section(args.sectionCode));
      if (error) throw error;
      return {};
    },
  },

  "sections.syncCourse": {
    access: "teacher",
    run: async ({ admin }, args) => {
      const { row, code } = sectionRow(args.section);
      const { data: course, error: cErr } = await admin
        .from("courses")
        .upsert(
          {
            canvas_course_id: v.int(args.canvasCourseId, "canvasCourseId"),
            code: v.str(args.courseCode, "código de curso", 40, 1),
            name: v.str(args.courseName, "nombre de curso", 160, 1),
            term: "2026-02",
          },
          { onConflict: "canvas_course_id" }
        )
        .select("id")
        .single();
      if (cErr || !course) throw cErr || new Error("Fallo al registrar curso");
      const { data: sec, error: sErr } = await admin
        .from("sections")
        .upsert({ course_id: course.id, code, ...row }, { onConflict: "course_id,code" })
        .select("id")
        .single();
      if (sErr || !sec) throw sErr || new Error("Fallo al registrar sección");
      return { courseId: course.id, sectionId: sec.id };
    },
  },

  "sections.syncRoster": {
    access: "teacher",
    run: async ({ admin }, args) => {
      const sectionId = v.str(args.sectionId, "sectionId", 40, 36);
      // rut y email son obligatorios en la base: un alumno sin ellos NO se envía (así nunca se pisa un RUT real con "")
      const parsed = v.array(args.students, "estudiantes", 600).map((item) => {
        const s = item as Record<string, unknown>;
        return {
          canvas_id: v.int(s.canvas_id, "canvas_id"),
          rut: typeof s.rut === "string" ? s.rut.trim().slice(0, 20) : "",
          nombres: v.str(s.nombres, "nombres", 120),
          apellidos: v.str(s.apellidos, "apellidos", 120),
          email: typeof s.email === "string" ? s.email.trim().slice(0, 160) : "",
        };
      });
      const students = parsed.filter((s) => s.rut && s.email);
      const skipped = parsed.length - students.length;
      if (students.length > 0) {
        const { data: inserted, error } = await admin.from("students").upsert(students, { onConflict: "canvas_id" }).select("id, canvas_id");
        if (error) throw error;
        if (inserted?.length) {
          const { error: eErr } = await admin
            .from("enrollments")
            .upsert(inserted.map((st) => ({ section_id: sectionId, student_id: st.id, status: "active" })), { onConflict: "section_id,student_id" });
          if (eErr) throw eErr;
        }
      }
      const rows = sessionRows(sectionId, args.sessions ?? []);
      if (rows.length > 0) {
        const { error } = await admin.from("class_sessions").upsert(rows, { onConflict: "section_id,date,type" });
        if (error) throw error;
      }
      return { skippedStudents: skipped };
    },
  },

  "sections.workSettings.get": {
    access: "teacher",
    run: async ({ admin }, args) => {
      const { data, error } = await admin
        .from("sections")
        .select("total_trabajos, decimas_por_trabajo")
        .eq("code", v.section(args.sectionCode))
        .limit(1);
      if (error) throw error;
      return data?.[0] ?? null;
    },
  },

  "sections.workSettings.save": {
    access: "teacher",
    run: async ({ admin }, args) => {
      const payload: Record<string, number> = {};
      if (args.totalTrabajos !== undefined) payload.total_trabajos = v.int(args.totalTrabajos, "totalTrabajos", 0, 999);
      if (args.decimasPorTrabajo !== undefined) payload.decimas_por_trabajo = v.num(args.decimasPorTrabajo, "decimasPorTrabajo", 0, 9.99);
      if (Object.keys(payload).length === 0) return {};
      const { error } = await admin.from("sections").update(payload).eq("code", v.section(args.sectionCode));
      if (error) throw error;
      return {};
    },
  },
};
