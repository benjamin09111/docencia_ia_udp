export type FaseClaseFormativa =
  | "Inicio de clase"
  | "Desarrollo / Durante la clase"
  | "Cierre de clase"
  | "Previo a la sesión"
  | "Fuera de aula / Terreno"
  | "Evaluación formativa";

export type CategoriaFormativa =
  | "Activación y Diagnóstico Inicial"
  | "Estructura y Metacognición"
  | "Indagación y Reflexión Crítica"
  | "Colaboración y Pares"
  | "Debate y Argumentación"
  | "Evaluación de Desempeño y Práctica"
  | "Cierre y Evaluación Continua"
  | "Producción y Síntesis";

export interface ActividadFormativa {
  id: string;
  nombre: string;
  categoria: CategoriaFormativa;
  faseClase: FaseClaseFormativa;
  descripcion: string;
  queHace: string;
  comoFunciona: string[];
  duracionSugerida: string;
  agrupacion: string;
  momentoAplicacion: string;
  recursosRequeridos: string[];
  ventajasPedagogicas: string;
  ejemploPractico: string;
  rolDocente: string;
  rolEstudiante: string;
  tituloDefecto: string;
  modalidadDefecto: "decimas" | "nota";
  valorDefecto: string;
  instruccionesDefecto: string;
}
