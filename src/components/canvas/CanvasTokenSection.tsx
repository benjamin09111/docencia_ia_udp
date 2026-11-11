"use client";

import React, { useState } from "react";
import { KeyRound, CheckCircle, AlertCircle, Loader2, Trash2 } from "lucide-react";

interface CanvasTokenSectionProps {
  hasCanvasToken: boolean;
  tokenMasked?: string | null;
  onTokenUpdated: () => void;
}

export const CanvasTokenSection: React.FC<CanvasTokenSectionProps> = ({
  hasCanvasToken,
  tokenMasked,
  onTokenUpdated,
}) => {
  const [tokenInput, setTokenInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSaveToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;

    setLoading(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/auth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenInput.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatusMsg({ type: "error", text: data.error || "Token inválido o expirado." });
      } else {
        setStatusMsg({
          type: "success",
          text: `¡Vinculado con éxito! Canvas: ${data.canvasUser?.name || "Activo"}`,
        });
        setTokenInput("");
        onTokenUpdated();
      }
    } catch {
      setStatusMsg({ type: "error", text: "Error de red al conectar con Canvas UDP." });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveToken = async () => {
    if (!confirm("¿Deseas desvincular tu token de Canvas UDP?")) return;
    setLoading(true);
    try {
      await fetch("/api/auth/token", { method: "DELETE" });
      setStatusMsg({ type: "success", text: "Token desvinculado. Usando cursos asignados." });
      onTokenUpdated();
    } catch {
      setStatusMsg({ type: "error", text: "No se pudo desvincular el token." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 bg-gray-50 border border-gray-200 rounded text-xs space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="font-bold text-[#2D3B45] flex items-center gap-1.5">
          <KeyRound size={13} className="text-[#B71C1C]" /> Token Canvas UDP
        </span>
        {hasCanvasToken ? (
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
            <CheckCircle size={10} /> Vinculado
          </span>
        ) : (
          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
            Sin vincular
          </span>
        )}
      </div>

      {hasCanvasToken && tokenMasked && (
        <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded border border-gray-200 font-mono text-[11px] text-gray-700">
          <span>{tokenMasked}</span>
          <button
            type="button"
            onClick={handleRemoveToken}
            disabled={loading}
            className="text-red-600 hover:text-red-800 p-0.5 rounded transition-colors cursor-pointer"
            title="Desvincular token"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}

      {statusMsg && (
        <div
          className={`p-2 rounded text-[11px] flex items-center gap-1.5 ${
            statusMsg.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {statusMsg.type === "success" ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      <form onSubmit={handleSaveToken} className="space-y-1.5">
        <input
          type="password"
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder={hasCanvasToken ? "Actualizar token..." : "Pegar token Canvas UDP..."}
          className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E0E3E6] rounded focus:border-[#B71C1C] focus:outline-hidden"
        />
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-gray-500">
            Canvas &gt; Cuenta &gt; Configuraciones &gt; + Nuevo token
          </span>
          <button
            type="submit"
            disabled={loading || !tokenInput.trim()}
            className="px-2.5 py-1 bg-[#2D3B45] hover:bg-[#1E272D] text-white text-[11px] font-bold rounded flex items-center gap-1 disabled:opacity-50 cursor-pointer"
          >
            {loading && <Loader2 size={11} className="animate-spin" />}
            <span>{hasCanvasToken ? "Actualizar" : "Vincular"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

