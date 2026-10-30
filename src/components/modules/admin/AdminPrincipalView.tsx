"use client";

import React, { useState } from "react";
import { Plus, ShieldCheck } from "lucide-react";
import { INITIAL_MOCK_ROLES, UNIVERSITY_METRICS } from "@/constants/adminDashboard";
import { AdminLockedPanel } from "./AdminLockedPanel";

export const AdminPrincipalView: React.FC = () => {
  const [roles, setRoles] = useState(INITIAL_MOCK_ROLES);
  const [roleName, setRoleName] = useState("");
  const addRole = () => {
    const name = roleName.trim();
    if (!name) return;
    setRoles((prev) => [...prev, { id: `mock-${Date.now()}`, name, scope: "Configuración mock", members: 0 }]);
    setRoleName("");
  };
  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="border-b border-[#E0E3E6] pb-4"><h1 className="text-xl font-bold text-[#2D3B45]">Principal</h1><p className="text-xs text-[#6B7780] mt-1">Resumen institucional basado en la sincronización disponible de Canvas.</p></header>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {UNIVERSITY_METRICS.map((metric) => <div key={metric.label} className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-canvas-card"><p className="text-xs text-[#6B7780]">{metric.label}</p><p className="text-2xl font-bold text-[#2D3B45] mt-1">{metric.value}</p><p className="text-[11px] text-[#6B7780] mt-2">{metric.detail}</p></div>)}
      </div>
      <section className="bg-white border border-[#E0E3E6] rounded-[4px] shadow-canvas-card"><div className="p-4 border-b border-[#E0E3E6]"><h2 className="font-bold text-sm text-[#2D3B45] flex gap-2 items-center"><ShieldCheck size={16} className="text-[#B71C1C]" /> Roles y accesos</h2><p className="text-xs text-[#6B7780] mt-1">Versión mock: no modifica permisos reales.</p></div><div className="p-4 space-y-3">{roles.map((role) => <div key={role.id} className="flex items-center justify-between border-b border-gray-100 pb-2 text-xs"><span className="font-semibold text-[#2D3B45]">{role.name}</span><span className="text-[#6B7780]">{role.scope} · {role.members} usuarios</span></div>)}<div className="flex gap-2"><input value={roleName} onChange={(e) => setRoleName(e.target.value)} placeholder="Nombre de rol mock" className="flex-1 border border-[#C7CDD1] rounded px-2 py-1.5 text-xs"/><button type="button" onClick={addRole} className="text-xs font-bold bg-[#B71C1C] text-white rounded px-3"><Plus size={13} className="inline mr-1" />Crear</button></div></div></section>
      <AdminLockedPanel title="Calendario UDP" description="La administración institucional del calendario estará disponible cuando se habilite su integración centralizada." />
    </div>
  );
};
