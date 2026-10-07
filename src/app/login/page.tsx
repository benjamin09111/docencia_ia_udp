"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, ShieldCheck, Lock, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Por favor ingresa la clave de acceso.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Clave incorrecta.");
        setLoading(false);
        return;
      }

      // Redirigir al inicio o página previa
      const params = new URLSearchParams(window.location.search);
      const nextUrl = params.get("next") || "/";
      router.push(nextUrl);
      router.refresh();
    } catch {
      setError("Error de red al verificar clave. Intente nuevamente.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Header Institucional Superior */}
      <header className="max-w-md w-full mx-auto flex items-center justify-between border-b border-gray-200 pb-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#C8102E] text-white flex items-center justify-center font-bold shadow-2xs">
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

      {/* Contenido Principal: Tarjeta de Acceso Canvas UDP */}
      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full bg-white border border-[#E0E3E6] rounded-[4px] p-6 sm:p-8 shadow-canvas-card space-y-6">
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 text-[#008EE2] flex items-center justify-center mb-3 border border-blue-100">
              <Lock size={22} />
            </div>
            <h2 className="text-lg font-bold text-[#2D3B45]">
              Acceso Institucional
            </h2>
            <p className="text-xs text-[#6B7780]">
              Ingresa la clave docente para acceder al Ecosistema Docente y Paneles de Control.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-[#C8102E] rounded-[4px] text-xs flex items-center gap-2 animate-fadeIn">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#2D3B45] mb-1.5">
                Clave de Acceso
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa clave (ej. udp2026)"
                autoFocus
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-[#E0E3E6] rounded-[4px] focus:bg-white focus:outline-hidden focus:border-[#008EE2] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#008EE2] hover:bg-[#0077BE] text-white text-xs font-bold rounded-[4px] flex items-center justify-center gap-2 transition-colors disabled:opacity-60 shadow-xs cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <span>Ingresar a la Plataforma</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Enlace directo a marcaje público de asistencia */}
          <div className="pt-4 border-t border-gray-100 text-center">
            <span className="text-[11px] text-[#6B7780] block mb-1">
              ¿Eres estudiante y vienes a marcar tu asistencia?
            </span>
            <Link
              href="/asistencia"
              className="text-xs font-bold text-[#008EE2] hover:underline inline-flex items-center gap-1"
            >
              <span>Ir a Marcaje de Asistencia (Libre y Público)</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Mínimo */}
      <footer className="text-center text-[11px] text-gray-500 mt-8 py-3 border-t border-gray-200">
        Portal Docente • Plataforma Institucional UDP © 2026
      </footer>
    </div>
  );
}
