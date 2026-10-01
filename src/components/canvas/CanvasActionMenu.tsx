"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";

export interface ActionMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
  disabled?: boolean;
}

interface CanvasActionMenuProps {
  items: ActionMenuItem[];
  ariaLabel?: string;
  align?: "left" | "right";
}

export const CanvasActionMenu: React.FC<CanvasActionMenuProps> = ({
  items,
  ariaLabel = "Acciones",
  align = "right",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        aria-label={ariaLabel}
        className={`p-1.5 rounded-[4px] border transition-colors flex items-center justify-center ${
          isOpen
            ? "bg-gray-100 border-gray-300 text-[#2D3B45]"
            : "border-transparent hover:border-gray-300 hover:bg-gray-50 text-[#55636E] hover:text-[#2D3B45]"
        }`}
        title="Opciones"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } mt-1 w-48 rounded-[4px] bg-white border border-[#E0E3E6] shadow-lg py-1 z-40 animate-scaleUp`}
          style={{ transformOrigin: align === "right" ? "top right" : "top left" }}
        >
          {items.map((item, idx) => (
            <button
              key={idx}
              type="button"
              disabled={item.disabled}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                item.onClick();
              }}
              className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 transition-colors ${
                item.disabled
                  ? "opacity-50 cursor-not-allowed text-gray-400"
                  : item.variant === "danger"
                  ? "text-red-700 hover:bg-red-50"
                  : "text-[#2D3B45] hover:bg-[#F5F6F8] hover:text-[#008EE2]"
              }`}
            >
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
