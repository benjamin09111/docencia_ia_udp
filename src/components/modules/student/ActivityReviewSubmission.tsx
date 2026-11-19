"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Lock } from "lucide-react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasInput } from "@/components/canvas/CanvasInput";
import { activityRequest, activityReviewApi } from "@/services/activityReviewService";
import { formatActivityValue, MAX_ACTIVITY_PDF_BYTES, type ReviewActivity, type StudentReviewStatus } from "@/types/activityReview";

type StudentPageData = { activity: ReviewActivity; submission: StudentReviewStatus | null };

export function ActivityReviewSubmission({ id }: { id: string }) {
  const endpoint = `${activityReviewApi}/${id}`;
  const [data, setData] = useState<StudentPageData | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const waitingForApproval = Boolean(data?.submission && !data.submission.approved_at);

  const refresh = useCallback(async (signal?: AbortSignal) => {
    try {
      const result = await activityRequest<StudentPageData>(endpoint, { signal });
      if (!result.activity) throw new Error("Abre este enlace con tu cuenta de estudiante.");
      if ("reviews" in result) throw new Error("Abre este enlace con tu cuenta de estudiante.");
      if (!signal?.aborted) {
        setError("");
        setData(result);
      }
    } catch (err) {
      if (!signal?.aborted) setError(err instanceof Error ? err.message : "No se pudo cargar la entrega.");
    }
  }, [endpoint]);

  useEffect(() => {
    const controller = new AbortController();
    void refresh(controller.signal);
    return () => controller.abort();
  }, [refresh]);

  useEffect(() => {
    if (!waitingForApproval) return;
    const controller = new AbortController();
    const interval = setInterval(() => void refresh(controller.signal), 7000);
    return () => { clearInterval(interval); controller.abort(); };
  }, [waitingForApproval, refresh]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const file = form.get("pdf");
    if (!(file instanceof File) || file.size > MAX_ACTIVITY_PDF_BYTES) {
      setError("Elige un PDF de hasta 2 MB.");
      return;
    }
    setBusy(true);
    try {
      await activityRequest(endpoint, { method: "POST", body: form });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar la entrega.");
    } finally {
      setBusy(false);
    }
  }

  const { activity, submission } = data ?? {};
  return (
    <main className="mx-auto max-w-2xl space-y-4 p-6 text-[#2D3B45] sm:p-10">
      <header className="space-y-2 border-b border-[#E0E3E6] pb-4">
        <p className="text-sm text-[#6B7780]">Arquitectura de Software · CIT3000</p>
        <h1 className="text-2xl font-bold">{activity?.title ?? "Entrega de actividad"}</h1>
      </header>
      {error && <p role="alert" className="text-sm text-[#B71C1C]">{error}</p>}
      {!activity && !error && <p role="status">Cargando tarea…</p>}
      {activity && (
        <>
          <p className="whitespace-pre-wrap text-sm">{activity.instructions}</p>
          <a href={`${endpoint}?pdf=tarea`} className="text-sm text-[#B71C1C] underline">Descargar tarea con pauta (PDF)</a>
          <p className="flex items-center gap-2 text-xs text-[#6B7780]"><Lock size={13} /> Cierre por fecha · Pendiente</p>
          {submission ? (
            <section className="space-y-2 rounded-[3px] border border-[#C7CDD1] p-4" aria-live="polite">
              {submission.approved_at && submission.final_value !== null ? (
                <>
                  <h2 className="font-bold">{activity.assessment === "nota" ? "Nota final" : "Décimas finales"} {formatActivityValue(submission.final_value, activity.assessment)}</h2>
                  <p className="whitespace-pre-wrap text-sm">{submission.final_feedback}</p>
                </>
              ) : (
                <>
                  <h2 className="font-bold">Entrega recibida</h2>
                  <p className="text-sm">La calificación aparecerá aquí cuando el docente la apruebe.</p>
                  <CanvasButton size="sm" variant="secondary" onClick={() => void refresh()}>Actualizar estado</CanvasButton>
                </>
              )}
            </section>
          ) : (
            <form onSubmit={submit} className="space-y-3 rounded-[3px] border border-[#C7CDD1] p-4">
              <CanvasInput label="Tu entrega en PDF" name="pdf" type="file" accept=".pdf,application/pdf"
                helperText="Máximo 2 MB y 20 páginas. El texto debe ser seleccionable." disabled={busy} required />
              <CanvasButton type="submit" disabled={busy}>{busy ? "Enviando y revisando…" : "Enviar entrega"}</CanvasButton>
            </form>
          )}
        </>
      )}
    </main>
  );
}
