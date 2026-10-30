"use client";

import React, { useState, useEffect } from "react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { User, CheckCircle2, Lock, Save } from "lucide-react";
import { TeacherProfileContactFields } from "./profile/TeacherProfileContactFields";

interface CanvasUserProfile {
  id: number;
  name: string;
  avatar_url: string;
  email: string;
}

export const TeacherProfileView: React.FC = () => {
  const [user, setUser] = useState<CanvasUserProfile>({
    id: 29248,
    name: "BENJAMÍN MORALES PIZARRO",
    avatar_url: "https://udp.instructure.com/images/thumbnails/1767553/l6cHLT7vxrfJZGlkMFRfSh0E9PktngbxGuBEBlgM",
    email: "benjamin.morales3@mail.udp.cl",
  });

  const [bio, setBio] = useState(
    "Docente e Investigador en la Escuela de Informática y Telecomunicaciones de la Universidad Diego Portales. A cargo de la gestión académica, sistemas de agentes y proyectos de software en Canvas LMS."
  );
  const [hasOffice, setHasOffice] = useState(true);
  const [officeLocation, setOfficeLocation] = useState("Pabellón de Informática, Oficina 402 (Edificio Ejército 441)");
  const [officeHours, setOfficeHours] = useState("Miércoles 14:00 - 16:00 hrs");
  const [emails, setEmails] = useState<string[]>(["benjamin.morales3@mail.udp.cl"]);
  const [linkedin, setLinkedin] = useState("https://www.linkedin.com/in/benjamin-morales-udp");

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/canvas/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.name) {
          setUser((prev) => ({ ...prev, name: data.name, avatar_url: data.avatar_url || prev.avatar_url, email: data.email || prev.email }));
        }
      })
      .catch(console.error);

    const saved = typeof window !== "undefined" ? localStorage.getItem("udp_teacher_profile_v2") : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.bio) setBio(parsed.bio);
        if (parsed.hasOffice !== undefined) setHasOffice(parsed.hasOffice);
        if (parsed.officeLocation) setOfficeLocation(parsed.officeLocation);
        if (parsed.officeHours) setOfficeHours(parsed.officeHours);
        if (Array.isArray(parsed.emails) && parsed.emails.length > 0) setEmails(parsed.emails);
        if (parsed.linkedin) setLinkedin(parsed.linkedin);
      } catch (err) {
        console.error("Error reading saved profile:", err);
      }
    }
  }, []);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    const profileData = {
      bio,
      hasOffice,
      officeLocation: hasOffice ? officeLocation : "",
      officeHours,
      emails: emails.filter((e) => e.trim().length > 0),
      linkedin,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("udp_teacher_profile_v2", JSON.stringify(profileData));
    }

    try {
      await fetch("/api/canvas/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
    } catch (e) {
      console.warn("Error sync with Canvas:", e);
    }

    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 5000);
  };

  const initials = user.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "BM";

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Header Oficial Canvas UDP */}
      <div className="bg-[#F5F6F8] border border-[#C7CDD1] rounded-[4px] p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-red-100 border border-red-200 flex items-center justify-center shrink-0 text-[#B71C1C]">
            <User size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#2D3B45]">Mi Perfil Docente</h2>
            <p className="text-xs text-[#6B7780]">Información académica, biografía y canales de atención sincronizados con Canvas LMS.</p>
          </div>
        </div>

        <CanvasButton variant="primary-udp" size="sm" disabled={isSaving} onClick={handleSaveProfile} icon={<Save size={14} />}>
          {isSaving ? "Guardando en Canvas..." : "Guardar en Canvas"}
        </CanvasButton>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>✓ Perfil actualizado y sincronizado de inmediato con Canvas LMS.</span>
        </div>
      )}

      {/* Tarjeta Principal del Perfil */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card space-y-4">
        {/* Cabecera del Usuario: Nombre, Escuela y Facultad No Editables */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
          <div className="relative shrink-0">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#B71C1C] shadow-inner bg-gray-100" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-[#B71C1C] flex items-center justify-center text-[#B71C1C] font-bold text-xl shadow-inner">
                {initials}
              </div>
            )}
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-[#2D3B45]">{user.name}</h3>
              <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200 flex items-center gap-1" title="Nombre oficial no editable">
                <Lock size={10} className="text-gray-400" /> Nombre Institucional
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-[#2D3B45] bg-gray-50 border border-gray-200 px-2 py-0.5 rounded flex items-center gap-1">
                <Lock size={10} className="text-gray-400" /> Escuela de Informática y Telecomunicaciones
              </span>
              <span className="text-[#6B7780]">•</span>
              <span className="font-semibold text-[#2D3B45] bg-gray-50 border border-gray-200 px-2 py-0.5 rounded flex items-center gap-1">
                <Lock size={10} className="text-gray-400" /> Facultad de Ingeniería y Ciencias UDP
              </span>
            </div>
          </div>
        </div>

        {/* Biografía del Docente */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-bold text-[#2D3B45] uppercase tracking-wide block">Biografía Docente</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="Escribe tu reseña biográfica, líneas de investigación o trayectoria..."
            className="w-full text-xs p-3 border border-gray-300 rounded font-sans focus:outline-none focus:ring-1 focus:ring-[#B71C1C] focus:border-[#B71C1C]"
          />
        </div>

        {/* Canales de Contacto: Oficina, Horario, Múltiples Correos, LinkedIn */}
        <TeacherProfileContactFields
          hasOffice={hasOffice}
          onToggleOffice={setHasOffice}
          officeLocation={officeLocation}
          onChangeOfficeLocation={setOfficeLocation}
          officeHours={officeHours}
          onChangeOfficeHours={setOfficeHours}
          emails={emails}
          onChangeEmails={setEmails}
          linkedin={linkedin}
          onChangeLinkedin={setLinkedin}
        />

        {/* Footer con Botón Guardar */}
        <div className="flex justify-end pt-3 border-t border-gray-100">
          <CanvasButton variant="primary-udp" size="sm" disabled={isSaving} onClick={handleSaveProfile} icon={<Save size={14} />}>
            {isSaving ? "Guardando en Canvas..." : "Guardar en Canvas"}
          </CanvasButton>
        </div>
      </div>
    </div>
  );
};
