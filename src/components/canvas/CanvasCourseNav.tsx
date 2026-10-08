"use client";

import React from "react";
import { EyeOff } from "lucide-react";

export interface CourseNavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  isHiddenForStudents?: boolean;
  badge?: React.ReactNode;
}

interface CanvasCourseNavProps {
  termText?: string;
  sectionText?: string;
  items: CourseNavItem[];
  activeId: string;
  onSelect: (id: string) => void;
  isOpen?: boolean;
  backLink?: {
    label: string;
    onBack: () => void;
  };
  bottomContent?: React.ReactNode;
}

export const CanvasCourseNav: React.FC<CanvasCourseNavProps> = ({
  termText = "2026-2",
  sectionText,
  items,
  activeId,
  onSelect,
  isOpen = true,
  backLink,
  bottomContent,
}) => {
  if (!isOpen) return null;

  return (
    <aside
      aria-label="Menú de navegación del curso"
      className="w-52 sm:w-60 shrink-0 py-2 pr-4 sm:pr-6 hidden md:block select-none sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto no-scrollbar z-10"
    >
      {backLink && (
        <button
          type="button"
          onClick={backLink.onBack}
          className="text-xs text-[#B71C1C] hover:text-[#8B1010] hover:underline flex items-center gap-1.5 px-3 py-1 mb-2 font-semibold transition-colors cursor-pointer"
        >
          <span>←</span>
          <span>{backLink.label}</span>
        </button>
      )}

      {/* Subtítulo de periodo (ej. 2026-2) y sección estilo Canvas en la misma fila */}
      <div className="text-xs font-semibold text-[#6B7780] pb-2.5 px-3 border-b border-[#E0E3E6] mb-2 uppercase tracking-wide flex items-center justify-between">
        <span>{termText}</span>
        {sectionText && (
          <span className="text-[#2D3B45] font-bold tracking-wider">
            {sectionText}
          </span>
        )}
      </div>

      <nav>
        <ul className="space-y-1">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSelect(item.id)}
                  className={`w-full text-left text-sm transition-colors py-2 px-3 flex items-center justify-between group rounded-[2px] cursor-pointer ${
                    isActive
                      ? "font-bold text-[#2D3B45] border-l-[3px] border-[#2D3B45] pl-3.5 bg-gray-50/70"
                      : "text-[#B71C1C] hover:text-[#8B1010] hover:underline"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {item.icon && (
                      <span
                        className={`shrink-0 transition-colors ${
                          isActive
                            ? "text-[#2D3B45]"
                            : "text-[#B71C1C] group-hover:text-[#8B1010]"
                        }`}
                      >
                        {item.icon}
                      </span>
                    )}
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {item.badge}
                    {item.isHiddenForStudents && (
                      <span title="Oculto para los estudiantes">
                        <EyeOff
                          size={14}
                          className="text-[#6B7780] group-hover:text-gray-500"
                        />
                      </span>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {bottomContent && (
        <div className="mt-4 pt-3 border-t border-[#E0E3E6]">
          {bottomContent}
        </div>
      )}
    </aside>
  );
};
