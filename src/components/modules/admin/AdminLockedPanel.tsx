"use client";

import React from "react";
import { LockKeyhole } from "lucide-react";

interface AdminLockedPanelProps { title: string; description: string; }

export const AdminLockedPanel: React.FC<AdminLockedPanelProps> = ({ title, description }) => (
  <div className="border border-[#E0E3E6] bg-[#F5F6F8] rounded-[4px] p-8 text-center max-w-2xl mx-auto">
    <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-white border border-[#C7CDD1] flex items-center justify-center text-[#6B7780]"><LockKeyhole size={18} /></div>
    <h2 className="text-base font-bold text-[#2D3B45]">{title}</h2>
    <p className="text-xs text-[#6B7780] mt-2 leading-relaxed">{description}</p>
    <span className="inline-block mt-4 text-[11px] font-semibold text-[#6B7780] bg-white border border-[#C7CDD1] px-2 py-1 rounded">Módulo bloqueado</span>
  </div>
);
