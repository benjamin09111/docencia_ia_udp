"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasSelect } from "@/components/canvas/CanvasSelect";
import { activityRequest, activityReviewApi } from "@/services/activityReviewService";
import { ACTIVITY_REVIEW_COURSE_ID, type ReviewActivity } from "@/types/activityReview";
import { ActivityReviewForm } from "./ActivityReviewForm";
import { ActivityReviewHistory } from "./ActivityReviewHistory";

export function ActivityReviewWorkspace() {
  const [activities, setActivities] = useState<ReviewActivity[] | null>(null);
  const [selected, setSelected] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const activity = activities?.find(task => task.id === selected);
  const path = activity ? `/entregas/${activity.id}` : "";
  const endpoint = `${activityReviewApi}/${selected}`;

  useEffect(() => {
    const controller = new AbortController();
    activityRequest<ReviewActivity[]>(activityReviewApi, { signal: controller.signal }).then(tasks => {
      setActivities(tasks);
      setSelected(tasks[0]?.id ?? "");
      setShowForm(tasks.length === 0);
    }).catch(err => {
      if (!controller.signal.aborted) setError(err.message);
    });
    return () => controller.abort();
  }, []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(new URL(path, window.location.origin).href);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5 text-[#2D3B45]">
      <header className="space-y-2 border-b border-[#E0E3E6] pb-4">
        <Link className="text-sm text-[#B71C1C] underline" href={`/docente/cursos/${ACTIVITY_REVIEW_COURSE_ID}`}>
          Arquitectura de Software
        </Link>
        <h1 className="text-2xl font-bold">Actividad y Corrección</h1>
      </header>
      {error && <p role="alert" className="text-sm text-[#B71C1C]">{error}</p>}
      {!error && activities === null && <p role="status">Cargando tareas…</p>}
      {activities !== null && (
        <CanvasButton variant={showForm ? "secondary" : "primary-udp"} onClick={() => setShowForm(value => !value)}>
          {showForm ? "Ocultar formulario" : "+ Crear tarea"}
        </CanvasButton>
      )}
      {showForm && <ActivityReviewForm onSave={task => {
        setActivities(previous => [task, ...(previous ?? [])]);
        setSelected(task.id);
        setCopied(false);
        setShowForm(false);
      }} />}
      {!!activities?.length && (
        <CanvasSelect label="Tarea publicada" value={selected}
          onChange={event => { setSelected(event.target.value); setCopied(false); }}
          options={activities.map(task => ({ value: task.id, label: task.title }))} />
      )}
      {activity && (
        <section className="space-y-4 rounded-[3px] border border-[#C7CDD1] p-4">
          <h2 className="text-lg font-bold">{activity.title}</h2>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <a href={`${endpoint}?pdf=tarea`} className="text-[#B71C1C] underline">Descargar tarea con pauta (PDF)</a>
            <a href={`${endpoint}?pdf=pauta`} className="text-[#B71C1C] underline">Descargar solo pauta (PDF)</a>
            <Link href={path} target="_blank" className="text-[#B71C1C] underline">Enlace de entrega</Link>
            <CanvasButton variant="secondary" size="sm" onClick={() => void copyLink()}>
              {copied ? "Enlace copiado" : "Copiar enlace"}
            </CanvasButton>
          </div>
          <p className="flex items-center gap-2 text-xs text-[#6B7780]"><Lock size={13} /> Cierre automático por fecha · Pendiente</p>
          <ActivityReviewHistory activity={activity} key={activity.id} />
        </section>
      )}
    </div>
  );
}
