"use client";

import React, { useState } from "react";
import { safeNextPath } from "@/utils/safeRedirect";
import { useRouter } from "next/navigation";
import { GraduationCap, ShieldCheck, Lock, ArrowRight, AlertCircle, Loader2, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError("Por favor ingresa tu correo institucional y contraseña.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Credenciales incorrectas.");
        setLoading(false);
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const nextUrl = safeNextPath(params.get("next"));
      router.push(nextUrl);
      router.refresh();
    } catch {
      setError("Error de red al autenticar. Intente nuevamente.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col justify-between p-4 sm:p-6 font-sans">
      <header className="max-w-md w-full mx-auto flex items-center justify-between border-b border-gray-200 pb-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#B71C1C] text-white flex items-center justify-center font-bold shadow-2xs">
            <GraduationCap size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
              Universidad Diego Portales
            </span>
            <h1 className="text-xs font-bold text-[#2D3B45]">
              Escuela de Informática y Telecomunicaciones
            </h1>
          </div>
        </div>
        <span className="text-[10px] text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded font-mono flex items-center gap-1">
          <ShieldCheck size={11} /> Seguro
        </span>
      </header>

      <main className="flex-1 flex items-center justify-center py-4">
        <div className="max-w-md w-full bg-white border border-[#E0E3E6] rounded-[4px] p-6 sm:p-8 shadow-canvas-card space-y-5">
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-50 text-[#B71C1C] flex items-center justify-center mb-3 border border-red-100">
              <Lock size={22} />
            </div>
            <h2 className="text-lg font-bold text-[#2D3B45]">Acceso Institucional Canvas UDP</h2>
            <p className="text-xs text-[#6B7780]">
              Inicia sesión con tus credenciales de Escuela para acceder al panel docente.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-[#B71C1C] rounded-[4px] text-xs flex items-center gap-2 animate-fadeIn">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#2D3B45] mb-1.5">
                Correo Institucional o Usuario
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="ej: benjamin.morales3@mail.udp.cl o dev1"
                  autoFocus
                  required
                  className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-[#E0E3E6] rounded-[4px] focus:bg-white focus:outline-hidden focus:border-[#B71C1C] transition-colors"
                />
                <User size={14} className="absolute left-2.5 top-3 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D3B45] mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña..."
                  required
                  className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-[#E0E3E6] rounded-[4px] focus:bg-white focus:outline-hidden focus:border-[#B71C1C] transition-colors"
                />
                <Lock size={14} className="absolute left-2.5 top-3 text-gray-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#B71C1C] hover:bg-[#991515] text-white text-xs font-bold rounded-[4px] flex items-center justify-center gap-2 transition-colors disabled:opacity-60 shadow-xs cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <>
                  <span>Ingresar a la Plataforma</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      <footer className="text-center text-[11px] text-gray-500 mt-4 py-3 border-t border-gray-200">
        Portal Institucional • Universidad Diego Portales © 2026
      </footer>
    </div>
  );
}
