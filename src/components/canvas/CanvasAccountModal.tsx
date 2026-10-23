"use client";

import React, { useState, useEffect } from "react";
import { User, LogOut, Shield, CheckCircle, AlertTriangle, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface CanvasAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  isOwner: boolean;
  hasCanvasToken: boolean;
}

export const CanvasAccountModal: React.FC<CanvasAccountModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch("/api/auth/me")
        .then((res) => res.json())
        .then((data) => {
          if (data?.authenticated && data.user) setProfile(data.user);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-fadeIn">
      <div className="bg-white rounded-[4px] border border-[#C7CDD1] shadow-canvas-card max-w-sm w-full p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <div className="flex items-center gap-2">
            <User size={18} className="text-[#B71C1C]" />
            <h3 className="text-sm font-bold text-[#2D3B45]">Cuenta Institucional</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded border border-gray-200">
          <div className="w-10 h-10 rounded-full bg-[#424242] text-white flex items-center justify-center font-bold text-sm shrink-0">
            {profile?.name ? profile.name.slice(0, 2).toUpperCase() : "AD"}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-[#2D3B45] truncate">
              {profile?.name || "Administrador UDP"}
            </h4>
            <p className="text-[11px] text-[#6B7780] font-mono truncate">
              {profile?.email || "usuario@udp.cl"}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="bg-red-100 text-[#B71C1C] border border-red-200 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                {profile?.role || "ADMIN"}
              </span>
              {profile?.isOwner ? (
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[9px] font-bold px-1.5 py-0.2 rounded">
                  Titular UDP
                </span>
              ) : (
                <span className="bg-blue-100 text-blue-800 border border-blue-200 text-[9px] font-bold px-1.5 py-0.2 rounded">
                  Sandbox Dev
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-2.5 bg-gray-50 border border-gray-200 rounded text-[11px] space-y-1">
          <span className="text-gray-500 font-semibold block">Aislamiento de Cursos & Canvas:</span>
          {profile?.isOwner ? (
            <div className="flex items-center gap-1.5 text-emerald-800">
              <CheckCircle size={13} className="text-emerald-600 shrink-0" />
              <span>Token personal vinculado (acceso a cursos reales y asistencias).</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-amber-800">
              <AlertTriangle size={13} className="text-amber-600 shrink-0" />
              <span>Modo Sandbox activo: cursos y asistencias del titular protegidos.</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded border border-gray-300 cursor-pointer"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#B71C1C] hover:bg-[#991515] text-white text-xs font-bold rounded cursor-pointer transition-colors"
          >
            <LogOut size={13} />
            <span>{loggingOut ? "Cerrando..." : "Cerrar Sesión"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
