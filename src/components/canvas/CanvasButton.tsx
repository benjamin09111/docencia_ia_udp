"use client";

import React from "react";

export type ButtonVariant =
  | "primary"
  | "primary-udp"
  | "primary-canvas"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "dark";

export interface CanvasButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

/**
 * CanvasButton — Componente Canónico Único de Botones (SSOT)
 * Estricto estándar Canvas Instructure + Identidad UDP:
 * - primary / primary-udp: Rojo oficial UDP #B71C1C (hover #A60D24), texto blanco
 * - secondary: Gris clásico Canvas #F5F6F8 (hover #E8EAED), borde #C7CDD1, texto #2D3B45
 * - primary-canvas: Azul Canvas #008EE2 (hover #0077BE), texto blanco
 * - outline: Fondo blanco #FFFFFF, borde #C7CDD1, texto #2D3B45
 * - ghost: Fondo transparente, texto #2D3B45
 * - danger: Rojo alerta #C8102E, texto blanco
 */
export const CanvasButton: React.FC<CanvasButtonProps> = ({
  children,
  variant = "primary-udp",
  size = "md",
  icon,
  className = "",
  disabled,
  type = "button",
  ...props
}) => {
  const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-[#B71C1C] hover:bg-[#A60D24] text-white border border-[#A60D24] shadow-2xs font-bold",
    "primary-udp": "bg-[#B71C1C] hover:bg-[#A60D24] text-white border border-[#A60D24] shadow-2xs font-bold",
    "primary-canvas": "bg-[#008EE2] hover:bg-[#0077BE] text-white border border-[#0077BE] shadow-2xs font-bold",
    secondary: "bg-[#F5F6F8] hover:bg-[#E8EAED] text-[#2D3B45] border border-[#C7CDD1] shadow-2xs font-medium",
    outline: "bg-white hover:bg-[#F5F6F8] text-[#2D3B45] border border-[#C7CDD1] shadow-2xs font-medium",
    ghost: "bg-transparent hover:bg-gray-100 text-[#2D3B45] border-transparent font-medium",
    danger: "bg-[#C8102E] hover:bg-[#A00C24] text-white border border-[#A00C24] shadow-2xs font-bold",
    dark: "bg-[#2D3B45] hover:bg-[#1E272E] text-white border border-[#1E272E] shadow-2xs font-bold",
  };

  const sizeStyles = {
    sm: "px-2.5 py-1 text-xs gap-1.5 min-h-[30px]",
    md: "px-3.5 py-1.5 text-xs sm:text-[13px] gap-2 min-h-[36px]",
    lg: "px-4 py-2 text-sm gap-2 min-h-[40px]",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-[3px] transition-colors focus:outline-none focus:ring-1 focus:ring-[#008EE2] disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0 flex items-center justify-center">{icon}</span>}
      {children && <span className="truncate">{children}</span>}
    </button>
  );
};
