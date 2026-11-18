"use client";

import React, { useMemo, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasModal } from "@/components/canvas/CanvasModal";
import { CanvasTable, CanvasTableCell, CanvasTableHeader, CanvasTableRow } from "@/components/canvas/CanvasTable";
import { mensajeDeError } from "@/services/gestion/clienteApi";
import type { AlumnoNuevo } from "@/types/gestion";
import type { FilaValidada } from "@/utils/gestion/validarAlumnos";
import { Aviso } from "./piezasFormulario";

interface Props {
  nombreArchivo: string;
  filas: FilaValidada[];
  onCerrar: () => void;
  /** Guarda las filas válidas; devuelve cuántas se cargaron. */
  onConfirmar: (alumnos: AlumnoNuevo[]) => Promise<number>;
}

/** Vista previa del Excel: marca errores por fila y carga solo las válidas al confirmar. */
export const ModalImportarAlumnos: React.FC<Props> = ({ nombreArchivo, filas, onCerrar, onConfirmar }) => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const validas = useMemo(() => filas.filter((f) => f.valida), [filas]);
  const conErrores = filas.length - validas.length;

  const confirmar = async () => {
    setCargando(true);
    setError(null);
    try {
      await onConfirmar(validas.map((f) => f.datos));
      onCerrar();
    } catch (e) {
      setError(mensajeDeError(e));
    } finally {
      setCargando(false);
    }
  };

  return (
    <CanvasModal
      isOpen
      onClose={onCerrar}
      title="Vista previa de la carga de alumnos"
      subtitle={`${nombreArchivo} · ${filas.length} fila(s) leídas`}
      maxWidth="5xl"
      footer={
        <>
          <CanvasButton variant="outline" size="sm" onClick={onCerrar} disabled={cargando}>
            Cancelar
          </CanvasButton>
          <CanvasButton variant="primary-udp" size="sm" onClick={() => void confirmar()} disabled={cargando || validas.length === 0}>
            {cargando ? "Cargando…" : `Cargar ${validas.length} alumno(s)`}
          </CanvasButton>
        </>
      }
    >
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <CanvasBadge variant="success" size="md">{validas.length} válidas</CanvasBadge>
          {conErrores > 0 && <CanvasBadge variant="danger" size="md">{conErrores} con errores (no se cargarán)</CanvasBadge>}
        </div>
        {conErrores > 0 && (
          <Aviso tipo="advertencia">
            Las filas con errores no se cargan. Corrígelas en el Excel y vuelve a subirlo, o agrégalas a mano después.
          </Aviso>
        )}
        <div className="max-h-[50vh] overflow-y-auto">
          <CanvasTable tableClassName="min-w-[760px] text-xs">
            <CanvasTableHeader>
              <tr>
                <th className="p-2.5 w-14">Fila</th>
                <th className="p-2.5">Nombres</th>
                <th className="p-2.5">Apellidos</th>
                <th className="p-2.5">RUT</th>
                <th className="p-2.5">Correo</th>
                <th className="p-2.5 w-64">Estado</th>
              </tr>
            </CanvasTableHeader>
            <tbody>
              {filas.map((f) => (
                <CanvasTableRow key={f.fila} hoverable={false} className={f.valida ? "" : "bg-red-50/60"}>
                  <CanvasTableCell className="p-2.5 font-mono text-[#6B7780]">{f.fila}</CanvasTableCell>
                  <CanvasTableCell className="p-2.5">{f.datos.nombres}</CanvasTableCell>
                  <CanvasTableCell className="p-2.5">{f.datos.apellidos}</CanvasTableCell>
                  <CanvasTableCell className="p-2.5 font-mono">{f.datos.rut}</CanvasTableCell>
                  <CanvasTableCell className="p-2.5">{f.datos.correo}</CanvasTableCell>
                  <CanvasTableCell className="p-2.5">
                    {f.valida ? (
                      <span className="flex items-center gap-1 text-[#2E7D32] font-semibold">
                        <CheckCircle2 size={14} /> Lista para cargar
                      </span>
                    ) : (
                      <ul className="text-[#C62828] space-y-0.5">
                        {f.errores.map((e) => (
                          <li key={e} className="flex items-start gap-1">
                            <XCircle size={13} className="shrink-0 mt-px" /> {e}
                          </li>
                        ))}
                      </ul>
                    )}
                  </CanvasTableCell>
                </CanvasTableRow>
              ))}
            </tbody>
          </CanvasTable>
        </div>
        {error && <Aviso tipo="error">{error}</Aviso>}
      </div>
    </CanvasModal>
  );
};
