"use client";

import React, { useMemo } from "react";
import { CanvasCourse } from "@/types";
import { Layers, Users } from "lucide-react";

interface CourseSisterSectionsBarProps {
  currentCourse: CanvasCourse;
  allCourses?: CanvasCourse[];
  onSwitchCourse?: (courseId: number) => void;
}

export const CourseSisterSectionsBar: React.FC<CourseSisterSectionsBarProps> = ({
  currentCourse,
  allCourses = [],
  onSwitchCourse,
}) => {
  const baseCode = useMemo(() => {
    return currentCourse.code.includes("_")
      ? currentCourse.code.split("_")[0]
      : currentCourse.code;
  }, [currentCourse.code]);

  const sisterCourses = useMemo(() => {
    if (!allCourses || allCourses.length === 0) return [];
    return allCourses
      .filter((c) => {
        const cBase = c.code.includes("_") ? c.code.split("_")[0] : c.code;
        return cBase.toUpperCase() === baseCode.toUpperCase();
      })
      .sort((a, b) => a.code.localeCompare(b.code));
  }, [allCourses, baseCode]);

  if (sisterCourses.length <= 1) return null;

  return (
    <div className="bg-[#F8F9FA] border border-[#C7CDD1] rounded-[3px] p-2.5 mb-4 flex flex-wrap items-center justify-between gap-2 text-xs">
      <div className="flex items-center gap-2">
        <span className="text-[#008EE2] bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
          <Layers size={13} />
          <span>Multisección {baseCode}</span>
        </span>
        <span className="text-[#55636E] hidden sm:inline">
          Cambiar de sección en 1 clic:
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {sisterCourses.map((c) => {
          const isActive = c.id === currentCourse.id;
          const sectionPart = c.code.includes("_") ? c.code.split("_")[1] : c.code;

          return (
            <button
              key={c.id}
              type="button"
              disabled={isActive}
              onClick={() => onSwitchCourse?.(c.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all ${
                isActive
                  ? "bg-[#B71C1C] text-white shadow-2xs cursor-default"
                  : "bg-white text-[#2D3B45] border border-gray-300 hover:border-[#B71C1C] hover:text-[#B71C1C]"
              }`}
            >
              <span>{sectionPart}</span>
              <span className={`text-xs flex items-center gap-0.5 ${isActive ? "text-red-100" : "text-gray-500"}`}>
                <Users size={12} />
                <span>{c.students_count || 0}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
