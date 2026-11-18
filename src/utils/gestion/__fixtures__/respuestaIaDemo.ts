/** Respuesta típica de la IA para el programa demo (datos de prueba compartidos por los tests). */
export const RESPUESTA_DEMO = {
  curso: { nombre: "Arquitectura de Software", codigo: "CIT3000", seccion: "2", semestre: "2026-2", docente: "Docente Demo" },
  evaluaciones: [
    { nombre: "Solemne", tipo: "Solemne", ponderacion_total: 50, cantidad: 2 },
    { nombre: "Tarea", tipo: "tarea", ponderacion_total: 30, cantidad: 3 },
    { nombre: "Examen", tipo: "examen", ponderacion_total: 20, cantidad: 1 },
  ],
  escala: { nota_minima: 1, nota_maxima: 7, nota_aprobacion: 4, exigencia_pct: 60 },
  examen: { nota_eximicion: 5.5, nota_minima_para_rendir: null },
  decimas_totales: 0.5,
  asistencia_minima_pct: 75,
  restricciones: [
    { tipo_evaluacion: "solemne", nota_minima: 4, criterio: "promedio", descripcion: "Promedio de solemnes ≥ 4.0" },
  ],
  supuestos: ["Quien no cumple la asistencia mínima queda RI."],
};
