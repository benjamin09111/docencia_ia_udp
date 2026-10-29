"use client";

import React from "react";
import { AdminAgentsTableTab } from "@/components/modules/admin/AdminAgentsTableTab";
import { Bot, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminAgentesDirectPage() {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between pb-3 border-b border-[#E0E3E6]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-red-50 text-[#B71C1C] rounded-[4px] border border-red-100">
            <Bot size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#2D3B45]">
              Catálogo Institucional de Agentes de IA
            </h1>
            <p className="text-xs text-gray-500">
              Gestión centralizada de modelos OpenRouter, tiers de costo y herramientas autorizadas UDP.
            </p>
          </div>
        </div>

        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B71C1C] hover:underline"
        >
          <ArrowLeft size={14} /> Volver a Facultades
        </Link>
      </div>

      <AdminAgentsTableTab />
    </div>
  );
}
