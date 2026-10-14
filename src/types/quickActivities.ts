export type QuickActivityResourceType = "archivo" | "link";

export interface QuickActivityFile {
  name: string;
  size: string;
  type: "pdf" | "image" | "doc" | "other";
  url?: string;
  previewUrl?: string;
}

export interface QuickActivity {
  id: string;
  courseCode: string;
  courseId?: number;
  titulo: string;
  descripcion: string;
  tipoRecurso: QuickActivityResourceType;
  archivo?: QuickActivityFile;
  enlaceUrl?: string;
  enlaceTexto?: string;
  fechaPublicacion: string;
  fechaLimite?: string;
  estado: "publicada" | "borrador";
  autor?: string;
  visitasCount?: number;
}
