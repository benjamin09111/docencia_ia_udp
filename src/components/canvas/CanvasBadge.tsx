import React from "react";

export type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral" | "udp";

interface CanvasBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  size?: "sm" | "md";
}

export const CanvasBadge: React.FC<CanvasBadgeProps> = ({
  children,
  variant = "neutral",
  className = "",
  size = "sm",
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    success: "bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]",
    warning: "bg-[#FFF8E1] text-[#F57F17] border-[#FFE082]",
    danger: "bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2]",
    info: "bg-[#E3F2FD] text-[#0277BD] border-[#B3E5FC]",
    neutral: "bg-[#F5F6F8] text-[#55636E] border-[#E0E3E6]",
    udp: "bg-[#FFEBEE] text-[#C8102E] border-[#FFCDD2] font-semibold",
  };

  const sizeStyles = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-[3px] border ${variantStyles[variant]} ${sizeStyles} ${className}`}
    >
      {children}
    </span>
  );
};
