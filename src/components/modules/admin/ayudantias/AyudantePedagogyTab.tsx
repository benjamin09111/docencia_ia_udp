"use client";

import React, { useState } from "react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import {
  GraduationCap,
  Brain,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  AlertCircle,
  Lightbulb,
  ShieldCheck,
  Award,
  Users,
} from "lucide-react";

interface TrainingModule {
  id: string;
  numero: number;
  titulo: string;
  duracion: string;
  descripcion: string;
  competencia: string;
  estado: "activo" | "en_diseno";
}

const TRAINING_MODULES: TrainingModule[] = [
  {
    id: "m1",
    numero: 1,
    titulo: "Didáctica Universitaria y Andamiaje en Laboratorios",
    duracion: "4 horas cronológicas",
    descripcion: "Estrategias de enseñanza activa. Cómo guiar la resolución de problemas sin dar la respuesta masticada, favoreciendo el razonamiento crítico del estudiante.",
    competencia: "Andamiaje cognitivo progresivo (Modelo CREA UDP)",
    estado: "activo",
  },
  {
    id: "m2",
    numero: 2,
    titulo: "Clima de Aula Seguro, Empatía y Salud Mental",
    duracion: "3 horas cronológicas",
    descripcion: "Manejo de la frustración ante el error en asignaturas técnicas (código, cálculos). Detección temprana de ansiedad ante evaluaciones y derivación a Bienestar UDP.",
    competencia: "Comunicación asertiva y contención formativa",
    estado: "activo",
  },
  {
    id: "m3",
    numero: 3,
    titulo: "Evaluación Formativa, Criterios Objetivos y Rúbricas",
    duracion: "4 horas cronológicas",
    descripcion: "Aplicación de rúbricas institucionales con descriptores observables. Cómo redactar feedback enriquecido que explique el 'por qué' del puntaje.",
    competencia: "Evaluación objetiva alineada a RAPs",
    estado: "activo",
  },
  {
    id: "m4",
    numero: 4,
    titulo: "Perspectiva de Género, Trato Digno y No Discriminación",
    duracion: "2 horas cronológicas",
    descripcion: "Protocolos institucionales de género e inclusión. Garantizar igualdad de turnos de habla y evitar sesgos implícitos en equipos de ingeniería.",
    competencia: "Equidad y ambiente libre de acoso",
    estado: "activo",
  },
  {
    id: "m5",
    numero: 5,
    titulo: "Uso Ético de Inteligencia Artificial en Ayudantías",
    duracion: "3 horas cronológicas",
    descripcion: "Políticas sobre cuándo y cómo usar LLMs como apoyo de corrección. Detección de plagio vs uso pedagógico guiado.",
    competencia: "Alfabetización y ética en IA",
    estado: "activo",
  },
];

export const AyudantePedagogyTab: React.FC = () => {
  const [downloadGuideSuccess, setDownloadGuideSuccess] = useState(false);

  const handleDownloadGuide = () => {
    setDownloadGuideSuccess(true);
    setTimeout(() => setDownloadGuideSuccess(false), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Diagnóstico Pedagógico e Investigación */}
      <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-[4px] text-xs text-purple-900 space-y-2">
        <div className="flex items-center gap-2 font-bold text-purple-950 text-sm">
          <Brain size={18} className="text-purple-700" />
          <span>Línea de Investigación: Profesionalización de la Docencia Auxiliar UDP</span>
        </div>
        <p className="leading-relaxed">
          <strong>Premisa Pedagógica Central:</strong> <em>"Saber mucho de una materia no significa saber enseñarla"</em>. Actualmente la mayoría de los ayudantes universitarios asumen su labor sin formación didáctica previa. La Escuela de Informática junto al Centro CREA UDP implementa un <strong>Curso Base de Inducción Pedagógica Obligatorio</strong> para certificar que el ayudante no solo domine el contenido técnico, sino que maneje el clima de aula, la retroalimentación constructiva y la perspectiva de género.
        </p>
      </div>

      {/* KPI de Certificación y Acciones */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-white border border-gray-200 rounded-[4px] shadow-xs">
          <span className="text-[11px] text-gray-500 font-bold uppercase block">Ayudantes Certificados</span>
          <span className="text-xl font-extrabold text-emerald-700 block mt-1">18 / 24 (75%)</span>
          <span className="text-[10px] text-emerald-600">Aprobaron módulos CREA</span>
        </div>

        <div className="p-3 bg-white border border-gray-200 rounded-[4px] shadow-xs">
          <span className="text-[11px] text-gray-500 font-bold uppercase block">En Curso de Inducción</span>
          <span className="text-xl font-extrabold text-amber-700 block mt-1">4 Ayudantes</span>
          <span className="text-[10px] text-amber-700">Completando módulo 3 de rúbricas</span>
        </div>

        <div className="p-3 bg-white border border-gray-200 rounded-[4px] shadow-xs">
          <span className="text-[11px] text-gray-500 font-bold uppercase block">Pendientes de Registro</span>
          <span className="text-xl font-extrabold text-red-700 block mt-1">2 Ayudantes</span>
          <span className="text-[10px] text-gray-400">Postulantes nuevos 2026-1</span>
        </div>

        <div className="p-3 bg-white border border-gray-200 rounded-[4px] shadow-xs flex flex-col justify-between">
          <span className="text-[11px] text-gray-500 font-bold uppercase block">Material Docente</span>
          <CanvasButton
            variant="outline"
            size="sm"
            icon={<Download size={14} />}
            onClick={handleDownloadGuide}
            title="Descargar Guía Oficial de Buenas Prácticas Pedagógicas UDP"
          >
            Descargar Guía Pedagógica
          </CanvasButton>
        </div>
      </div>

      {downloadGuideSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>Guía oficial "Manual Pedagógico para Ayudantes de Ingeniería UDP 2026" descargada con éxito (.PDF).</span>
        </div>
      )}

      {/* Módulos de la Formación Pedagógica Base */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-[#2D3B45] uppercase tracking-wider block">
            Estructura Curricular del Curso Base de Ayudantes (16 Horas Totales)
          </span>
          <span className="text-[11px] text-gray-500">Diseñado con el Centro CREA UDP</span>
        </div>

        <div className="space-y-2.5">
          {TRAINING_MODULES.map((modulo) => (
            <div
              key={modulo.id}
              className="p-3.5 bg-white border border-gray-200 rounded-[4px] hover:border-blue-300 transition-all shadow-xs space-y-1.5"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#008EE2] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {modulo.numero}
                  </span>
                  <h4 className="text-xs font-bold text-[#2D3B45]">
                    {modulo.titulo}
                  </h4>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-gray-500 flex items-center gap-1">
                    <Clock size={12} />
                    {modulo.duracion}
                  </span>
                  <CanvasBadge variant="success">Obligatorio</CanvasBadge>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-normal pl-7">
                {modulo.descripcion}
              </p>
              <div className="pl-7 pt-1 flex items-center gap-1.5 text-[11px] text-[#008EE2] font-semibold">
                <ShieldCheck size={13} />
                <span>Competencia Clave: {modulo.competencia}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
