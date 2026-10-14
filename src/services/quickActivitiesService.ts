import { QuickActivity } from "@/types/quickActivities";

const INITIAL_QUICK_ACTIVITIES: QuickActivity[] = [
  {
    id: "qa_1",
    courseCode: "CIT3000_CA02",
    titulo: "Guía de Ejercicios N°2: Arquitectura en Microservicios y API Gateways",
    descripcion:
      "Estimados estudiantes, adjunto la guía de ejercicios prácticos para la sesión de hoy. Deben analizar los diagramas de componentes de la pág. 3 y responder las 3 preguntas en su cuaderno o reporte digital.",
    tipoRecurso: "archivo",
    archivo: {
      name: "Guia_02_Microservicios_Arquitectura.pdf",
      size: "1.4 MB",
      type: "pdf",
      url: "#",
    },
    fechaPublicacion: "Hoy, 10:15",
    fechaLimite: "2026-04-24",
    estado: "publicada",
    autor: "Profesor de Cátedra",
    visitasCount: 28,
  },
  {
    id: "qa_2",
    courseCode: "CIT3000_CA02",
    titulo: "Enunciado Taller Práctico: Despliegue con Docker Compose",
    descripcion:
      "Aquí tienen el archivo con las instrucciones para levantar los tres contenedores (PostgreSQL, FastAPI y React). Sigan las instrucciones del paso a paso y verifiquen los logs en consola.",
    tipoRecurso: "archivo",
    archivo: {
      name: "Taller_Docker_Compose_Instrucciones.pdf",
      size: "920 KB",
      type: "pdf",
      url: "#",
    },
    fechaPublicacion: "Ayer, 16:30",
    fechaLimite: "2026-04-21",
    estado: "publicada",
    autor: "Ayudante Docente",
    visitasCount: 34,
  },
  {
    id: "qa_3",
    courseCode: "CIT3000_CA02",
    titulo: "Lectura y Ejercicios: Patrones de Resiliencia en Cloud (Circuit Breaker)",
    descripcion:
      "Revisen el material en este enlace con casos de estudio y código de ejemplo sobre tolerancia a fallos. Traer dudas preparadas para la sesión del miércoles.",
    tipoRecurso: "link",
    enlaceUrl: "https://drive.google.com/file/d/1ab2c3d4e5f_resilience_cloud/view",
    enlaceTexto: "Carpeta Drive: Patrones de Resiliencia Cloud (UDP)",
    fechaPublicacion: "12 Oct 2026",
    estado: "publicada",
    autor: "Profesor de Cátedra",
    visitasCount: 19,
  },
];

const STORAGE_PREFIX = "udp_quick_activities_";

export function getStoredQuickActivities(courseCode: string): QuickActivity[] {
  if (typeof window === "undefined") {
    return INITIAL_QUICK_ACTIVITIES;
  }
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${courseCode}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn("Error reading quick activities from localStorage", e);
  }
  return INITIAL_QUICK_ACTIVITIES;
}

export function saveStoredQuickActivities(courseCode: string, items: QuickActivity[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${courseCode}`, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("udp_quick_activities_updated", { detail: { courseCode } }));
  } catch (e) {
    console.warn("Error saving quick activities to localStorage", e);
  }
}

export function createQuickActivity(
  courseCode: string,
  data: Omit<QuickActivity, "id" | "fechaPublicacion" | "visitasCount">
): QuickActivity {
  const current = getStoredQuickActivities(courseCode);
  const now = new Date();
  const dateStr = now.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const newItem: QuickActivity = {
    ...data,
    id: `qa_${Date.now()}`,
    fechaPublicacion: dateStr,
    visitasCount: 0,
  };

  const updated = [newItem, ...current];
  saveStoredQuickActivities(courseCode, updated);
  return newItem;
}

export function updateQuickActivity(courseCode: string, updatedItem: QuickActivity): void {
  const current = getStoredQuickActivities(courseCode);
  const updated = current.map((item) => (item.id === updatedItem.id ? updatedItem : item));
  saveStoredQuickActivities(courseCode, updated);
}

export function deleteQuickActivity(courseCode: string, id: string): void {
  const current = getStoredQuickActivities(courseCode);
  const updated = current.filter((item) => item.id !== id);
  saveStoredQuickActivities(courseCode, updated);
}

export function togglePublishQuickActivity(courseCode: string, id: string): QuickActivity | null {
  const current = getStoredQuickActivities(courseCode);
  let changed: QuickActivity | null = null;
  const updated = current.map((item) => {
    if (item.id === id) {
      const newStatus = item.estado === "publicada" ? "borrador" : "publicada";
      changed = { ...item, estado: newStatus };
      return changed;
    }
    return item;
  });
  if (changed) {
    saveStoredQuickActivities(courseCode, updated);
  }
  return changed;
}
