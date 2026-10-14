import { InstruccionItem } from "@/types/actividadesFormativas";
import { RubricMatrixRubro } from "@/components/canvas/CanvasOfficialRubricTable";

export const PUNTAJE_MAXIMO_ESTANDAR = 60;

export function buildDefaultInstructionsForActivity(
  nombreActividad: string,
  queHace?: string
): InstruccionItem[] {
  return [
    {
      id: "inst_1",
      numero: 1,
      titulo: "Pregunta 1: Análisis Teórico y Fundamentación Conceptual",
      descripcion:
        queHace ||
        "Identificar los conceptos clave de la sesión y explicar su relación causal con el problema planteado.",
      puntaje: 20,
    },
    {
      id: "inst_2",
      numero: 2,
      titulo: "Pregunta 2: Desarrollo de la Dinámica y Aplicación Práctica",
      descripcion:
        "Ejecutar el ejercicio técnico aplicando las pautas metodológicas y documentando la solución paso a paso.",
      puntaje: 20,
    },
    {
      id: "inst_3",
      numero: 3,
      titulo: "Pregunta 3: Evaluación de Trade-offs y Conclusiones",
      descripcion:
        "Analizar las limitaciones de la solución, proponer mejoras arquitectónicas y redactar la síntesis del equipo.",
      puntaje: 20,
    },
  ];
}

export function buildRubricFromInstructions(items: InstruccionItem[]): RubricMatrixRubro[] {
  return items.map((item, idx) => {
    const sub1Puntos = Math.round(item.puntaje * 0.6);
    const sub2Puntos = item.puntaje - sub1Puntos;

    return {
      id: `rub_${item.id || idx + 1}`,
      nombre: item.titulo || `Pregunta ${idx + 1}`,
      puntajeRubro: item.puntaje,
      criterios: [
        {
          id: `crit_${item.id || idx + 1}_1`,
          nombre: `Criterio de Evaluación: Pregunta ${idx + 1}`,
          subcriterios: [
            {
              id: `sub_${item.id || idx + 1}_1`,
              nombre: "Rigor Conceptual y Respuesta a la Pregunta",
              puntaje: sub1Puntos,
              descriptores: [
                item.descripcion
                  ? `Responde cabalmente a la instrucción: "${item.descripcion.slice(0, 80)}..."`
                  : "Responde completamente a la pregunta con terminología técnica precisa.",
                "Fundamenta sus respuestas en el marco teórico de la sesión sin errores conceptuales.",
                "Estructura el razonamiento de forma lógica y coherente.",
              ],
            },
            {
              id: `sub_${item.id || idx + 1}_2`,
              nombre: "Calidad de Evidencia y Conclusiones Técnicas",
              puntaje: sub2Puntos,
              descriptores: [
                "Aporta diagramas, ejemplos o evidencia práctica debidamente justificada.",
                "Demuestra capacidad de análisis crítico e identificación de trade-offs.",
                "Presentación clara, sin ambigüedades y en el formato solicitado.",
              ],
            },
          ],
        },
      ],
    };
  });
}

export function formatInstructionsToMarkdown(items: InstruccionItem[]): string {
  const total = items.reduce((acc, it) => acc + (Number(it.puntaje) || 0), 0);
  let text = `PAUTA DE INSTRUCCIONES Y PREGUNTAS (Puntaje Máximo: ${total} pts — Escala 1.0 a 7.0)\n\n`;

  items.forEach((item, index) => {
    text += `${index + 1}. ${item.titulo} [${item.puntaje} pts]\n`;
    text += `   ${item.descripcion}\n\n`;
  });

  return text.trim();
}
