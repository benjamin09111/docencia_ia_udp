"use client";

import React, { useState } from "react";
import { UserRole } from "@/types";
import { useRouter, usePathname } from "next/navigation";
import { User, Sparkles, School, GraduationCap, Gauge, Calendar, Inbox, HelpCircle, ChevronLeft } from "lucide-react";
import { CanvasAccountModal } from "./CanvasAccountModal";

interface CanvasSidebarProps {
  currentRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
  activeNav?: string;
  onNavClick?: (nav: string) => void;
  userName?: string;
  userAvatar?: string;
}

export const CanvasSidebar: React.FC<CanvasSidebarProps> = ({
  currentRole = "admin",
  onRoleChange,
  activeNav,
  onNavClick,
  userName = "Benjamín Morales",
  userAvatar,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [showAccountModal, setShowAccountModal] = useState(false);

  const effectiveRole: UserRole = pathname?.startsWith("/admin")
    ? "admin"
    : pathname?.startsWith("/docente")
    ? "teacher"
    : pathname?.startsWith("/estudiante")
    ? "student"
    : currentRole;

  const roleViews = [
    { id: "admin" as const, label: "UDP IA", icon: Sparkles, title: "Administración global & Gestión de agentes IA", route: "/admin" },
    { id: "teacher" as const, label: "Docencia", icon: School, title: "Docencia: Profesores y Ayudantes", route: "/docente" },
    { id: "student" as const, label: "Aprendizaje con IA", icon: GraduationCap, title: "Estudiantes: Aprendizaje guiado y retroalimentación IA", route: "/estudiante" },
  ];

  const institutionalTools = [
    { id: "dashboard", label: "Tablero", icon: Gauge },
    { id: "calendar", label: "Calendario", icon: Calendar },
    { id: "inbox", label: "Bandeja", icon: Inbox, badge: "66" },
    { id: "help", label: "Ayuda", icon: HelpCircle, badge: "1" },
  ];

  const handleRoleSelect = (item: (typeof roleViews)[0]) => {
    onRoleChange?.(item.id);
    onNavClick?.(item.id);
    router.push(item.route);
  };

  const handleAccountClick = () => {
    setShowAccountModal(true);
    onNavClick?.("account");
  };

  return (
    <>
      <aside
        aria-label="Navegación global"
        className="w-16 sm:w-20 md:w-[84px] bg-[#424242] text-white flex flex-col items-center py-2 shrink-0 select-none border-r border-[#333333] z-30 sticky top-0 h-screen overflow-y-auto no-scrollbar"
      >
        <div
          className="mb-2 text-center flex flex-col items-center cursor-pointer group px-2"
          onClick={() => router.push("/docente")}
          title="Universidad Diego Portales - Canvas LMS"
        >
          <div className="flex items-center gap-0.5 text-white font-bold text-sm tracking-tight hover:opacity-90">
            <span className="text-white text-base font-black">@</span>
            <span className="text-white text-sm font-extrabold tracking-wider">udp</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAccountClick}
          className={`w-full flex flex-col items-center py-1.5 px-1 text-center transition-colors relative group cursor-pointer ${
            activeNav === "account" || showAccountModal ? "bg-white text-[#B71C1C]" : "text-gray-200 hover:bg-[#333333]"
          }`}
          title={`Cuenta institucional: ${userName}`}
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full border border-gray-400 overflow-hidden flex items-center justify-center bg-gray-600">
              {userAvatar ? <img src={userAvatar} alt={userName} className="w-full h-full object-cover" /> : <User size={18} className="text-white" />}
            </div>
            <span className="absolute -top-1 -right-1 bg-[#B71C1C] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white">
              1
            </span>
          </div>
          <span className="text-[10px] md:text-[11px] font-medium leading-tight truncate mt-1">Cuenta</span>
        </button>

        <nav className="w-full flex flex-col mt-1 space-y-0.5" aria-label="Vistas del sistema">
          {roleViews.map((item) => {
            const Icon = item.icon;
            const isActive = effectiveRole === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleRoleSelect(item)}
                className={`w-full flex flex-col items-center py-2 px-1 transition-all relative group cursor-pointer ${
                  isActive ? "bg-white text-[#B71C1C] shadow-xs font-semibold" : "text-gray-200 hover:bg-[#333333] hover:text-white"
                }`}
                title={item.title}
              >
                <Icon size={22} className={isActive ? "text-[#B71C1C]" : "text-gray-300 group-hover:text-white"} />
                <span className={`text-[10px] md:text-[11px] leading-tight mt-1 text-center truncate max-w-[76px] ${isActive ? "text-[#B71C1C] font-semibold" : "text-gray-200"}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="w-8 h-[1px] bg-white/20 my-2" />

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
                  isActive ? "bg-white text-[#B71C1C] shadow-xs font-semibold" : "text-gray-200 hover:bg-[#333333] hover:text-white"
                }`}
                title={item.label}
              >
                <div className="relative">
                  <Icon size={20} className={isActive ? "text-[#B71C1C]" : "text-gray-400 group-hover:text-white"} />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-2 bg-[#B71C1C] text-white text-[9px] font-bold rounded-full px-1 min-w-[14px] h-[14px] flex items-center justify-center border border-[#424242]">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-normal leading-tight mt-1 text-center truncate max-w-[76px] text-gray-300">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="w-full flex flex-col items-center mt-auto pt-2 pb-1 border-t border-[#555555]/50">
          <button type="button" className="text-gray-400 hover:text-white p-1 rounded hover:bg-[#333333] transition-colors" title="Minimizar navegación global">
            <ChevronLeft size={18} />
          </button>
        </div>
      </aside>

      <CanvasAccountModal isOpen={showAccountModal} onClose={() => setShowAccountModal(false)} />
    </>
  );
};
