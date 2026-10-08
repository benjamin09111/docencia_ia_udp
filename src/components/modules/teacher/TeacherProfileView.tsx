"use client";

import React, { useState, useEffect } from "react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import {
  User,
  Mail,
  Building2,
  Clock,
  Edit3,
  Check,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

interface CanvasUserProfile {
  id: number;
  name: string;
  short_name: string;
  avatar_url: string;
  email: string;
  role?: string;
}

export const TeacherProfileView: React.FC = () => {
  const [user, setUser] = useState<CanvasUserProfile>({
    id: 29248,
    name: "BENJAMÍN MORALES PIZARRO",
    short_name: "Benjamín Morales",
    avatar_url: "https://udp.instructure.com/images/thumbnails/1767553/l6cHLT7vxrfJZGlkMFRfSh0E9PktngbxGuBEBlgM",
    email: "benjamin.morales3@mail.udp.cl",
    role: "admin",
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const [bio, setBio] = useState(
    "Docente e Investigador en la Escuela de Informática y Telecomunicaciones de la Universidad Diego Portales. A cargo de la gestión académica, sistemas de agentes y proyectos de software en Canvas LMS."
  );
  const [isEditing, setIsEditing] = useState(false);
  const [tempBio, setTempBio] = useState(bio);
  const [horarioAtencion, setHorarioAtencion] = useState("Miércoles 14:00 - 16:00 hrs (Oficina 402 / Teams)");
  const [oficina, setOficina] = useState("Pabellón de Informática, Oficina 402 (Edificio Ejército 441)");

  const fetchProfile = () => {
    setIsSyncing(true);
    fetch("/api/canvas/me")
      .then((res) => {
        if (!res.ok) throw new Error("Error fetching");
        return res.json();
      })
      .then((data) => {
        if (data && data.name) {
          setUser(data);
          setSyncSuccess(true);
          setTimeout(() => setSyncSuccess(false), 4000);
        }
      })
      .catch((err) => console.error("Error al sincronizar perfil Canvas:", err))
      .finally(() => setIsSyncing(false));
  };

  useEffect(() => {
    fetchProfile();
    if (typeof window !== "undefined") {
      const savedBio = localStorage.getItem("udp_teacher_global_bio");
      if (savedBio) {
        setBio(savedBio);
        setTempBio(savedBio);
      }
    }
  }, []);

  const handleSaveBio = () => {
    setBio(tempBio);
    if (typeof window !== "undefined") {
      localStorage.setItem("udp_teacher_global_bio", tempBio);
    }
    setIsEditing(false);
  };

  // Obtener iniciales para avatar de respaldo
  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "BM";

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Banner Principal Canvas */}
      <div className="bg-[#F5F6F8] border border-[#C7CDD1] rounded-[4px] p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[4px] bg-red-100 border border-red-200 flex items-center justify-center shrink-0 text-[#B71C1C]">
            <User size={22} />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#2D3B45]">
              Mi Perfil Docente & Credencial Canvas UDP
            </h2>
            <p className="text-xs text-[#6B7780]">
              Identidad oficial en Canvas Instructure obtenida mediante token de acceso seguro.
            </p>
          </div>
        </div>

        <CanvasButton
          variant="outline"
          size="sm"
          disabled={isSyncing}
          onClick={fetchProfile}
          icon={<RefreshCw size={13} className={isSyncing ? "animate-spin" : ""} />}
        >
          {isSyncing ? "Sincronizando..." : "Sincronizar con Canvas"}
        </CanvasButton>
      </div>

      {syncSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>
            Perfil sincronizado exitosamente con Canvas LMS Instructure (ID Canvas: <strong>{user.id}</strong>).
          </span>
        </div>
      )}

      {/* Ficha del Profesor */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-5 border-b border-gray-100">
          <div className="relative">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#B71C1C] shadow-inner bg-gray-100"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-[#B71C1C] flex items-center justify-center text-[#B71C1C] font-bold text-2xl shadow-inner">
                {initials}
              </div>
            )}
            <span
              className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"
              title="Token Canvas UDP Activo"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-[#2D3B45]">{user.name}</h3>
              <span className="text-[11px] bg-red-100 text-[#B71C1C] font-semibold px-2 py-0.5 rounded border border-red-200">
                Docente / Administrador CREA UDP
              </span>
              <span className="text-[10px] font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200 flex items-center gap-1">
                <ShieldCheck size={11} className="text-emerald-600" /> ID Canvas: {user.id}
              </span>
            </div>
            <p className="text-xs text-[#55636E]">
              Escuela de Informática y Telecomunicaciones • Facultad de Ingeniería UDP
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B7780] pt-1">
              <span className="flex items-center gap-1">
                <Mail size={13} className="text-gray-400" /> {user.email}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Building2 size={13} className="text-gray-400" /> UDP Instructure SSO
              </span>
            </div>
          </div>
        </div>

        {/* Biografía Docente */}
        <div className="pt-4 space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-[#2D3B45] uppercase tracking-wide">
              Biografía Docente (Sincronizada con Canvas LMS)
            </label>
            {!isEditing ? (
              <button
                type="button"
                onClick={() => {
                  setTempBio(bio);
                  setIsEditing(true);
                }}
                className="text-xs text-[#008EE2] hover:underline flex items-center gap-1 font-semibold"
              >
                <Edit3 size={12} /> Editar
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-gray-500 hover:underline"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveBio}
                  className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1"
                >
                  <Check size={12} /> Guardar
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <textarea
              value={tempBio}
              onChange={(e) => setTempBio(e.target.value)}
              rows={4}
              className="w-full text-xs p-3 border border-gray-300 rounded font-sans focus:outline-none focus:ring-1 focus:ring-[#008EE2]"
            />
          ) : (
            <p className="text-xs text-[#55636E] leading-relaxed bg-[#F5F6F8] p-3.5 rounded border border-[#E0E3E6] whitespace-pre-line">
              {bio}
            </p>
          )}
        </div>

        {/* Horarios de Atención y Despacho */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-xs">
          <div className="p-3 bg-gray-50 rounded border border-gray-200">
            <span className="font-bold text-[#2D3B45] flex items-center gap-1.5 mb-1">
              <Clock size={13} className="text-[#008EE2]" /> Horario de Atención y Consultas
            </span>
            <input
              type="text"
              value={horarioAtencion}
              onChange={(e) => setHorarioAtencion(e.target.value)}
              className="w-full p-1.5 text-xs bg-white border border-gray-300 rounded"
            />
          </div>

          <div className="p-3 bg-gray-50 rounded border border-gray-200">
            <span className="font-bold text-[#2D3B45] flex items-center gap-1.5 mb-1">
              <Building2 size={13} className="text-[#B71C1C]" /> Oficina / Sala de Reuniones
            </span>
            <input
              type="text"
              value={oficina}
              onChange={(e) => setOficina(e.target.value)}
              className="w-full p-1.5 text-xs bg-white border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
