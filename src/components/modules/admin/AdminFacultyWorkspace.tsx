"use client";

import React, { useState } from "react";
import { Bell, Bot, Calendar, GraduationCap, LockKeyhole, Scale, Users } from "lucide-react";
import { InstitutionalFaculty } from "@/constants/institutionalHierarchy";
import { CanvasCourseNav, CourseNavItem } from "@/components/canvas/CanvasCourseNav";
import { AdminAgentsTableTab } from "./AdminAgentsTableTab";
import { AdminCourseScheduleManagement } from "./AdminCourseScheduleManagement";
import { AdminGradeScaleTab } from "./AdminGradeScaleTab";
import { AdminLockedPanel } from "./AdminLockedPanel";

interface Props { faculty: InstitutionalFaculty; onBack: () => void; }
type FacultyTab = "courses" | "agents" | "announcements" | "grades" | "rules" | "assistants" | "teachers" | "exams" | "close";

const locked = new Set<FacultyTab>(["rules", "assistants", "teachers", "exams", "close"]);

export const AdminFacultyWorkspace: React.FC<Props> = ({ faculty, onBack }) => {
  const [active, setActive] = useState<FacultyTab>("courses");
  const items: CourseNavItem[] = [
    { id: "courses", label: "Cursos y horarios", icon: <Calendar size={15} /> },
    { id: "agents", label: "Agentes", icon: <Bot size={15} /> },
    { id: "announcements", label: "Anuncios", icon: <Bell size={15} /> },
    { id: "grades", label: "Escala y notas", icon: <Scale size={15} /> },
    { id: "rules", label: "Reglas", icon: <LockKeyhole size={15} />, badge: <LockKeyhole size={12} /> },
    { id: "assistants", label: "Ayudantías", icon: <Users size={15} />, badge: <LockKeyhole size={12} /> },
    { id: "teachers", label: "Docentes", icon: <GraduationCap size={15} />, badge: <LockKeyhole size={12} /> },
    { id: "exams", label: "Solemnes", icon: <LockKeyhole size={15} />, badge: <LockKeyhole size={12} /> },
    { id: "close", label: "Cierre de semestre", icon: <LockKeyhole size={15} />, badge: <LockKeyhole size={12} /> },
  ];
  const render = () => {
    if (locked.has(active)) return <AdminLockedPanel title={`${items.find((item) => item.id === active)?.label} bloqueado`} description="Esta capacidad requiere validación institucional antes de habilitarse." />;
    if (active === "courses") return <AdminCourseScheduleManagement />;
    if (active === "agents") return <AdminAgentsTableTab />;
    if (active === "grades") return <AdminGradeScaleTab />;
    return <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 space-y-3"><h2 className="text-base font-bold text-[#2D3B45]">Anuncios de {faculty.nombre}</h2><p className="text-xs text-[#6B7780] leading-relaxed">Mock institucional: configura anuncios segmentados por carrera y define si se publican por Canvas, correo institucional o ambos canales.</p><div className="border border-dashed border-[#C7CDD1] rounded p-4 text-xs text-[#6B7780]">La automatización no está conectada a envíos reales en esta versión.</div></div>;
  };
  return <div className="space-y-4 animate-fadeIn"><div className="border-b border-[#E0E3E6] pb-4 flex items-center justify-between gap-3"><div><p className="text-xs text-[#6B7780]">UDP IA &gt; Facultades</p><h1 className="text-xl font-bold text-[#2D3B45]">{faculty.nombre}</h1></div><button type="button" onClick={onBack} className="text-xs font-semibold text-[#B71C1C] hover:underline">← Volver a Facultades</button></div><div className="flex gap-8 items-start"><CanvasCourseNav termText="2026-2" sectionText={faculty.sigla} items={items} activeId={active} onSelect={(id) => setActive(id as FacultyTab)} /><main className="flex-1 min-w-0">{render()}</main></div></div>;
};
