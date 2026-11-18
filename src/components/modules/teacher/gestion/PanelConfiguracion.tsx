"use client";

import React, { useMemo, useState } from "react";
import { actualizarCursoApi, type CursoDetalle } from "@/services/gestion/clienteApi";
import { borradorDesdeCurso } from "@/utils/gestion/borradorCurso";
import { CursoConfigForm } from "./CursoConfigForm";
import { Aviso } from "./piezasFormulario";

interface Props {
  detalle: CursoDetalle;
  /** Se llama después de guardar, para recargar el curso. */
  onGuardado: () => Promise<void> | void;
}

/** Pestaña Configuración: el mismo formulario de creación, en modo edición. */
export const PanelConfiguracion: React.FC<Props> = ({ detalle, onGuardado }) => {
  const { curso, notas_por_evaluacion } = detalle;
  const inicial = useMemo(() => borradorDesdeCurso(curso), [curso]);
  const [guardado, setGuardado] = useState(false);

  return (
    <CursoConfigForm
      // Al recargar el curso guardado, el formulario se reinicia con los ids nuevos.
      key={curso.updated_at}
      inicial={inicial}
      textoGuardar="Guardar configuración"
      notasPorEvaluacion={notas_por_evaluacion}
      encabezado={
        guardado ? (
          <Aviso tipo="exito">Configuración guardada. La tabla de notas ya usa estas reglas.</Aviso>
        ) : (
          <Aviso tipo="info">
            Cambiar evaluaciones o ponderaciones recalcula todas las notas finales. Las notas ya ingresadas se conservan
            mientras la evaluación exista.
          </Aviso>
        )
      }
      onGuardar={async (input) => {
        await actualizarCursoApi(curso.id, input);
        setGuardado(true);
        await onGuardado();
      }}
    />
  );
};
