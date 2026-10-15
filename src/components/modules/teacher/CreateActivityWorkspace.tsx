"use client";

import React, { useState } from "react";
import { CourseDeliverable } from "@/types";
import { ActivityStudioHeader } from "./activities/ActivityStudioHeader";
import { StepTipoActividad } from "./activities/StepTipoActividad";
import { StepInformacion } from "./activities/StepInformacion";
import { StepInstrucciones } from "./activities/StepInstrucciones";
import { StepRubrica } from "./activities/StepRubrica";
import { StepResumen } from "./activities/StepResumen";
import { ActivityAssistantChat } from "./activities/ActivityAssistantChat";
import { useCreateActivityForm } from "./activities/useCreateActivityForm";
import { StudentActivityPreviewModal } from "./activities/preview/StudentActivityPreviewModal";
import { ActivityAgentDraft } from "@/types/activityAgent";

interface CreateActivityWorkspaceProps {
  courseId: number;
  courseCode: string;
  initialActivityId?: string;
  agentDraft?: ActivityAgentDraft;
  onBack: () => void;
  onPublish: (activity: CourseDeliverable) => void;
}

export const CreateActivityWorkspace: React.FC<CreateActivityWorkspaceProps> = ({
  courseId,
  courseCode,
  initialActivityId,
  agentDraft,
  onBack,
  onPublish,
}) => {
  const form = useCreateActivityForm(courseId, initialActivityId, onPublish, agentDraft);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <div className="fixed inset-0 left-0 md:left-[84px] top-[49px] z-30 bg-[#F5F6F8] flex flex-col overflow-hidden">
      {/* Barra Única Studio / Wizard (48px) con botón de Vista Previa */}
      <ActivityStudioHeader
        pasoActual={form.pasoActual}
        onSelectPaso={form.setPasoActual}
        onBack={onBack}
        onPublish={form.handlePublishFinal}
        isActividadConfirmada={form.isActividadConfirmada}
        onOpenPreview={() => setIsPreviewOpen(true)}
      />

      {/* Contenido Full Viewport: Baraja 3D o Formulario + Copiloto IA */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 p-3 overflow-hidden">
        <div className="lg:col-span-8 flex flex-col min-h-0 overflow-hidden">
          {form.pasoActual === 1 && (
            <StepTipoActividad
              selectedMetodologia={form.metodologia}
              onSelectMetodologia={form.handleSelectMetodologia}
              onNext={() => form.setPasoActual(2)}
            />
          )}

          {form.pasoActual === 2 && (
            <div className="flex-1 min-h-0 bg-white border border-[#C7CDD1] rounded-[3px] p-5 shadow-2xs overflow-y-auto space-y-4">
              <StepInformacion
                courseCode={courseCode}
                titulo={form.titulo}
                setTitulo={form.setTitulo}
                descripcion={form.descripcion}
                setDescripcion={form.setDescripcion}
                contenidoSeleccionado={form.contenidoSeleccionado}
                setContenidoSeleccionado={form.setContenidoSeleccionado}
                contenidoManual={form.contenidoManual}
                setContenidoManual={form.setContenidoManual}
                fecha={form.fecha}
                setFecha={form.setFecha}
                pin={form.activityPin}
                setPin={form.setActivityPin}
                pointsPossible={form.pointsPossible}
                setPointsPossible={form.setPointsPossible}
                gradingType={form.gradingType}
                setGradingType={form.setGradingType}
                assignmentGroup={form.assignmentGroup}
                setAssignmentGroup={form.setAssignmentGroup}
                omitFromFinalGrade={form.omitFromFinalGrade}
                setOmitFromFinalGrade={form.setOmitFromFinalGrade}
                submissionType={form.submissionType}
                setSubmissionType={form.setSubmissionType}
                allowedExtensions={form.allowedExtensions}
                setAllowedExtensions={form.setAllowedExtensions}
                allowedAttempts={form.allowedAttempts}
                setAllowedAttempts={form.setAllowedAttempts}
                isGroupAssignment={form.isGroupAssignment}
                setIsGroupAssignment={form.setIsGroupAssignment}
                unlockAt={form.unlockAt}
                setUnlockAt={form.setUnlockAt}
                lockAt={form.lockAt}
                setLockAt={form.setLockAt}
                syncToCanvas={form.syncToCanvas}
                setSyncToCanvas={form.setSyncToCanvas}
                onPrev={() => form.setPasoActual(1)}
                onNext={() => form.setPasoActual(3)}
              />
            </div>
          )}

          {form.pasoActual === 3 && (
            <div className="flex-1 min-h-0 bg-white border border-[#C7CDD1] rounded-[3px] p-5 shadow-2xs overflow-y-auto space-y-4">
              <StepInstrucciones
                items={form.instruccionesItems}
                setItems={form.setInstruccionesItems}
                attachments={form.attachments}
                setAttachments={form.setAttachments}
                onGenerarIA={form.handleGenerarInstruccionesIA}
                isGenerating={form.isGeneratingInstructions}
                onPrev={() => form.setPasoActual(2)}
                onNext={() => form.setPasoActual(4)}
              />
            </div>
          )}

          {form.pasoActual === 4 && (
            <div className="flex-1 min-h-0 bg-white border border-[#C7CDD1] rounded-[3px] p-5 shadow-2xs overflow-y-auto space-y-4">
              <StepRubrica
                metodologia={form.metodologia}
                modalidad={form.modalidad}
                setModalidad={form.setModalidad}
                decimas={form.decimas}
                setDecimas={form.setDecimas}
                targetEvaluacion={form.targetEvaluacion}
                setTargetEvaluacion={form.setTargetEvaluacion}
                matrizRubros={form.matrizRubros}
                setMatrizRubros={form.setMatrizRubros}
                onPrev={() => form.setPasoActual(3)}
                onNext={() => form.setPasoActual(5)}
              />
            </div>
          )}

          {form.pasoActual === 5 && (
            <div className="flex-1 min-h-0 bg-white border border-[#C7CDD1] rounded-[3px] p-5 shadow-2xs overflow-y-auto space-y-4">
              <StepResumen
                metodologia={form.metodologia}
                titulo={form.titulo}
                modalidad={form.modalidad}
                decimas={form.decimas}
                targetEvaluacion={form.targetEvaluacion}
                fecha={form.fecha}
                contenidoSeleccionado={form.contenidoSeleccionado}
                contenidoManual={form.contenidoManual}
                matrizRubros={form.matrizRubros}
                pointsPossible={form.pointsPossible}
                gradingType={form.gradingType}
                assignmentGroup={form.assignmentGroup}
                submissionType={form.submissionType}
                allowedExtensions={form.allowedExtensions}
                syncToCanvas={form.syncToCanvas}
                pin={form.activityPin}
                attachmentsCount={form.attachments.length}
                onPrev={() => form.setPasoActual(4)}
                onPublish={form.handlePublishFinal}
              />
            </div>
          )}
        </div>

        {/* Copiloto lateral Canvas en columna derecha */}
        <div className="lg:col-span-4 flex flex-col min-h-0 overflow-hidden">
          <ActivityAssistantChat
            chatMessages={form.chatMessages}
            chatInput={form.chatInput}
            setChatInput={form.setChatInput}
            isTyping={form.isTyping}
            onSendMessage={form.handleSendMessage}
          />
        </div>
      </div>

      {/* Modal de Vista Previa de la Actividad (Perspectiva del Estudiante con PIN) */}
      <StudentActivityPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        metodologia={form.metodologia}
        titulo={form.titulo}
        descripcion={form.descripcion}
        fecha={form.fecha}
        pin={form.activityPin}
        items={form.instruccionesItems}
        attachments={form.attachments}
        matrizRubros={form.matrizRubros}
        modalidad={form.modalidad}
        decimas={form.decimas}
        pointsPossible={form.pointsPossible}
      />
    </div>
  );
};
