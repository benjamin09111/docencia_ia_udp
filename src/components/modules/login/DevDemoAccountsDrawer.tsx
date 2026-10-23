"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, KeyRound, Shield, Check } from "lucide-react";

export interface DemoAccount {
  id: string;
  email: string;
  username: string;
  name: string;
  role: string;
  isOwner: boolean;
  demoPass: string;
}

interface DevDemoAccountsDrawerProps {
  accounts: DemoAccount[];
  onSelectAccount: (email: string, pass: string) => void;
}

export const DevDemoAccountsDrawer: React.FC<DevDemoAccountsDrawerProps> = ({
  accounts,
  onSelectAccount,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!accounts || accounts.length === 0) return null;

  const handleSelect = (acc: DemoAccount) => {
    setSelectedId(acc.id);
    onSelectAccount(acc.email, acc.demoPass);
  };

  return (
    <div className="border border-amber-200 bg-amber-50/60 rounded-[4px] p-3 text-xs transition-all">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left font-semibold text-amber-900 cursor-pointer"
      >
        <div className="flex items-center gap-1.5">
          <KeyRound size={14} className="text-amber-700" />
          <span>Acceso Rápido Desarrollo (5 Cuentas Admin)</span>
        </div>
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>

      {open && (
        <div className="mt-3 space-y-2 pt-2 border-t border-amber-200/70">
          <p className="text-[11px] text-amber-800 leading-tight">
            Selecciona una cuenta para autocompletar credenciales y probar aislamiento de cursos:
          </p>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {accounts.map((acc) => {
              const isSelected = selectedId === acc.id;
              return (
                <div
                  key={acc.id}
                  onClick={() => handleSelect(acc)}
                  className={`p-2 rounded border text-left cursor-pointer transition-colors flex items-center justify-between gap-2 ${
                    isSelected
                      ? "bg-amber-100/90 border-amber-400 text-amber-950 font-medium"
                      : "bg-white hover:bg-amber-50 border-gray-200 text-gray-800"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold truncate text-[11px]">{acc.name}</span>
                      {acc.isOwner ? (
                        <span className="bg-[#B71C1C] text-white text-[9px] px-1.5 py-0.2 rounded font-semibold">
                          Titular
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-700 border border-gray-300 text-[9px] px-1 py-0.2 rounded">
                          Sandbox
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono block truncate">
                      {acc.email}
                    </span>
                  </div>

                  <div className="shrink-0 flex items-center gap-1">
                    {isSelected ? (
                      <span className="text-emerald-700 text-[10px] font-bold flex items-center gap-0.5">
                        <Check size={12} /> Listo
                      </span>
                    ) : (
                      <span className="text-[10px] text-blue-600 hover:underline">
                        Usar
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-[10px] text-gray-500 flex items-center gap-1 pt-1">
            <Shield size={11} className="text-emerald-600" />
            <span>Hashes PBKDF2 y cookies seguras HttpOnly (sin localStorage).</span>
          </div>
        </div>
      )}
    </div>
  );
};
