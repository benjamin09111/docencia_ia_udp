"use client";

import React, { useState } from "react";
import { CanvasCourse } from "@/types";
import { CourseSection } from "@/types/attendance";
import { CanvasTable, CanvasTableHeader } from "@/components/canvas/CanvasTable";
import { TeacherCourseRow } from "./TeacherCourseRow";
import { GripVertical } from "lucide-react";

interface TeacherCoursesTableProps {
  courses: CanvasCourse[];
  sections: CourseSection[];
  automatedCourseIds: number[];
  onOpenCourse: (courseId: number) => void;
  onAutomateCourse: (courseId: number) => void;
  onReorderCourses: (reordered: CanvasCourse[]) => void;
  onMockNotice: () => void;
}

export const TeacherCoursesTable: React.FC<TeacherCoursesTableProps> = ({
  courses,
  sections,
  automatedCourseIds,
  onOpenCourse,
  onAutomateCourse,
  onReorderCourses,
  onMockNotice,
}) => {
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIdx !== index) {
      setDragOverIdx(index);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLTableRowElement>, targetIndex: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIndex) {
      setDraggedIdx(null);
      setDragOverIdx(null);
      return;
    }

    const updated = [...courses];
    const [movedItem] = updated.splice(draggedIdx, 1);
    updated.splice(targetIndex, 0, movedItem);

    onReorderCourses(updated);
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  if (courses.length === 0) {
    return (
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-8 text-center text-xs text-[#6B7780] shadow-canvas-card">
        No se encontraron cursos automatizados. Desmarca el filtro para ver todos los cursos de Canvas.
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E0E3E6] rounded-[4px] shadow-canvas-card overflow-hidden">
      <div className="bg-[#FAFBFD] px-3.5 py-2 border-b border-[#E0E3E6] flex items-center justify-between text-[11px] text-[#6B7780]">
        <span className="flex items-center gap-1.5 font-medium">
          <GripVertical size={13} className="text-[#008EE2]" />
          Arrastra las filas desde el icono lateral para personalizar tu orden de asignaturas
        </span>
        <span className="font-mono font-bold text-[10px] bg-blue-50 text-[#008EE2] px-2 py-0.5 rounded border border-blue-200">
          {courses.length} Cursos
        </span>
      </div>

      <CanvasTable tableClassName="min-w-[800px]">
        <CanvasTableHeader>
          <tr>
            <th className="p-3 w-10 text-center">#</th>
            <th className="p-3">Código Canvas</th>
            <th className="p-3">Nombre de Asignatura</th>
            <th className="p-3 text-center">Dificultad</th>
            <th className="p-3">Horario Ayudantía</th>
            <th className="p-3 text-center">Agente Institucional</th>
            <th className="p-3 text-center">Estado</th>
            <th className="p-3 text-right w-16">Acciones</th>
          </tr>
        </CanvasTableHeader>
        <tbody>
          {courses.map((course: CanvasCourse, idx: number) => (
            <TeacherCourseRow
              key={course.id}
              course={course}
              index={idx}
              sections={sections}
              isAutomated={automatedCourseIds.includes(course.id)}
              isDragging={draggedIdx === idx}
              isOver={dragOverIdx === idx}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
              onOpenCourse={onOpenCourse}
              onAutomateCourse={onAutomateCourse}
              onMockNotice={onMockNotice}
            />
          ))}
        </tbody>
      </CanvasTable>
    </div>
  );
};
