"use client";

import React, { useState, useEffect } from "react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { Edit3, Check, User, GraduationCap, Mail } from "lucide-react";

interface DashboardStaffAndBioSectionProps {
  courseCode: string;
  studentsCount: number;
}

export const DashboardStaffAndBioSection: React.FC<DashboardStaffAndBioSectionProps> = ({
  courseCode,
  studentsCount,
}) => {
  const storageKey = `udp_teacher_bio_${courseCode}`;
  const [bio, setBio] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempBio, setTempBio] = useState<string>("");

  const [teacherName, setTeacherName] = useState("Benjamín Morales Pizarro");
  const [teacherEmail, setTeacherEmail] = useState("benjamin.morales3@mail.udp.cl");

  useEffect(() => {
    fetch("/api/canvas/me")
      .then((r) => r.json())
      .then((d) => {
        if (d && d.name) {
          setTeacherName(d.name);
          if (d.email) setTeacherEmail(d.email);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setBio(saved);
        setTempBio(saved);
      }
    }
  }, [storageKey]);

  const handleSaveBio = () => {
    setBio(tempBio);
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, tempBio);
    }
    setIsEditing(false);
  };

  return (
    <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-canvas-card">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-3 mb-4">
        <div>
          <h2 className="text-sm font-bold text-[#2D3B45] flex items-center gap-2">
            <GraduationCap size={18} className="text-[#B71C1C]" />
            Equipo Docente & Presentación del Curso
          </h2>
          <p className="text-xs text-[#6B7780]">
            Nómina de profesores a cargo e información visible para los {studentsCount} estudiantes matriculados.
          </p>
        </div>

        {!isEditing ? (
          <CanvasButton
            variant="outline"
            size="sm"
            onClick={() => {
              setTempBio(bio);
              setIsEditing(true);
            }}
            icon={<Edit3 size={13} />}
          >
            {bio ? "Editar Presentación" : "Añadir Presentación"}
          </CanvasButton>
        ) : (
          <div className="flex items-center gap-2">
            <CanvasButton
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              Cancelar
            </CanvasButton>
            <CanvasButton
              variant="primary-canvas"
              size="sm"
              onClick={handleSaveBio}
              icon={<Check size={13} />}
            >
              Guardar
            </CanvasButton>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Tarjeta Profesor Titular */}
        <div className="bg-[#F5F6F8] border border-[#E0E3E6] rounded-[4px] p-3.5 flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 border border-red-200 flex items-center justify-center shrink-0 text-[#B71C1C]">
            <User size={20} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B71C1C] block">
              Profesor Titular / Docente
            </span>
            <p className="text-sm font-bold text-[#2D3B45] truncate">
              {teacherName}
            </p>
            <span className="text-xs text-[#6B7780] flex items-center gap-1.5 mt-0.5">
              <Mail size={12} /> {teacherEmail}
            </span>
          </div>
        </div>

        {/* Tarjeta Ayudante */}
        <div className="bg-[#F5F6F8] border border-[#E0E3E6] rounded-[4px] p-3.5 flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0 text-[#008EE2]">
            <User size={20} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#008EE2] block">
              Ayudante de Cátedra & Taller
            </span>
            <p className="text-sm font-bold text-[#2D3B45] truncate">
              Equipo de Ayudantía Informática UDP
            </p>
            <span className="text-xs text-[#6B7780] flex items-center gap-1.5 mt-0.5">
              <Mail size={12} /> ayudantia.tics@udp.cl
            </span>
          </div>
        </div>
      </div>

      {/* Mi Descripción como Profesor / Ayudante */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#2D3B45] block">
          Mi Presentación y Mensaje de Bienvenida al Curso
        </label>
        {isEditing ? (
          <textarea
            value={tempBio}
            onChange={(e) => setTempBio(e.target.value)}
            rows={4}
            placeholder="Escribe tu saludo inicial, normas de convivencia, canales de resolución de dudas o tu horario de atención presencial/virtual..."
            className="w-full text-xs p-3 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-1 focus:ring-[#008EE2] font-sans"
          />
        ) : (
          <div className="bg-gray-50/70 border border-dashed border-gray-300 rounded-[4px] p-3.5 text-xs text-[#55636E] leading-relaxed">
            {bio ? (
              <p className="whitespace-pre-line">{bio}</p>
            ) : (
              <p className="italic text-[#8C9BA5]">
                Aún no has ingresado una presentación docente. Haz clic en &ldquo;Añadir Presentación&rdquo; para registrar tu bienvenida, correo de contacto y horario de consultas para esta sección.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
