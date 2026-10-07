import React from "react";

interface CanvasTableProps {
  children: React.ReactNode;
  className?: string;
  tableClassName?: string;
}

export const CanvasTable: React.FC<CanvasTableProps> = ({ children, className = "", tableClassName = "" }) => {
  return (
    <div className={`overflow-x-auto border border-[#E0E3E6] rounded-[4px] bg-white shadow-canvas-card ${className}`}>
      <table className={`w-full text-left border-collapse text-xs ${tableClassName}`}>
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

export interface CanvasTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const CanvasTableRow: React.FC<CanvasTableRowProps> = ({
  children,
  className = "",
  onClick,
  hoverable = true,
  ...props
}) => {
  return (
    <tr
      onClick={onClick}
      className={`border-b border-[#E0E3E6] transition-colors last:border-b-0 ${
        hoverable ? "hover:bg-[#F9FAFB] cursor-pointer" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
};

export interface CanvasTableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children?: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}

export const CanvasTableCell: React.FC<CanvasTableCellProps> = ({
  children,
  className = "",
  align = "left",
  colSpan,
  ...props
}) => {
  const alignClass = align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";
  return (
    <td
      colSpan={colSpan}
      className={`p-3 text-[#2D3B45] ${alignClass} ${className}`}
      {...props}
    >
      {children}
    </td>
  );
};
