"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export interface PendingAppealItem {
  id: string;
  studentName: string;
  motivo: string;
  courseCode: string;
}

export interface PendingReviewItem {
  id: string;
  title: string;
  studentOrGroup: string;
  courseCode: string;
  fecha: string;
}

interface TeacherPendingSummaryProps {
  appeals?: PendingAppealItem[];
  reviews?: PendingReviewItem[];
  onSelectCourse?: (courseCode: string) => void;
}

export const TeacherPendingSummary: React.FC<TeacherPendingSummaryProps> = ({
  appeals = [],
  reviews = [],
  onSelectCourse,
}) => {
  const [appealsOpen, setAppealsOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);

  const totalCount = appeals.length + reviews.length;

  return (
    <div className="text-xs select-none space-y-2">
      {/* Encabezado del Resumen Recopilador */}
      <div className="text-xs font-semibold text-[#6B7780] uppercase tracking-wider px-2 pb-1 flex items-center justify-between">
        <span>Resumen Pendiente</span>
        <span className="text-xs font-mono bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-bold">
          {totalCount}
        </span>
      </div>

      {/* 1. Sección: Apelaciones */}
      <div className="bg-white rounded border border-[#E0E3E6] overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => setAppealsOpen(!appealsOpen)}
          className="w-full text-left p-2.5 bg-gray-50/80 hover:bg-gray-100/80 transition-colors flex items-center justify-between font-semibold text-[#2D3B45] cursor-pointer"
        >
          <div className="flex items-center gap-1.5 min-w-0">
            {appealsOpen ? <ChevronDown size={14} className="text-[#6B7780]" /> : <ChevronRight size={14} className="text-[#6B7780]" />}
            <span className="truncate">Apelaciones</span>
          </div>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded ${
              appeals.length > 0 ? "bg-red-100 text-[#B71C1C]" : "bg-gray-100 text-gray-500"
            }`}
          >
            {appeals.length}
          </span>
        </button>

        {appealsOpen && (
          <div className="divide-y divide-gray-100 bg-white">
            {appeals.length === 0 ? (
              <p className="p-2.5 text-xs text-[#6B7780] italic">Sin apelaciones pendientes.</p>
            ) : (
              appeals.map((app) => (
                <div
                  key={app.id}
                  onClick={() => onSelectCourse?.(app.courseCode)}
                  className="p-2.5 hover:bg-red-50/40 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-xs text-[#2D3B45] group-hover:text-[#B71C1C] truncate block">
                      {app.studentName}
                    </span>
                    <span className="text-xs font-mono text-[#008EE2] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                      {app.courseCode.split("_")[0]}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7780] truncate mt-1">{app.motivo}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* 2. Sección: Por revisar */}
      <div className="bg-white rounded border border-[#E0E3E6] overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => setReviewsOpen(!reviewsOpen)}
          className="w-full text-left p-2.5 bg-gray-50/80 hover:bg-gray-100/80 transition-colors flex items-center justify-between font-semibold text-[#2D3B45] cursor-pointer"
        >
          <div className="flex items-center gap-1.5 min-w-0">
            {reviewsOpen ? <ChevronDown size={14} className="text-[#6B7780]" /> : <ChevronRight size={14} className="text-[#6B7780]" />}
            <span className="truncate">Por revisar</span>
          </div>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded ${
              reviews.length > 0 ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-500"
            }`}
          >
            {reviews.length}
          </span>
        </button>

        {reviewsOpen && (
          <div className="divide-y divide-gray-100 bg-white">
            {reviews.length === 0 ? (
              <p className="p-2.5 text-xs text-[#6B7780] italic">Todo al día.</p>
            ) : (
              reviews.map((rev) => (
                <div
                  key={rev.id}
                  onClick={() => onSelectCourse?.(rev.courseCode)}
                  className="p-2.5 hover:bg-amber-50/40 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-xs text-[#2D3B45] group-hover:text-[#008EE2] truncate block">
                      {rev.title}
                    </span>
                    <span className="text-xs text-[#6B7780] shrink-0 ml-1">{rev.fecha}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#6B7780] mt-1">
                    <span className="truncate">{rev.studentOrGroup}</span>
                    <span className="text-xs font-mono text-[#55636E]">{rev.courseCode.split("_")[0]}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
