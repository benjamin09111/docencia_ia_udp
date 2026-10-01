"use client";

import React, { useState } from "react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import {
  FileSpreadsheet,
  Download,
  Send,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  Clock,
  Filter,
  Search,
  Building2,
  Check,
} from "lucide-react";

interface PaymentRow {
  id: string;
  nombre: string;
  rut: string;
  curso: string;
  horas: number;
  monto: number;
  boleta: string;
  estado: "pagado" | "en_tramite" | "aprobado_docente" | "pendiente";
  fechaPagoEstimada: string;
}

const MOCK_PAYMENTS: PaymentRow[] = [
  { id: "p1", nombre: "Matías Ignacio Rojas", rut: "20.123.456-7", curso: "CIT3203 - Proy. Innovación (Sec 1)", horas: 12, monto: 195000, boleta: "BOL-2026-441", estado: "pagado", fechaPagoEstimada: "28 Mar 2026" },
  { id: "p2", nombre: "Valentina Paz Silva", rut: "19.987.654-3", curso: "CIT3203 - Proy. Innovación (Sec 2)", horas: 12, monto: 195000, boleta: "BOL-2026-442", estado: "en_tramite", fechaPagoEstimada: "30 Abr 2026" },
  { id: "p3", nombre: "Diego Andrés Morales", rut: "21.054.321-8", curso: "CIT2206 - Taller de Integración", horas: 15, monto: 245000, boleta: "BOL-2026-445", estado: "aprobado_docente", fechaPagoEstimada: "30 Abr 2026" },
  { id: "p4", nombre: "Fernanda Lucía Herrera", rut: "20.876.543-2", curso: "CIT3100 - Redes y Cloud", horas: 10, monto: 165000, boleta: "Pendiente", estado: "pendiente", fechaPagoEstimada: "Por definir" },
  { id: "p5", nombre: "Lucas Tomás Navarrete", rut: "20.432.109-1", curso: "CIT1010 - Programación I", horas: 16, monto: 260000, boleta: "BOL-2026-449", estado: "en_tramite", fechaPagoEstimada: "30 Abr 2026" },
];

