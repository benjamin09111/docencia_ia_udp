"use client";

import React, { useState, useEffect, useCallback } from "react";
import { UserRole, CanvasCourse, CanvasUser, CourseDeliverable, StudentExcelRow, AgentPerillas } from "@/types";
import { CanvasSidebar } from "@/components/canvas/CanvasSidebar";
import { CanvasHeader } from "@/components/canvas/CanvasHeader";
import { AdminView } from "@/components/modules/AdminView";
import { TeacherView } from "@/components/modules/TeacherView";
import { StudentView } from "@/components/modules/StudentView";
import { initialCourseData, getStoredCourseGrades, saveStoredCourseGrades } from "@/services/courseStore";

export default function DashboardPage() {
  const [currentRole, setCurrentRole] = useState<UserRole>("admin");
  const [activeNav, setActiveNav] = useState("docencia_ia");
  const [activeCourseBreadcrumb, setActiveCourseBreadcrumb] = useState<{ courseCode: string; tabTitle: string } | null>(null);

  // Canvas API state
  const [canvasUser, setCanvasUser] = useState<CanvasUser>({
    id: 29248,
    name: "BENJAMÍN MORALES PIZARRO",
    short_name: "Benjamín Morales",
    avatar_url: "https://udp.instructure.com/images/thumbnails/1767553/l6cHLT7vxrfJZGlkMFRfSh0E9PktngbxGuBEBlgM",
    email: "benjamin.morales3@mail.udp.cl",
    role: "admin",
  });
  const [canvasCourses, setCanvasCourses] = useState<CanvasCourse[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // Business state
  const [perillas, setPerillas] = useState<AgentPerillas>(initialCourseData.perillas);
  const [cronograma, setCronograma] = useState(initialCourseData.cronograma);
  const [entregables, setEntregables] = useState<CourseDeliverable[]>(initialCourseData.entregables);
  const [estudiantesExcel, setEstudiantesExcel] = useState<StudentExcelRow[]>([]);
  const [entregasAlumnos, setEntregasAlumnos] = useState(initialCourseData.entregas_alumnos);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setEstudiantesExcel(getStoredCourseGrades("CIT3203_CA01"));

    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get("role") || params.get("rol");
    if (roleParam === "student" || roleParam === "estudiante" || roleParam === "alumno") {
      setCurrentRole("student");
    } else if (roleParam === "teacher" || roleParam === "profesor" || roleParam === "docente" || roleParam === "ayudante") {
      setCurrentRole("teacher");
    }
  }, []);

  useEffect(() => {
    if (estudiantesExcel.length > 0) {
      saveStoredCourseGrades("CIT3203_CA01", estudiantesExcel);
    }
  }, [estudiantesExcel]);

  useEffect(() => {
    // Carga de datos reales desde Canvas UDP API
    fetch("/api/canvas/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.id) setCanvasUser(data);
      })
      .catch(() => {});

    fetch("/api/canvas/courses")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCanvasCourses(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingCourses(false));
  }, []);

  // Handlers reactivos
  const handleUpdatePerillas = (newPerillas: AgentPerillas) => {
    setPerillas(newPerillas);
  };

  const handleGenerateCronograma = () => {
    // Simula regeneración con IA
    const updated = [
      ...initialCourseData.cronograma,
      {
        semana: 3,
        sesion: 1,
        tipo: "catedra" as const,
        titulo: "Arquitecturas Orientadas a Eventos y Microservicios",
        objetivo: "Analizar brokers de mensajería y consistencia eventual.",
        material_referencia: "Cátedra 5 UDP.",
      },
    ];
    setCronograma(updated);
  };

  const handleAddDeliverable = (d: CourseDeliverable) => {
    setEntregables((prev) => [d, ...prev]);
  };

  const handleUpdateGrade = useCallback(
    (canvasId: number, field: keyof StudentExcelRow, value: number) => {
      setEstudiantesExcel((prev) => {
        const target = prev.find((r) => r.canvas_id === canvasId);
        if (!target || target[field] === value) return prev;

        return prev.map((row) => {
          if (row.canvas_id !== canvasId) return row;
          const updatedRow = { ...row, [field]: value };

          // Recálculo automático de notas y décimas en tiempo real
          if (field === "solemne_1" || field === "decimas_act1") {
            updatedRow.solemne_1_final = Math.min(
              7.0,
              Number((updatedRow.solemne_1 + updatedRow.decimas_act1).toFixed(1))
            );
          }

          const notaFinalCalculada = Number(
            (
              updatedRow.solemne_1_final * 0.3 +
              updatedRow.solemne_2 * 0.3 +
              updatedRow.taller_proyecto * 0.4
            ).toFixed(1)
          );

          updatedRow.nota_final = notaFinalCalculada;
          updatedRow.estado_curso = notaFinalCalculada >= 4.0 ? "Aprobado" : "Reprobado";

          return updatedRow;
        });
      });
    },
    []
  );

  const handleSubmitStudentActivity = (deliverableId: string, solutionText: string) => {
    const newSubmission = {
      id: `sub_${Date.now()}`,
      deliverable_id: deliverableId,
      estudiante_id: canvasUser.id,
      estudiante_nombre: canvasUser.name,
      fecha_entrega: new Date().toLocaleString("es-CL", { dateStyle: "short", timeStyle: "short" }),
      archivo_nombre: "entrega_alumno_udp.pdf",
      texto_solucion: solutionText,
      estado: "pre_revisada_ia" as const,
      nota_sugerida: 6.5,
      decimas_sugeridas: 0.3,
      feedback_ia: {
        resumen:
          "Entrega bien orientada. La solución aborda los conceptos de la cátedra e identifica las tácticas principales. Sugerimos profundizar en la métrica cuantitativa de recuperación.",
        criterios_evaluados: [
          {
            criterio: "Dominio conceptual y justificación técnica",
            puntaje_obtenido: 45,
            puntaje_max: 50,
            cita_textual: solutionText.slice(0, 95) + "...",
            comentario: "El análisis es correcto y consistente con la pauta oficial.",
          },
          {
            criterio: "Calidad de la solución y robustez",
            puntaje_obtenido: 46,
            puntaje_max: 50,
            cita_textual: solutionText.slice(95, 180) || solutionText.slice(0, 50),
            comentario: "Estructura adecuada para el nivel de ayudantía.",
          },
        ],
        sugerencias_mejora: ["Revisar el impacto en latencia durante el failover."],
      },
    };

    setEntregasAlumnos((prev) => [newSubmission, ...prev]);

    // Aplica automáticamente la décima ganada a la planilla Excel
    setEstudiantesExcel((prev) =>
      prev.map((row) => {
        if (row.canvas_id === canvasUser.id) {
          const nuevasDecimas = Math.min(0.6, Number((row.decimas_act1 + 0.3).toFixed(1)));
          const sol1Final = Math.min(7.0, Number((row.solemne_1 + nuevasDecimas).toFixed(1)));
          const finalNota = Number(
            (sol1Final * 0.3 + row.solemne_2 * 0.3 + row.taller_proyecto * 0.4).toFixed(1)
          );
          return {
            ...row,
            decimas_act1: nuevasDecimas,
            solemne_1_final: sol1Final,
            nota_final: finalNota,
            estado_curso: finalNota >= 4.0 ? "Aprobado" : "Reprobado",
          };
        }
        return row;
      })
    );
  };

  const getBreadcrumbs = () => {
    return [
      "Universidad Diego Portales",
      "Facultad de Ingeniería",
      "Ingeniería Civil en Informática y Telecomunicaciones",
    ];
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

  const handleResolveAppeal = (submissionId: string, action: "aceptar" | "ratificar") => {
    setEntregasAlumnos((prev) =>
      prev.map((sub) => {
        if (sub.id !== submissionId) return sub;
        const extraDecimas = action === "aceptar" ? 0.1 : 0.0;
        return {
          ...sub,
          decimas_sugeridas: Number(((sub.decimas_sugeridas || 0.3) + extraDecimas).toFixed(1)),
          apelacion: sub.apelacion
            ? {
                ...sub.apelacion,
                estado: action === "aceptar" ? "aceptada" : "rechazada",
                respuesta_docente:
                  action === "aceptar"
                    ? "Apelación acogida por el docente (+0.1 décima adicional acreditada)."
                    : "Calificación ratificada conforme a los criterios objetivos de la rúbrica.",
              }
            : undefined,
        };
      })
    );
  };

  return (
    <div className="flex min-h-screen bg-[#F5F6F8]">
      {/* Sidebar estilo Canvas Global con los 3 iconos de vista */}
      <CanvasSidebar
        currentRole={currentRole}
        onRoleChange={(role) => {
          setCurrentRole(role);
          setActiveCourseBreadcrumb(null);
        }}
        activeNav={activeNav}
        onNavClick={setActiveNav}
        userName={canvasUser.short_name}
        userAvatar={canvasUser.avatar_url}
      />

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Barra Superior Canvas (#breadcrumbs): SOLO aparece cuando estamos dentro de un curso */}
        {activeCourseBreadcrumb && (
          <CanvasHeader
            courseCode={activeCourseBreadcrumb.courseCode}
            currentPageTitle={activeCourseBreadcrumb.tabTitle}
            isStudentView={currentRole === "student"}
            onToggleStudentView={() => setCurrentRole(currentRole === "student" ? "teacher" : "student")}
          />
        )}

        <main className="p-6 sm:p-8 lg:p-10 w-full flex-1 min-w-0 bg-white">
          {currentRole === "admin" && (
            <AdminView />
          )}

          {currentRole === "teacher" && (
            <TeacherView
              canvasCourses={canvasCourses}
              entregables={entregables}
              estudiantesExcel={estudiantesExcel}
              entregasAlumnos={entregasAlumnos}
              onAddDeliverable={handleAddDeliverable}
              onUpdateGrade={handleUpdateGrade}
              onResolveAppeal={handleResolveAppeal}
              onActiveCourseChange={setActiveCourseBreadcrumb}
            />
          )}

          {currentRole === "student" && (
            <StudentView
              entregables={entregables}
              entregasAlumnos={entregasAlumnos}
              estudiantesExcel={estudiantesExcel}
              onSubmitActivity={handleSubmitStudentActivity}
              onSendAppeal={handleSendAppeal}
              onActiveCourseChange={setActiveCourseBreadcrumb}
            />
          )}
        </main>
      </div>
    </div>
  );
}
