"use client";

import React, { useState } from "react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import {
  Network,
  X,
  Sparkles,
  Layers,
  FileCode,
  MapPin,
  Smartphone,
  Users,
  CheckCircle2,
  ArrowRight,
  Download,
  BookOpen,
  Share2,
  Compass,
} from "lucide-react";

interface FutureConnectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ExternalPlatform {
  id: string;
  nombre: string;
  categoria: string;
  icono: string;
  estadoActual: string;
  integracionProyectada: string;
  impacto: "Alto" | "Estratégico" | "Crítico";
}

const EXTERNAL_PLATFORMS: ExternalPlatform[] = [
  {
    id: "epauta",
    nombre: "ePauta (Evaluaciones y Pautas)",
    categoria: "Evaluación Estudiantil",
    icono: "FileText",
    estadoActual: "Plataforma externa que los estudiantes usan por separado para consultar pautas oficiales y enunciados sin conexión a actas.",
    integracionProyectada: "Sincronización nativa de pautas generadas por el Agente de Rúbricas y resolución trazable de apelaciones en un solo flujo.",
    impacto: "Alto",
  },
  {
    id: "malla",
    nombre: "Malla Interactiva (App Casera Estudiantil)",
    categoria: "Plan de Estudios",
    icono: "Compass",
    estadoActual: "Herramienta informal creada por alumnos para simular prerrequisitos y ramos aprobados, desconectada de la ficha académica UDP.",
    integracionProyectada: "Módulo oficial integrado con Canvas que mapea el avance en tiempo real de RAPs, créditos SCT y ramos habilitados por semestre.",
    impacto: "Estratégico",
  },
  {
    id: "eit",
    nombre: "Plataforma EIT (Ejercicios de Programación)",
    categoria: "Práctica de Código",
    icono: "FileCode",
    estadoActual: "Servidor casero de ejercicios de programación usado aisladamente en asignaturas específicas de la Escuela de Informática.",
    integracionProyectada: "Ejecución y testeo automático de código con feedback pedagógico en vivo entregado por el Agente Tutor de aula.",
    impacto: "Alto",
  },
  {
    id: "ayudantes",
    nombre: "Sitio de Ayudantes y Convocatorias",
    categoria: "Gestión Docente",
    icono: "Users",
    estadoActual: "Formularios de Google dispersos y procesos sin baremación formal que dependen exclusivamente del criterio informal del docente.",
    integracionProyectada: "Portal centralizado con baremo académico, certificación pedagógica CREA y despacho automatizado de nóminas a Finanzas.",
    impacto: "Estratégico",
  },
  {
    id: "salas",
    nombre: "Sistema de Asignación de Salas UDP",
    categoria: "Infraestructura Física",
    icono: "MapPin",
    estadoActual: "Planillas estáticas de secretaría con cruces de horarios y falta de visibilidad en tiempo real de qué aula o laboratorio está libre.",
    integracionProyectada: "Disponibilidad en vivo de salas, integración con geocercas para asistencia automatizada y reprogramación ágil de cátedras.",
    impacto: "Crítico",
  },
  {
    id: "movil",
    nombre: "App Móvil UDP / Credencial Digital",
    categoria: "Identidad & Campus",
    icono: "Smartphone",
    estadoActual: "Aplicación móvil acotada a exhibir la credencial plástica en pantalla para torniquetes de acceso a la universidad.",
    integracionProyectada: "Check-in de asistencia por geolocalización, avisos push directos de evaluaciones y alertas tempranas en el bolsillo del estudiante.",
    impacto: "Crítico",
  },
];

