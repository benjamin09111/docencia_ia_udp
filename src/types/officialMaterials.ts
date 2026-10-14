export type OfficialMaterialCategory =
  | "syllabus"
  | "guia_proyecto"
  | "rubrica"
  | "plantilla"
  | "politicas"
  | "material_oficial";

export interface OfficialMaterial {
  id: string;
  courseCode: string; // Código base (ej: "CIT3203")
  courseName: string; // Nombre de la asignatura (ej: "Proyecto en TICs II")
  title: string;
  category: OfficialMaterialCategory;
  description: string;
  fileName: string;
  fileSize: string;
  fileExtension: "pdf" | "docx" | "xlsx" | "zip";
  version: string;
  uploadedBy: string;
  updatedAt: string;
  isCanvasPublished: boolean;
  totalSections: number;
  syncedSections: number;
}

export interface BaseOfficialCourse {
  code: string;
  name: string;
  term: string;
  totalSections: number;
  sectionsList: string[]; // ej: ["CA01", "CA02", "CA03"]
  coordinator: string;
}
