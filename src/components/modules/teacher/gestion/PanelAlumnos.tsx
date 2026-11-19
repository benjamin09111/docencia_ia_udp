"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasModal } from "@/components/canvas/CanvasModal";
import { CanvasToolbar } from "@/components/canvas/CanvasToolbar";
import type { Alumno } from "@/types/gestion";
import { mensajeDeError } from "@/services/gestion/clienteApi";
import { descargarArchivo } from "@/utils/gestion/descargarArchivo";
import { validarFilasAlumnos, type FilaValidada } from "@/utils/gestion/validarAlumnos";
import { useAlumnosCurso } from "./useAlumnosCurso";
import { TablaAlumnos } from "./TablaAlumnos";
import { ModalAlumno } from "./ModalAlumno";
import { ModalImportarAlumnos } from "./ModalImportarAlumnos";
import { Aviso } from "./piezasFormulario";

type Modal =
  | { tipo: "alumno"; alumno: Alumno | null; clave: number }
  | { tipo: "importar"; nombreArchivo: string; filas: FilaValidada[] }
  | { tipo: "eliminar"; alumno: Alumno };

const normalizar = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Pestaña Alumnos: plantilla, carga desde Excel con vista previa y CRUD manual. */
export const PanelAlumnos: React.FC<{ cursoId: string }> = ({ cursoId }) => {
  const { alumnos, error, agregar, actualizar, eliminar } = useAlumnosCurso(cursoId);
  const [busqueda, setBusqueda] = useState("");
  const [modal, setModal] = useState<Modal | null>(null);
  const [aviso, setAviso] = useState<{ tipo: "error" | "exito"; texto: string } | null>(null);
  const [eliminando, setEliminando] = useState(false);
  const archivoRef = useRef<HTMLInputElement>(null);

  const filtrados = useMemo(() => {
    const q = normalizar(busqueda.trim());
    if (!q || !alumnos) return alumnos ?? [];
    return alumnos.filter((a) => normalizar(`${a.nombres} ${a.apellidos} ${a.rut} ${a.correo}`).includes(q));
  }, [alumnos, busqueda]);

  const descargarPlantilla = useCallback(async () => {
    try {
      const { crearPlantillaAlumnos } = await import("@/utils/gestion/excelAlumnos");
      descargarArchivo(await crearPlantillaAlumnos(), "plantilla_alumnos.xlsx");
    } catch (e) {
      setAviso({ tipo: "error", texto: mensajeDeError(e) });
    }
  }, []);

  const leerArchivo = async (archivo: File | undefined) => {
    if (archivoRef.current) archivoRef.current.value = ""; // permite volver a subir el mismo archivo
    if (!archivo) return;
    setAviso(null);
    try {
      const { leerExcelAlumnos } = await import("@/utils/gestion/excelAlumnos");
      const filas = await leerExcelAlumnos(await archivo.arrayBuffer());
      if (filas.length === 0) return setAviso({ tipo: "error", texto: "El archivo no tiene filas de alumnos." });
      setModal({ tipo: "importar", nombreArchivo: archivo.name, filas: validarFilasAlumnos(filas, alumnos ?? []) });
    } catch (e) {
      setAviso({ tipo: "error", texto: mensajeDeError(e) });
    }
  };

  const confirmarEliminar = async (alumno: Alumno) => {
    setEliminando(true);
    try {
      await eliminar(alumno.id);
      setAviso({ tipo: "exito", texto: `Se eliminó a ${alumno.nombres} ${alumno.apellidos}.` });
      setModal(null);
    } catch (e) {
      setAviso({ tipo: "error", texto: mensajeDeError(e) });
    } finally {
      setEliminando(false);
    }
  };

  const abrirAlumno = useCallback((alumno: Alumno | null) => setModal({ tipo: "alumno", alumno, clave: Date.now() }), []);
  const pedirEliminar = useCallback((alumno: Alumno) => setModal({ tipo: "eliminar", alumno }), []);

  return (
    <div className="space-y-3">
      <CanvasToolbar
        searchQuery={busqueda}
        onSearchChange={setBusqueda}
        searchPlaceholder="Buscar por nombre, RUT o correo..."
        primaryButtonLabel="+ Alumno"
        onPrimaryClick={() => abrirAlumno(null)}
        secondaryButtonLabel="Subir Excel"
        onSecondaryClick={() => archivoRef.current?.click()}
        tertiaryButtonLabel="Descargar plantilla"
        onTertiaryClick={() => void descargarPlantilla()}
      />
      <input
        ref={archivoRef}
        type="file"
        accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        className="sr-only"
        aria-label="Subir Excel de alumnos"
        onChange={(e) => void leerArchivo(e.target.files?.[0])}
      />

      {error && <Aviso tipo="error">{error}</Aviso>}
      {aviso && <Aviso tipo={aviso.tipo}>{aviso.texto}</Aviso>}

      {alumnos === null ? (
        <div className="flex items-center gap-2 text-xs text-[#6B7780] p-6">
          <Loader2 size={16} className="animate-spin text-[#B71C1C]" /> Cargando alumnos…
        </div>
      ) : (
        <>
          <p className="text-xs text-[#6B7780]">
            {alumnos.length} alumno(s) en el curso{busqueda ? ` · ${filtrados.length} coinciden con la búsqueda` : ""}
          </p>
          <TablaAlumnos alumnos={filtrados} hayBusqueda={Boolean(busqueda)} onEditar={abrirAlumno} onEliminar={pedirEliminar} />
        </>
      )}

      {modal?.tipo === "alumno" && (
        <ModalAlumno
          key={modal.clave}
          alumno={modal.alumno}
          existentes={alumnos ?? []}
          onCerrar={() => setModal(null)}
          onGuardar={async (datos) => {
            if (modal.alumno) await actualizar(modal.alumno.id, datos);
            else await agregar([datos]);
            setAviso({ tipo: "exito", texto: modal.alumno ? "Alumno actualizado." : "Alumno agregado." });
          }}
        />
      )}

      {modal?.tipo === "importar" && (
        <ModalImportarAlumnos
          nombreArchivo={modal.nombreArchivo}
          filas={modal.filas}
          onCerrar={() => setModal(null)}
          onConfirmar={async (nuevos) => {
            const n = await agregar(nuevos);
            setAviso({ tipo: "exito", texto: `Se cargaron ${n} alumno(s).` });
            return n;
          }}
        />
      )}

      {modal?.tipo === "eliminar" && (
        <CanvasModal
          isOpen
          onClose={() => setModal(null)}
          title="¿Eliminar alumno?"
          subtitle="También se borran sus notas en este curso. No se puede deshacer."
          footer={
            <>
              <CanvasButton variant="outline" size="sm" onClick={() => setModal(null)} disabled={eliminando}>
                Cancelar
              </CanvasButton>
              <CanvasButton variant="danger" size="sm" onClick={() => void confirmarEliminar(modal.alumno)} disabled={eliminando}>
                {eliminando ? "Eliminando…" : "Eliminar"}
              </CanvasButton>
            </>
          }
        >
          <p className="text-xs text-[#2D3B45]">
            {modal.alumno.nombres} {modal.alumno.apellidos} · <span className="font-mono">{modal.alumno.rut}</span>
          </p>
        </CanvasModal>
      )}
    </div>
  );
};