export const AyudantePaymentsSubTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportDispatched, setReportDispatched] = useState(false);

  const filteredPayments = MOCK_PAYMENTS.filter((p) => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || p.curso.toLowerCase().includes(searchTerm.toLowerCase()) || p.rut.includes(searchTerm);
    const matchesStatus = statusFilter === "todos" || p.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalMonto = MOCK_PAYMENTS.reduce((sum, p) => sum + p.monto, 0);

  const handleDispatchReport = () => {
    setReportDispatched(true);
    setTimeout(() => {
      setReportDispatched(false);
      setShowReportModal(false);
    }, 3000);
  };

  return (
    <div className="space-y-4">
      {/* Resumen de Cifras de Pagos */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-white border border-gray-200 rounded-[4px] shadow-xs">
          <span className="text-[11px] text-gray-500 font-bold uppercase block">Presupuesto Mensual</span>
          <span className="text-xl font-extrabold text-[#2D3B45] block mt-1">
            ${totalMonto.toLocaleString("es-CL")}
          </span>
          <span className="text-[10px] text-gray-400">Escuela de Informática UDP</span>
        </div>

        <div className="p-3 bg-white border border-gray-200 rounded-[4px] shadow-xs">
          <span className="text-[11px] text-gray-500 font-bold uppercase block">Ayudantes en Nómina</span>
          <span className="text-xl font-extrabold text-[#008EE2] block mt-1">24 Alumnos</span>
          <span className="text-[10px] text-emerald-600 font-semibold">100% con contrato vigente</span>
        </div>

        <div className="p-3 bg-white border border-gray-200 rounded-[4px] shadow-xs">
          <span className="text-[11px] text-gray-500 font-bold uppercase block">En Trámite de Pago</span>
          <span className="text-xl font-extrabold text-amber-700 block mt-1">2 Boletas</span>
          <span className="text-[10px] text-amber-700">En revisión Dirección de Finanzas</span>
        </div>

        <div className="p-3 bg-white border border-gray-200 rounded-[4px] shadow-xs flex flex-col justify-between">
          <span className="text-[11px] text-gray-500 font-bold uppercase block">Control Oficial</span>
          <CanvasButton
            variant="primary-canvas"
            size="sm"
            icon={<FileSpreadsheet size={14} />}
            onClick={() => setShowReportModal(true)}
            title="Consolidar informe de horas y remuneraciones para Dirección de Finanzas"
          >
            Generar informe de pagos
          </CanvasButton>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por ayudante, RUT o curso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#008EE2] focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-gray-300 rounded text-xs bg-white text-gray-700 focus:outline-none"
          >
            <option value="todos">Todos los Estados</option>
            <option value="pagado">Pagados</option>
            <option value="en_tramite">En Trámite</option>
            <option value="aprobado_docente">Aprobado por Docente</option>
            <option value="pendiente">Pendiente</option>
          </select>
        </div>

        <span className="text-[11px] text-gray-500">
          Mostrando {filteredPayments.length} de {MOCK_PAYMENTS.length} registros
        </span>
      </div>

      {/* Tabla de Pagos */}
      <div className="border border-gray-200 rounded-[4px] overflow-x-auto bg-white">
        <table className="w-full text-left text-xs border-collapse min-w-[700px]">
          <thead className="bg-gray-100 text-gray-700 font-bold border-b border-gray-200 text-[11px] uppercase">
            <tr>
              <th className="p-2.5">Ayudante / RUT</th>
              <th className="p-2.5">Asignatura</th>
              <th className="p-2.5 text-center">Horas/Mes</th>
              <th className="p-2.5 text-right">Monto Bruto</th>
              <th className="p-2.5 text-center">Boleta N°</th>
              <th className="p-2.5 text-center">Estado</th>
              <th className="p-2.5 text-center">Fecha Pago</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPayments.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="p-2.5">
                  <div className="font-bold text-[#2D3B45]">{row.nombre}</div>
                  <div className="text-[10px] text-gray-400 font-mono">{row.rut}</div>
                </td>
                <td className="p-2.5 text-gray-700 font-medium">{row.curso}</td>
                <td className="p-2.5 text-center font-semibold">{row.horas} hrs</td>
                <td className="p-2.5 text-right font-mono font-bold text-gray-900">
                  ${row.monto.toLocaleString("es-CL")}
                </td>
                <td className="p-2.5 text-center font-mono text-[11px] text-gray-600">{row.boleta}</td>
                <td className="p-2.5 text-center">
                  <CanvasBadge
                    variant={
                      row.estado === "pagado"
                        ? "success"
                        : row.estado === "en_tramite"
                        ? "warning"
                        : row.estado === "aprobado_docente"
                        ? "info"
                        : "danger"
                    }
                  >
                    {row.estado === "pagado"
                      ? "Pagado"
                      : row.estado === "en_tramite"
                      ? "En Trámite"
                      : row.estado === "aprobado_docente"
                      ? "Aprobado Docente"
                      : "Pendiente Boleta"}
                  </CanvasBadge>
                </td>
                <td className="p-2.5 text-center text-[11px] text-gray-500">{row.fechaPagoEstimada}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Informe Automático de Pagos */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white border border-[#E0E3E6] rounded-[6px] shadow-2xl max-w-lg w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet size={18} className="text-emerald-600" />
                <h3 className="text-sm font-bold text-[#2D3B45]">
                  Informe Consolidado de Remuneraciones
                </h3>
              </div>
              <button onClick={() => setShowReportModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            {reportDispatched ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded text-emerald-900 text-xs flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span>Nómina oficial despachada a la Dirección de Finanzas y Recursos Humanos UDP.</span>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-gray-700">
                <p>
                  Este informe consolida las horas efectivas aprobadas por los profesores titulares de cada cátedra y genera el archivo de liquidación oficial para tramitación de boletas de honorarios.
                </p>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-600">Periodo Liquidado:</span>
                    <span className="font-bold text-gray-900">Marzo - Abril 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-600">Total Ayudantes:</span>
                    <span className="font-bold text-gray-900">24 estudiantes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-600">Monto Total Nómina:</span>
                    <span className="font-extrabold text-[#C8102E] font-mono">$4.850.000 CLP</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <CanvasButton variant="outline" size="sm" onClick={() => setShowReportModal(false)}>
                    Cancelar
                  </CanvasButton>
                  <CanvasButton
                    variant="primary-udp"
                    size="sm"
                    icon={<Send size={13} />}
                    onClick={handleDispatchReport}
                  >
                    Enviar Nómina a Finanzas UDP
                  </CanvasButton>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
