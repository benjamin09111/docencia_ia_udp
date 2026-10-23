export interface StudentMetric {
  nombre: string;
  asistenciaPct: number;
  consultasAgente: number;
  actividadesEntregadas: number;
  decimasGanadas: number;
  notaProyectada: number;
  estadoRiesgo: "Bajo" | "Medio" | "Crítico";
}

export const MOCK_STUDENT_METRICS: StudentMetric[] = [
  { nombre: "Benjamín", asistenciaPct: 0, consultasAgente: 14, actividadesEntregadas: 2, decimasGanadas: 0.3, notaProyectada: 6.2, estadoRiesgo: "Bajo" },
  { nombre: "Víctor", asistenciaPct: 0, consultasAgente: 9, actividadesEntregadas: 2, decimasGanadas: 0.3, notaProyectada: 5.9, estadoRiesgo: "Bajo" },
  { nombre: "Laura", asistenciaPct: 0, consultasAgente: 16, actividadesEntregadas: 2, decimasGanadas: 0.3, notaProyectada: 6.5, estadoRiesgo: "Bajo" },
  { nombre: "Francisco", asistenciaPct: 0, consultasAgente: 7, actividadesEntregadas: 1, decimasGanadas: 0.3, notaProyectada: 5.3, estadoRiesgo: "Bajo" },
  { nombre: "Camila", asistenciaPct: 0, consultasAgente: 2, actividadesEntregadas: 0, decimasGanadas: 0.0, notaProyectada: 4.1, estadoRiesgo: "Crítico" },
  { nombre: "Martín", asistenciaPct: 0, consultasAgente: 5, actividadesEntregadas: 1, decimasGanadas: 0.2, notaProyectada: 4.6, estadoRiesgo: "Medio" },
  { nombre: "Sebastián", asistenciaPct: 0, consultasAgente: 8, actividadesEntregadas: 2, decimasGanadas: 0.3, notaProyectada: 5.5, estadoRiesgo: "Bajo" },
];
