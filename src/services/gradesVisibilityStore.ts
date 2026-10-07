const VISIBILITY_STORAGE_KEY_PREFIX = "udp_hidden_columns_";

export interface ColumnDefinition {
  key: string;
  label: string;
  shortLabel: string;
  weight: string;
}

export const OFFICIAL_GRADE_COLUMNS: ColumnDefinition[] = [
  { key: "solemne_1", label: "Informe Inicial", shortLabel: "Informe Ini", weight: "20%" },
  { key: "decimas", label: "Décimas de Ayudantía", shortLabel: "+Décimas", weight: "Bono" },
  { key: "solemne_2", label: "Solemne Oficial", shortLabel: "Solemne", weight: "20%" },
  { key: "avance_1", label: "Avance 1 Proyecto", shortLabel: "Avance 1", weight: "20%" },
  { key: "avance_2", label: "Avance 2 Proyecto", shortLabel: "Avance 2", weight: "20%" },
  { key: "final", label: "Entrega Final Proyecto", shortLabel: "Final", weight: "20%" },
];

export function getHiddenColumns(courseCode: string): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(`${VISIBILITY_STORAGE_KEY_PREFIX}${courseCode}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setColumnVisibility(
  courseCode: string,
  columnKey: string,
  isHidden: boolean
): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const current = getHiddenColumns(courseCode);
    const updated = { ...current, [columnKey]: isHidden };
    localStorage.setItem(`${VISIBILITY_STORAGE_KEY_PREFIX}${courseCode}`, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("udp_hidden_columns_updated", { detail: { courseCode, updated } }));
    return updated;
  } catch {
    return {};
  }
}
