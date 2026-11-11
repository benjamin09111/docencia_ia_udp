"use client";

import React, { useState } from "react";
import { Sparkles, Shield, GraduationCap, School, UserCheck } from "lucide-react";
import { TEST_ACCOUNTS, DEV_PASSWORD } from "@/constants/testAccounts";

interface DevRoleSelectorProps {
  onSelect: (identifier: string, pass: string) => void;
}

export const DevRoleSelector: React.FC<DevRoleSelectorProps> = ({ onSelect }) => {
  const [activeTab, setActiveTab] = useState<"docente" | "admin" | "ayudante" | "estudiante">("docente");

  const tabIcons = {
    docente: School,
    admin: Shield,
    ayudante: UserCheck,
    estudiante: GraduationCap,
  };

  const filteredAccounts = TEST_ACCOUNTS.filter((acc) => acc.role === activeTab);

  return (
    <div className="pt-3 border-t border-gray-200 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1 uppercase tracking-wider">
          <Sparkles size={11} className="text-[#B71C1C]" /> Cuentas de Prueba por Rol (3 c/u)
        </span>
        <span className="text-[10px] text-gray-400 font-mono">pass: {DEV_PASSWORD}</span>
      </div>

      {/* Tabs por rol */}
      <div className="grid grid-cols-4 gap-1 p-0.5 bg-gray-100 rounded text-center">
        {(["docente", "admin", "ayudante", "estudiante"] as const).map((r) => {
          const Icon = tabIcons[r];
          const isActive = activeTab === r;
          return (
            <button
              key={r}
              type="button"
              onClick={() => setActiveTab(r)}
              className={`py-1 text-[11px] font-bold rounded flex items-center justify-center gap-1 transition-all cursor-pointer ${
                isActive ? "bg-white text-[#B71C1C] shadow-2xs" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <Icon size={12} />
              <span className="capitalize">{r === "docente" ? "Docentes" : r === "admin" ? "Admins" : r === "ayudante" ? "Ayudantes" : "Alumnos"}</span>
            </button>
          );
        })}
      </div>

      {/* Tarjetas de cuentas filtradas */}
      <div className="space-y-1">
        {filteredAccounts.map((opt) => (
          <button
            key={opt.email}
            type="button"
            onClick={() => onSelect(opt.email, DEV_PASSWORD)}
            className="w-full p-2 bg-gray-50 hover:bg-red-50 hover:border-red-200 border border-gray-200 rounded text-left transition-all group cursor-pointer flex items-center justify-between"
            title={`${opt.name} — ${opt.description}`}
          >
            <div className="min-w-0 pr-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-[#2D3B45] group-hover:text-[#B71C1C] truncate">
                  {opt.name}
                </span>
              </div>
              <p className="text-[10px] text-gray-500 truncate">{opt.coursesSummary}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[9px] font-mono text-gray-400 group-hover:text-[#B71C1C] block">{opt.username}</span>
              <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1 rounded">1-Clic</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
