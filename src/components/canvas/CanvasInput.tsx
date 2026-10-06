import React, { forwardRef } from "react";

export interface CanvasInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const CanvasInput = forwardRef<HTMLInputElement, CanvasInputProps>(
  ({ label, error, helperText, icon, className = "", id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-bold text-[#2D3B45]">
            {label}
            {props.required && <span className="text-[#C8102E] ml-1">*</span>}
          </label>
        )}
        <div className="relative rounded-[4px]">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full rounded-[4px] border bg-white text-xs text-[#2D3B45] transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
              icon ? "pl-8 pr-3 py-1.5" : "px-3 py-1.5"
            } ${
              error
                ? "border-[#C8102E] focus:border-[#C8102E] focus:ring-[#C8102E]"
                : "border-gray-300 focus:border-[#008EE2] focus:ring-[#008EE2]"
            } disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
            {...props}
          />
        </div>
        {error ? (
          <p className="text-[11px] text-[#C8102E] font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-[#6B7780]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

CanvasInput.displayName = "CanvasInput";
