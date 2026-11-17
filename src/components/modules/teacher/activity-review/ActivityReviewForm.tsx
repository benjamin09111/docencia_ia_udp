"use client";

import { useState, type FormEvent } from "react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasInput } from "@/components/canvas/CanvasInput";
import { CanvasSelect } from "@/components/canvas/CanvasSelect";
import { activityJson, activityRequest, activityReviewApi } from "@/services/activityReviewService";
import { ACTIVITY_TYPES, ACTIVITY_REVIEW_COURSE_CODE, activityPoints, type ReviewActivity, type ReviewActivityInput } from "@/types/activityReview";
import type { ActivityAgentDraft, ActivityAgentRequest } from "@/types/activityAgent";

const blankCriterion = { name: "", description: "", points: 10 };
const initialActivity: ReviewActivityInput = {
  title: "", type: "Taller", assessment: "nota", instructions: "", context: "",
  gradeBase: 1, maxDecimas: 0.3, rubric: [blankCriterion],
};
const textarea = "block w-full rounded-[3px] border border-[#C7CDD1] p-2 font-normal";

export function ActivityReviewForm({ onSave }: { onSave: (activity: ReviewActivity) => void }) {
  const [activity, setActivity] = useState(initialActivity);
  const [objective, setObjective] = useState("");
  const [rubricPrompt, setRubricPrompt] = useState("");
  const [busy, setBusy] = useState<"draft" | "rubric" | "save" | null>(null);
  const [error, setError] = useState("");
  const [draftSource, setDraftSource] = useState<ActivityAgentDraft["source"]>();
  const update = (patch: Partial<ReviewActivityInput>) => setActivity(current => ({ ...current, ...patch }));

  async function generate(target: "draft" | "rubric") {
    const subject = target === "draft" ? objective.trim() : activity.instructions.trim() || objective.trim();
    if (!subject) {
      setError("Describe primero lo que quieres que hagan los estudiantes.");
      return;
    }
    setBusy(target);
    setError("");
    const input: ActivityAgentRequest = {
      courseCode: ACTIVITY_REVIEW_COURSE_CODE, courseName: "Arquitectura de Software",
      duration: "45", format: "individual", assessment: activity.assessment,
      objective: `${activity.type}: ${subject}`,
      content: [activity.context, rubricPrompt.trim() && `Indicaciones para la pauta: ${rubricPrompt.trim()}`,
        "Usa tres criterios sencillos y describe qué se espera en cada uno."].filter(Boolean).join("\n"),
    };

    try {
      const draft = await activityRequest<ActivityAgentDraft>("/api/ai/activity-draft", activityJson("POST", input));
      const criteria = draft.rubric?.length ? draft.rubric : draft.instructions.map(step => ({
        name: step.titulo, description: step.descripcion, points: step.puntaje,
      }));
      const rubric = criteria.slice(0, 5).map(item => ({
        name: item.name.slice(0, 100),
        description: item.description.replace(/\s+/g, " ").slice(0, 500),
        points: Math.max(1, Math.round(item.points) || 10),
      }));
      setDraftSource(draft.source);
      if (!rubric.length) throw new Error("El borrador no contiene criterios.");
      update(target === "rubric" ? { rubric } : {
        rubric,
        title: draft.title.slice(0, 150),
        instructions: [draft.description, ...draft.instructions.map((step, index) =>
          `${index + 1}. ${step.titulo}. ${step.descripcion}`)].join("\n\n").slice(0, 6000),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo generar el borrador.");
    } finally {
      setBusy(null);
    }
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setBusy("save");
    setError("");
    try {
      onSave(await activityRequest<ReviewActivity>(activityReviewApi, activityJson("POST", activity)));
      setActivity(initialActivity);
      setObjective("");
      setRubricPrompt("");
      setDraftSource(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la tarea.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <form onSubmit={save} className="space-y-4 rounded-[3px] border border-[#C7CDD1] p-4">
      <h2 className="text-base font-bold">Crear tarea</h2>
      <fieldset disabled={busy !== null} className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <CanvasSelect label="Tipo de actividad" value={activity.type}
            onChange={event => update({ type: event.target.value as ReviewActivityInput["type"] })}
            options={ACTIVITY_TYPES.map(value => ({ value, label: value }))} />
          <CanvasSelect label="Evaluación" value={activity.assessment}
            onChange={event => update({ assessment: event.target.value as ReviewActivityInput["assessment"] })}
            options={[{ value: "nota", label: "Nota" }, { value: "decimas", label: "Décimas" }]} />
          {activity.assessment === "nota"
            ? <CanvasInput label="Punto base" type="number" step="0.1" min="1" max="4" required
                value={Number.isNaN(activity.gradeBase) ? "" : activity.gradeBase}
                onChange={event => update({ gradeBase: event.target.valueAsNumber })} />
            : <CanvasInput label="Tope de décimas" type="number" step="0.1" min="0.1" max="10" required
                value={Number.isNaN(activity.maxDecimas) ? "" : activity.maxDecimas}
                onChange={event => update({ maxDecimas: event.target.valueAsNumber })} />}
        </div>
        <label className="block space-y-1 text-xs font-bold">Qué quieres que hagan los estudiantes
          <textarea rows={2} value={objective} maxLength={500} className={textarea}
            onChange={event => setObjective(event.target.value)} />
        </label>
        <label className="block space-y-1 text-xs font-bold">Contexto del curso (opcional)
          <textarea rows={2} value={activity.context} maxLength={1500} className={textarea}
            onChange={event => update({ context: event.target.value })} />
        </label>
        <CanvasInput label="Indicaciones para la pauta (opcional)" value={rubricPrompt} maxLength={500}
          onChange={event => setRubricPrompt(event.target.value)} placeholder="Ej. Prioriza la justificación técnica" />
        <CanvasButton variant="secondary" onClick={() => void generate("draft")}>
          {busy === "draft" ? "Generando borrador…" : "Generar tarea y pauta"}
        </CanvasButton>
        {draftSource && <p role="status" className="text-xs text-[#6B7780]">
          {draftSource === "ia" ? "Borrador generado por IA. Puedes editarlo antes de publicarlo." : "Borrador generado con una plantilla local. Puedes editarlo antes de publicarlo."}
        </p>}
        <CanvasInput label="Título de la tarea" value={activity.title} maxLength={150} required
          onChange={event => update({ title: event.target.value })} />
        <label className="block space-y-1 text-xs font-bold">Instrucciones de la tarea
          <textarea rows={5} value={activity.instructions} maxLength={6000} required className={textarea}
            onChange={event => update({ instructions: event.target.value })} />
        </label>
        <section className="space-y-2 rounded-[3px] border border-[#E0E3E6] p-3" aria-label="Pauta de evaluación">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold">Pauta de evaluación · {activityPoints(activity) || 0} puntos</h3>
            <CanvasButton size="sm" variant="secondary" onClick={() => void generate("rubric")}>
              {busy === "rubric" ? "Generando pauta…" : "Generar pauta"}
            </CanvasButton>
          </div>
          {activity.rubric.map((criterion, index) => (
            <div key={index} className="grid items-end gap-2 border-t border-[#E0E3E6] pt-2 sm:grid-cols-[1fr_2fr_5rem_auto]">
              <CanvasInput label={`Criterio ${index + 1}`} value={criterion.name} maxLength={100} required
                onChange={event => update({ rubric: activity.rubric.map((item, i) => i === index ? { ...item, name: event.target.value } : item) })} />
              <CanvasInput label={`Qué se evalúa ${index + 1}`} value={criterion.description} maxLength={500} required
                onChange={event => update({ rubric: activity.rubric.map((item, i) => i === index ? { ...item, description: event.target.value } : item) })} />
              <CanvasInput label={`Puntos ${index + 1}`} type="number" min="1" max="1000" required
                value={Number.isNaN(criterion.points) ? "" : criterion.points}
                onChange={event => update({ rubric: activity.rubric.map((item, i) => i === index ? { ...item, points: event.target.valueAsNumber } : item) })} />
              <CanvasButton variant="secondary" size="sm" disabled={activity.rubric.length === 1}
                aria-label={`Quitar criterio ${index + 1}`} onClick={() => update({ rubric: activity.rubric.filter((_, i) => i !== index) })}>
                Quitar
              </CanvasButton>
            </div>
          ))}
          <CanvasButton variant="secondary" size="sm" disabled={activity.rubric.length >= 5}
            onClick={() => update({ rubric: [...activity.rubric, blankCriterion] })}>
            Añadir criterio
          </CanvasButton>
        </section>
        <CanvasButton type="submit">{busy === "save" ? "Guardando…" : "Publicar tarea"}</CanvasButton>
      </fieldset>
      {error && <p role="alert" className="text-sm text-[#B71C1C]">{error}</p>}
    </form>
  );
}
