"use client";

import React, { useState, useEffect } from "react";
import { StudentView } from "@/components/modules/StudentView";
import { CourseDeliverable, StudentExcelRow, StudentSubmission } from "@/types";
import { initialCourseData, getStoredCourseGrades } from "@/services/courseStore";

export default function EstudiantePage() {
  const [entregables] = useState<CourseDeliverable[]>(initialCourseData.entregables);
  const [entregasAlumnos, setEntregasAlumnos] = useState<StudentSubmission[]>(initialCourseData.entregas_alumnos);
  const [estudiantesExcel, setEstudiantesExcel] = useState<StudentExcelRow[]>([]);

  useEffect(() => {
    setEstudiantesExcel(getStoredCourseGrades("CIT3203_CA01"));
  }, []);

  const handleSubmitActivity = (deliverableId: string, solutionText: string) => {
    const newSubmission: StudentSubmission = {
      id: `sub_${Date.now()}`,
      deliverable_id: deliverableId,
      estudiante_id: 29248,
      estudiante_nombre: "Estudiante UDP",
      fecha_entrega: new Date().toLocaleString("es-CL", { dateStyle: "short", timeStyle: "short" }),
      archivo_nombre: "entrega_alumno_udp.pdf",
      texto_solucion: solutionText,
      estado: "pre_revisada_ia",
      nota_sugerida: 6.5,
      decimas_sugeridas: 0.3,
      feedback_ia: {
        resumen: "Entrega registrada exitosamente y pre-revisada.",
        criterios_evaluados: [],
        sugerencias_mejora: [],
      },
    };
    setEntregasAlumnos((prev) => [newSubmission, ...prev]);
  };

  const handleSendAppeal = (submissionId: string, appealText: string) => {
    setEntregasAlumnos((prev) =>
      prev.map((sub) =>
        sub.id === submissionId
          ? {
              ...sub,
              apelacion: {
                motivo: appealText,
                fecha: new Date().toLocaleString("es-CL", { dateStyle: "short", timeStyle: "short" }),
                estado: "pendiente",
              },
            }
          : sub
      )
    );
  };

  return (
    <StudentView
      entregables={entregables}
      entregasAlumnos={entregasAlumnos}
      estudiantesExcel={estudiantesExcel}
      onSubmitActivity={handleSubmitActivity}
      onSendAppeal={handleSendAppeal}
    />
  );
}
