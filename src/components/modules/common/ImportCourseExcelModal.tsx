"use client";

import React, { useState } from "react";
import { CanvasModal } from "@/components/canvas/CanvasModal";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasInput } from "@/components/canvas/CanvasInput";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import { CanvasCourse } from "@/types";
import {
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  Users,
  Bot,
  Sparkles,
} from "lucide-react";

interface ImportCourseExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCourseCreated: (newCourse: CanvasCourse) => void;
}

const MOCK_PREVIEW_STUDENTS = [
  { rut: "20.142.883-4", nombres: "Constanza Belén", apellidos: "Valenzuela Soto", email: "c.valenzuela@mail.udp.cl" },
  { rut: "19.832.991-K", nombres: "Ignacio Andrés", apellidos: "Paredes Muñoz", email: "i.paredes@mail.udp.cl" },
  { rut: "20.551.412-1", nombres: "Valentina Paz", apellidos: "Morales Pizarro", email: "v.morales@mail.udp.cl" },
];

export const ImportCourseExcelModal: React.FC<ImportCourseExcelModalProps> = ({
  isOpen,
  onClose,
  onCourseCreated,
}) => {
  const [cursoNombre, setCursoNombre] = useState("INTELIGENCIA ARTIFICIAL APLICADA");
  const [cursoCodigo, setCursoCodigo] = useState("CIT4000_CA01");
  const [profesor, setProfesor] = useState("Benjamín Morales Pizarro");
  const [fileName, setFileName] = useState("nomina_alumnos_udp_2026_02.xlsx");
  const [fileLoaded, setFileLoaded] = useState(true);

  const handleCreate = () => {
    const newCourse: CanvasCourse = {
      id: Math.floor(40000 + Math.random() * 9000),
      name: cursoNombre,
      code: cursoCodigo,
      term: "2026-02 Semestre Primavera",
      students_count: 32,
      is_automated: true,
      agent_id: `agent_${cursoCodigo.toLowerCase()}`,
    };

    onCourseCreated(newCourse);
    onClose();
  };

  return (
    <CanvasModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2">
          <FileSpreadsheet size={18} className="text-emerald-700" />
          Crear Curso desde Excel Oficial UDP
        </span>
      }
      subtitle="Genera automáticamente la sección, su nómina de estudiantes y su Agente Técnico."
      maxWidth="xl"
      footer={
        <>
          <CanvasButton variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </CanvasButton>
          <CanvasButton
            variant="primary-udp"
            size="sm"
            onClick={handleCreate}
            icon={<Sparkles size={14} />}
          >
            Importar Curso e Instanciar Agente
          </CanvasButton>
        </>
      }
    >
      <div className="space-y-4">
        {/* Zona de Arrastre de Archivo Excel */}
        <div className="border-2 border-dashed border-[#C7CDD1] hover:border-[#008EE2] rounded-[4px] p-4 bg-gray-50/70 text-center transition-colors">
          <Upload size={22} className="mx-auto text-gray-400 mb-1" />
          <span className="text-xs font-bold text-[#2D3B45] block">
            {fileName}
          </span>
          <p className="text-[11px] text-[#6B7780] mt-0.5">
            Formato oficial Escuela de Informática (.xlsx, .csv con RUT, Apellidos, Nombres, Correo)
          </p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <CanvasBadge variant="success">
              <CheckCircle2 size={11} className="mr-1" /> Nómina validada: 32 alumnos detectados
            </CanvasBadge>
          </div>
        </div>

        {/* Formulario de Configuración del Curso */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <CanvasInput
            label="Nombre de la Asignatura"
            value={cursoNombre}
            onChange={(e) => setCursoNombre(e.target.value)}
            required
          />
          <CanvasInput
            label="Código y Sección"
            value={cursoCodigo}
            onChange={(e) => setCursoCodigo(e.target.value)}
            required
          />
        </div>

        <CanvasInput
          label="Profesor Titular"
          value={profesor}
          onChange={(e) => setProfesor(e.target.value)}
          required
        />

        {/* Previsualización de Alumnos Parseados */}
        <div className="bg-[#F9FAFB] border border-[#E0E3E6] rounded-[4px] p-3 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-[#2D3B45] flex items-center gap-1.5">
              <Users size={14} className="text-[#008EE2]" />
              Vista Previa de Estudiantes (Primeros 3 de 32):
            </span>
            <span className="text-[10px] text-gray-500 font-mono">Columnas UDP detectadas</span>
          </div>

          <div className="space-y-1">
            {MOCK_PREVIEW_STUDENTS.map((st, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-[11px] bg-white p-2 rounded border border-gray-200"
              >
                <div>
                  <strong className="text-[#2D3B45]">{st.apellidos}, {st.nombres}</strong>
                  <span className="text-gray-400 font-mono ml-2">({st.rut})</span>
                </div>
                <span className="text-[#6B7780] font-mono text-[10px]">{st.email}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ficha del Agente Asignado */}
        <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-[4px] flex items-center gap-2.5 text-xs text-[#0277BD]">
          <Bot size={18} className="shrink-0 text-[#008EE2]" />
          <div>
            <strong className="block text-[#2D3B45]">Agente Técnico Auto-Generado:</strong>
            <span>
              Se creará un agente para <strong>{cursoCodigo}</strong> configurado con los parámetros de la Escuela.
            </span>
          </div>
        </div>
      </div>
    </CanvasModal>
  );
};
