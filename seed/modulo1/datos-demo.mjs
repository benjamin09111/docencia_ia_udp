/**
 * Datos FICTICIOS de la demo del Módulo 1 (Gestión y Calificaciones).
 * Los usan scripts/modulo1/generar-archivos-demo.mjs (Excel) y scripts/modulo1/seed-demo.mjs (Supabase).
 *
 * Los RUT se calculan con su dígito verificador a partir de cuerpos ficticios (no se escriben
 * RUT literales: el escáner de datos personales del repo los marca). Correos en el dominio .test.
 */

/** Dígito verificador módulo 11 (misma regla que src/utils/gestion/rut.ts). */
export function dv(cuerpo) {
  let suma = 0;
  let mult = 2;
  for (const d of String(cuerpo).split("").reverse()) {
    suma += Number(d) * mult;
    mult = mult === 7 ? 2 : mult + 1;
  }
  const r = 11 - (suma % 11);
  return r === 11 ? "0" : r === 10 ? "K" : String(r);
}

export const rut = (cuerpo) => `${cuerpo}-${dv(cuerpo)}`;
export const rutConPuntos = (cuerpo) => `${String(cuerpo).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}-${dv(cuerpo)}`;

/** Curso precargado por el seed (Sección 1). El PDF demo es la Sección 2, para crearlo en vivo sin conflicto. */
export const CURSO_SEED = {
  nombre: "Arquitectura de Software (Demo con notas)",
  codigo: "CIT3000",
  seccion: "1",
  semestre: "2026-2",
  docente_nombre: "Prof. Demo Act-IA",
  origen: "manual",
  programa_archivo: null,
  nota_minima: 1.0,
  nota_maxima: 7.0,
  nota_aprobacion: 4.0,
  exigencia_pct: 60,
  nota_eximicion: 5.5,
  nota_minima_examen: null,
  decimas_totales: 0.5,
  asistencia_minima_pct: 75,
  notas_faltantes: "pendiente",
  restricciones: [
    { tipo_evaluacion: "solemne", nota_minima: 4.0, criterio: "promedio", descripcion: "Promedio de solemnes mínimo 4.0 para aprobar" },
  ],
  supuestos: [
    "Con nota de presentación 5.5 o más el alumno se exime del examen.",
    "Quien no cumple 75% de asistencia queda Reprobado por Inasistencia (RI).",
  ],
};

export const EVALUACIONES = [
  { nombre: "Solemne 1", tipo: "solemne", ponderacion: 25 },
  { nombre: "Solemne 2", tipo: "solemne", ponderacion: 25 },
  { nombre: "Tarea 1", tipo: "tarea", ponderacion: 10 },
  { nombre: "Tarea 2", tipo: "tarea", ponderacion: 10 },
  { nombre: "Tarea 3", tipo: "tarea", ponderacion: 10 },
  { nombre: "Examen", tipo: "examen", ponderacion: 20 },
];

/**
 * 10 alumnos ficticios. `notas` sigue el orden de EVALUACIONES (null = sin nota).
 * Cada uno muestra un caso del cálculo (ver `caso`).
 */
export const ALUMNOS = [
  { nombres: "Catalina Andrea", apellidos: "Fuentes Rojas", cuerpo: 20_481_532, decimas: 0, notas: [6.5, 6.0, 6.8, 6.5, 7.0, null], caso: "Eximida del examen (NP 6.4)" },
  { nombres: "Matías Ignacio", apellidos: "Herrera Soto", cuerpo: 20_917_204, decimas: 0, notas: [5.0, 4.5, 5.5, 5.0, 6.0, 4.8], caso: "Aprueba con examen" },
  { nombres: "Valentina Paz", apellidos: "Muñoz Castro", cuerpo: 21_034_871, decimas: 0, notas: [3.2, 3.8, 7.0, 7.0, 7.0, 6.0], caso: "Nota final 5.0 pero reprueba: promedio de solemnes 3.5 < 4.0" },
  { nombres: "Benjamín Alonso", apellidos: "Contreras Díaz", cuerpo: 20_655_319, decimas: 0, notas: [4.8, 5.1, 5.0, 4.5, null, null], caso: "Pendiente: falta Tarea 3 y Examen" },
  { nombres: "Josefa Ignacia", apellidos: "Vargas Pino", cuerpo: 21_208_446, decimas: 0, notas: [4.0, 4.0, 3.9, 3.9, 3.8, 4.0], caso: "NP exacta 3.95 → se redondea a 4.0" },
  { nombres: "Tomás Andrés", apellidos: "Reyes Lagos", cuerpo: 20_377_958, decimas: 0, notas: [2.5, 3.0, 4.0, 3.0, 3.5, 3.0], caso: "Reprueba por nota y por solemnes" },
  { nombres: "Fernanda Sofía", apellidos: "Morales Núñez", cuerpo: 20_802_163, decimas: 0.3, notas: [4.2, 4.0, 4.5, 4.0, 4.2, 3.5], caso: "Las décimas (+0.3) suben la nota final de 4.1 a 4.4" },
  { nombres: "Diego Esteban", apellidos: "Sepúlveda Araya", cuerpo: 21_150_297, decimas: 0, notas: [5.8, 5.2, 6.0, 6.0, 6.0, null], caso: "Eximido del examen (NP 5.7)" },
  { nombres: "Antonia Belén", apellidos: "Olivares Pérez", cuerpo: 20_566_084, decimas: 0.2, notas: [4.5, 5.0, 5.0, 5.0, 5.5, 5.0], caso: "Aprueba con examen y décimas" },
  { nombres: "Sebastián Elías", apellidos: "Carrasco Vega", cuerpo: 20_993_715, decimas: 0, notas: [4.0, 4.5, 4.5, 5.0, 5.0, null], caso: "Pendiente: debe rendir examen (NP 4.5)" },
];

const sinTildes = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
export const correo = (a) => `${sinTildes(a.nombres.split(" ")[0])}.${sinTildes(a.apellidos.split(" ")[0])}@mail.udp.test`;

/** Filas con errores a propósito, para mostrar la validación de la carga por Excel. */
export const FILAS_CON_ERRORES = [
  { nombres: "Ignacio", apellidos: "Bravo Molina", rut: () => `${20_444_111}-${dv(20_444_111) === "1" ? "2" : "1"}`, correo: "ignacio.bravo@mail.udp.test", error: "RUT con dígito verificador incorrecto" },
  { nombres: "Paula", apellidos: "Toro Saavedra", rut: () => rutConPuntos(20_222_888), correo: "paula.toro@", error: "Correo inválido" },
  { nombres: "Martina", apellidos: "Gálvez Ruiz", rut: () => rutConPuntos(21_111_333), correo: "martina.galvez@mail.udp.test", error: "RUT duplicado (fila siguiente)" },
  { nombres: "Martín", apellidos: "Gálvez Ruiz", rut: () => rut(21_111_333), correo: "martin.galvez@mail.udp.test", error: "RUT duplicado (fila anterior)" },
  { nombres: "", apellidos: "Silva Ortiz", rut: () => rut(20_999_555), correo: "silva.ortiz@mail.udp.test", error: "Faltan los nombres" },
  { nombres: "Renata", apellidos: "Campos León", rut: () => rutConPuntos(20_313_717), correo: "renata.campos@mail.udp.test", error: "(válida)" },
];
