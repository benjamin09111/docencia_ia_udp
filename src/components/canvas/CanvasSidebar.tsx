"use client";

import React from "react";
import {
  User,
  LayoutDashboard,
  BookOpen,
  Calendar,
  Inbox,
  HelpCircle,
  Bot,
  GraduationCap,
} from "lucide-react";

interface CanvasSidebarProps {
  activeNav: string;
  onNavClick: (nav: string) => void;
  userName?: string;
  userAvatar?: string;
}

export const CanvasSidebar: React.FC<CanvasSidebarProps> = ({
  activeNav,
  onNavClick,
  userName = "Benjamín Morales",
  userAvatar,
}) => {
  const navItems = [
    { id: "dashboard", label: "Tablero", icon: LayoutDashboard },
    { id: "courses", label: "Cursos", icon: BookOpen },
    { id: "docencia_ia", label: "Docencia IA", icon: Bot, isSpecial: true },
    { id: "calendar", label: "Calendario", icon: Calendar },
    { id: "inbox", label: "Bandeja", icon: Inbox },
  ];

  return (
    <aside className="w-[84px] bg-canvas-dark text-white flex flex-col items-center py-2 shrink-0 select-none border-r border-[#1E272E] z-30 min-h-screen">
      {/* UDP Logo / Shield */}
      <div className="mb-2 text-center flex flex-col items-center cursor-pointer group" title="Universidad Diego Portales">
        <div className="w-11 h-11 bg-udp-red rounded-[4px] flex items-center justify-center font-bold text-base tracking-wider text-white shadow-sm border border-red-700">
          UDP
        </div>
        <span className="text-[10px] text-gray-300 font-medium tracking-tight mt-1 opacity-90 group-hover:opacity-100">
          Portal
        </span>
      </div>

      {/* User Account */}
      <button
        onClick={() => onNavClick("account")}
        className={`w-full flex flex-col items-center py-2 px-1 text-center transition-colors relative ${
          activeNav === "account" ? "bg-canvas-darker text-white" : "text-gray-300 hover:bg-canvas-hover"
        }`}
      >
        <div className="w-8 h-8 rounded-full border border-gray-400 overflow-hidden flex items-center justify-center bg-gray-700 mb-1">
          {userAvatar ? (
            <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
          ) : (
            <User size={18} className="text-gray-200" />
          )}
        </div>
        <span className="text-[11px] font-normal leading-tight truncate max-w-[76px]">
          Cuenta
        </span>
      </button>

      {/* Navigation items */}
      <nav className="w-full flex flex-col gap-1 mt-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavClick(item.id)}
              className={`w-full flex flex-col items-center py-2.5 px-1 transition-all relative group ${
                isActive
                  ? "bg-canvas-darker text-white"
                  : "text-gray-300 hover:bg-canvas-hover hover:text-white"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-udp-red" />
              )}
              <div className="relative">
                <Icon
                  size={22}
                  className={
                    item.isSpecial
                      ? "text-udp-red group-hover:scale-105 transition-transform"
                      : isActive
                      ? "text-white"
                      : "text-gray-300 group-hover:text-white"
                  }
                />
                {item.isSpecial && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-udp-red"></span>
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] font-medium leading-tight mt-1 text-center truncate max-w-[76px] ${
                  item.isSpecial ? "text-red-300 font-semibold" : ""
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer / Help */}
      <div className="w-full flex flex-col items-center mt-auto py-2">
        <button
          className="w-full flex flex-col items-center py-2 text-gray-400 hover:text-white hover:bg-canvas-hover transition-colors"
          title="Ayuda CREA UDP"
        >
          <HelpCircle size={20} />
          <span className="text-[10px] mt-1">Ayuda</span>
        </button>
      </div>
    </aside>
  );
};
