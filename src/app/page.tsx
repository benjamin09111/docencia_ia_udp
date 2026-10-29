"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleParam = (params.get("role") || params.get("rol") || "").toLowerCase();

    // Preservar parámetros de búsqueda para LTI y cursos
    const query = window.location.search;

    if (roleParam === "student" || roleParam === "estudiante" || roleParam === "alumno") {
      router.replace(`/estudiante${query}`);
    } else if (roleParam === "admin") {
      router.replace(`/admin${query}`);
    } else {
      // Por defecto entra al portal docente/ayudante
      router.replace(`/docente${query}`);
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex items-center justify-center font-sans">
      <div className="flex flex-col items-center gap-3 text-center p-6 bg-white border border-[#E0E3E6] rounded-[4px] shadow-canvas-card">
        <div className="w-8 h-8 rounded-full border-2 border-[#B71C1C] border-t-transparent animate-spin" />
        <span className="text-xs font-semibold text-[#2D3B45]">
          Redirigiendo al espacio institucional UDP...
        </span>
      </div>
    </div>
  );
}
