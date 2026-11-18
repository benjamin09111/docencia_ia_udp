"use client";

import React, { useState } from "react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasInput } from "@/components/canvas/CanvasInput";
import { CanvasModal } from "@/components/canvas/CanvasModal";
import type { Alumno, AlumnoNuevo } from "@/types/gestion";
import { mensajeDeError } from "@/services/gestion/clienteApi";
import { validarFilasAlumnos } from "@/utils/gestion/validarAlumnos";
import { Aviso } from "./piezasFormulario";

interface Props {
  /** null = alumno nuevo. */
  alumno: Alumno | null;
  /** Nómina actual, para detectar RUT o correo repetidos. */
  existentes: Alumno[];
  onCerrar: () => void;
  onGuardar: (datos: AlumnoNuevo) => Promise<void>;
}

const VACIO: AlumnoNuevo = { nombres: "", apellidos: "", rut: "", correo: "" };

/** Alta o edición manual de un alumno. El padre lo monta con `key` para reiniciarlo. */
export const ModalAlumno: React.FC<Props> = ({ alumno, existentes, onCerrar, onGuardar }) => {
  const [datos, setDatos] = useState<AlumnoNuevo>(alumno ? { ...alumno } : VACIO);
  const [errores, setErrores] = useState<string[]>([]);
  const [guardando, setGuardando] = useState(false);

  const cambiar = (campo: keyof AlumnoNuevo) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setDatos((d) => ({ ...d, [campo]: e.target.value }));

  const guardar = async () => {
    const otros = existentes.filter((a) => a.id !== alumno?.id);
    const [fila] = validarFilasAlumnos([{ fila: 1, ...datos }], otros);
    if (!fila.valida) {
      setErrores(fila.errores);
      return;
    }
    setGuardando(true);
    setErrores([]);
    try {
      await onGuardar(fila.datos);
      onCerrar();
    } catch (e) {
      setErrores([mensajeDeError(e)]);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <CanvasModal
      isOpen
      onClose={onCerrar}
      title={alumno ? "Editar alumno" : "Agregar alumno"}
      subtitle="El RUT se valida con su dígito verificador y se guarda sin puntos (cuerpo-DV)."
      maxWidth="lg"
      footer={
        <>
          <CanvasButton variant="outline" size="sm" onClick={onCerrar} disabled={guardando}>
            Cancelar
          </CanvasButton>
          <CanvasButton variant="primary-udp" size="sm" onClick={() => void guardar()} disabled={guardando}>
            {guardando ? "Guardando…" : alumno ? "Guardar cambios" : "Agregar alumno"}
          </CanvasButton>
        </>
      }
    >
      <form
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          void guardar();
        }}
      >
        <CanvasInput id="alumno-nombres" label="Nombres" required value={datos.nombres} onChange={cambiar("nombres")} maxLength={100} />
        <CanvasInput id="alumno-apellidos" label="Apellidos" required value={datos.apellidos} onChange={cambiar("apellidos")} maxLength={100} />
        <CanvasInput id="alumno-rut" label="RUT" required value={datos.rut} onChange={cambiar("rut")} maxLength={14} placeholder="Con o sin puntos, con guion" />
        <CanvasInput id="alumno-correo" label="Correo" required type="email" value={datos.correo} onChange={cambiar("correo")} maxLength={254} />
        <button type="submit" className="sr-only">
          Guardar
        </button>
      </form>
      {errores.length > 0 && (
        <div className="mt-3">
          <Aviso tipo="error">
            <ul className="list-disc pl-4 space-y-0.5">
              {errores.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </Aviso>
        </div>
      )}
    </CanvasModal>
  );
};
