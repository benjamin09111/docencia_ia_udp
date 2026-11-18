"use client";

import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { CanvasActionMenu } from "@/components/canvas/CanvasActionMenu";
import { CanvasTable, CanvasTableCell, CanvasTableHeader, CanvasTableRow } from "@/components/canvas/CanvasTable";
import type { Alumno } from "@/types/gestion";

interface Props {
  alumnos: Alumno[];
  hayBusqueda: boolean;
  onEditar: (alumno: Alumno) => void;
  onEliminar: (alumno: Alumno) => void;
}

export const TablaAlumnos: React.FC<Props> = React.memo(({ alumnos, hayBusqueda, onEditar, onEliminar }) => (
  <CanvasTable tableClassName="min-w-[640px]">
    <CanvasTableHeader>
      <tr>
        <th className="p-3">Apellidos</th>
        <th className="p-3">Nombres</th>
        <th className="p-3">RUT</th>
        <th className="p-3">Correo</th>
        <th className="p-3 w-12">
          <span className="sr-only">Acciones</span>
        </th>
      </tr>
    </CanvasTableHeader>
    <tbody>
      {alumnos.length === 0 ? (
        <tr>
          <td colSpan={5} className="p-6 text-center text-xs text-[#6B7780]">
            {hayBusqueda
              ? "Ningún alumno coincide con la búsqueda."
              : "Aún no hay alumnos. Sube el Excel (puedes partir de la plantilla) o agrégalos uno por uno."}
          </td>
        </tr>
      ) : (
        alumnos.map((a) => (
          <CanvasTableRow key={a.id} hoverable={false} className="hover:bg-[#F9FAFB]">
            <CanvasTableCell className="font-semibold">{a.apellidos}</CanvasTableCell>
            <CanvasTableCell>{a.nombres}</CanvasTableCell>
            <CanvasTableCell className="font-mono text-xs">{a.rut}</CanvasTableCell>
            <CanvasTableCell className="text-xs text-[#6B7780]">{a.correo}</CanvasTableCell>
            <CanvasTableCell align="center">
              <CanvasActionMenu
                items={[
                  { label: "Editar", icon: <Pencil size={14} />, onClick: () => onEditar(a) },
                  { label: "Eliminar", icon: <Trash2 size={14} />, variant: "danger", onClick: () => onEliminar(a) },
                ]}
              />
            </CanvasTableCell>
          </CanvasTableRow>
        ))
      )}
    </tbody>
  </CanvasTable>
));

TablaAlumnos.displayName = "TablaAlumnos";
