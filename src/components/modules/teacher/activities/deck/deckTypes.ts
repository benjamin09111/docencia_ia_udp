import { ActividadFormativa, FaseClaseFormativa } from "@/types/actividadesFormativas";
import {
  Sparkles,
  Lightbulb,
  Users,
  Compass,
  BrainCircuit,
  MessageSquare,
  Award,
  CheckCircle2,
  FileQuestion,
  LucideIcon,
} from "lucide-react";

export interface DeckCardMeta {
  icon: LucideIcon;
  accentColor: string;
  badgeBg: string;
  badgeBorder: string;
  faseTag: string;
  puntosClave: string[];
}

export function getDeckCardMeta(act: ActividadFormativa): DeckCardMeta {
  // Mapeo temático de iconos y colores institucionales para cada categoría
  let icon: LucideIcon = Sparkles;
  let accentColor = "#B71C1C"; // UDP Red default
  let badgeBg = "rgba(183, 28, 28, 0.12)";
  let badgeBorder = "rgba(183, 28, 28, 0.25)";

  if (act.faseClase === "Inicio de clase") {
    icon = Lightbulb;
    accentColor = "#D97706"; // Amber
    badgeBg = "rgba(217, 119, 6, 0.12)";
    badgeBorder = "rgba(217, 119, 6, 0.25)";
  } else if (act.faseClase === "Desarrollo / Durante la clase") {
    icon = Users;
    accentColor = "#2563EB"; // Blue
    badgeBg = "rgba(37, 99, 235, 0.12)";
    badgeBorder = "rgba(37, 99, 235, 0.25)";
  } else if (act.faseClase === "Cierre de clase") {
    icon = CheckCircle2;
    accentColor = "#059669"; // Emerald
    badgeBg = "rgba(5, 150, 105, 0.12)";
    badgeBorder = "rgba(5, 150, 105, 0.25)";
  } else if (act.categoria === "Debate y Argumentación") {
    icon = MessageSquare;
    accentColor = "#7C3AED"; // Purple
    badgeBg = "rgba(124, 58, 237, 0.12)";
    badgeBorder = "rgba(124, 58, 237, 0.25)";
  } else if (act.categoria === "Estructura y Metacognición") {
    icon = BrainCircuit;
    accentColor = "#0284C7"; // Sky
    badgeBg = "rgba(2, 132, 199, 0.12)";
    badgeBorder = "rgba(2, 132, 199, 0.25)";
  }

  // Extraer 3 puntos clave contundentes y breves desde ventajasPedagogicas o queHace
  const puntosClave: string[] = [];
  if (act.ventajasPedagogicas) {
    const rawSentences = act.ventajasPedagogicas
      .split(/\.|\;|\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 12 && s.length < 90);
    puntosClave.push(...rawSentences.slice(0, 3));
  }

  if (puntosClave.length < 3 && act.comoFunciona && act.comoFunciona.length > 0) {
    act.comoFunciona.slice(0, 3 - puntosClave.length).forEach((step) => {
      puntosClave.push(step.replace(/^\d+[\.\)]\s*/, "").slice(0, 85));
    });
  }

  // Fallbacks de puntos clave pedagógicos
  while (puntosClave.length < 3) {
    if (puntosClave.length === 0) puntosClave.push("Alta activación cognitiva y participación equitativa");
    else if (puntosClave.length === 1) puntosClave.push("Retroalimentación formativa inmediata en el aula");
    else puntosClave.push("Fácil de evaluar mediante rúbrica institucional");
  }

  return {
    icon,
    accentColor,
    badgeBg,
    badgeBorder,
    faseTag: act.faseClase,
    puntosClave: puntosClave.slice(0, 3),
  };
}
