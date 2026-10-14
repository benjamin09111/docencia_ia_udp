export type PageItem = number | "ellipsis-start" | "ellipsis-end";

export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

/** Total de páginas (mínimo 1, aunque no haya resultados). */
export function getTotalPages(total: number, pageSize: number): number {
  return Math.max(1, Math.ceil(Math.max(0, total) / Math.max(1, pageSize)));
}

/** Limita una página al rango válido [1, totalPages]. */
export function clampPage(page: number, totalPages: number): number {
  return Math.min(Math.max(1, Math.floor(page) || 1), totalPages);
}

/**
 * Ventana de páginas con elipsis: 1 … 4 5 [6] 7 8 … 20
 * Siempre muestra primera, última y `siblings` vecinas de la actual.
 */
export function getPageItems(current: number, totalPages: number, siblings = 1): PageItem[] {
  const maxVisible = 5 + siblings * 2;
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const left = Math.max(current - siblings, 2);
  const right = Math.min(current + siblings, totalPages - 1);
  const items: PageItem[] = [1];

  if (left > 2) items.push("ellipsis-start");
  for (let p = left; p <= right; p++) items.push(p);
  if (right < totalPages - 1) items.push("ellipsis-end");

  items.push(totalPages);
  return items;
}

/** Rango "mostrando X–Y de Z" (base 1). */
export function getRangeLabel(page: number, pageSize: number, total: number): { from: number; to: number } {
  if (total <= 0) return { from: 0, to: 0 };
  const from = (page - 1) * pageSize + 1;
  return { from, to: Math.min(page * pageSize, total) };
}
