import { useCallback, useEffect, useRef, useState } from "react";
import { clampPage, getTotalPages } from "@/utils/pagination";

export interface PageResult<T> {
  rows: T[];
  total: number;
}

interface Options {
  pageSize?: number;
  /** Recarga silenciosa (sin parpadeo) cada N ms. */
  refreshMs?: number;
  /** Si es false no consulta (p. ej. mientras falta un filtro obligatorio). */
  enabled?: boolean;
}

/**
 * usePaginatedQuery — paginación del lado del servidor, reutilizable.
 * - Cambiar los filtros vuelve a la página 1.
 * - Ignora respuestas atrasadas (carrera entre peticiones).
 * - Si el total baja y la página queda fuera de rango, retrocede sola.
 */
export function usePaginatedQuery<T, F>(
  fetcher: (args: { page: number; pageSize: number; filters: F }) => Promise<PageResult<T>>,
  filters: F,
  { pageSize: initialPageSize = 25, refreshMs, enabled = true }: Options = {}
) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialPageSize);
  const [result, setResult] = useState<PageResult<T>>({ rows: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const requestId = useRef(0);
  const filtersKey = JSON.stringify(filters);
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  useEffect(() => {
    setPage(1);
  }, [filtersKey]);

  const load = useCallback(
    async (silent: boolean) => {
      if (!enabled) return;
      const id = ++requestId.current;
      if (!silent) setLoading(true);
      try {
        const data = await fetcherRef.current({ page, pageSize, filters: filtersRef.current });
        if (id !== requestId.current) return;
        setResult(data);
        setError(false);
        const last = getTotalPages(data.total, pageSize);
        if (page > last) setPage(clampPage(page, last));
      } catch {
        if (id === requestId.current) setError(true);
      } finally {
        if (id === requestId.current && !silent) setLoading(false);
      }
    },
    [enabled, page, pageSize, filtersKey] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    load(false);
  }, [load]);

  useEffect(() => {
    if (!refreshMs || !enabled) return;
    const t = setInterval(() => load(true), refreshMs);
    return () => clearInterval(t);
  }, [load, refreshMs, enabled]);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setPage(1);
  }, []);

  return {
    rows: result.rows,
    total: result.total,
    page,
    pageSize,
    loading,
    error,
    setPage,
    setPageSize,
    reload: () => load(false),
  };
}
