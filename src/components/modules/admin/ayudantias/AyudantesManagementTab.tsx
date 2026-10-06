"use client";

import React, { useState } from "react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import {
  Users,
  Search,
  Filter,
  Megaphone,
  Mail,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  DollarSign,
  GraduationCap,
  Copy,
  Check,
} from "lucide-react";
import { AyudanteAnnouncementModal } from "./AyudanteAnnouncementModal";
import { AyudantePaymentsSubTab } from "./AyudantePaymentsSubTab";

interface AyudanteItem {
  id: string;
  nombre: string;
  rut: string;
  correo: string;
  curso: string;
  tipo: "Cátedra" | "Laboratorio" | "Corrección";
  promedioHistorico: number;
  estado: "activo" | "postulante" | "historico";
  certificacionPedagogica: "Certificado CREA" | "En Curso" | "Pendiente";
}

const MOCK_AYUDANTES: AyudanteItem[] = [
  { id: "a1", nombre: "Matías Ignacio Rojas", rut: "20.123.456-7", correo: "matias.rojas@mail.udp.cl", curso: "CIT3203 - Proy. Innovación (Sec 1)", tipo: "Cátedra", promedioHistorico: 6.3, estado: "activo", certificacionPedagogica: "Certificado CREA" },
  { id: "a2", nombre: "Valentina Paz Silva", rut: "19.987.654-3", correo: "valentina.silva@mail.udp.cl", curso: "CIT3203 - Proy. Innovación (Sec 2)", tipo: "Laboratorio", promedioHistorico: 6.1, estado: "activo", certificacionPedagogica: "Certificado CREA" },
  { id: "a3", nombre: "Diego Andrés Morales", rut: "21.054.321-8", correo: "diego.morales@mail.udp.cl", curso: "CIT2206 - Taller de Integración", tipo: "Laboratorio", promedioHistorico: 5.9, estado: "activo", certificacionPedagogica: "En Curso" },
  { id: "a4", nombre: "Fernanda Lucía Herrera", rut: "20.876.543-2", correo: "fernanda.herrera@mail.udp.cl", curso: "CIT3100 - Redes y Cloud", tipo: "Corrección", promedioHistorico: 6.4, estado: "activo", certificacionPedagogica: "Pendiente" },
  { id: "a5", nombre: "Gabriel Enrique Soto", rut: "20.654.987-1", correo: "gabriel.soto@mail.udp.cl", curso: "CIT1010 - Programación I", tipo: "Cátedra", promedioHistorico: 6.0, estado: "postulante", certificacionPedagogica: "Pendiente" },
  { id: "a6", nombre: "Camila Andrea Vega", rut: "19.876.123-5", correo: "camila.vega@mail.udp.cl", curso: "CIT3203 - Proy. Innovación (2025)", tipo: "Cátedra", promedioHistorico: 6.5, estado: "historico", certificacionPedagogica: "Certificado CREA" },
];

