"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  AlertCircle,
  FileText,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface PendingAppealItem {
  id: string;
  studentName: string;
  motivo: string;
  courseCode: string;
}

interface PendingReviewItem {
  id: string;
  title: string;
  studentOrGroup: string;
  courseCode: string;
  fecha: string;
}

const DEFAULT_PENDING_APPEALS: PendingAppealItem[] = [
  {
    id: "app-1",
    studentName: "Tomás Morales",
    motivo: "Licencia médica justificada (Sesión 05 Oct)",
    courseCode: "CIT3203_CA01",
  },
  {
    id: "app-2",
    studentName: "Francisca Soto",
    motivo: "Falla de señal GPS en sala L-204",
    courseCode: "CIT3100_CA02",
  },
];

const DEFAULT_PENDING_REVIEWS: PendingReviewItem[] = [
  {
    id: "rev-1",
    title: "Informe Hito 2: Arquitectura Base",
    studentOrGroup: "Grupo 4 (Capstone)",
    courseCode: "CIT3203_CA01",
    fecha: "Ayer 23:59",
  },
  {
    id: "rev-2",
    title: "Taller Microservicios & Kubernetes",
    studentOrGroup: "Vicente Tapia",
    courseCode: "CIT3100_CA02",
    fecha: "Hoy 10:15",
  },
  {
    id: "rev-3",
    title: "Caso Harvard: Netflix & Dinámica",
    studentOrGroup: "Sofía Henríquez",
    courseCode: "CIT2206_CA01",
    fecha: "06 Oct",
  },
];

interface TeacherPendingSummaryProps {
  onSelectCourse?: (courseCode: string) => void;
}

export const TeacherPendingSummary: React.FC<TeacherPendingSummaryProps> = ({
  onSelectCourse,
}) => {
  const [appealsOpen, setAppealsOpen] = useState(true);
  const [reviewsOpen, setReviewsOpen] = useState(true);
  const [appeals, setAppeals] = useState<PendingAppealItem[]>(DEFAULT_PENDING_APPEALS);
  const [reviews, setReviews] = useState<PendingReviewItem[]>(DEFAULT_PENDING_REVIEWS);

  return (
    <div className="text-xs select-none space-y-2">
      {/* Encabezado del Resumen Recopilador */}
      <div className="text-[11px] font-bold text-[#6B7780] uppercase tracking-wider px-2 pb-1 flex items-center justify-between">
        <span>Resumen Pendiente</span>
        <span className="text-[10px] font-mono bg-gray-200 text-gray-700 px-1.5 py-0.2 rounded font-bold">
          {appeals.length + reviews.length}
        </span>
      </div>

      {/* 1. Sección: Apelaciones */}
      <div className="bg-white rounded border border-[#E0E3E6] overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => setAppealsOpen(!appealsOpen)}
          className="w-full text-left p-2 bg-gray-50/80 hover:bg-gray-100/80 transition-colors flex items-center justify-between font-semibold text-[#2D3B45]"
        >
          <div className="flex items-center gap-1.5 min-w-0">
            {appealsOpen ? <ChevronDown size={13} className="text-[#6B7780]" /> : <ChevronRight size={13} className="text-[#6B7780]" />}
            <span className="truncate">Apelaciones</span>
          </div>
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              appeals.length > 0 ? "bg-red-100 text-[#B71C1C]" : "bg-gray-100 text-gray-500"
            }`}
          >
            {appeals.length}
          </span>
        </button>

        {appealsOpen && (
          <div className="divide-y divide-gray-100 bg-white">
            {appeals.length === 0 ? (
              <p className="p-2 text-[11px] text-[#6B7780] italic">Sin apelaciones pendientes.</p>
            ) : (
              appeals.map((app) => (
                <div
                  key={app.id}
                  onClick={() => onSelectCourse?.(app.courseCode)}
                  className="p-2 hover:bg-red-50/40 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#2D3B45] group-hover:text-[#B71C1C] truncate block">
                      {app.studentName}
                    </span>
                    <span className="text-[9px] font-mono text-[#008EE2] bg-blue-50 px-1 rounded">
                      {app.courseCode.split("_")[0]}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#6B7780] truncate mt-0.5">{app.motivo}</p>
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
          className="w-full text-left p-2 bg-gray-50/80 hover:bg-gray-100/80 transition-colors flex items-center justify-between font-semibold text-[#2D3B45]"
        >
          <div className="flex items-center gap-1.5 min-w-0">
            {reviewsOpen ? <ChevronDown size={13} className="text-[#6B7780]" /> : <ChevronRight size={13} className="text-[#6B7780]" />}
            <span className="truncate">Por revisar</span>
          </div>
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              reviews.length > 0 ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-500"
            }`}
          >
            {reviews.length}
          </span>
        </button>

        {reviewsOpen && (
          <div className="divide-y divide-gray-100 bg-white">
            {reviews.length === 0 ? (
              <p className="p-2 text-[11px] text-[#6B7780] italic">Todo al día.</p>
            ) : (
              reviews.map((rev) => (
                <div
                  key={rev.id}
                  onClick={() => onSelectCourse?.(rev.courseCode)}
                  className="p-2 hover:bg-amber-50/40 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#2D3B45] group-hover:text-[#008EE2] truncate block">
                      {rev.title}
                    </span>
                    <span className="text-[9px] text-[#6B7780] shrink-0 ml-1">{rev.fecha}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#6B7780] mt-0.5">
                    <span className="truncate">{rev.studentOrGroup}</span>
                    <span className="text-[9px] font-mono text-[#55636E]">{rev.courseCode.split("_")[0]}</span>
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
