import React, { forwardRef } from "react";

export interface CanvasSelectOption {
  value: string | number;
  label: string;
}

export interface CanvasSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: CanvasSelectOption[];
}

export const CanvasSelect = forwardRef<HTMLSelectElement, CanvasSelectProps>(
  ({ label, error, helperText, options, children, className = "", id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-bold text-[#2D3B45]">
            {label}
            {props.required && <span className="text-[#C8102E] ml-1">*</span>}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`w-full rounded-[4px] border bg-white px-3 py-1.5 text-xs text-[#2D3B45] transition-colors focus:outline-none focus:ring-1 ${
            error
              ? "border-[#C8102E] focus:border-[#C8102E] focus:ring-[#C8102E]"
              : "border-gray-300 focus:border-[#008EE2] focus:ring-[#008EE2]"
          } disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {error ? (
          <p className="text-[11px] text-[#C8102E] font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-[#6B7780]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

CanvasSelect.displayName = "CanvasSelect";
