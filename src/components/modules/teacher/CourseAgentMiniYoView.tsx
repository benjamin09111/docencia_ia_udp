"use client";

import React, { useState } from "react";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasInput } from "@/components/canvas/CanvasInput";
import { CanvasSelect } from "@/components/canvas/CanvasSelect";
import {
  Bot,
  Brain,
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  Sliders,
  Send,
  BookOpen,
} from "lucide-react";

interface CourseAgentMiniYoViewProps {
  courseCode: string;
  courseName: string;
}

interface MaterialFile {
  id: string;
  nombre: string;
  tipo: string;
  tamano: string;
  estado: "vectorizado" | "procesando";
}

const INITIAL_MATERIALS: MaterialFile[] = [
  { id: "m1", nombre: "Catedra_01_Arquitectura_Atributos_Calidad.pdf", tipo: "Diapositivas Cátedra", tamano: "4.2 MB", estado: "vectorizado" },
  { id: "m2", nombre: "Guia_Ejercicios_Escenarios_RTO_RPO.pdf", tipo: "Guía de Ejercicios", tamano: "1.1 MB", estado: "vectorizado" },
  { id: "m3", nombre: "Reglamento_Evaluacion_Eximicion_2026.pdf", tipo: "Normativa Oficial", tamano: "520 KB", estado: "vectorizado" },
];

export const CourseAgentMiniYoView: React.FC<CourseAgentMiniYoViewProps> = ({
  courseCode,
  courseName,
}) => {
  const [materials, setMaterials] = useState<MaterialFile[]>(INITIAL_MATERIALS);
  const [exigencia, setExigencia] = useState<string>("4");
  const [estilo, setEstilo] = useState<string>("constructivo");
  const [tono, setTono] = useState<string>("cercano");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Test bench
  const [testQuery, setTestQuery] = useState("");
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleSavePerillas = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      const newFile: MaterialFile = {
        id: `m_${Date.now()}`,
        nombre: "Apuntes_Catedra_Semana_04_Microservicios.pdf",
        tipo: "Apunte Docente",
        tamano: "2.8 MB",
        estado: "vectorizado",
      };
      setMaterials((prev) => [newFile, ...prev]);
      setIsUploading(false);
    }, 1200);
  };

  const handleTestMiniYo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testQuery.trim()) return;
    setIsTesting(true);

    setTimeout(() => {
      setTestResponse(
        `[Respuesta calibrada como Mini-Yo (${estilo.toUpperCase()}, Exigencia ${exigencia}/5)]:\n"Para responder a tu duda sobre '${testQuery}', revisemos primero los apuntes de la Cátedra 1. Recuerda que no basta con memorizar el concepto: debes justificar el trade-off con métricas de latencia antes de tu entrega."`
      );
      setIsTesting(false);
    }, 700);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Banner */}
      <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 sm:p-5 shadow-canvas-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CanvasBadge variant="udp">Contexto y Personalización Docente</CanvasBadge>
            <span className="text-xs text-[#6B7780]">{courseCode}</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#2D3B45] mt-1 flex items-center gap-2">
            <Bot size={20} className="text-[#C8102E]" />
            Materiales de Cátedra y Calibración del Agente (Mini-Yo)
          </h2>
          <p className="text-xs text-[#6B7780] mt-0.5">
            Sube los PDFs de tus clases para que el agente responda con tu estilo pedagógico y resuelva dudas a tus alumnos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Columna Izquierda: Materiales RAG (6 Cols) */}
        <div className="lg:col-span-6 bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-xs font-bold text-[#2D3B45] uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen size={14} className="text-[#008EE2]" />
              Documentos Indexados en Embeddings ({materials.length})
            </h3>
            <CanvasButton
              variant="outline"
              size="sm"
              icon={<Upload size={12} />}
              onClick={handleSimulateUpload}
              disabled={isUploading}
            >
              {isUploading ? "Indexando..." : "Subir PDF de Clase"}
            </CanvasButton>
          </div>

          <div className="space-y-2">
            {materials.map((file) => (
              <div
                key={file.id}
                className="p-3 rounded-[4px] border border-gray-200 bg-[#F9FAFB] flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileText size={16} className="text-[#C8102E] shrink-0" />
                  <div className="truncate">
                    <span className="text-xs font-bold text-[#2D3B45] block truncate">
                      {file.nombre}
                    </span>
                    <span className="text-[10px] text-gray-500">{file.tipo} • {file.tamano}</span>
                  </div>
                </div>
                <CanvasBadge variant="success">
                  <CheckCircle2 size={10} className="mr-1" /> Vectorizado
                </CanvasBadge>
              </div>
            ))}
          </div>
        </div>

        {/* Columna Derecha: Perillas Pedagógicas & Simulador (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-5 shadow-canvas-card space-y-4">
            <h3 className="text-xs font-bold text-[#2D3B45] uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
              <Sliders size={14} className="text-[#008EE2]" />
              Calibración del "Mini-Yo" del Docente
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <CanvasSelect
                label="Nivel de Exigencia"
                value={exigencia}
                onChange={(e) => setExigencia(e.target.value)}
                options={[
                  { value: "2", label: "2 - Guiado y Accesible" },
                  { value: "3", label: "3 - Equilibrado UDP" },
                  { value: "4", label: "4 - Riguroso con Citas" },
                  { value: "5", label: "5 - Estricto de Comisión" },
                ]}
              />

              <CanvasSelect
                label="Estilo Pedagógico"
                value={estilo}
                onChange={(e) => setEstilo(e.target.value)}
                options={[
                  { value: "constructivo", label: "Constructivo (Andamiaje)" },
                  { value: "socratico", label: "Socrático (Con Preguntas)" },
                  { value: "directo", label: "Directo y Ejecutivo" },
                ]}
              />

              <CanvasSelect
                label="Tono del Agente"
                value={tono}
                onChange={(e) => setTono(e.target.value)}
                options={[
                  { value: "cercano", label: "Cercano y Motivador" },
                  { value: "formal", label: "Académico Formal" },
                ]}
              />
            </div>

            <div className="flex justify-between items-center pt-2 border-t">
              {saveSuccess && (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 size={13} /> Parámetros guardados y sincronizados
                </span>
              )}
              <div className="ml-auto">
                <CanvasButton variant="primary-udp" size="sm" onClick={handleSavePerillas}>
                  Guardar Perillas del Agente
                </CanvasButton>
              </div>
            </div>
          </div>

          {/* Mini-Simulador de Prueba */}
          <div className="bg-white border border-[#E0E3E6] rounded-[4px] p-4 shadow-canvas-card space-y-3">
            <span className="text-xs font-bold text-[#2D3B45] flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#008EE2]" />
              Probar Respuesta de tu Agente:
            </span>

            <form onSubmit={handleTestMiniYo} className="flex gap-2">
              <input
                type="text"
                placeholder="Escribe una pregunta de prueba (ej. ¿Qué entra en la Solemne?)"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                className="flex-1 text-xs border border-gray-300 rounded-[4px] px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#008EE2]"
              />
              <CanvasButton variant="secondary" size="sm" type="submit" disabled={isTesting}>
                {isTesting ? "Probando..." : "Testear"}
              </CanvasButton>
            </form>

            {testResponse && (
              <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-[4px] text-xs text-[#2D3B45] whitespace-pre-wrap font-mono">
                {testResponse}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
