"use client";

import React from "react";
import { Mail, Building2, Clock, Plus, Trash2, Globe } from "lucide-react";

interface TeacherProfileContactFieldsProps {
  hasOffice: boolean;
  onToggleOffice: (val: boolean) => void;
  officeLocation: string;
  onChangeOfficeLocation: (val: string) => void;
  officeHours: string;
  onChangeOfficeHours: (val: string) => void;
  emails: string[];
  onChangeEmails: (emails: string[]) => void;
  linkedin: string;
  onChangeLinkedin: (val: string) => void;
}

export const TeacherProfileContactFields: React.FC<TeacherProfileContactFieldsProps> = ({
  hasOffice,
  onToggleOffice,
  officeLocation,
  onChangeOfficeLocation,
  officeHours,
  onChangeOfficeHours,
  emails,
  onChangeEmails,
  linkedin,
  onChangeLinkedin,
}) => {
  const handleEmailChange = (index: number, val: string) => {
    const next = [...emails];
    next[index] = val;
    onChangeEmails(next);
  };

  const handleAddEmail = () => {
    onChangeEmails([...emails, ""]);
  };

  const handleRemoveEmail = (index: number) => {
    if (emails.length <= 1) return;
    onChangeEmails(emails.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4 pt-3 text-xs">
      {/* Switch Oficina Física y Ubicación */}
      <div className="p-3.5 bg-gray-50/80 border border-gray-200 rounded-[4px] space-y-2">
        <div className="flex items-center justify-between">
          <label className="font-bold text-[#2D3B45] flex items-center gap-1.5 cursor-pointer select-none">
            <Building2 size={14} className="text-[#B71C1C]" />
            <span>¿Cuentas con oficina física presencial para alumnos?</span>
          </label>
          <button
            type="button"
            role="switch"
            aria-checked={hasOffice}
            onClick={() => onToggleOffice(!hasOffice)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              hasOffice ? "bg-[#B71C1C]" : "bg-gray-300"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                hasOffice ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {hasOffice ? (
          <div>
            <label className="text-[11px] text-[#55636E] block mb-1">Ubicación de la oficina</label>
            <input
              type="text"
              value={officeLocation}
              onChange={(e) => onChangeOfficeLocation(e.target.value)}
              placeholder="Ej. Pabellón de Informática, Oficina 402 (Edificio Ejército 441)"
              className="w-full p-2 bg-white border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#B71C1C]"
            />
          </div>
        ) : (
          <p className="text-[11px] text-gray-500 italic">Sin oficina física presencial (Atención remota/virtual).</p>
        )}
      </div>

      {/* Horario de Atención y LinkedIn */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 bg-gray-50/80 border border-gray-200 rounded-[4px]">
          <label className="font-bold text-[#2D3B45] flex items-center gap-1.5 mb-1.5">
            <Clock size={13} className="text-[#008EE2]" />
            <span>Horarios de atención</span>
          </label>
          <input
            type="text"
            value={officeHours}
            onChange={(e) => onChangeOfficeHours(e.target.value)}
            placeholder="Ej: Miércoles 14:00 - 16:00 hrs"
            className="w-full p-2 bg-white border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#B71C1C]"
          />
        </div>

        <div className="p-3 bg-gray-50/80 border border-gray-200 rounded-[4px]">
          <label className="font-bold text-[#2D3B45] flex items-center gap-1.5 mb-1.5">
            <Globe size={13} className="text-[#0077B5]" />
            <span>LinkedIn</span>
          </label>
          <input
            type="url"
            value={linkedin}
            onChange={(e) => onChangeLinkedin(e.target.value)}
            placeholder="https://www.linkedin.com/in/tu-perfil"
            className="w-full p-2 bg-white border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#B71C1C]"
          />
        </div>
      </div>

      {/* Correos Electrónicos Oficiales con Botón + */}
      <div className="p-3 bg-gray-50/80 border border-gray-200 rounded-[4px] space-y-2">
        <div className="flex items-center justify-between">
          <label className="font-bold text-[#2D3B45] flex items-center gap-1.5">
            <Mail size={13} className="text-[#B71C1C]" />
            <span>Correo electrónico oficial</span>
          </label>
          <button
            type="button"
            onClick={handleAddEmail}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#B71C1C] hover:text-[#8E1010] bg-white border border-red-200 px-2 py-0.5 rounded cursor-pointer"
          >
            <Plus size={12} />
            <span>Agregar otro correo</span>
          </button>
        </div>

        <div className="space-y-1.5">
          {emails.map((email, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(idx, e.target.value)}
                placeholder={`correo${idx > 0 ? ` alternativo ${idx}` : " oficial"}@mail.udp.cl`}
                className="w-full p-2 bg-white border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#B71C1C]"
              />
              {emails.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveEmail(idx)}
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded cursor-pointer"
                  title="Eliminar correo"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

