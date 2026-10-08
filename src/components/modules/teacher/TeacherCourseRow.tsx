"use client";

import React from "react";
import { CanvasCourse } from "@/types";
import { CourseSection } from "@/types/attendance";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import { CanvasActionMenu } from "@/components/canvas/CanvasActionMenu";
import { CanvasTableRow, CanvasTableCell } from "@/components/canvas/CanvasTable";
import { getSectionByCourseCode, formatSectionSchedule } from "@/services/attendanceStore";
import { Sparkles, ArrowRight, Building2, GripVertical, BookOpen } from "lucide-react";

interface TeacherCourseRowProps {
  course: CanvasCourse;
  index: number;
  sections: CourseSection[];
  isAutomated: boolean;
  isDragging: boolean;
  isOver: boolean;
  onDragStart: (e: React.DragEvent<HTMLTableRowElement>, index: number) => void;
  onDragOver: (e: React.DragEvent<HTMLTableRowElement>, index: number) => void;
  onDragEnd: () => void;
  onDrop: (e: React.DragEvent<HTMLTableRowElement>, index: number) => void;
  onOpenCourse: (courseId: number) => void;
  onAutomateCourse: (courseId: number) => void;
  onMockNotice: () => void;
}

const getCourseDifficulty = (code: string) => {
  if (code.includes("CIT1010") || code.includes("1010")) {
    return { nivel: "Baja", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  }
  if (code.includes("CIT2206") || code.includes("2206")) {
    return { nivel: "Media", color: "bg-amber-50 text-amber-700 border-amber-200" };
  }
  return { nivel: "Alta", color: "bg-rose-50 text-[#C8102E] border-rose-200" };
};

export const TeacherCourseRow: React.FC<TeacherCourseRowProps> = ({
  course,
  index,
  sections,
  isAutomated,
  isDragging,
  isOver,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
  onOpenCourse,
  onAutomateCourse,
  onMockNotice,
}) => {
  const isMockCourse = false;
  const sec = getSectionByCourseCode(course.code, sections);
  const sched = formatSectionSchedule(sec);
  const diff = getCourseDifficulty(course.code || "");

  const handleRowClick = () => {
    if (isMockCourse) {
      onMockNotice();
      return;
    }
    if (isAutomated) {
      onOpenCourse(course.id);
    } else {
      onAutomateCourse(course.id);
    }
  };

  return (
    <CanvasTableRow
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragEnd={onDragEnd}
      onDrop={(e) => onDrop(e, index)}
      onClick={handleRowClick}
      className={`cursor-pointer transition-all duration-150 group ${
        isDragging ? "opacity-40 bg-blue-50 scale-[0.99]" : ""
      } ${isOver ? "border-t-2 border-[#008EE2] bg-blue-50/40" : ""} ${
        isMockCourse ? "hover:bg-amber-50/50 bg-gray-50/30" : "hover:bg-blue-50/60"
      }`}
    >
      <CanvasTableCell align="center" className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-[#008EE2]">
        <div className="flex items-center justify-center p-1 rounded hover:bg-gray-100" title="Arrastra para reordenar">
          <GripVertical size={15} />
        </div>
      </CanvasTableCell>

      <CanvasTableCell>
        <span className="font-mono font-bold text-[#008EE2] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          {course.code}
        </span>
      </CanvasTableCell>

      <CanvasTableCell>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[#2D3B45] text-xs group-hover:text-[#008EE2] transition-colors">
              {course.name}
            </span>
            {isMockCourse && (
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded border border-amber-200">
                Mock 1er Año
              </span>
            )}
          </div>
          <span className="block text-[11px] text-[#6B7780]">
            Canvas ID: {course.id} • {sec.nombre} (Prof. {sec.profesor})
          </span>
        </div>
      </CanvasTableCell>

      <CanvasTableCell align="center">
        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded border ${diff.color}`}>
          {diff.nivel}
        </span>
      </CanvasTableCell>

      <CanvasTableCell>
        <div className="space-y-0.5 text-[11px] leading-tight min-w-[170px]">
          <div className="flex items-center gap-1.5 text-purple-950 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />
            <span><strong>Ayudantía:</strong> {sched.ayudantia}</span>
          </div>
          <div className="text-[10px] text-[#6B7780] pl-3 font-mono flex items-center gap-1">
            <Building2 size={11} className="text-[#C8102E]" />
            <span>{sched.ayudantiaSala || "SALA X"}</span>
          </div>
        </div>
      </CanvasTableCell>

      <CanvasTableCell align="center">
        <span className="inline-flex items-center gap-1.5 text-xs text-[#2D3B45] bg-[#F5F6F8] px-2 py-0.5 rounded border border-[#E0E3E6]">
          <Sparkles size={12} className={isMockCourse ? "text-gray-400" : "text-[#C8102E]"} />
          <span>
            {isMockCourse
              ? "Agente Lógica Básica (CIT1010) [Mock]"
              : course.code.includes("CIT2206")
              ? "Agente Teoría Org (CIT2206)"
              : course.code.includes("CIT3100")
              ? "Agente Arq Cloud (CIT3100)"
              : "Agente PMBOK + Ágil (CIT3203)"}
          </span>
        </span>
      </CanvasTableCell>

      <CanvasTableCell align="center">
        {isMockCourse ? (
          <CanvasBadge variant="warning">Solo Mock</CanvasBadge>
        ) : isAutomated ? (
          <CanvasBadge variant="success">✓ Automatizado</CanvasBadge>
        ) : (
          <CanvasBadge variant="neutral">Sin Vincular</CanvasBadge>
        )}
      </CanvasTableCell>

      <CanvasTableCell align="right" onClick={(e) => e.stopPropagation()}>
        <CanvasActionMenu
          ariaLabel={`Acciones para ${course.code}`}
          items={
            isMockCourse
              ? [{ label: "Curso Mock (Primer Año)", icon: <BookOpen size={14} className="text-amber-600" />, onClick: onMockNotice }]
              : [
                  {
                    label: "Ver panel",
                    icon: <ArrowRight size={14} className="text-[#008EE2]" />,
                    onClick: () => isAutomated ? onOpenCourse(course.id) : onAutomateCourse(course.id),
                  },
                  ...(!isAutomated ? [{
                    label: "Automatizar con IA",
                    icon: <Sparkles size={14} className="text-[#C8102E]" />,
                    onClick: () => onAutomateCourse(course.id),
                  }] : []),
                ]
          }
        />
      </CanvasTableCell>
    </CanvasTableRow>
  );
};
