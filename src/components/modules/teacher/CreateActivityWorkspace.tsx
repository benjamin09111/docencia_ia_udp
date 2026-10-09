"use client";

import React, { useState } from "react";
import { CourseDeliverable } from "@/types";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import { ArrowLeft } from "lucide-react";
import { RubricMatrixRubro } from "@/components/canvas/CanvasOfficialRubricTable";
import {
  MetodologiaDocente,
  catalogoMetodologiasDocentes,
} from "@/constants/metodologiasDocentes";
import { ActivityWizardStepper } from "./activities/ActivityWizardStepper";
import { StepTipoActividad } from "./activities/StepTipoActividad";
import { StepInformacion } from "./activities/StepInformacion";
import { StepInstrucciones } from "./activities/StepInstrucciones";
import { StepRubrica } from "./activities/StepRubrica";
import { StepResumen } from "./activities/StepResumen";
import { ActivityAssistantChat, ChatMessageItem } from "./activities/ActivityAssistantChat";
import { sendAgentQuery } from "@/services/aiAgentService";

export {
  type MetodologiaDocente,
  catalogoMetodologiasDocentes,
  matricesOficialesPorMetodologia,
  CONTENIDOS_OFICIALES,
} from "@/constants/metodologiasDocentes";

interface CreateActivityWorkspaceProps {
  courseId: number;
  initialActivityId?: string;
  onBack: () => void;
  onPublish: (activity: CourseDeliverable) => void;
}

