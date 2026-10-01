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
    <aside className="w-14 sm:w-16 md:w-[84px] bg-canvas-dark text-white flex flex-col items-center py-2 shrink-0 select-none border-r border-[#1E272E] z-30 sticky top-0 h-screen overflow-y-auto no-scrollbar">
      {/* UDP Logo / Shield */}
      <div className="mb-2 text-center flex flex-col items-center cursor-pointer group" title="Universidad Diego Portales">
        <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 bg-udp-red rounded-[4px] flex items-center justify-center font-bold text-xs sm:text-sm md:text-base tracking-wider text-white shadow-sm border border-red-700">
          UDP
        </div>
        <span className="text-[9px] md:text-[10px] text-gray-300 font-medium tracking-tight mt-1 opacity-90 group-hover:opacity-100 hidden sm:block">
          Portal
        </span>
      </div>

      {/* User Account */}
      <button
        onClick={() => onNavClick("account")}
        className={`w-full flex flex-col items-center py-1.5 sm:py-2 px-1 text-center transition-colors relative ${
          activeNav === "account" ? "bg-canvas-darker text-white" : "text-gray-300 hover:bg-canvas-hover"
        }`}
      >
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-400 overflow-hidden flex items-center justify-center bg-gray-700 mb-1">
          {userAvatar ? (
            <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
          ) : (
            <User size={16} className="text-gray-200" />
          )}
        </div>
        <span className="text-[10px] md:text-[11px] font-normal leading-tight truncate max-w-[48px] sm:max-w-[58px] md:max-w-[76px] hidden sm:block">
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
              className={`w-full flex flex-col items-center py-2 sm:py-2.5 px-1 transition-all relative group ${
                isActive
                  ? "bg-canvas-darker text-white"
                  : "text-gray-300 hover:bg-canvas-hover hover:text-white"
              }`}
              title={item.label}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-udp-red" />
              )}
              <div className="relative">
                <Icon
                  size={20}
                  className={`md:w-[22px] md:h-[22px] ${
                    item.isSpecial
                      ? "text-udp-red group-hover:scale-105 transition-transform"
                      : isActive
                      ? "text-white"
                      : "text-gray-300 group-hover:text-white"
                  }`}
                />
                {item.isSpecial && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-udp-red"></span>
                  </span>
                )}
              </div>
              <span
                className={`text-[9px] md:text-[11px] font-medium leading-tight mt-1 text-center truncate max-w-[48px] sm:max-w-[58px] md:max-w-[76px] hidden sm:block ${
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
          className="w-full flex flex-col items-center py-1.5 sm:py-2 text-gray-400 hover:text-white hover:bg-canvas-hover transition-colors"
          title="Ayuda CREA UDP"
        >
          <HelpCircle size={18} className="md:w-5 md:h-5" />
          <span className="text-[9px] md:text-[10px] mt-1 hidden sm:block">Ayuda</span>
        </button>
      </div>
    </aside>
  );
};
