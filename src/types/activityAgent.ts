import { InstruccionItem } from "./actividadesFormativas";

export interface ActivityAgentRequest {
  courseCode: string;
  courseName: string;
  content: string;
  objective: string;
  duration: string;
  format: "individual" | "grupal";
  assessment: "decimas" | "nota";
}

export interface ActivityAgentDraft {
  title: string;
  description: string;
  content: string;
  instructions: InstruccionItem[];
  methodologyId?: string;
  pointsPossible: number;
  assessment: "decimas" | "nota";
  decimas: string;
  isGroupAssignment: boolean;
}
