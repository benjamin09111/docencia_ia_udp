"use client";

import React, { useState } from "react";
import { CourseDeliverable } from "@/types";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import {
  ArrowLeft,
  Sparkles,
  Send,
  Bot,
  Brain,
  BookOpen,
  Calendar,
  Award,
  FileText,
  CheckCircle2,
  Scale,
  GraduationCap,
  Layers,
  Plus,
  Zap,
} from "lucide-react";

interface CreateActivityWorkspaceProps {
  courseId: number;
  onBack: () => void;
  onPublish: (activity: CourseDeliverable) => void;
}

export interface MetodologiaDocente {
  id: string;
  tipo: string;
  nombreCorto: string;
  tituloDefecto: string;
  descripcionDefecto: string;
  fechaDefecto: string;
  modalidadDefecto: "decimas" | "nota";
  valorDefecto: string;
  targetDefecto: string;
  enfoquePedagogicoCREA: string;
  agenteGeneroValidacion: string;
  rubricaDefecto: { criterio: string; puntos: number; detalle: string }[];
}

export const catalogoMetodologiasDocentes: MetodologiaDocente[] = [
  {
    id: "rol_crisis",
    tipo: "Juego de Roles (Simulación de Crisis y Negociación)",
    nombreCorto: "Juego de Roles",
    tituloDefecto: "Simulación de Negociación ante Recorte de Presupuesto del Mandante",
    descripcionDefecto:
      "El mandante del proyecto recorta el 30% del presupuesto y exige adelantar la entrega en 2 semanas. El equipo debe asumir roles (Scrum Master, Product Owner, Tech Lead) y renegociar el Backlog aplicando la Matriz de Riesgos PMBOK sin romper la arquitectura básica.",
    fechaDefecto: "2026-10-18",
    modalidadDefecto: "decimas",
    valorDefecto: "0.3",
    targetDefecto: "Reporte de Avance 1",
    enfoquePedagogicoCREA:
      "Metodología vivencial recomendada por el CREA UDP para desarrollar habilidades blandas de negociación, gestión de la frustración bajo presión y trabajo colaborativo (RAP 5).",
    agenteGeneroValidacion:
      "Turnos y roles rotativos auditados para garantizar que el liderazgo técnico no recaiga sistemáticamente en un solo género.",
    rubricaDefecto: [
      { criterio: "Defensa Técnica de Trade-offs y Repriorización de Backlog", puntos: 50, detalle: "Justificación arquitectónica del alcance esencial vs prescindible." },
      { criterio: "Aplicación de Matriz de Riesgos y Mitigación PMBOK", puntos: 50, detalle: "Identificación de 3 riesgos críticos y plan de contingencia viable." },
    ],
  },
  {
    id: "caso_forense",
    tipo: "Estudio de Caso Real y Análisis Forense (Post-Mortem)",
    nombreCorto: "Estudio de Caso Real",
    tituloDefecto: "Dictamen Forense de un Software Gubernamental Fallido",
    descripcionDefecto:
      "Los estudiantes analizan el caso real de una plataforma gubernamental que colapsó en su lanzamiento. Deben redactar un informe forense identificando qué cláusula contractual y qué pruebas de aseguramiento de calidad (QA) fueron omitidas.",
    fechaDefecto: "2026-11-05",
    modalidadDefecto: "nota",
    valorDefecto: "15",
    targetDefecto: "Evaluación Práctica de Ayudantía",
    enfoquePedagogicoCREA:
      "Pedagogía del error constructivo: promueve el juicio crítico ético-profesional y la conexión de la ingeniería con el impacto público real.",
    agenteGeneroValidacion:
      "Análisis de sesgos de atribución en equipos multidisciplinarios diversos.",
    rubricaDefecto: [
      { criterio: "Diagnóstico Contractual y Violación de SLAs", puntos: 50, detalle: "Identificación precisa de cláusulas de penalización y entregables omitidos." },
      { criterio: "Plan de Aseguramiento de Calidad y Pruebas de Carga", puntos: 50, detalle: "Diseño de batería de pruebas preventivas de estrés y seguridad." },
    ],
  },
  {
    id: "gamificacion_poker",
    tipo: "Gamificación Ágil (Planning Poker & Estimación)",
    nombreCorto: "Planning Poker Ágil",
    tituloDefecto: "Torneo de Calibración Técnica con Story Points y Fibonacci",
    descripcionDefecto:
      "Competencia grupal donde los equipos reciben 5 historias de usuario reales de proyectos TICs. Usan la serie Fibonacci en votación ciega para estimar puntos de historia, justificar supuestos de arquitectura y calibrar su velocidad de desarrollo.",
    fechaDefecto: "2026-10-25",
    modalidadDefecto: "decimas",
    valorDefecto: "0.4",
    targetDefecto: "Reporte de Avance 1",
    enfoquePedagogicoCREA:
      "Aprendizaje lúdico basado en dinámicas de consenso y calibración colectiva del esfuerzo (Unidad 2 del programa oficial).",
    agenteGeneroValidacion:
      "La votación ciega neutraliza la dominancia verbal y asegura que las voces minoritarias pesen por igual en el debate técnico.",
    rubricaDefecto: [
      { criterio: "Fundamentación de Complejidad Técnica e Incertidumbre", puntos: 50, detalle: "Argumentación basada en APIs, base de datos y UI." },
      { criterio: "Coherencia en la Definición de 'Hecho' (DoD) y Testing", puntos: 50, detalle: "Inclusión de pruebas unitarias, CI/CD y criterios de aceptación." },
    ],
  },
  {
    id: "debate_fishbowl",
    tipo: "Debate Socrático / Pecera de Arquitectura (Fishbowl)",
    nombreCorto: "Debate Socrático",
    tituloDefecto: "Discusión de Arquitectura: Monolito Modular vs Microservicios en la Nube",
    descripcionDefecto:
      "Dinámica de discusión estructurada en círculo interno (pecera) y externo. Los grupos defienden posturas contrapuestas justificando costos operacionales, latencia, escalabilidad y tiempos de despliegue según estándares PMBOK.",
    fechaDefecto: "2026-10-28",
    modalidadDefecto: "decimas",
    valorDefecto: "0.3",
    targetDefecto: "Reporte de Avance 1",
    enfoquePedagogicoCREA:
      "Técnica dialógica que fortalece el pensamiento crítico, la argumentación basada en evidencias técnicas y la escucha activa.",
    agenteGeneroValidacion:
      "Turnos de palabra cronometrados para asegurar paridad de participación equitativa de todos los estudiantes.",
    rubricaDefecto: [
      { criterio: "Solidez de la Argumentación Técnica y Uso de Métricas", puntos: 50, detalle: "Citas a costos AWS/Azure, latencia y requerimientos no funcionales." },
      { criterio: "Capacidad de Refutación Asertiva y Respeto Dialógico", puntos: 50, detalle: "Respuestas constructivas sin descalificaciones personales." },
    ],
  },
  {
    id: "war_room",
    tipo: "Simulación de Sala de Crisis en Vivo (War Room DevOps)",
    nombreCorto: "War Room DevOps",
    tituloDefecto: "Respuesta a Incidentes Críticos de Producción y Caída de Base de Datos",
    descripcionDefecto:
      "Simulación cronometrada donde se inyecta una falla inducida en una réplica del software. El equipo debe coordinar la comunicación con el cliente, identificar el cuello de botella en los logs y desplegar un hotfix con rollback plan.",
    fechaDefecto: "2026-11-12",
    modalidadDefecto: "decimas",
    valorDefecto: "0.5",
    targetDefecto: "Reporte de Avance 2",
    enfoquePedagogicoCREA:
      "Entrenamiento de alta fidelidad para el mundo laboral real. Fomenta la calma metódica, la asignación de roles de emergencia y la trazabilidad técnica.",
    agenteGeneroValidacion:
      "Rotación del rol de Comandante del Incidente (Incident Commander) con criterios de equidad.",
    rubricaDefecto: [
      { criterio: "Tiempo y Precisión en el Diagnóstico de Causa Raíz", puntos: 50, detalle: "Uso eficaz de telemetría, logs y pruebas de aislamiento." },
      { criterio: "Estrategia de Rollback y Comunicación con el Mandante", puntos: 50, detalle: "Gestión oportuna del canal de comunicación y mitigación del impacto." },
    ],
  },
  {
    id: "peer_review",
    tipo: "Revisión Ciega por Pares (Blind Peer Review)",
    nombreCorto: "Revisión por Pares",
    tituloDefecto: "Auditoría Cruzada de Arquitectura y Código Previa a Entrega Oficial",
    descripcionDefecto:
      "Cada grupo revisa de forma anónima el avance técnico de otro equipo utilizando la rúbrica oficial del curso. Deben emitir un informe de observaciones fundadas con sugerencias de mejora inmediata.",
    fechaDefecto: "2026-10-14",
    modalidadDefecto: "decimas",
    valorDefecto: "0.3",
    targetDefecto: "Reporte de Avance 1",
    enfoquePedagogicoCREA:
      "Evaluación formativa entre pares: desarrolla habilidades de análisis crítico, metacognición y calibración de estándares de calidad antes del hito calificado.",
    agenteGeneroValidacion:
      "Anonimización estricta de autores y revisores para eliminar sesgos inconscientes en la evaluación.",
    rubricaDefecto: [
      { criterio: "Profundidad y Rigor de las Observaciones Técnicas", puntos: 50, detalle: "Feedback constructivo citando estándares del descriptor UDP y PMBOK." },
      { criterio: "Claridad y Viabilidad del Plan de Recomendaciones", puntos: 50, detalle: "Propuestas concretas de mejora aplicables en menos de una semana." },
    ],
  },
];

