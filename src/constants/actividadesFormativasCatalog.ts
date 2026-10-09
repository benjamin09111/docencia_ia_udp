import rawData from "@/data/actividadesFormativas.json";
import { ActividadFormativa } from "@/types/actividadesFormativas";
import { RubricMatrixRubro } from "@/components/canvas/CanvasOfficialRubricTable";
import type { MetodologiaDocente } from "@/constants/metodologiasDocentes";

export const ACTIVIDADES_FORMATIVAS: ActividadFormativa[] = rawData as ActividadFormativa[];

export const FASES_CLASE_FORMATIVAS = [
  "Todas",
  "Inicio de clase",
  "Desarrollo / Durante la clase",
  "Cierre de clase",
  "Previo a la sesión",
  "Fuera de aula / Terreno",
  "Evaluación formativa",
] as const;

export const CATEGORIAS_ACTIVIDADES_FORMATIVAS = FASES_CLASE_FORMATIVAS;

export function getActividadFormativaById(id: string): ActividadFormativa | undefined {
  return ACTIVIDADES_FORMATIVAS.find((a) => a.id === id);
}

export function buildRubricaPorDefectoParaActividad(act: ActividadFormativa): RubricMatrixRubro[] {
  return [
    {
      id: `rub_${act.id}_1`,
      nombre: "Rigor Conceptual y Comprensión del Aprendizaje",
      puntajeRubro: 50,
      criterios: [
        {
          id: `crit_${act.id}_1`,
          nombre: "Dominio de Conceptos y Criterio Técnico",
          subcriterios: [
            {
              id: `sub_${act.id}_1_1`,
              nombre: "Precisión y Fundamentación Conceptual",
              descriptores: [
                "Respuestas precisas respaldadas en el marco teórico de la sesión.",
                "Uso de terminología técnica adecuada sin ambigüedades.",
                "Capacidad de síntesis y relación causal entre conceptos clave.",
              ],
              puntaje: 25,
            },
            {
              id: `sub_${act.id}_1_2`,
              nombre: "Reflexión Crítica y Análisis",
              descriptores: [
                "Identificación explícita de limitaciones, riesgos o trade-offs.",
                "Aporte de puntos de vista argumentados con evidencia técnica.",
                "Conexión con el contexto del proyecto y la industria.",
              ],
              puntaje: 25,
            },
          ],
        },
      ],
    },
    {
      id: `rub_${act.id}_2`,
      nombre: "Desempeño en la Dinámica y Colaboración",
      puntajeRubro: 50,
      criterios: [
        {
          id: `crit_${act.id}_2`,
          nombre: "Participación Activa y Cumplimiento de Pauta",
          subcriterios: [
            {
              id: `sub_${act.id}_2_1`,
              nombre: "Ejecución de la Dinámica y Tiempos",
              descriptores: [
                "Cumplimiento cabal de las instrucciones y pasos de la actividad.",
                "Respeto de los tiempos asignados para cada fase de trabajo.",
                "Entrega formal de la evidencia o síntesis requerida.",
              ],
              puntaje: 25,
            },
            {
              id: `sub_${act.id}_2_2`,
              nombre: "Interacción Colaborativa y Escucha Activa",
              descriptores: [
                "Participación constructiva y equitativa con sus pares.",
                "Apertura a la retroalimentación y diálogo respetuoso.",
                "Co-construcción de acuerdos y resolución compartida del reto.",
              ],
              puntaje: 25,
            },
          ],
        },
      ],
    },
  ];
}

export function actividadFormativaToMetodologiaDocente(
  act: ActividadFormativa
): MetodologiaDocente {
  return {
    id: act.id,
    tipo: act.nombre,
    nombreCorto: act.nombre,
    subtitulo: act.descripcion,
    descripcionDefecto: act.queHace,
    ventajas: act.ventajasPedagogicas,
    duracionSugerida: act.duracionSugerida,
    contenidoSugerido: "Unidad 1: Requerimientos, Casos de Uso y Arquitectura de Software",
    tituloDefecto: act.tituloDefecto,
    fechaDefecto: new Date().toISOString().split("T")[0],
    modalidadDefecto: act.modalidadDefecto,
    valorDefecto: act.valorDefecto,
    targetDefecto: "Reporte de Avance 1",
    instruccionesDefecto: act.instruccionesDefecto,
    matrizOficial: buildRubricaPorDefectoParaActividad(act),
  };
}

export const catalogoActividadesFormativasDocentes: MetodologiaDocente[] =
  ACTIVIDADES_FORMATIVAS.map(actividadFormativaToMetodologiaDocente);
