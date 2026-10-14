"use client";

import { useState } from "react";
import { CourseDeliverable } from "@/types";
import { RubricMatrixRubro } from "@/components/canvas/CanvasOfficialRubricTable";
import {
  MetodologiaDocente,
  catalogoMetodologiasDocentes,
} from "@/constants/metodologiasDocentes";
import { ChatMessageItem } from "./ActivityAssistantChat";
import { sendAgentQuery } from "@/services/aiAgentService";
import { InstruccionItem, ActivityAttachment } from "@/types/actividadesFormativas";
import { generateUniqueActivityPin } from "@/utils/activityPinHelpers";
import {
  buildDefaultInstructionsForActivity,
  buildRubricFromInstructions,
  formatInstructionsToMarkdown,
} from "@/utils/rubricHelpers";

export function useCreateActivityForm(
  courseId: number,
  initialActivityId: string | undefined,
  onPublish: (activity: CourseDeliverable) => void
) {
  const initialMet =
    catalogoMetodologiasDocentes.find((m) => m.id === initialActivityId) ||
    catalogoMetodologiasDocentes[0];

  const [pasoActual, setPasoActual] = useState<number>(1);
  const [isActividadConfirmada, setIsActividadConfirmada] = useState<boolean>(
    Boolean(initialActivityId)
  );
  const [metodologia, setMetodologia] = useState<MetodologiaDocente>(initialMet);
  const [titulo, setTitulo] = useState(initialMet.tituloDefecto);
  const [descripcion, setDescripcion] = useState(initialMet.descripcionDefecto);
  const [contenidoSeleccionado, setContenidoSeleccionado] = useState(initialMet.contenidoSugerido);
  const [contenidoManual, setContenidoManual] = useState("");
  const [fecha, setFecha] = useState(initialMet.fechaDefecto);
  const [instruccionesItems, setInstruccionesItems] = useState<InstruccionItem[]>(() =>
    buildDefaultInstructionsForActivity(initialMet.nombreCorto, initialMet.descripcionDefecto)
  );
  const [instrucciones, setInstrucciones] = useState(() =>
    formatInstructionsToMarkdown(
      buildDefaultInstructionsForActivity(initialMet.nombreCorto, initialMet.descripcionDefecto)
    )
  );

  const [modalidad, setModalidad] = useState<"decimas" | "nota">(initialMet.modalidadDefecto);
  const [decimas, setDecimas] = useState(initialMet.valorDefecto);
  const [targetEvaluacion, setTargetEvaluacion] = useState(initialMet.targetDefecto);
  const [matrizRubros, setMatrizRubros] = useState<RubricMatrixRubro[]>(() =>
    buildRubricFromInstructions(
      buildDefaultInstructionsForActivity(initialMet.nombreCorto, initialMet.descripcionDefecto)
    )
  );

  // PIN de 6 caracteres alfanuméricos único para acceso del estudiante
  const [activityPin, setActivityPin] = useState<string>(() => generateUniqueActivityPin());

  // Archivos o imágenes adjuntos como anexos para el estudiante
  const [attachments, setAttachments] = useState<ActivityAttachment[]>([]);

  const [chatMessages, setChatMessages] = useState<ChatMessageItem[]>([
    {
      sender: "agent",
      text: "Hola docente! Cualquier ayuda que necesites, puedes escribirme. Puedo buscar la mejor actividad que se ajuste a tus ideas!",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isGeneratingInstructions, setIsGeneratingInstructions] = useState(false);

  // Parámetros técnicos oficiales de Canvas LMS (Paso 2)
  const [pointsPossible, setPointsPossible] = useState<number>(60.0);
  const [gradingType, setGradingType] = useState<"points" | "percentage" | "letter_grade" | "pass_fail">("points");
  const [assignmentGroup, setAssignmentGroup] = useState<string>("Talleres y Actividades Formativas");
  const [omitFromFinalGrade, setOmitFromFinalGrade] = useState<boolean>(false);
  const [submissionType, setSubmissionType] = useState<"online_upload" | "online_text_entry" | "online_url" | "on_paper" | "none">("online_upload");
  const [allowedExtensions, setAllowedExtensions] = useState<string>("pdf, docx, zip");
  const [allowedAttempts, setAllowedAttempts] = useState<number>(-1);
  const [isGroupAssignment, setIsGroupAssignment] = useState<boolean>(false);
  const [unlockAt, setUnlockAt] = useState<string>(new Date().toISOString().split("T")[0]);
  const [lockAt, setLockAt] = useState<string>("");
  const [syncToCanvas, setSyncToCanvas] = useState<boolean>(true);
  const [isSyncingCanvas, setIsSyncingCanvas] = useState<boolean>(false);
  const [canvasSyncError, setCanvasSyncError] = useState<string | null>(null);
  const [canvasSyncSuccess, setCanvasSyncSuccess] = useState<{ id: number; htmlUrl: string; name: string } | null>(null);

  const handleUpdateInstruccionesItems = (newItems: InstruccionItem[]) => {
    setInstruccionesItems(newItems);
    setInstrucciones(formatInstructionsToMarkdown(newItems));
    setMatrizRubros(buildRubricFromInstructions(newItems));
  };

  const handleSelectMetodologia = (met: MetodologiaDocente) => {
    setMetodologia(met);
    setIsActividadConfirmada(true);
    setTitulo(met.tituloDefecto);
    setDescripcion(met.descripcionDefecto);
    setContenidoSeleccionado(met.contenidoSugerido);
    setFecha(met.fechaDefecto);
    setModalidad(met.modalidadDefecto);
    setDecimas(met.valorDefecto);
    setTargetEvaluacion(met.targetDefecto);

    const defaultItems = buildDefaultInstructionsForActivity(met.nombreCorto, met.descripcionDefecto);
    setInstruccionesItems(defaultItems);
    setInstrucciones(formatInstructionsToMarkdown(defaultItems));
    setMatrizRubros(buildRubricFromInstructions(defaultItems));

    setChatMessages((prev) => [
      ...prev,
      {
        sender: "agent",
        text: `Seleccionaste "${met.nombreCorto}". Esta dinámica es ideal para: ${met.ventajas}. Avanza a Información cuando desees.`,
      },
    ]);
  };

  const handleGenerarInstruccionesIA = () => {
    setIsGeneratingInstructions(true);
    setTimeout(() => {
      const contenidoFinal = contenidoSeleccionado.startsWith("Personalizado")
        ? contenidoManual || "los contenidos de la sesión"
        : contenidoSeleccionado;

      const aiItems: InstruccionItem[] = [
        {
          id: `inst_ai_1`,
          numero: 1,
          titulo: `Pregunta 1: Diagnóstico y Fundamentación Conceptual (${metodologia.nombreCorto})`,
          descripcion: `Formular y justificar los supuestos técnicos del problema considerando: "${contenidoFinal}". Identificar conceptos clave y restricciones.`,
          puntaje: 20,
        },
        {
          id: `inst_ai_2`,
          numero: 2,
          titulo: `Pregunta 2: Aplicación Práctica y Modelado de Solución`,
          descripcion: `Ejecutar la dinámica grupal o individual resolviendo el reto planteado. Presentar diagramas, algoritmos o pautas fundamentadas en ${contenidoFinal}.`,
          puntaje: 20,
        },
        {
          id: `inst_ai_3`,
          numero: 3,
          titulo: `Pregunta 3: Análisis Crítico de Trade-offs y Conclusiones`,
          descripcion: `Evaluar las limitaciones de la propuesta, contrastar riesgos técnicos y sintetizar los acuerdos y aprendizajes alcanzados en el taller.`,
          puntaje: 20,
        },
      ];

      handleUpdateInstruccionesItems(aiItems);
      setIsGeneratingInstructions(false);
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "agent",
          text: `He estructurado 3 preguntas adaptadas para "${metodologia.nombreCorto}" con 60 puntos exactos basadas en: ${contenidoFinal}.`,
        },
      ]);
    }, 600);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userText = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatInput("");
    setIsTyping(true);

    try {
      const res = await sendAgentQuery({ agentRole: "activity_assistant", message: userText });
      setIsTyping(false);
      setChatMessages((prev) => [...prev, { sender: "agent", text: res.reply }]);
    } catch {
      setIsTyping(false);
      setChatMessages((prev) => [
        ...prev,
        { sender: "agent", text: "Error de comunicación con el agente. Intenta nuevamente." },
      ]);
    }
  };

  const handlePublishFinal = async () => {
    const ponderacionFinal = modalidad === "decimas" ? `+${decimas} décimas` : "Evaluación formativa (1.0 - 7.0)";
    const rubricaGenerada = matrizRubros.flatMap((rubro) =>
      rubro.criterios.flatMap((criterio) =>
        criterio.subcriterios.map((sub) => ({
          id: sub.id,
          descripcion: `${rubro.nombre} > ${criterio.nombre}: ${sub.nombre}`,
          puntaje_max: sub.puntaje,
          indicadores: [
            { nivel: "Excelente" as const, detalle: sub.descriptores.join(" • "), puntos: sub.puntaje },
            { nivel: "Aceptable" as const, detalle: "Cumple parcialmente con los requerimientos.", puntos: Math.round(sub.puntaje * 0.6) },
            { nivel: "Insuficiente" as const, detalle: "No cumple con los estándares mínimos.", puntos: Math.round(sub.puntaje * 0.2) },
          ],
        }))
      )
    );

    let canvasAssignmentId: number | undefined = undefined;
    let canvasHtmlUrl: string | undefined = undefined;

    if (syncToCanvas) {
      setIsSyncingCanvas(true);
      setCanvasSyncError(null);
      try {
        const extensionsList = allowedExtensions
          .split(",")
          .map((e) => e.trim().toLowerCase().replace(/^\./, ""))
          .filter(Boolean);

        const res = await fetch("/api/canvas/assignments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId: courseId,
            name: `${metodologia.nombreCorto}: ${titulo}`,
            description: `<div style="font-family: Lato, sans-serif;">
              <p><strong>Actividad Pedagógica:</strong> ${metodologia.nombreCorto}</p>
              <p><strong>Eje Temático Evaluado:</strong> ${contenidoSeleccionado.startsWith("Personalizado") ? contenidoManual || "Contenidos del curso" : contenidoSeleccionado}</p>
              <hr style="border: 0; border-top: 1px solid #C7CDD1; margin: 12px 0;" />
              <p>${descripcion}</p>
              ${instrucciones ? `<div style="background-color: #F5F6F8; border-left: 4px solid #B71C1C; padding: 12px; margin-top: 12px;"><pre style="white-space: pre-wrap; font-family: inherit;">${instrucciones}</pre></div>` : ""}
            </div>`,
            dueAt: fecha ? new Date(fecha).toISOString() : null,
            unlockAt: unlockAt ? new Date(unlockAt).toISOString() : null,
            lockAt: lockAt ? new Date(lockAt).toISOString() : null,
            pointsPossible: pointsPossible,
            gradingType: gradingType,
            submissionTypes: [submissionType],
            allowedExtensions: extensionsList,
            allowedAttempts: allowedAttempts,
            omitFromFinalGrade: omitFromFinalGrade,
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          canvasAssignmentId = data.assignmentId;
          canvasHtmlUrl = data.htmlUrl;
          setCanvasSyncSuccess(data);
        } else {
          console.warn("Canvas API notice:", data.error);
        }
      } catch (err: any) {
        console.warn("Canvas sync exception (will save locally):", err);
      } finally {
        setIsSyncingCanvas(false);
      }
    }

    onPublish({
      id: `act_${Date.now()}`,
      curso_id: courseId,
      tipo: "actividad_ayudantia",
      titulo: `${metodologia.nombreCorto}: ${titulo}`,
      descripcion,
      fecha_limite: fecha,
      ponderacion_o_decimas: ponderacionFinal,
      target_evaluacion: modalidad === "decimas" ? targetEvaluacion : "Evaluación Extra",
      estado: "publicada",
      rubrica: rubricaGenerada,
      canvas_assignment_id: canvasAssignmentId,
      canvas_html_url: canvasHtmlUrl,
      points_possible: pointsPossible,
      grading_type: gradingType,
      assignment_group: assignmentGroup,
      submission_types: [submissionType],
      allowed_extensions: allowedExtensions.split(",").map((e) => e.trim()).filter(Boolean),
      allowed_attempts: allowedAttempts,
      is_group_assignment: isGroupAssignment,
      unlock_at: unlockAt,
      lock_at: lockAt,
      pin: activityPin,
      attachments: attachments,
    });
  };

  return {
    pasoActual,
    setPasoActual,
    isActividadConfirmada,
    setIsActividadConfirmada,
    metodologia,
    handleSelectMetodologia,
    titulo,
    setTitulo,
    descripcion,
    setDescripcion,
    contenidoSeleccionado,
    setContenidoSeleccionado,
    contenidoManual,
    setContenidoManual,
    fecha,
    setFecha,
    activityPin,
    setActivityPin,
    attachments,
    setAttachments,
    instrucciones,
    setInstrucciones,
    instruccionesItems,
    setInstruccionesItems: handleUpdateInstruccionesItems,
    modalidad,
    setModalidad,
    decimas,
    setDecimas,
    targetEvaluacion,
    setTargetEvaluacion,
    matrizRubros,
    setMatrizRubros,
    chatMessages,
    chatInput,
    setChatInput,
    isTyping,
    isGeneratingInstructions,
    handleGenerarInstruccionesIA,
    handleSendMessage,
    handlePublishFinal,

    // Parámetros técnicos Canvas (Paso 2)
    pointsPossible,
    setPointsPossible,
    gradingType,
    setGradingType,
    assignmentGroup,
    setAssignmentGroup,
    omitFromFinalGrade,
    setOmitFromFinalGrade,
    submissionType,
    setSubmissionType,
    allowedExtensions,
    setAllowedExtensions,
    allowedAttempts,
    setAllowedAttempts,
    isGroupAssignment,
    setIsGroupAssignment,
    unlockAt,
    setUnlockAt,
    lockAt,
    setLockAt,
    syncToCanvas,
    setSyncToCanvas,
    isSyncingCanvas,
    canvasSyncError,
    canvasSyncSuccess,
  };
}
