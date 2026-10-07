import React from "react";
import { MapPin, Compass, CheckCircle2, AlertTriangle } from "lucide-react";

interface PublicAttendanceLocationCardProps {
  geoStatus: "idle" | "checking" | "verified" | "out_of_range" | "denied";
  distancia?: number;
  targetCampusNombre: string;
  targetRadius: number;
  onVerifyLocation: () => void;
}

export const PublicAttendanceLocationCard: React.FC<PublicAttendanceLocationCardProps> = ({
  geoStatus,
  distancia,
  targetCampusNombre,
  targetRadius,
  onVerifyLocation,
}) => {
  return (
    <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-[4px] space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-bold text-[#008EE2] flex items-center gap-1.5">
          <MapPin size={13} />
          4. Validación de Ubicación Física:
        </span>
        <span className="text-[10px] text-gray-500 font-mono">GPS</span>
      </div>

      <p className="text-[11px] text-gray-600">
        Ubicación configurada: <strong>{targetCampusNombre}</strong> (margen de cobertura: {targetRadius}m).
      </p>

      {geoStatus === "idle" && (
        <button
          type="button"
          onClick={onVerifyLocation}
          className="w-full py-2 bg-white hover:bg-gray-50 border border-blue-300 text-[#008EE2] rounded font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <Compass size={13} />
          <span>Verificar que estoy en la sala (GPS)</span>
        </button>
      )}

      {geoStatus === "checking" && (
        <div className="py-2 text-center text-gray-500 italic block animate-pulse">
          Calculando coordenadas GPS del campus UDP...
        </div>
      )}

      {geoStatus === "verified" && (
        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-emerald-900 font-medium text-[11px] flex items-center gap-1.5">
          <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
          <span>
            Ubicación validada: En campus UDP (a {distancia ?? 0}m de {targetCampusNombre}, cobertura permitida {targetRadius}m).
          </span>
        </div>
      )}

      {geoStatus === "out_of_range" && (
        <div className="p-2 bg-amber-50 border border-amber-200 rounded text-amber-900 font-medium text-[11px] space-y-1">
          <div className="flex items-center gap-1.5">
            <AlertTriangle size={14} className="text-amber-600 shrink-0" />
            <strong>Fuera del perímetro permitido ({distancia}m)</strong>
          </div>
          <p className="text-[10px] text-amber-800">
            El radio de cobertura para el cuadrante del campus es de {targetRadius}m. Debes estar en la facultad para poder marcar.
          </p>
          <button
            type="button"
            onClick={onVerifyLocation}
            className="text-[10px] text-[#008EE2] underline font-semibold block cursor-pointer"
          >
            Volver a calcular ubicación
          </button>
        </div>
      )}

      {geoStatus === "denied" && (
        <div className="p-2 bg-red-50 border border-red-200 rounded text-red-900 text-[11px] space-y-1">
          <span className="font-bold block">Permiso de ubicación GPS denegado</span>
          <p className="text-[10px]">
            Activa la ubicación en los ajustes de tu navegador para confirmar que estás presente en la sala.
          </p>
          <button
            type="button"
            onClick={onVerifyLocation}
            className="text-[10px] text-[#008EE2] underline font-semibold block cursor-pointer"
          >
            Reintentar permiso GPS
          </button>
        </div>
      )}
    </div>
  );
};
