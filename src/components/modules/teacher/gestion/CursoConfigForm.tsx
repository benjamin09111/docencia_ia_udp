"use client";

import React, { useMemo, useState } from "react";
import { Save } from "lucide-react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasModal } from "@/components/canvas/CanvasModal";
import type { CursoBorrador } from "@/utils/gestion/borradorCurso";
import type { CursoInput } from "@/utils/gestion/esquemasCurso";
import { ErrorApi, mensajeDeError } from "@/services/gestion/clienteApi";
import { useCursoForm } from "./useCursoForm";
import { Aviso } from "./piezasFormulario";
import { SeccionDatosCurso } from "./SeccionDatosCurso";
import { SeccionEvaluaciones } from "./SeccionEvaluaciones";
import { SeccionEscalaReglas } from "./SeccionEscalaReglas";
import { SeccionRestricciones } from "./SeccionRestricciones";

interface Props {
  inicial: CursoBorrador;
  textoGuardar: string;
  onGuardar: (input: CursoInput) => Promise<void>;
  onCancelar?: () => void;
  /** Notas guardadas por evaluación (solo al editar un curso existente). */
  notasPorEvaluacion?: Record<string, number>;
  /** Contenido sobre el formulario (ej. aviso de que los datos vienen de la IA). */
  encabezado?: React.ReactNode;
}

/**
 * Formulario único del curso: se usa al crear (vacío o pre-rellenado por la IA) y
 * al editar la configuración. Nada se guarda hasta que el docente confirma.
 */
export const CursoConfigForm: React.FC<Props> = ({
  inicial,
  textoGuardar,
  onGuardar,
  onCancelar,
  notasPorEvaluacion = {},
  encabezado,
}) => {
  const form = useCursoForm(inicial);
  const [mostrarErrores, setMostrarErrores] = useState(false);
  const [erroresServidor, setErroresServidor] = useState<Record<string, string>>({});
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [confirmar, setConfirmar] = useState<CursoInput | null>(null);

  const errores = useMemo(
    () => ({ ...erroresServidor, ...(mostrarErrores && !form.validacion.ok ? form.validacion.errores : {}) }),
    [erroresServidor, mostrarErrores, form.validacion]
  );

  // Evaluaciones existentes que el docente quitó y que ya tienen notas.
  const eliminadasConNotas = useMemo(() => {
    const quedan = new Set(form.borrador.evaluaciones.map((e) => e.id).filter(Boolean));
    return inicial.evaluaciones.filter((e) => e.id && !quedan.has(e.id) && (notasPorEvaluacion[e.id] ?? 0) > 0);
  }, [form.borrador.evaluaciones, inicial.evaluaciones, notasPorEvaluacion]);

  const guardar = async (input: CursoInput) => {
    setConfirmar(null);
    setGuardando(true);
    setMensaje(null);
    try {
      await onGuardar(input);
    } catch (error) {
      setErroresServidor(error instanceof ErrorApi ? error.campos : {});
      setMensaje(mensajeDeError(error));
    } finally {
      setGuardando(false);
    }
  };

  const alGuardar = () => {
    setErroresServidor({});
    if (!form.validacion.ok) {
      setMostrarErrores(true);
      setMensaje("Revisa los campos marcados en rojo.");
      return;
    }
    if (eliminadasConNotas.length > 0) {
      setConfirmar(form.validacion.input);
      return;
    }
    void guardar(form.validacion.input);
  };

  return (
    <div className="space-y-4">
      {encabezado}
      <SeccionDatosCurso form={form} errores={errores} />
      <SeccionEvaluaciones form={form} errores={errores} notasPorEvaluacion={notasPorEvaluacion} />
      <SeccionEscalaReglas form={form} errores={errores} />
      <SeccionRestricciones form={form} errores={errores} />

      {mensaje && <Aviso tipo="error">{mensaje}</Aviso>}

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sticky bottom-0 bg-white/95 py-3 border-t border-[#E0E3E6]">
        {onCancelar && (
          <CanvasButton variant="outline" onClick={onCancelar} disabled={guardando}>
            Cancelar
          </CanvasButton>
        )}
        <CanvasButton
          variant="primary-udp"
          icon={<Save size={14} />}
          onClick={alGuardar}
          disabled={guardando || !form.ponderaciones.ok}
          title={form.ponderaciones.ok ? undefined : "Las ponderaciones deben sumar 100%"}
        >
          {guardando ? "Guardando…" : textoGuardar}
        </CanvasButton>
      </div>

      <CanvasModal
        isOpen={confirmar !== null}
        onClose={() => setConfirmar(null)}
        title="¿Eliminar evaluaciones con notas?"
        subtitle="Esta acción borra las notas de esas evaluaciones y no se puede deshacer."
        footer={
          <>
            <CanvasButton variant="outline" size="sm" onClick={() => setConfirmar(null)}>
              Volver
            </CanvasButton>
            <CanvasButton variant="danger" size="sm" onClick={() => confirmar && void guardar(confirmar)}>
              Eliminar y guardar
            </CanvasButton>
          </>
        }
      >
        <ul className="text-xs text-[#2D3B45] list-disc pl-5 space-y-1">
          {eliminadasConNotas.map((e) => (
            <li key={e.clave}>
              <strong>{e.nombre}</strong>: {notasPorEvaluacion[e.id!]} nota(s)
            </li>
          ))}
        </ul>
      </CanvasModal>
    </div>
  );
};