export const CreateActivityWorkspace: React.FC<CreateActivityWorkspaceProps> = ({
  courseId,
  initialActivityId,
  onBack,
  onPublish,
}) => {
  const initialMet =
    catalogoMetodologiasDocentes.find((m) => m.id === initialActivityId) ||
    catalogoMetodologiasDocentes[0];

  const [pasoActual, setPasoActual] = useState<number>(1);
  const [metodologia, setMetodologia] = useState<MetodologiaDocente>(initialMet);

  // Form State
  const [titulo, setTitulo] = useState(initialMet.tituloDefecto);
  const [descripcion, setDescripcion] = useState(initialMet.descripcionDefecto);
  const [contenidoSeleccionado, setContenidoSeleccionado] = useState(initialMet.contenidoSugerido);
  const [contenidoManual, setContenidoManual] = useState("");
  const [fecha, setFecha] = useState(initialMet.fechaDefecto);
  const [instrucciones, setInstrucciones] = useState(initialMet.instruccionesDefecto);

  // Modalidad de evaluación
  const [modalidad, setModalidad] = useState<"decimas" | "nota">(initialMet.modalidadDefecto);
  const [decimas, setDecimas] = useState(initialMet.valorDefecto);
  const [targetEvaluacion, setTargetEvaluacion] = useState(initialMet.targetDefecto);
  const [matrizRubros, setMatrizRubros] = useState<RubricMatrixRubro[]>(initialMet.matrizOficial);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessageItem[]>([
    {
      sender: "agent",
      text: "Hola profesor. Seleccione el tipo de actividad en el catálogo para comenzar. Le asistiré en cada paso del diseño pedagógico.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isGeneratingInstructions, setIsGeneratingInstructions] = useState(false);

  const handleSelectMetodologia = (met: MetodologiaDocente) => {
    setMetodologia(met);
    setTitulo(met.tituloDefecto);
    setDescripcion(met.descripcionDefecto);
    setContenidoSeleccionado(met.contenidoSugerido);
    setFecha(met.fechaDefecto);
    setModalidad(met.modalidadDefecto);
    setDecimas(met.valorDefecto);
    setTargetEvaluacion(met.targetDefecto);
    setInstrucciones(met.instruccionesDefecto);
    setMatrizRubros(met.matrizOficial);

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

      const textoGenerado =
        `Instrucciones Oficiales — Dinámica: ${metodologia.nombreCorto}\n` +
        `Eje Temático Evaluado: ${contenidoFinal}\n\n` +
        `1. Organización y Roles:\n` +
        `   Los equipos se conformarán en grupos de 3 a 4 estudiantes. Cada integrante asumirá un rol activo con tareas delimitadas.\n\n` +
        `2. Desarrollo de la Dinámica (${metodologia.duracionSugerida}):\n` +
        `   ${metodologia.descripcionDefecto}\n\n` +
        `3. Aplicación Práctica y Evidencia:\n` +
        `   Aplicar los conceptos de ${contenidoFinal} resolviendo la problemática propuesta con fundamentación técnica y justificación de decisiones.\n\n` +
        `4. Cierre y Entregable:\n` +
        `   Cada grupo registrará su entrega antes de la fecha límite (${fecha}). La evaluación se realizará según la pauta oficial del taller.`;

      setInstrucciones(textoGenerado);
      setIsGeneratingInstructions(false);

      setChatMessages((prev) => [
        ...prev,
        {
          sender: "agent",
          text: `He generado instrucciones adaptadas para "${metodologia.nombreCorto}" enfocadas en: ${contenidoFinal}. Puedes editarlas libremente en el campo de texto.`,
        },
      ]);
    }, 700);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatInput("");
    setIsTyping(true);

    try {
      const res = await sendAgentQuery({
        agentRole: "activity_assistant",
        message: userText,
      });
      setIsTyping(false);
      setChatMessages((prev) => [...prev, { sender: "agent", text: res.reply }]);
    } catch {
      setIsTyping(false);
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "agent",
          text: "No se pudo obtener respuesta del agente. Intenta nuevamente.",
        },
      ]);
    }
  };

  const handlePublishFinal = () => {
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

    const newActivity: CourseDeliverable = {
      id: `act_${Date.now()}`,
      curso_id: courseId,
      tipo: "actividad_ayudantia",
      titulo: `${metodologia.nombreCorto}: ${titulo}`,
      descripcion,
      fecha_limite: fecha,
      ponderacion_o_decimas: ponderacionFinal,
      target_evaluacion: modalidad === "decimas" ? targetEvaluacion : "Evaluación Extra Ayudantía",
      estado: "publicada",
      rubrica: rubricaGenerada,
    };

    onPublish(newActivity);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header Institucional de Navegación */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-canvas-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            title="Volver a Actividades extra"
            aria-label="Volver a Actividades extra"
            className="w-8 h-8 rounded-[4px] border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-100 text-[#2D3B45] hover:text-[#008EE2] transition-colors flex items-center justify-center shrink-0 shadow-2xs cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-gray-500">PROYECTO EN TICS II (CIT3203)</span>
              <CanvasBadge variant="udp">Actividades extra</CanvasBadge>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-[#2D3B45] mt-0.5">
              Diseño de Actividad Pedagógica
            </h1>
          </div>
        </div>
      </div>

      {/* Stepper del Wizard */}
      <ActivityWizardStepper pasoActual={pasoActual} onSelectPaso={setPasoActual} />

      {/* Formulario Wizard (7 Cols) + Asistente Lateral (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-7 bg-white border border-[#E0E3E6] rounded-[4px] p-5 sm:p-6 shadow-canvas-card space-y-5">
          {pasoActual === 1 && (
            <StepTipoActividad
              selectedMetodologia={metodologia}
              onSelectMetodologia={handleSelectMetodologia}
              onNext={() => setPasoActual(2)}
            />
          )}

          {pasoActual === 2 && (
            <StepInformacion
              titulo={titulo}
              setTitulo={setTitulo}
              descripcion={descripcion}
              setDescripcion={setDescripcion}
              contenidoSeleccionado={contenidoSeleccionado}
              setContenidoSeleccionado={setContenidoSeleccionado}
              contenidoManual={contenidoManual}
              setContenidoManual={setContenidoManual}
              fecha={fecha}
              setFecha={setFecha}
              onPrev={() => setPasoActual(1)}
              onNext={() => setPasoActual(3)}
            />
          )}

          {pasoActual === 3 && (
            <StepInstrucciones
              instrucciones={instrucciones}
              setInstrucciones={setInstrucciones}
              onGenerarIA={handleGenerarInstruccionesIA}
              isGenerating={isGeneratingInstructions}
              onPrev={() => setPasoActual(2)}
              onNext={() => setPasoActual(4)}
            />
          )}

          {pasoActual === 4 && (
            <StepRubrica
              metodologia={metodologia}
              modalidad={modalidad}
              setModalidad={setModalidad}
              decimas={decimas}
              setDecimas={setDecimas}
              targetEvaluacion={targetEvaluacion}
              setTargetEvaluacion={setTargetEvaluacion}
              matrizRubros={matrizRubros}
              setMatrizRubros={setMatrizRubros}
              onPrev={() => setPasoActual(3)}
              onNext={() => setPasoActual(5)}
            />
          )}

          {pasoActual === 5 && (
            <StepResumen
              metodologia={metodologia}
              titulo={titulo}
              modalidad={modalidad}
              decimas={decimas}
              targetEvaluacion={targetEvaluacion}
              fecha={fecha}
              contenidoSeleccionado={contenidoSeleccionado}
              contenidoManual={contenidoManual}
              matrizRubros={matrizRubros}
              onPrev={() => setPasoActual(4)}
              onPublish={handlePublishFinal}
            />
          )}
        </div>

        <ActivityAssistantChat
          chatMessages={chatMessages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          isTyping={isTyping}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};
