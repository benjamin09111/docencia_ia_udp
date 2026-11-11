"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, KeyRound, Building2, ExternalLink } from "lucide-react";
import { CanvasAccountModal } from "./CanvasAccountModal";

interface CanvasTokenStatusBarProps {
  onTokenChanged?: () => void;
}

export const CanvasTokenStatusBar: React.FC<CanvasTokenStatusBarProps> = ({ onTokenChanged }) => {
  const [profile, setProfile] = useState<{
    name: string;
    role: string;
    faculty: string;
    school: string;
    hasCanvasToken: boolean;
    tokenMasked?: string | null;
  } | null>(null);

  const [showModal, setShowModal] = useState(false);

  const fetchStatus = () => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.authenticated && data.user) {
          setProfile(data.user);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleModalClose = () => {
    setShowModal(false);
    fetchStatus();
    onTokenChanged?.();
  };

  if (!profile) return null;

  return (
    <>
      <div className="space-y-2 mb-4">
        {/* Cabecera de Afiliación Institucional Automática (Facultad de Ingeniería y Ciencias) */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-gray-50 border border-[#E0E3E6] rounded-[3px] text-xs">
          <div className="flex items-center gap-2 text-[#2D3B45] font-semibold">
            <Building2 size={14} className="text-[#B71C1C] shrink-0" />
            <span>Facultad de Ingeniería y Ciencias (FIC)</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500 font-normal truncate">Escuela de Informática y Telecomunicaciones</span>
          </div>
          <span className="text-[10px] bg-red-50 text-[#B71C1C] border border-red-200 px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
            {profile.role}
          </span>
        </div>

        {/* Banner de Estado del Token de Canvas */}
        {profile.hasCanvasToken ? (
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-emerald-50/70 border border-emerald-200 rounded-[3px] text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
              <div className="min-w-0">
                <span className="font-bold text-emerald-950 block sm:inline mr-2">
                  Canvas UDP Conectado
                </span>
                <span className="text-emerald-800 text-[11px] truncate">
                  Sincronización oficial activa con tus asignaturas del semestre ({profile.tokenMasked || "Token activo"}).
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="text-[11px] font-semibold text-emerald-900 hover:text-emerald-950 underline shrink-0 ml-3 cursor-pointer"
            >
              Gestionar
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-3.5 py-2.5 bg-[#FFF9F5] border border-amber-300 rounded-[3px] text-xs shadow-2xs">
            <div className="flex items-start sm:items-center gap-2.5 min-w-0">
              <KeyRound size={17} className="text-[#B71C1C] shrink-0 mt-0.5 sm:mt-0" />
              <div className="min-w-0">
                <span className="font-bold text-[#2D3B45] block sm:inline mr-2">
                  Token de Canvas no vinculado
                </span>
                <span className="text-gray-600 text-[11px]">
                  Estás visualizando asignaturas en modo Piloto/Sandbox. Vincula tu Token Personal de Canvas para cargar directamente tus cursos oficiales del semestre.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="self-end sm:self-auto px-3 py-1.5 bg-[#B71C1C] hover:bg-[#991515] text-white text-[11px] font-bold rounded-[3px] flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer shadow-2xs"
            >
              <span>+ Vincular Token Canvas</span>
            </button>
          </div>
        )}
      </div>

      <CanvasAccountModal isOpen={showModal} onClose={handleModalClose} />
    </>
  );
};

