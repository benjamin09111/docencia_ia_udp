"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RootRedirectPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data?.authenticated || !data.user) {
          router.replace("/login");
          return;
        }

        const role = data.user.role;
        const query = window.location.search;

        if (role === "admin") {
          router.replace(`/admin${query}`);
        } else if (role === "estudiante") {
          router.replace(`/estudiante${query}`);
        } else if (role === "ayudante") {
          router.replace(`/ayudantia${query}`);
        } else {
          router.replace(`/docente${query}`);
        }
      })
      .catch(() => {
        router.replace("/login");
      })
      .finally(() => {
        setChecking(false);
      });
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex items-center justify-center font-sans">
      <div className="flex flex-col items-center gap-3 text-center p-6 bg-white border border-[#E0E3E6] rounded-[4px] shadow-canvas-card">
        <div className="w-8 h-8 rounded-full border-2 border-[#B71C1C] border-t-transparent animate-spin" />
        <span className="text-xs font-semibold text-[#2D3B45]">
          {checking ? "Verificando perfil y cursos autorizados..." : "Redirigiendo..."}
        </span>
      </div>
    </div>
  );
}
