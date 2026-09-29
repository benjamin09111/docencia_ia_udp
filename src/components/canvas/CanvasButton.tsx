import React from "react";

export type ButtonVariant = "primary-udp" | "primary-canvas" | "secondary" | "outline" | "ghost";

interface CanvasButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export const CanvasButton: React.FC<CanvasButtonProps> = ({
  children,
  variant = "primary-udp",
  size = "md",
  icon,
  className = "",
  disabled,
  ...props
}) => {
  const variantStyles: Record<ButtonVariant, string> = {
    "primary-udp": "bg-[#C8102E] hover:bg-[#A60D24] text-white border border-[#A60D24] shadow-sm",
    "primary-canvas": "bg-[#008EE2] hover:bg-[#0077BE] text-white border border-[#0077BE] shadow-sm",
    secondary: "bg-[#2D3B45] hover:bg-[#1E272E] text-white border border-[#1E272E] shadow-sm",
    outline: "bg-white hover:bg-gray-50 text-[#2D3B45] border border-[#C7CDD1]",
    ghost: "bg-transparent hover:bg-gray-100 text-[#2D3B45] border-transparent",
  };

  const sizeStyles = {
    sm: "px-2.5 py-1 text-xs gap-1.5",
    md: "px-3.5 py-1.5 text-xs font-semibold gap-2",
    lg: "px-4 py-2 text-sm font-semibold gap-2",
  };

  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-[4px] font-medium transition-all focus:outline-none focus:ring-1 focus:ring-[#008EE2] disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
