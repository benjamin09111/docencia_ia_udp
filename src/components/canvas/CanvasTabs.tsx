"use client";

import React from "react";

export interface CanvasTabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

export interface CanvasTabsProps {
  tabs: CanvasTabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const CanvasTabs: React.FC<CanvasTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = "",
}) => {
  return (
    <div className={`bg-white border border-[#E0E3E6] rounded-[4px] shadow-xs px-2 pt-1.5 ${className}`}>
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-nowrap border-b border-gray-200 pb-0 text-xs font-medium">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`px-3 py-2 border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "border-[#008EE2] text-[#008EE2] font-bold bg-blue-50/40 rounded-t-[3px]"
                  : "border-transparent text-[#6B7780] hover:text-[#2D3B45] hover:bg-gray-50"
              }`}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge && <span className="ml-1 shrink-0">{tab.badge}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