export const AyudantesManagementTab: React.FC = () => {
  const [innerTab, setInnerTab] = useState<"nomina" | "pagos">("nomina");
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState<string>("todos");
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const filtered = MOCK_AYUDANTES.filter((a) => {
    const matchesSearch = a.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || a.curso.toLowerCase().includes(searchTerm.toLowerCase()) || a.correo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = stateFilter === "todos" || a.estado === stateFilter;
    return matchesSearch && matchesState;
  });

  const handleCopyEmail = (correo: string) => {
    navigator.clipboard.writeText(correo);
    setCopiedEmail(correo);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Banner de Diagnóstico y Automatización del Proceso de Selección */}
      <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-[4px] text-xs text-blue-900 space-y-1">
        <div className="flex items-center gap-2 font-bold text-blue-950">
          <Sparkles size={15} className="text-[#008EE2]" />
          <span>Innovación en Selección de Ayudantes — Escuela de Informática UDP</span>
        </div>
        <p className="text-[11px] leading-relaxed text-blue-900">
          <strong>Diagnóstico Institucional:</strong> Tradicionalmente el proceso de selección de ayudantes carece de una metodología formal y suele depender exclusivamente del profesor a cargo ("a dedo"), generando cuellos de botella administrativos y disparidad de perfiles. Este módulo permite estructurar el baremo de méritos académicos, registrar convocatorias abiertas y auditar la trazabilidad de postulantes.
        </p>
      </div>

      {/* Selector de sub-sección: Nómina vs Pagos */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setInnerTab("nomina")}
            className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold transition-all ${
              innerTab === "nomina"
                ? "bg-[#2D3B45] text-white shadow-xs"
                : "bg-white text-[#2D3B45] border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Registro y Selección de Ayudantes ({MOCK_AYUDANTES.length})
          </button>
          <button
            type="button"
            onClick={() => setInnerTab("pagos")}
            className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold transition-all ${
              innerTab === "pagos"
                ? "bg-[#2D3B45] text-white shadow-xs"
                : "bg-white text-[#2D3B45] border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Gestión de Pagos y Remuneraciones
          </button>
        </div>

        {innerTab === "nomina" && (
          <CanvasButton
            variant="outline"
            size="sm"
            icon={<Megaphone size={14} className="text-[#008EE2]" />}
            onClick={() => setShowAnnouncementModal(true)}
            title="Enviar anuncio masivo oficial por correo a los ayudantes"
          >
            Anuncios automatizados
          </CanvasButton>
        )}
      </div>

      {/* Contenido según Inner Tab */}
      {innerTab === "pagos" ? (
        <AyudantePaymentsSubTab />
      ) : (
        <div className="space-y-3">
          {/* Filtros de Búsqueda */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por ayudante, curso o correo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#008EE2] focus:outline-none"
                />
              </div>

              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="px-2.5 py-1.5 border border-gray-300 rounded text-xs bg-white text-gray-700 focus:outline-none"
              >
                <option value="todos">Todos los Estados</option>
                <option value="activo">Activos (2026-1)</option>
                <option value="postulante">Postulantes en Evaluación</option>
                <option value="historico">Históricos / Pasados</option>
              </select>
            </div>

            <span className="text-[11px] text-gray-500">
              Mostrando {filtered.length} de {MOCK_AYUDANTES.length} ayudantes registrados
            </span>
          </div>

          {/* Tabla de Ayudantes */}
          <div className="border border-gray-200 rounded-[4px] overflow-x-auto bg-white">
            <table className="w-full text-left text-xs border-collapse min-w-[760px]">
              <thead className="bg-gray-100 text-gray-700 font-bold border-b border-gray-200 text-[11px] uppercase">
                <tr>
                  <th className="p-2.5">Ayudante / Contacto</th>
                  <th className="p-2.5">Asignatura Asignada</th>
                  <th className="p-2.5 text-center">Tipo</th>
                  <th className="p-2.5 text-center">Prom. Histórico</th>
                  <th className="p-2.5 text-center">Formación Pedagógica</th>
                  <th className="p-2.5 text-center">Estado</th>
                  <th className="p-2.5 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((ayudante) => (
                  <tr key={ayudante.id} className="hover:bg-gray-50">
                    <td className="p-2.5">
                      <div className="font-bold text-[#2D3B45]">{ayudante.nombre}</div>
                      <div className="text-[11px] text-gray-500 font-mono flex items-center gap-1">
                        <span>{ayudante.correo}</span>
                      </div>
                    </td>
                    <td className="p-2.5 text-gray-700 font-medium">{ayudante.curso}</td>
                    <td className="p-2.5 text-center">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[11px] font-medium">
                        {ayudante.tipo}
                      </span>
                    </td>
                    <td className="p-2.5 text-center font-bold text-gray-800">
                      {ayudante.promedioHistorico.toFixed(1)}
                    </td>
                    <td className="p-2.5 text-center">
                      <CanvasBadge
                        variant={
                          ayudante.certificacionPedagogica === "Certificado CREA"
                            ? "success"
                            : ayudante.certificacionPedagogica === "En Curso"
                            ? "warning"
                            : "danger"
                        }
                      >
                        {ayudante.certificacionPedagogica}
                      </CanvasBadge>
                    </td>
                    <td className="p-2.5 text-center">
                      <CanvasBadge
                        variant={
                          ayudante.estado === "activo"
                            ? "success"
                            : ayudante.estado === "postulante"
                            ? "info"
                            : "neutral"
                        }
                      >
                        {ayudante.estado === "activo" ? "Activo 2026-1" : ayudante.estado === "postulante" ? "Postulante" : "Histórico"}
                      </CanvasBadge>
                    </td>
                    <td className="p-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleCopyEmail(ayudante.correo)}
                        className="px-2 py-1 text-[11px] border border-gray-300 rounded hover:bg-gray-100 text-gray-700 flex items-center gap-1 mx-auto"
                        title="Copiar correo para contactar"
                      >
                        {copiedEmail === ayudante.correo ? (
                          <>
                            <Check size={12} className="text-emerald-600" />
                            <span className="text-emerald-700">¡Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Mail size={12} className="text-[#008EE2]" />
                            <span>Contactar</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Anuncios */}
      <AyudanteAnnouncementModal
        isOpen={showAnnouncementModal}
        onClose={() => setShowAnnouncementModal(false)}
      />
    </div>
  );
};
