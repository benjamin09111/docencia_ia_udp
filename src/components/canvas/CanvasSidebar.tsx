"use client";

import React from "react";
import { UserRole } from "@/types";
import {
  User,
  Sparkles,
  School,
  GraduationCap,
  Gauge,
  Calendar,
  Inbox,
  HelpCircle,
  ChevronLeft,
} from "lucide-react";

interface CanvasSidebarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeNav?: string;
  onNavClick?: (nav: string) => void;
  userName?: string;
  userAvatar?: string;
}

export const CanvasSidebar: React.FC<CanvasSidebarProps> = ({
  currentRole,
  onRoleChange,
  activeNav,
  onNavClick,
  userName = "Benjamín Morales",
  userAvatar,
}) => {
  const roleViews: { id: UserRole; label: string; icon: any; title: string }[] = [
    { id: "admin", label: "UDP IA", icon: Sparkles, title: "Administración global & Gestión de agentes IA" },
    { id: "teacher", label: "Docencia", icon: School, title: "Docencia: Profesores y Ayudantes" },
    { id: "student", label: "Aprendizaje con IA", icon: GraduationCap, title: "Estudiantes: Aprendizaje guiado y retroalimentación IA" },
  ];

  // Utilidades institucionales estándar de Canvas LMS
  const institutionalTools = [
    { id: "dashboard", label: "Tablero", icon: Gauge },
    { id: "calendar", label: "Calendario", icon: Calendar },
    { id: "inbox", label: "Bandeja", icon: Inbox, badge: "66" },
    { id: "help", label: "Ayuda", icon: HelpCircle, badge: "1" },
  ];

  const handleRoleSelect = (role: UserRole) => {
    onRoleChange(role);
    onNavClick?.(role);
  };

  return (
    <aside
      aria-label="Navegación global"
      className="w-16 sm:w-20 md:w-[84px] bg-[#424242] text-white flex flex-col items-center py-2 shrink-0 select-none border-r border-[#333333] z-30 sticky top-0 h-screen overflow-y-auto no-scrollbar"
    >
      {/* Logotipo UDP en blanco estilo Canvas (#header) */}
      <div
        className="mb-2 text-center flex flex-col items-center cursor-pointer group px-2"
        onClick={() => handleRoleSelect("teacher")}
        title="Universidad Diego Portales - Canvas LMS"
      >
        <div className="flex items-center gap-0.5 text-white font-bold text-sm tracking-tight hover:opacity-90">
          <span className="text-white text-base font-black">@</span>
          <span className="text-white text-sm font-extrabold tracking-wider">udp</span>
        </div>
      </div>

      {/* Cuenta del usuario */}
      <button
        type="button"
        onClick={() => onNavClick?.("account")}
        className={`w-full flex flex-col items-center py-1.5 px-1 text-center transition-colors relative group cursor-pointer ${
          activeNav === "account" ? "bg-white text-[#B71C1C]" : "text-gray-200 hover:bg-[#333333]"
        }`}
        title={`Cuenta oficial: ${userName}`}
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-full border border-gray-400 overflow-hidden flex items-center justify-center bg-gray-600">
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
            ) : (
              <User size={18} className="text-white" />
            )}
          </div>
          <span className="absolute -top-1 -right-1 bg-[#B71C1C] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white">
            1
          </span>
        </div>
        <span className="text-[10px] md:text-[11px] font-medium leading-tight truncate mt-1">
          Cuenta
        </span>
      </button>

      {/* SECCIÓN PRINCIPAL: 3 VISTAS DEL ECOSISTEMA */}
      <nav className="w-full flex flex-col mt-1 space-y-0.5" aria-label="Vistas del sistema">
        {roleViews.map((item) => {
          const Icon = item.icon;
          const isActive = currentRole === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleRoleSelect(item.id)}
              className={`w-full flex flex-col items-center py-2 px-1 transition-all relative group cursor-pointer ${
                isActive
                  ? "bg-white text-[#B71C1C] shadow-xs font-semibold"
                  : "text-gray-200 hover:bg-[#333333] hover:text-white"
              }`}
              title={item.title}
            >
              <div className="relative">
                <Icon
                  size={22}
                  className={isActive ? "text-[#B71C1C]" : "text-gray-300 group-hover:text-white"}
                />
              </div>
              <span
                className={`text-[10px] md:text-[11px] font-normal leading-tight mt-1 text-center truncate max-w-[76px] ${
                  isActive ? "text-[#B71C1C] font-semibold" : "text-gray-200"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Separador sutil */}
      <div className="w-8 h-[1px] bg-white/20 my-2" />

      {/* Utilidades de Canvas LMS */}
      <div className="w-full flex flex-col space-y-0.5">
        {institutionalTools.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavClick?.(item.id)}
              className={`w-full flex flex-col items-center py-2 px-1 transition-all relative group cursor-pointer ${
                isActive
                  ? "bg-white text-[#B71C1C] shadow-xs font-semibold"
                  : "text-gray-200 hover:bg-[#333333] hover:text-white"
              }`}
              title={item.label}
            >
              <div className="relative">
                <Icon
                  size={20}
                  className={isActive ? "text-[#B71C1C]" : "text-gray-400 group-hover:text-white"}
                />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 bg-[#B71C1C] text-white text-[9px] font-bold rounded-full px-1 min-w-[14px] h-[14px] flex items-center justify-center border border-[#424242]">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-normal leading-tight mt-1 text-center truncate max-w-[76px] text-gray-300">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Flecha colapsar al fondo */}
      <div className="w-full flex flex-col items-center mt-auto pt-2 pb-1 border-t border-[#555555]/50">
        <button
          type="button"
          className="text-gray-400 hover:text-white p-1 rounded hover:bg-[#333333] transition-colors"
          title="Minimizar navegación global"
        >
          <ChevronLeft size={18} />
        </button>
      </div>
    </aside>
  );
};
