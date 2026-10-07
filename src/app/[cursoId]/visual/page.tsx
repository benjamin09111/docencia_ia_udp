"use client";

import React, { use } from "react";
import dynamic from "next/dynamic";
import { GraduationCap, Loader2 } from "lucide-react";

// Deshabilitamos SSR para evitar cualquier discrepancia de hidratación con APIs del cliente (localStorage, caches)
const PublicAttendanceVisualView = dynamic(
  () =>
    import("@/components/modules/public-attendance/PublicAttendanceVisualView").then(
      (mod) => mod.PublicAttendanceVisualView
    ),
  {
    ssr: false,
    loading: () => (
      <div className="max-w-[1400px] w-full mx-auto space-y-4 animate-pulse">
        <header className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[4px] bg-[#C8102E] text-white flex items-center justify-center font-bold">
              <GraduationCap size={26} />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-40 bg-gray-200 rounded" />
              <div className="h-5 w-64 bg-gray-300 rounded" />
              <div className="h-3 w-48 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#6B7780]">
            <Loader2 size={16} className="animate-spin text-[#008EE2]" />
            <span>Cargando portal estudiante UDP...</span>
          </div>
        </header>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-white border border-[#E0E3E6] rounded-[4px]" />
          ))}
        </div>
        <div className="h-96 bg-white border border-[#E0E3E6] rounded-[4px]" />
      </div>
    ),
  }
);

interface CourseVisualPageProps {
  params: Promise<{ cursoId: string }>;
  searchParams: Promise<{ sec?: string }>;
}

export default function CourseVisualPage({
  params,
  searchParams,
}: CourseVisualPageProps) {
  const resolvedParams = use(params);
  const resolvedSearch = use(searchParams);

  return (
    <div className="min-h-screen bg-[#F5F6F8] py-4 px-3 sm:px-6 lg:px-8 font-sans overflow-x-hidden">
      <PublicAttendanceVisualView
        courseCode={resolvedParams.cursoId}
        initialSectionId={resolvedSearch?.sec}
      />
    </div>
  );
}
