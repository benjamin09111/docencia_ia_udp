"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { AutomatedCourseWorkspace } from "@/components/modules/teacher/AutomatedCourseWorkspace";
import { CanvasCourse, CourseDeliverable, StudentExcelRow, StudentSubmission } from "@/types";
import { initialCourseData, getStoredCourseGrades, saveStoredCourseGrades } from "@/services/courseStore";
import { Loader2, ArrowLeft } from "lucide-react";

interface CourseDetailPageProps {
  params: Promise<{ cursoId: string }>;
}

export default function DocenteCourseDetailPage({ params }: CourseDetailPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const courseIdNum = Number(resolvedParams.cursoId);

  const [courses, setCourses] = useState<CanvasCourse[]>([]);
  const [course, setCourse] = useState<CanvasCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [entregables, setEntregables] = useState<CourseDeliverable[]>(initialCourseData.entregables);
  const [estudiantesExcel, setEstudiantesExcel] = useState<StudentExcelRow[]>([]);
  const [entregasAlumnos, setEntregasAlumnos] = useState<StudentSubmission[]>(initialCourseData.entregas_alumnos);

  useEffect(() => {
    fetch("/api/canvas/courses")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCourses(data);
          const found = data.find((c: CanvasCourse) => c.id === courseIdNum);
          if (found) {
            setCourse(found);
            setEstudiantesExcel(getStoredCourseGrades(found.code));
          } else {
            // Fallback al primer curso
            setCourse(data[0]);
            setEstudiantesExcel(getStoredCourseGrades(data[0].code));
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [courseIdNum]);

  const handleAddDeliverable = (d: CourseDeliverable) => {
    setEntregables((prev) => [d, ...prev]);
  };

  const handleUpdateGrade = (canvasId: number, field: keyof StudentExcelRow, value: number) => {
    setEstudiantesExcel((prev) => {
      const updated = prev.map((row) => (row.canvas_id === canvasId ? { ...row, [field]: value } : row));
      if (course?.code) saveStoredCourseGrades(course.code, updated);
      return updated;
    });
  };

  const handleResolveAppeal = (submissionId: string, action: "aceptar" | "ratificar") => {
    setEntregasAlumnos((prev) =>
      prev.map((sub) => {
        if (sub.id !== submissionId) return sub;
        return {
          ...sub,
          apelacion: sub.apelacion ? {
            ...sub.apelacion,
            estado: action === "aceptar" ? "aceptada" : "rechazada",
            respuesta_docente: action === "aceptar"
              ? "Apelación acogida (+0.1 décima acreditada)."
              : "Calificación ratificada conforme a la rúbrica.",
          } : undefined,
        };
      })
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-3">
        <Loader2 size={24} className="animate-spin text-[#B71C1C]" />
        <span className="text-xs text-[#6B7780] font-semibold">Cargando espacio del curso...</span>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="text-sm font-bold text-[#2D3B45]">Curso no encontrado o no asignado a tu cuenta.</p>
        <button
          type="button"
          onClick={() => router.push("/docente")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#B71C1C] text-white rounded font-bold cursor-pointer"
        >
          <ArrowLeft size={14} /> Volver a Mis Cursos
        </button>
      </div>
    );
  }

  return (
    <AutomatedCourseWorkspace
      course={course}
      allCourses={courses}
      entregables={entregables}
      estudiantesExcel={estudiantesExcel}
      entregasAlumnos={entregasAlumnos}
      onBack={() => router.push("/docente")}
      onSwitchCourse={(id) => router.push(`/docente/cursos/${id}`)}
      onAddDeliverable={handleAddDeliverable}
      onUpdateGrade={handleUpdateGrade}
      onResolveAppeal={handleResolveAppeal}
    />
  );
}
