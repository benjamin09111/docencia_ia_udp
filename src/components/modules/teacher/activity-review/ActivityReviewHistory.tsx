"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasInput } from "@/components/canvas/CanvasInput";
import { activityJson, activityRequest, activityReviewApi } from "@/services/activityReviewService";
import { formatActivityValue, type ActivityReviewEntry, type ReviewActivity } from "@/types/activityReview";

const labels = { ia: "Sugerencia de IA", heuristica: "Sugerencia de la corrección heurística", sin_confirmar: "Sugerencia del evaluador" };

function ReviewCard({ activity, review, refresh }: {
  activity: ReviewActivity;
  review: ActivityReviewEntry;
  refresh: () => Promise<void>;
}) {
  const [value, setValue] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const endpoint = `${activityReviewApi}/${activity.id}/revisiones/${review.id}`;
  const canRetry = !review.processing_at || Date.now() - new Date(review.processing_at).getTime() >= 120_000;
  const grade = activity.assessment === "nota";

  async function submit(action: "approve" | "retry", event?: FormEvent) {
    event?.preventDefault();
    setError("");
    setBusy(true);
    try {
      const result = value ?? review.suggested?.value;
      await activityRequest(endpoint, activityJson("PATCH", {
        action, value: result === "" ? null : Number(result),
        feedback: feedback ?? review.suggested?.feedback,
      }));
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar la revisión.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="space-y-3 rounded-[3px] border border-[#E0E3E6] p-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h4 className="font-bold">{review.student_name}</h4>
        <a className="text-[#B71C1C] underline" href={endpoint}>{review.file_name}</a>
      </div>
      <p className="text-xs text-[#6B7780]">{new Date(review.created_at).toLocaleString("es-CL", { timeZone: "America/Santiago" })}</p>
      {review.suggested && (
        <>
          <div><strong>Resumen de la entrega</strong><p>{review.suggested.summary}</p></div>
          {!review.approved_at && <p><strong>{labels[review.suggested.method]}</strong> {formatActivityValue(review.suggested.value, activity.assessment)}</p>}
        </>
      )}
      {review.approved_at && review.final_value !== null ? (
        <div className="rounded border border-[#2E7D32] bg-green-50 p-3">
          <p><strong>Publicado</strong> {formatActivityValue(review.final_value, activity.assessment)}</p>
          <p className="whitespace-pre-wrap">{review.final_feedback}</p>
        </div>
      ) : review.suggested ? (
        <form onSubmit={event => void submit("approve", event)} className="space-y-2">
          <div className="max-w-44">
            <CanvasInput id={`value-${review.id}`} label={grade ? "Nota final" : "Décimas finales"}
              type="number" step="0.1" min={grade ? activity.gradeBase : 0} max={grade ? 7 : activity.maxDecimas}
              value={value ?? review.suggested.value} required onChange={event => setValue(event.target.value)} />
          </div>
          <label className="block space-y-1 text-xs font-bold">Feedback para el estudiante
            <textarea rows={3} required maxLength={1200} value={feedback ?? review.suggested.feedback}
              onChange={event => setFeedback(event.target.value)}
              className="block w-full rounded-[3px] border border-[#C7CDD1] p-2 font-normal" />
          </label>
          <CanvasButton type="submit" disabled={busy}>Aprobar y publicar</CanvasButton>
        </form>
      ) : (
        <div className="space-y-2">
          <p role="status">{review.review_error || "Entrega recibida. Corrección pendiente."}</p>
          {canRetry && <CanvasButton variant="secondary" size="sm" disabled={busy} onClick={() => void submit("retry")}>
            {busy ? "Corrigiendo…" : "Reintentar corrección"}
          </CanvasButton>}
        </div>
      )}
      {error && <p role="alert" className="text-[#B71C1C]">{error}</p>}
    </article>
  );
}

export function ActivityReviewHistory({ activity }: { activity: ReviewActivity }) {
  const [reviews, setReviews] = useState<ActivityReviewEntry[] | null>(null);
  const [error, setError] = useState("");
  const refresh = useCallback(async () => {
    setError("");
    try {
      const result = await activityRequest<{ reviews: ActivityReviewEntry[] }>(`${activityReviewApi}/${activity.id}`);
      setReviews(result.reviews);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo consultar el historial.");
    }
  }, [activity.id]);

  useEffect(() => { void refresh(); }, [refresh]);

  return (
    <section className="space-y-3 text-sm" aria-label="Historial de revisiones">
      <div className="flex flex-wrap justify-between gap-2">
        <h3 className="text-base font-bold">Historial de revisiones</h3>
        <CanvasButton variant="secondary" size="sm" onClick={() => void refresh()}>Actualizar historial</CanvasButton>
      </div>
      {error && <p role="alert" className="text-[#B71C1C]">{error}</p>}
      {!error && reviews === null && <p role="status">Cargando entregas…</p>}
      {reviews?.length === 0 && <p>Aún no hay entregas para esta tarea.</p>}
      {reviews?.map(review => <ReviewCard key={review.id} activity={activity} review={review} refresh={refresh} />)}
    </section>
  );
}
