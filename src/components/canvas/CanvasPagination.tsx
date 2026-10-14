"use client";

import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import {
  DEFAULT_PAGE_SIZE_OPTIONS,
  getPageItems,
  getRangeLabel,
  getTotalPages,
} from "@/utils/pagination";

export interface CanvasPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: readonly number[];
  disabled?: boolean;
  className?: string;
}

const navBtn =
  "inline-flex items-center justify-center min-w-[32px] h-8 px-2 text-xs font-semibold rounded-[4px] border border-[#C7CDD1] bg-white text-[#2D3B45] hover:bg-[#F5F6F8] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors";

/**
 * CanvasPagination — Paginador canónico y reutilizable (SSOT).
 * - Móvil: anterior / "Página X de Y" / siguiente (objetivos táctiles de 32px+).
 * - Escritorio: números con elipsis, primera/última y selector de tamaño de página.
 */
export const CanvasPagination: React.FC<CanvasPaginationProps> = ({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  disabled = false,
  className = "",
}) => {
  const totalPages = getTotalPages(total, pageSize);
  const { from, to } = getRangeLabel(page, pageSize, total);
  const items = getPageItems(page, totalPages);
  const go = (p: number) => !disabled && p >= 1 && p <= totalPages && p !== page && onPageChange(p);

  return (
    <nav
      aria-label="Paginación"
      className={`flex flex-col sm:flex-row items-center justify-between gap-2 px-3 py-2 bg-[#F5F6F8] border-t border-[#E0E3E6] text-xs text-[#6B7780] ${className}`}
    >
      <div className="flex items-center gap-3">
        <span>
          {total === 0 ? "Sin resultados" : <>Mostrando <b className="text-[#2D3B45]">{from}–{to}</b> de <b className="text-[#2D3B45]">{total}</b></>}
        </span>
        {onPageSizeChange && (
          <label className="hidden sm:flex items-center gap-1">
            <span>Por página</span>
            <select
              value={pageSize}
              disabled={disabled}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-8 px-1 border border-[#C7CDD1] rounded-[4px] bg-white text-[#2D3B45] font-semibold cursor-pointer"
            >
              {pageSizeOptions.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button type="button" className={`${navBtn} hidden sm:inline-flex`} onClick={() => go(1)} disabled={disabled || page <= 1} aria-label="Primera página">
          <ChevronsLeft size={14} />
        </button>
        <button type="button" className={navBtn} onClick={() => go(page - 1)} disabled={disabled || page <= 1} aria-label="Página anterior">
          <ChevronLeft size={14} />
        </button>

        <span className="sm:hidden px-2 font-semibold text-[#2D3B45]">Página {page} de {totalPages}</span>

        <div className="hidden sm:flex items-center gap-1">
          {items.map((it) =>
            typeof it === "number" ? (
              <button
                key={it}
                type="button"
                onClick={() => go(it)}
                disabled={disabled}
                aria-current={it === page ? "page" : undefined}
                className={`${navBtn} ${it === page ? "!bg-[#2D3B45] !text-white !border-[#2D3B45]" : ""}`}
              >
                {it}
              </button>
            ) : (
              <span key={it} className="px-1 select-none">…</span>
            )
          )}
        </div>

        <button type="button" className={navBtn} onClick={() => go(page + 1)} disabled={disabled || page >= totalPages} aria-label="Página siguiente">
          <ChevronRight size={14} />
        </button>
        <button type="button" className={`${navBtn} hidden sm:inline-flex`} onClick={() => go(totalPages)} disabled={disabled || page >= totalPages} aria-label="Última página">
          <ChevronsRight size={14} />
        </button>
      </div>
    </nav>
  );
};
