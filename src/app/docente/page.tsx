"use client";

import React, { useState, useEffect } from "react";
import { TeacherView } from "@/components/modules/TeacherView";
import { CanvasCourse, CourseDeliverable, StudentExcelRow, StudentSubmission } from "@/types";
import { initialCourseData, getStoredCourseGrades, saveStoredCourseGrades } from "@/services/courseStore";

export default function DocentePage() {
  const [canvasCourses, setCanvasCourses] = useState<CanvasCourse[]>([]);
  const [entregables, setEntregables] = useState<CourseDeliverable[]>(initialCourseData.entregables);
  const [estudiantesExcel, setEstudiantesExcel] = useState<StudentExcelRow[]>([]);
  const [entregasAlumnos, setEntregasAlumnos] = useState<StudentSubmission[]>(initialCourseData.entregas_alumnos);

  useEffect(() => {
    setEstudiantesExcel(getStoredCourseGrades("CIT3203_CA01"));
    fetch("/api/canvas/courses")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setCanvasCourses(data);
      })
      .catch(() => {});
  }, []);

  const handleAddDeliverable = (d: CourseDeliverable) => {
    setEntregables((prev) => [d, ...prev]);
  };

  const handleUpdateGrade = (canvasId: number, field: keyof StudentExcelRow, value: number) => {
    setEstudiantesExcel((prev) => {
      const updated = prev.map((row) => (row.canvas_id === canvasId ? { ...row, [field]: value } : row));
      saveStoredCourseGrades("CIT3203_CA01", updated);
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

  return (
    <TeacherView
      canvasCourses={canvasCourses}
      entregables={entregables}
      estudiantesExcel={estudiantesExcel}
      entregasAlumnos={entregasAlumnos}
      currentRole="teacher"
      onAddDeliverable={handleAddDeliverable}
      onUpdateGrade={handleUpdateGrade}
      onResolveAppeal={handleResolveAppeal}
    />
  );
}
