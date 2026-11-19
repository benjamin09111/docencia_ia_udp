"use client";

import React, { useRef, useState } from "react";
import { FileUp, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { extraerProgramaApi, mensajeDeError, type ResultadoExtraccionApi } from "@/services/gestion/clienteApi";
import { Aviso, TarjetaSeccion } from "./piezasFormulario";

const MAX_MB = 4;

interface Props {
  onResultado: (resultado: ResultadoExtraccionApi, nombreArchivo: string) => void;
}

/** Tarjeta para subir el PDF del programa y pre-rellenar el formulario con IA. */
export const SubirProgramaPdf: React.FC<Props> = ({ onResultado }) => {
  const input = useRef<HTMLInputElement>(null);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [leyendo, setLeyendo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const elegir = (f: File | null) => {
    setError(null);
    if (f && (f.size > MAX_MB * 1024 * 1024 || !/\.pdf$/i.test(f.name))) {
      setArchivo(null);
      setError(`Elige un archivo PDF de menos de ${MAX_MB} MB.`);
      return;
    }
    setArchivo(f);
  };

  const leer = async () => {
    if (!archivo) return;
    setLeyendo(true);
    setError(null);
    try {
      onResultado(await extraerProgramaApi(archivo), archivo.name);
    } catch (e) {
      setError(mensajeDeError(e));
    } finally {
      setLeyendo(false);
    }
  };

  return (
    <TarjetaSeccion
      titulo="Desde el programa del curso (PDF)"
      descripcion="La IA lee el programa y pre-rellena el formulario. Revisas y corriges todo antes de guardar."
      icono={<Sparkles size={16} className="text-purple-600" />}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <input
          ref={input}
          type="file"
          accept="application/pdf,.pdf"
          className="sr-only"
          id="programa-pdf"
          onChange={(e) => elegir(e.target.files?.[0] ?? null)}
        />
        <CanvasButton variant="secondary" icon={<FileUp size={14} />} onClick={() => input.current?.click()} disabled={leyendo}>
          {archivo ? "Cambiar PDF" : "Elegir PDF"}
        </CanvasButton>
        <span className="text-xs text-[#6B7780] truncate" aria-live="polite">
          {archivo ? archivo.name : "Ningún archivo elegido"}
        </span>
      </div>

      <CanvasButton
        variant="primary-udp"
        icon={leyendo ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
        onClick={() => void leer()}
        disabled={!archivo || leyendo}
      >
        {leyendo ? "Leyendo el programa… (puede tardar hasta un minuto)" : "Leer programa con IA"}
      </CanvasButton>

      {error && <Aviso tipo="error">{error}</Aviso>}

      <p className="text-[11px] text-[#6B7780] flex items-start gap-1.5">
        <ShieldCheck size={13} className="text-emerald-600 shrink-0 mt-px" />
        Solo se envía el texto del programa, con correos, RUT y teléfonos tachados. Los datos de los alumnos nunca se
        envían a la IA. El PDF no se guarda.
      </p>
    </TarjetaSeccion>
  );
};
