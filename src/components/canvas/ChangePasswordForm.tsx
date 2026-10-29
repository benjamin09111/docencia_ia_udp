"use client";

import React, { useState } from "react";
import { KeyRound } from "lucide-react";

export const ChangePasswordForm: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await response.json();
      setMessage(response.ok ? "Contraseña actualizada correctamente." : data.error || "No fue posible actualizar la contraseña.");
      if (response.ok) {
        setCurrentPassword("");
        setNewPassword("");
      }
    } catch {
      setMessage("No fue posible actualizar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-2 border-t border-gray-100 pt-3">
      <div className="flex items-center gap-1.5 text-xs font-bold text-[#2D3B45]"><KeyRound size={13} /> Cambiar contraseña</div>
      <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Contraseña actual" required className="w-full rounded border border-gray-300 px-2 py-1.5 text-xs" />
      <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nueva: 14+ caracteres, símbolo, número" required className="w-full rounded border border-gray-300 px-2 py-1.5 text-xs" />
      {message && <p className="text-[11px] text-[#6B7780]">{message}</p>}
      <button disabled={loading} className="w-full rounded border border-[#B71C1C] px-3 py-1.5 text-xs font-bold text-[#B71C1C] hover:bg-red-50 disabled:opacity-60">{loading ? "Actualizando..." : "Actualizar contraseña"}</button>
    </form>
  );
};
