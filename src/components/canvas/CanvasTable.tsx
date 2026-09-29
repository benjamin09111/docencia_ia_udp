import React from "react";

interface CanvasTableProps {
  children: React.ReactNode;
  className?: string;
}

export const CanvasTable: React.FC<CanvasTableProps> = ({ children, className = "" }) => {
  return (
    <div className={`overflow-x-auto border border-[#E0E3E6] rounded-[4px] bg-white shadow-canvas-card ${className}`}>
      <table className="w-full text-left border-collapse text-xs">
        {children}
      </table>
    </div>
  );
};

export const CanvasTableHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  return (
    <thead className={`bg-[#F5F6F8] border-b border-[#E0E3E6] text-[11px] font-bold uppercase tracking-wider text-[#6B7780] ${className}`}>
      {children}
    </thead>
  );
};

export const CanvasTableRow: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}> = ({ children, className = "", onClick, hoverable = true }) => {
  return (
    <tr
      onClick={onClick}
      className={`border-b border-[#E0E3E6] transition-colors last:border-b-0 ${
        hoverable ? "hover:bg-[#F9FAFB] cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </tr>
  );
};

export const CanvasTableCell: React.FC<{
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}> = ({ children, className = "", align = "left" }) => {
  const alignClass = align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";
  return (
    <td className={`p-3 text-[#2D3B45] ${alignClass} ${className}`}>
      {children}
    </td>
  );
};