export const FutureConnectionsModal: React.FC<FutureConnectionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [downloadRoadmapSuccess, setDownloadRoadmapSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadRoadmap = () => {
    setDownloadRoadmapSuccess(true);
    setTimeout(() => setDownloadRoadmapSuccess(false), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-[#E0E3E6] rounded-[6px] shadow-2xl max-w-3xl w-full p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-start border-b border-gray-200 pb-3">
          <div className="flex items-start gap-2.5">
            <div className="p-2 bg-purple-50 text-purple-700 rounded border border-purple-200 shrink-0 mt-0.5">
              <Network size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-[#2D3B45]">
                  Futuras Conexiones y Unificación del Ecosistema UDP
                </h3>
                <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded border border-purple-200">
                  Visión Integradora
                </span>
                <span className="text-[10px] bg-blue-100 text-[#008EE2] font-bold px-2 py-0.5 rounded border border-blue-200">
                  Automatización a Gran Escala
                </span>
              </div>
              <p className="text-xs text-[#6B7780] mt-0.5">
                Estrategia de convergencia: de iniciativas fragmentadas a una infraestructura digital unificada, automatizada y práctica.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded"
          >
            <X size={18} />
          </button>
        </div>

        {downloadRoadmapSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>
              <strong>Hoja de Ruta Descargada:</strong> Documento estratégico "Plan de Convergencia Tecnológica UDP 2026-2028" exportado con éxito (.PDF).
            </span>
          </div>
        )}

        {/* Declaración de Visión del Proyecto */}
        <div className="p-4 bg-gradient-to-r from-purple-50/80 to-blue-50/80 border border-purple-200 rounded-[4px] space-y-2 text-xs text-[#2D3B45]">
          <div className="flex items-center gap-2 font-bold text-purple-950 text-sm">
            <Sparkles size={16} className="text-purple-600" />
            <span>Misión: Automatizar, Sistematizar y Unir a Toda la Universidad</span>
          </div>
          <p className="leading-relaxed text-gray-700">
            Hoy en la universidad coexisten múltiples herramientas caseras, plataformas sueltas y soluciones desconectadas que resuelven problemas puntuales pero <strong>no están bien articuladas</strong>. Este proyecto nace con una visión ambiciosa: <strong>construir un ecosistema que integre y dé coherencia a toda la institución</strong>, partiendo desde lo práctico y concreto (la docencia directa, ayudantías y evaluación) para luego converger de forma ordenada.
          </p>
        </div>

        {/* Mapeo de Iniciativas y Futuras Conexiones */}
        <div className="space-y-2.5">
          <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
            Plataformas e Iniciativas Mapeadas para Futura Integración
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {EXTERNAL_PLATFORMS.map((plat) => (
              <div
                key={plat.id}
                className="p-3.5 bg-white border border-gray-200 rounded-[4px] shadow-xs hover:border-purple-300 transition-all space-y-2"
              >
                <div className="flex justify-between items-start gap-1">
                  <div>
                    <h4 className="font-bold text-[#2D3B45] text-xs">
                      {plat.nombre}
                    </h4>
                    <span className="text-[10px] text-gray-500 font-medium">
                      {plat.categoria}
                    </span>
                  </div>
                  <CanvasBadge
                    variant={
                      plat.impacto === "Crítico"
                        ? "danger"
                        : plat.impacto === "Estratégico"
                        ? "warning"
                        : "info"
                    }
                  >
                    {plat.impacto}
                  </CanvasBadge>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="p-2 bg-gray-50 rounded border border-gray-200/80 text-gray-600 leading-snug">
                    <strong className="text-gray-700 block text-[10px] uppercase font-bold">
                      Situación Actual Fragmentada:
                    </strong>
                    {plat.estadoActual}
                  </div>

                  <div className="p-2 bg-blue-50/60 rounded border border-blue-200/70 text-blue-900 leading-snug">
                    <strong className="text-blue-950 block text-[10px] uppercase font-bold flex items-center gap-1">
                      <ArrowRight size={10} className="text-[#008EE2]" />
                      Integración en esta Plataforma:
                    </strong>
                    {plat.integracionProyectada}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enfoque Gradual: De lo Práctico a lo Institucional */}
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-[4px] text-xs text-gray-700 space-y-1.5">
          <span className="font-bold text-[#2D3B45] block">
            Estrategia de Despliegue Gradual (Roadmap):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <div className="p-2 bg-white rounded border border-gray-200">
              <strong className="block text-emerald-700">Fase 1 (Actual - Aula):</strong>
              <span>Docencia, ayudantías, décimas automatizadas, actas oficiales anonimizadas y asistencia.</span>
            </div>
            <div className="p-2 bg-white rounded border border-gray-200">
              <strong className="block text-[#008EE2]">Fase 2 (Próxima - Académica):</strong>
              <span>Conexión API con ePauta, Plataforma EIT y sistema baremado de selección de ayudantes.</span>
            </div>
            <div className="p-2 bg-white rounded border border-gray-200">
              <strong className="block text-purple-700">Fase 3 (Campus Integrado):</strong>
              <span>Salas en tiempo real, credencial digital móvil y malla interactiva oficial UDP.</span>
            </div>
          </div>
        </div>

        {/* Footer con Acciones */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-3 border-t border-gray-200">
          <span className="text-[11px] text-gray-500">
            Escuela de Informática y Telecomunicaciones • Facultad de Ingeniería UDP
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <CanvasButton variant="outline" size="sm" onClick={onClose}>
              Cerrar
            </CanvasButton>

            <CanvasButton
              variant="primary-canvas"
              size="sm"
              icon={<Download size={14} />}
              onClick={handleDownloadRoadmap}
            >
              Descargar Hoja de Ruta (.PDF)
            </CanvasButton>
          </div>
        </div>
      </div>
    </div>
  );
};
