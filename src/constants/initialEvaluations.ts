import { EvaluationCategory } from "@/components/modules/teacher/evaluaciones/EvaluationCreateModal";

export interface EvaluationItem {
  id: string;
  titulo: string;
  tipo: EvaluationCategory;
  codigo: string;
  curso: string;
  ponderacion: string;
  tiempo: string;
  fecha: string;
  canvasSync: boolean;
  canvasId?: number;
  preguntasCount: number;
  puntajeTotal: number;
}

export const INITIAL_EVALUATIONS: EvaluationItem[] = [
  {
    id: "ev1",
    titulo: "Control 1: Fundamentos de Gestión y Ciclos de Vida",
    tipo: "Control",
    codigo: "CIT3203",
    curso: "Proyecto en TICs II",
    ponderacion: "5%",
    tiempo: "30 min",
    fecha: "2026-04-03",
    canvasSync: true,
    canvasId: 44101,
    preguntasCount: 3,
    puntajeTotal: 30,
  },
  {
    id: "ev2",
    titulo: "Laboratorio 1: Modelado de Casos y WBS en Jira",
    tipo: "Laboratorio",
    codigo: "CIT3203",
    curso: "Proyecto en TICs II",
    ponderacion: "10%",
    tiempo: "90 min",
    fecha: "2026-04-17",
    canvasSync: true,
    canvasId: 44102,
    preguntasCount: 4,
    puntajeTotal: 50,
  },
  {
    id: "ev3",
    titulo: "Solemne Oficial 1: Arquitectura y Gestión Ágil",
    tipo: "Solemne",
    codigo: "CIT3203",
    curso: "Proyecto en TICs II",
    ponderacion: "20%",
    tiempo: "90 min",
    fecha: "2026-05-15",
    canvasSync: true,
    canvasId: 44103,
    preguntasCount: 4,
    puntajeTotal: 70,
  },
  {
    id: "ev4",
    titulo: "Tarea / Investigación: Estado del Arte de Tecnologías Cloud",
    tipo: "Tarea / Investigación",
    codigo: "CIT3203",
    curso: "Proyecto en TICs II",
    ponderacion: "15%",
    tiempo: "2 semanas",
    fecha: "2026-05-29",
    canvasSync: true,
    canvasId: 44104,
    preguntasCount: 2,
    puntajeTotal: 70,
  },
  {
    id: "ev5",
    titulo: "Avance 1: Backlog Priorizado y Prototipo Wireframe",
    tipo: "Avances",
    codigo: "CIT3203",
    curso: "Proyecto en TICs II",
    ponderacion: "20%",
    tiempo: "Hito",
    fecha: "2026-06-12",
    canvasSync: true,
    canvasId: 44105,
    preguntasCount: 3,
    puntajeTotal: 70,
  },
  {
    id: "ev6",
    titulo: "Proyecto Final: Despliegue en Producción y Defensa",
    tipo: "Proyecto",
    codigo: "CIT3203",
    curso: "Proyecto en TICs II",
    ponderacion: "30%",
    tiempo: "Comisión",
    fecha: "2026-07-03",
    canvasSync: true,
    canvasId: 44106,
    preguntasCount: 5,
    puntajeTotal: 70,
  },
];
