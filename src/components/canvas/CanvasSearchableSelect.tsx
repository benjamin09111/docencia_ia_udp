"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import { CanvasSearchSelectedCard } from "./CanvasSearchSelectedCard";
import { CanvasSearchDropdownMenu } from "./CanvasSearchDropdownMenu";

export interface CanvasSearchOption {
  value: string | number;
  label: string;
  subLabel?: string;
  badge?: string;
  keywords?: string[];
}

export interface CanvasSearchableSelectProps {
  label?: string;
  placeholder?: string;
  options: CanvasSearchOption[];
  value?: string | number | null;
  onChange: (value: string | number | null, option?: CanvasSearchOption | null) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  noOptionsText?: string;
  selectedCardLabel?: string;
}

const normalize = (str: string) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.\-\s]/g, "");

export const CanvasSearchableSelect: React.FC<CanvasSearchableSelectProps> = ({
  label,
  placeholder = "Escribe para buscar por nombre o RUT...",
  options,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  required = false,
  className = "",
  noOptionsText = "No se encontraron coincidencias.",
  selectedCardLabel = "Estudiante Seleccionado",
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value) || null,
    [options, value]
  );

  const filteredOptions = useMemo(() => {
    const q = normalize(query);
    if (!q) return options.slice(0, 50);
    return options
      .filter((opt) => {
        if (normalize(opt.label).includes(q)) return true;
        if (opt.subLabel && normalize(opt.subLabel).includes(q)) return true;
        if (opt.keywords?.some((k) => normalize(k).includes(q))) return true;
        return false;
      })
      .slice(0, 50);
  }, [options, query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (opt: CanvasSearchOption) => {
      onChange(opt.value, opt);
      setQuery("");
      setIsOpen(false);
    },
    [onChange]
  );

  const handleClear = useCallback(() => {
    onChange(null, null);
    setQuery("");
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [onChange]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredOptions[highlightedIndex]) {
        handleSelect(filteredOptions[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`w-full space-y-1 relative text-xs ${className}`}>
      {label && (
        <label className="block font-bold text-[#2D3B45]">
          {label}
          {required && <span className="text-[#C8102E] ml-1">*</span>}
        </label>
      )}

      {selectedOption ? (
        <CanvasSearchSelectedCard
          cardLabel={selectedCardLabel}
          selectedOption={selectedOption}
          onClear={handleClear}
        />
      ) : (
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            disabled={disabled}
            value={query}
            placeholder={placeholder}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setHighlightedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className={`w-full pl-8 pr-8 py-2 border rounded-[4px] bg-white text-[#2D3B45] text-xs transition-colors focus:outline-none focus:ring-1 ${
              error
                ? "border-[#C8102E] focus:ring-[#C8102E]"
                : "border-gray-300 focus:border-[#008EE2] focus:ring-[#008EE2]"
            } disabled:bg-gray-100 disabled:cursor-not-allowed`}
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600"
            >
              <X size={13} />
            </button>
          ) : (
            <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" />
          )}

          {isOpen && (
            <CanvasSearchDropdownMenu
              options={filteredOptions}
              highlightedIndex={highlightedIndex}
              noOptionsText={noOptionsText}
              onSelect={handleSelect}
              onHighlight={setHighlightedIndex}
            />
          )}
        </div>
      )}

      {error ? (
        <p className="text-[11px] text-[#C8102E] font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-[#6B7780]">{helperText}</p>
      ) : null}
    </div>
  );
};
