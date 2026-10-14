import { BaseOfficialCourse, OfficialMaterial } from "@/types/officialMaterials";
import { BASE_OFFICIAL_COURSES, INITIAL_OFFICIAL_MATERIALS } from "@/constants/initialOfficialMaterials";

const STORAGE_KEY = "udp_official_materials_v1";

export function getOfficialCourses(): BaseOfficialCourse[] {
  return BASE_OFFICIAL_COURSES;
}

export function getStoredOfficialMaterials(): OfficialMaterial[] {
  if (typeof window === "undefined") {
    return INITIAL_OFFICIAL_MATERIALS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_OFFICIAL_MATERIALS));
      return INITIAL_OFFICIAL_MATERIALS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_OFFICIAL_MATERIALS;
  } catch {
    return INITIAL_OFFICIAL_MATERIALS;
  }
}

export function saveStoredOfficialMaterials(materials: OfficialMaterial[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(materials));
    window.dispatchEvent(new Event("udp_official_materials_updated"));
  } catch (e) {
    console.error("Error guardando materiales oficiales en localStorage:", e);
  }
}

export function addOfficialMaterial(
  payload: Omit<OfficialMaterial, "id" | "updatedAt" | "syncedSections">
): OfficialMaterial {
  const current = getStoredOfficialMaterials();
  const course = BASE_OFFICIAL_COURSES.find((c) => c.code === payload.courseCode);
  const totalSec = course ? course.totalSections : payload.totalSections;

  const newDoc: OfficialMaterial = {
    ...payload,
    id: `mat_${payload.courseCode.toLowerCase()}_${Date.now()}`,
    updatedAt: new Date().toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" }),
    syncedSections: payload.isCanvasPublished ? totalSec : 0,
    totalSections: totalSec,
  };

  const updated = [newDoc, ...current];
  saveStoredOfficialMaterials(updated);
  return newDoc;
}

export function toggleCanvasPublish(materialId: string): OfficialMaterial[] {
  const current = getStoredOfficialMaterials();
  const updated = current.map((mat) => {
    if (mat.id !== materialId) return mat;
    const nextState = !mat.isCanvasPublished;
    return {
      ...mat,
      isCanvasPublished: nextState,
      syncedSections: nextState ? mat.totalSections : 0,
      updatedAt: new Date().toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" }),
    };
  });

  saveStoredOfficialMaterials(updated);
  return updated;
}

export function deleteOfficialMaterial(materialId: string): OfficialMaterial[] {
  const current = getStoredOfficialMaterials();
  const updated = current.filter((mat) => mat.id !== materialId);
  saveStoredOfficialMaterials(updated);
  return updated;
}