export const CreateActivityWorkspace: React.FC<CreateActivityWorkspaceProps> = ({
  courseId,
  onBack,
  onPublish,
}) => {
  const [metodologiaSeleccionada, setMetodologiaSeleccionada] = useState<MetodologiaDocente>(
    catalogoMetodologiasDocentes[0]
  );

  // Form State
  const [titulo, setTitulo] = useState(catalogoMetodologiasDocentes[0].tituloDefecto);
  const [tipo, setTipo] = useState(catalogoMetodologiasDocentes[0].tipo);
  const [descripcion, setDescripcion] = useState(catalogoMetodologiasDocentes[0].descripcionDefecto);
  const [fecha, setFecha] = useState(catalogoMetodologiasDocentes[0].fechaDefecto);
  const [modalidad, setModalidad] = useState<"decimas" | "nota">(catalogoMetodologiasDocentes[0].modalidadDefecto);
  const [decimasMaximas, setDecimasMaximas] = useState(catalogoMetodologiasDocentes[0].valorDefecto);
  const [targetEvaluacion, setTargetEvaluacion] = useState(catalogoMetodologiasDocentes[0].targetDefecto);
  const [ponderacionNota, setPonderacionNota] = useState("10");
  const [rubricaCriterios, setRubricaCriterios] = useState(catalogoMetodologiasDocentes[0].rubricaDefecto);

  // Chat State
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: "user" | "agent"; text: string; rec?: MetodologiaDocente }>
  >([
    {
      sender: "agent",
      text: "¡Hola profesor! Soy el Agente de Actividades Dinámicas. Trabajo en conjunto con el Agente Teórico (Guía PMBOK 7) y el Agente Técnico (Descriptor Oficial UDP) para diseñarle actividades recomendadas por expertos de docencia del CREA. Elija el tipo de actividad en el menú desplegable o pídame recomendaciones personalizadas en este chat:",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Cuando el docente cambia el <select> de metodología
  const handleSelectMetodologia = (tipoNombre: string) => {
    const met = catalogoMetodologiasDocentes.find((m) => m.tipo === tipoNombre) || catalogoMetodologiasDocentes[0];
    setMetodologiaSeleccionada(met);
    setTipo(met.tipo);
    setTitulo(met.tituloDefecto);
    setDescripcion(met.descripcionDefecto);
    setFecha(met.fechaDefecto);
    setModalidad(met.modalidadDefecto);
    if (met.modalidadDefecto === "decimas") {
      setDecimasMaximas(met.valorDefecto);
      setTargetEvaluacion(met.targetDefecto);
    } else {
      setPonderacionNota(met.valorDefecto);
    }
    setRubricaCriterios(met.rubricaDefecto);

    // Mensaje automático del agente confirmando el cambio
    setChatMessages((prev) => [
      ...prev,
      {
        sender: "agent",
        text: `✨ Ha seleccionado la metodología: "${met.nombreCorto}". En conjunto con el Agente Teórico (PMBOK 7) y el Agente Técnico (Programa UDP), he autocompletado el título, enunciado, fechas y la rúbrica oficial. ¡El formulario a la izquierda está listo para publicar!`,
        rec: met,
      },
    ]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const lower = userText.toLowerCase();

      let targetMet = catalogoMetodologiasDocentes[0];
      if (lower.includes("poker") || lower.includes("estimac") || lower.includes("fibonacci")) {
        targetMet = catalogoMetodologiasDocentes[2];
      } else if (lower.includes("caso") || lower.includes("forense") || lower.includes("contrato") || lower.includes("nota")) {
        targetMet = catalogoMetodologiasDocentes[1];
      } else if (lower.includes("debate") || lower.includes("socratic") || lower.includes("pecera")) {
        targetMet = catalogoMetodologiasDocentes[3];
      } else if (lower.includes("war") || lower.includes("crisis") || lower.includes("devops") || lower.includes("servidor")) {
        targetMet = catalogoMetodologiasDocentes[4];
      } else if (lower.includes("par") || lower.includes("peer") || lower.includes("ciega") || lower.includes("cruzada")) {
        targetMet = catalogoMetodologiasDocentes[5];
      }

      handleSelectMetodologia(targetMet.tipo);
    }, 800);
  };

  const handlePublish = () => {
    const newActivity: CourseDeliverable = {
      id: `act_${Date.now()}`,
      curso_id: courseId,
      tipo: "actividad_ayudantia",
      titulo: `${metodologiaSeleccionada.nombreCorto}: ${titulo}`,
      descripcion,
      fecha_limite: fecha,
      ponderacion_o_decimas: modalidad === "decimas" ? `+${decimasMaximas} décimas` : `Nota (${ponderacionNota}%)`,
      target_evaluacion: modalidad === "decimas" ? targetEvaluacion : "Acta General Ayudantía",
      estado: "publicada",
      rubrica: rubricaCriterios.map((r, i) => ({
        id: `crit_${Date.now()}_${i}`,
        descripcion: r.criterio,
        puntaje_max: r.puntos,
        indicadores: [
          { nivel: "Excelente", detalle: r.detalle, puntos: r.puntos },
          { nivel: "Aceptable", detalle: "Cumple de manera parcial con el estándar esperado.", puntos: Math.round(r.puntos * 0.6) },
          { nivel: "Insuficiente", detalle: "No presenta fundamentación técnica suficiente.", puntos: Math.round(r.puntos * 0.2) },
        ],
      })),
    };

    onPublish(newActivity);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header Institucional de Navegación */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <CanvasButton variant="outline" size="sm" onClick={onBack} icon={<ArrowLeft size={14} />}>
            Volver a Actividades
          </CanvasButton>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-gray-500">PROYECTO EN TICS II (CIT3203)</span>
              <CanvasBadge variant="udp">Diseñador Autónomo con IA</CanvasBadge>
            </div>
            <h1 className="text-lg font-bold text-[#2D3B45] mt-0.5">
              Generador Inteligente de Actividades Pedagógicas
            </h1>
          </div>
        </div>

        {/* Clúster de Agentes Asistentes */}
        <div className="flex items-center gap-2 text-xs bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-[4px]">
          <span className="text-gray-500 font-medium">Enjambre Colaborativo:</span>
          <span className="font-bold text-purple-700 flex items-center gap-1">
            <Sparkles size={12} /> Creativo
          </span>
          <span className="text-gray-300">•</span>
          <span className="font-bold text-blue-700 flex items-center gap-1">
            <Brain size={12} /> Teórico (PMBOK)
          </span>
          <span className="text-gray-300">•</span>
          <span className="font-bold text-[#C8102E] flex items-center gap-1">
            <BookOpen size={12} /> Técnico (RAPs)
          </span>
        </div>
      </div>

      {/* Layout de Dos Columnas: Formulario a la Izquierda y Chat de Asistencia a la Derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* COLUMNA IZQUIERDA: Formulario Inteligente (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E0E3E6] rounded-[4px] p-6 shadow-canvas-card space-y-5">
          <div className="border-b border-[#E0E3E6] pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold text-[#2D3B45] flex items-center gap-2">
                <FileText size={16} className="text-[#008EE2]" />
                Configuración de la Actividad (Completada por el Agente)
              </h2>
              <p className="text-xs text-[#6B7780] mt-0.5">
                Seleccione el tipo de actividad pedagógica recomendada por expertos de docencia.
              </p>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
              <CheckCircle2 size={11} /> 100% Automatizado
            </span>
          </div>

          {/* EL SELECT DE METODOLOGÍAS / TIPO DE ACTIVIDAD */}
          <div className="space-y-1.5 bg-[#F0F8FF] border border-[#B3E5FC] p-3.5 rounded-[4px]">
            <label className="text-xs font-bold text-[#0277BD] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <GraduationCap size={15} className="text-[#008EE2]" />
                Tipo de Actividad Pedagógica (Recomendada por Expertos en Docencia):
              </span>
              <span className="text-[10.5px] font-normal text-[#01579B]">
                {catalogoMetodologiasDocentes.length} dinámicas activas disponibles
              </span>
            </label>
            <select
              value={tipo}
              onChange={(e) => handleSelectMetodologia(e.target.value)}
              className="w-full text-xs font-bold border-2 border-[#008EE2] bg-white text-[#2D3B45] rounded-[4px] p-2 focus:ring-2 focus:ring-[#008EE2]"
            >
              {catalogoMetodologiasDocentes.map((m) => (
                <option key={m.id} value={m.tipo}>
                  {m.tipo}
                </option>
              ))}
            </select>

            {/* Micro badge explicativo del enfoque docente */}
            <p className="text-[11px] text-[#0277BD] mt-1 leading-relaxed">
              <strong>💡 Enfoque Docente CREA UDP:</strong> {metodologiaSeleccionada.enfoquePedagogicoCREA}
            </p>
          </div>

          {/* Título de la Actividad */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#2D3B45]">Título del Taller / Dinámica</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full text-xs border border-gray-300 rounded-[4px] p-2 focus:ring-1 focus:ring-[#008EE2]"
            />
          </div>

          {/* Enunciado y Descripción */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#2D3B45] flex justify-between">
              <span>Descripción y Enunciado del Taller</span>
              <span className="text-[11px] font-normal text-gray-500">Fundamentado en PMBOK y RAPs</span>
            </label>
            <textarea
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full text-xs border border-gray-300 rounded-[4px] p-2.5 focus:ring-1 focus:ring-[#008EE2] leading-relaxed"
            />
          </div>

          {/* Fecha y Modalidad de Evaluación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F9FAFB] p-4 rounded-[4px] border border-gray-200">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2D3B45] flex items-center gap-1">
                <Calendar size={13} className="text-[#008EE2]" />
                Fecha Límite de Entrega
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full text-xs border border-gray-300 rounded-[4px] p-2 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2D3B45] flex items-center gap-1">
                <Award size={13} className="text-[#C8102E]" />
                Modalidad de Evaluación
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setModalidad("decimas")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-[4px] border transition-all ${
                    modalidad === "decimas"
                      ? "bg-purple-100 border-purple-300 text-purple-900"
                      : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Bonificación Décimas
                </button>
                <button
                  type="button"
                  onClick={() => setModalidad("nota")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-[4px] border transition-all ${
                    modalidad === "nota"
                      ? "bg-blue-100 border-blue-300 text-blue-900"
                      : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Nota Oficial (1.0 - 7.0)
                </button>
              </div>
            </div>
          </div>

          {/* Detalle del Incentivo de Evaluación (Décimas vs Nota) */}
          {modalidad === "decimas" ? (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-[4px] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-purple-900 block mb-1">
                  Cantidad Máxima de Décimas a Bonificar
                </label>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-purple-900 text-sm">+</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="1.0"
                    value={decimasMaximas}
                    onChange={(e) => setDecimasMaximas(e.target.value)}
                    className="w-24 text-xs font-bold border border-purple-300 rounded-[4px] p-1.5 bg-white text-purple-900 text-center"
                  />
                  <span className="text-[#6B7780]">décimas en nota final</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-purple-900 block mb-1">
                  Hito Oficial al que se Sumarán
                </label>
                <select
                  value={targetEvaluacion}
                  onChange={(e) => setTargetEvaluacion(e.target.value)}
                  className="w-full text-xs border border-purple-300 rounded-[4px] p-1.5 bg-white font-medium text-purple-950"
                >
                  <option value="Presentación e informe inicial">Presentación e informe inicial (20%)</option>
                  <option value="Solemne Oficial">Solemne Oficial (20%)</option>
                  <option value="Reporte de Avance 1">Reporte de Avance 1 (20%)</option>
                  <option value="Reporte de Avance 2">Reporte de Avance 2 (20%)</option>
                  <option value="Presentación Final">Presentación Final / Feria (20%)</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-[4px] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-blue-900 block mb-1">
                  Ponderación de la Nota en el Curso
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="5"
                    max="30"
                    value={ponderacionNota}
                    onChange={(e) => setPonderacionNota(e.target.value)}
                    className="w-20 text-xs font-bold border border-blue-300 rounded-[4px] p-1.5 bg-white text-blue-900 text-center"
                  />
                  <span className="text-[#6B7780]">% de la Cátedra / Ayudantía</span>
                </div>
              </div>
              <div className="text-[11px] text-blue-800 flex items-center">
                <span>Esta nota se registrará en una columna dedicada de la planilla de calificaciones oficial.</span>
              </div>
            </div>
          )}

          {/* Rúbrica Automática Generada */}
          <div className="space-y-2 border-t pt-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-[#2D3B45] flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-700" />
                Rúbrica Oficial Generada Automáticamente (Agente Corrector)
              </label>
              <button
                type="button"
                onClick={() => {
                  setRubricaCriterios((prev) => [
                    ...prev,
                    {
                      criterio: "Aseguramiento de Calidad y Criterios de Aceptación",
                      puntos: 30,
                      detalle: "Validación de requisitos funcionales y no funcionales del software.",
                    },
                  ]);
                }}
                className="text-[11px] text-[#008EE2] hover:underline font-bold flex items-center gap-1"
              >
                <Plus size={11} /> Añadir Criterio
              </button>
            </div>

            <div className="space-y-2">
              {rubricaCriterios.map((c, i) => (
                <div key={i} className="p-3 bg-gray-50 border border-gray-200 rounded-[4px] space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold text-[#2D3B45]">
                    <span>Criterio {i + 1}: {c.criterio}</span>
                    <span className="text-[#008EE2] bg-blue-50 px-2 py-0.5 rounded">{c.puntos} pts</span>
                  </div>
                  <p className="text-[11px] text-[#55636E] leading-relaxed">{c.detalle}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Auditoría Ética & Pedagógica en Pie del Formulario */}
          <div className="bg-[#FAF5FF] border border-[#E9D5FF] rounded-[4px] p-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Scale size={14} className="text-purple-700 shrink-0" />
              <span className="text-[11px] text-purple-950">
                <strong>Auditoría de Género & CREA:</strong> {metodologiaSeleccionada.agenteGeneroValidacion}
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded shrink-0">
              Certificado
            </span>
          </div>

          {/* Botón de Publicación */}
          <div className="pt-2 flex justify-end gap-3 border-t">
            <CanvasButton variant="outline" size="sm" onClick={onBack}>
              Cancelar
            </CanvasButton>
            <CanvasButton variant="primary-udp" size="md" onClick={handlePublish} icon={<Zap size={14} />}>
              Publicar Actividad en el Curso y Sincronizar
            </CanvasButton>
          </div>
        </div>

        {/* COLUMNA DERECHA: Chat del Agente de Actividades (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E0E3E6] rounded-[4px] shadow-canvas-card flex flex-col h-[750px]">
          {/* Header del Chat */}
          <div className="p-4 border-b border-[#E0E3E6] flex items-center justify-between bg-[#F9FAFB]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center">
                <Bot size={17} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#2D3B45]">
                  Agente de Actividades Dinámicas
                </h3>
                <span className="text-[10.5px] text-emerald-700 font-medium flex items-center gap-1">
                  ● Conectado con Agente Teórico & Técnico UDP
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-[#008EE2]">
              Asistente en Vivo
            </span>
          </div>

          {/* Mensajes del Chat */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "agent" && (
                  <div className="w-6 h-6 rounded-full bg-purple-50 text-purple-800 border border-purple-200 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">
                    IA
                  </div>
                )}

                <div className={`space-y-2 max-w-[88%] ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`p-3 rounded-[6px] leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[#008EE2] text-white"
                        : "bg-[#F5F6F8] text-[#2D3B45] border border-gray-200"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Tarjeta de Recomendación con Botón para Rellenar el Formulario */}
                  {msg.rec && (
                    <div className="p-3 bg-white border-2 border-purple-300 rounded-[6px] space-y-2 shadow-xs">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                          {msg.rec.nombreCorto}
                        </span>
                        <span className="text-[10px] font-bold text-purple-900 bg-purple-50 px-1.5 py-0.5 rounded">
                          {msg.rec.modalidadDefecto === "decimas" ? `+${msg.rec.valorDefecto} décimas` : `Nota (${msg.rec.valorDefecto}%)`}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#2D3B45]">{msg.rec.tituloDefecto}</h4>
                      <p className="text-[11px] text-[#55636E] line-clamp-2">{msg.rec.descripcionDefecto}</p>

                      <div className="pt-1 border-t border-gray-100 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleSelectMetodologia(msg.rec!.tipo)}
                          className="px-2.5 py-1 bg-purple-700 hover:bg-purple-800 text-white rounded-[4px] text-[11px] font-bold flex items-center gap-1 shadow-xs transition-colors"
                        >
                          <Zap size={11} /> Aplicar esta actividad al formulario
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-gray-500 italic">
                <Bot size={13} className="animate-spin text-purple-700" />
                <span>Consultando con el Agente Teórico y Técnico...</span>
              </div>
            )}
          </div>

          {/* Sugerencias Rápidas para la Demo */}
          <div className="p-2.5 bg-gray-50 border-t border-gray-200 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
              💡 Metodologías Recomendadas por Expertos (Acceso Rápido):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {catalogoMetodologiasDocentes.slice(0, 4).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleSelectMetodologia(m.tipo)}
                  className="text-[10.5px] bg-white border border-gray-300 hover:border-purple-400 hover:bg-purple-50 px-2 py-1 rounded text-[#2D3B45] transition-colors text-left font-medium"
                >
                  ⚡ {m.nombreCorto}
                </button>
              ))}
            </div>
          </div>

          {/* Input del Chat */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 flex gap-2 bg-white">
            <input
              type="text"
              placeholder="Pídele al agente que te sugiera otra dinámica o adapte la actual..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 text-xs border border-gray-300 rounded-[4px] px-3 py-2 focus:ring-1 focus:ring-[#008EE2]"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-[#2D3B45] hover:bg-[#1E272E] text-white rounded-[4px] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Send size={12} />
              <span>Enviar</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
