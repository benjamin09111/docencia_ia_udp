"use client";

import React, { useState } from "react";
import { CanvasSidebar } from "@/components/canvas/CanvasSidebar";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("admin");

  const handleRoleChange = (role: UserRole) => {
    if (role === "admin") router.push("/admin");
    else if (role === "teacher") router.push("/docente");
    else if (role === "student") router.push("/estudiante");
  };

  return (
    <div className="flex min-h-screen bg-[#F5F6F8]">
      <CanvasSidebar
        currentRole="admin"
        onRoleChange={handleRoleChange}
        activeNav={activeNav}
        onNavClick={setActiveNav}
        userName="Administrador UDP"
      />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="p-6 sm:p-8 lg:p-10 w-full flex-1 min-w-0 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
