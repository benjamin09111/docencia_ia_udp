export type AiAgentRole =
  | "rubric_generator"
  | "activity_assistant"
  | "theoretical_tutor"
  | "technical_tutor"
  | "submission_evaluator";

export interface AiChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AiChatRequest {
  agentRole: AiAgentRole;
  message: string;
  courseCode?: string;
  courseName?: string;
  sectionCode?: string;
  history?: AiChatMessage[];
  customInstructions?: string;
}

export interface AiChatResponse {
  reply: string;
  agentRole: AiAgentRole;
  tokensUsed?: number;
  sources?: string[];
}

export interface AiSubmissionEvaluationRequest {
  deliverableId: string;
  studentSolution: string;
  rubric: {
    criterio: string;
    puntajeMax: number;
    descriptores: string[];
  }[];
  maxDecimas?: number;
}

export interface AiSubmissionEvaluationResult {
  notaSugerida: number;
  decimasSugeridas: number;
  resumenFeedback: string;
  criteriosEvaluados: {
    criterio: string;
    puntajeObtenido: number;
    puntajeMax: number;
    citaTextual: string;
    comentario: string;
  }[];
  sugerenciasMejora: string[];
}
