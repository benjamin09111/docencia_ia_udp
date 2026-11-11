"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface DevRoleOption {
  role: string;
  name: string;
  identifier: string;
  desc: string;
  badge: string;
  badgeColor: string;
}

const DEV_OPTIONS: DevRoleOption[] = [
  { role: "docente", name: "Docente Titular", identifier: "benjamin.morales3@mail.udp.cl", desc: "Prof. Benjamín Morales (Cursos oficiales Canvas)", badge: "TITULAR", badgeColor: "bg-emerald-100 text-emerald-800" },
  { role: "admin", name: "Administrador", identifier: "admin@mail.udp.cl", desc: "Escuela Informática (Panel Admin global)", badge: "ADMIN", badgeColor: "bg-purple-100 text-purple-800" },
  { role: "docente", name: "Docente Sandbox", identifier: "dev@udp.cl", desc: "Desarrollador (Cursos sandbox aislados)", badge: "DEV", badgeColor: "bg-blue-100 text-blue-800" },
  { role: "ayudante", name: "Ayudante", identifier: "ayudante@mail.udp.cl", desc: "Ayudante docente (Talleres y laboratorios)", badge: "AYUDANTE", badgeColor: "bg-amber-100 text-amber-800" },
  { role: "estudiante", name: "Estudiante", identifier: "estudiante@mail.udp.cl", desc: "Alumno (Evaluaciones y feedback IA)", badge: "ALUMNO", badgeColor: "bg-rose-100 text-rose-800" },
];

interface DevRoleSelectorProps {
  onSelect: (identifier: string, pass: string) => void;
}

export const DevRoleSelector: React.FC<DevRoleSelectorProps> = ({ onSelect }) => {
  return (
    <div className="pt-3 border-t border-gray-200 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1 uppercase tracking-wider">
          <Sparkles size={11} className="text-[#B71C1C]" /> Cuentas de Prueba / Testing
        </span>
        <span className="text-[10px] text-gray-400 font-mono">pass: udp2026</span>
      </div>
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        {DEV_OPTIONS.map((opt) => (
          <button
            key={opt.identifier}
            type="button"
            onClick={() => onSelect(opt.identifier, "udp2026")}
            className="p-1.5 bg-gray-50 hover:bg-red-50 hover:border-red-200 border border-gray-200 rounded text-left transition-all group cursor-pointer"
            title={`${opt.name} — ${opt.desc}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#2D3B45] group-hover:text-[#B71C1C]">
                {opt.name}
              </span>
              <span className={`text-[8px] font-extrabold px-1 rounded ${opt.badgeColor}`}>
                {opt.badge}
              </span>
            </div>
            <p className="text-[9px] text-gray-400 truncate mt-0.5">{opt.identifier}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

