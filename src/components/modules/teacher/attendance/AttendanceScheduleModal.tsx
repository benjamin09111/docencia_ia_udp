import React, { useState } from "react";
import { CourseSection } from "@/types/attendance";
import { X, Clock, MapPin, Save, Calendar, Navigation, KeyRound, RefreshCw, Compass } from "lucide-react";

interface AttendanceScheduleModalProps {
  section: CourseSection;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedSection: CourseSection) => void;
}

const DIAS_OPCIONES = [
  { val: 1, label: "Lun" },
  { val: 2, label: "Mar" },
  { val: 3, label: "Mié" },
  { val: 4, label: "Jue" },
  { val: 5, label: "Vie" },
];

const PRESETS_CAMPUS = [
  {
    nombre: "Facultad de Ingeniería y Ciencias (Ejército 441)",
    lat: -33.4501,
    lng: -70.6622,
    radio: 500,
  },
  {
    nombre: "Campus República - Aulas (Vergara 432)",
    lat: -33.4503,
    lng: -70.6610,
    radio: 450,
  },
  {
    nombre: "Campus Manuel Rodríguez (Manuel Rodríguez 415)",
    lat: -33.4485,
    lng: -70.6605,
    radio: 500,
  },
];

export const AttendanceScheduleModal: React.FC<AttendanceScheduleModalProps> = ({
  section,
  isOpen,
  onClose,
  onSave,
}) => {
  const [catedraDias, setCatedraDias] = useState<number[]>(section.horarioCatedra.dias.filter((d) => d >= 1 && d <= 5));
  const [catedraInicio, setCatedraInicio] = useState(section.horarioCatedra.horaInicio || "14:30");
  const [catedraFin, setCatedraFin] = useState(section.horarioCatedra.horaFin || "17:30");

  const [ayudantiaDias, setAyudantiaDias] = useState<number[]>(
    section.horarioAyudantia?.dias?.filter((d) => d >= 1 && d <= 5) || [3]
  );
  const [ayudantiaInicio, setAyudantiaInicio] = useState(section.horarioAyudantia?.horaInicio || "16:00");
  const [ayudantiaFin, setAyudantiaFin] = useState(section.horarioAyudantia?.horaFin || "17:20");
  const [ayudantiaSala, setAyudantiaSala] = useState(section.horarioAyudantia?.sala || "Laboratorio TIC 2");

  const [requiereGeo, setRequiereGeo] = useState(section.requiereGeolocalizacion ?? true);
  const [requierePin, setRequierePin] = useState(section.requierePin ?? true);
  const [pinActivo, setPinActivo] = useState(section.pinActivo || "4821");

  // Ubicación y Coordenadas GPS
  const [ubicacionNombre, setUbicacionNombre] = useState(
    section.ubicacionNombre || "Facultad de Ingeniería y Ciencias UDP (Av. Ejército Libertador 441)"
  );
  const [ubicacionLat, setUbicacionLat] = useState<number>(section.ubicacionLat ?? -33.4501);
  const [ubicacionLng, setUbicacionLng] = useState<number>(section.ubicacionLng ?? -70.6622);
  const [radioMetros, setRadioMetros] = useState<number>(section.radioMetros ?? 500);

  if (!isOpen) return null;

  const selectAyudantiaDia = (dia: number) => {
    setAyudantiaDias([dia]);
  };

  const applyPreset = (preset: typeof PRESETS_CAMPUS[0]) => {
    setUbicacionNombre(preset.nombre);
    setUbicacionLat(preset.lat);
    setUbicacionLng(preset.lng);
    setRadioMetros(preset.radio);
  };

  const handleRegeneratePin = () => {
    const newPin = Math.floor(1000 + Math.random() * 9000).toString();
    setPinActivo(newPin);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...section,
      horarioCatedra: {
        ...section.horarioCatedra,
        dias: catedraDias,
        horaInicio: catedraInicio,
        horaFin: catedraFin,
      },
      horarioAyudantia: {
        ...section.horarioAyudantia,
        dias: ayudantiaDias,
        horaInicio: ayudantiaInicio,
        horaFin: ayudantiaFin,
        sala: ayudantiaSala,
      },
      pinActivo,
      requierePin,
      requiereGeolocalizacion: requiereGeo,
      ubicacionNombre,
      ubicacionLat,
      ubicacionLng,
      radioMetros,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-[4px] border border-[#E0E3E6] shadow-canvas-modal max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 space-y-4">
        <div className="flex justify-between items-start border-b border-gray-200 pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#2D3B45] flex items-center gap-2">
              <Calendar size={16} className="text-[#008EE2]" />
              Configurar Horarios, Ubicación GPS y PIN: {section.nombre}
            </h3>
            <span className="text-xs text-[#6B7780] font-mono">{section.codigo} • {section.cursoNombre}</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Horario de Ayudantía */}
          <div className="p-3 bg-purple-50/50 border border-purple-200 rounded-[4px] space-y-2">
            <span className="font-bold text-purple-900 block">1. Horario Oficial de Ayudantía:</span>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-600 w-16 font-medium">Día fijo:</span>
              <div className="flex gap-1">
                {DIAS_OPCIONES.map((d) => (
                  <button
                    key={d.val}
                    type="button"
                    onClick={() => selectAyudantiaDia(d.val)}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors ${
                      ayudantiaDias.includes(d.val)
                        ? "bg-purple-700 text-white border-purple-700 shadow-xs"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Clock size={13} className="text-gray-500" />
              <span>De</span>
              <input
                type="time"
                value={ayudantiaInicio}
                onChange={(e) => setAyudantiaInicio(e.target.value)}
                className="p-1 border border-gray-300 rounded bg-white text-center font-mono font-bold"
              />
              <span>a</span>
              <input
                type="time"
                value={ayudantiaFin}
                onChange={(e) => setAyudantiaFin(e.target.value)}
                className="p-1 border border-gray-300 rounded bg-white text-center font-mono font-bold"
              />
              <span className="ml-2 text-gray-600 font-medium">Sala:</span>
              <input
                type="text"
                value={ayudantiaSala}
                onChange={(e) => setAyudantiaSala(e.target.value)}
                placeholder="Ej. Lab TIC 2"
                className="p-1 border border-gray-300 rounded bg-white flex-1 min-w-[100px]"
              />
            </div>
          </div>

          {/* Configuración de Ubicación Física y GPS */}
          <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-[4px] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#008EE2] flex items-center gap-1.5">
                <MapPin size={14} />
                2. Ubicación Física y Geocerca GPS (UDP):
              </span>
              <span className="text-[10px] text-gray-500 font-mono">Facultad & Campus</span>
            </div>

            {/* Presets Rápidos */}
            <div className="space-y-1">
              <span className="text-[10px] text-gray-600 font-medium block">Cargar ubicación institucional predefinida:</span>
              <div className="flex flex-wrap gap-1.5">
                {PRESETS_CAMPUS.map((pr) => (
                  <button
                    key={pr.nombre}
                    type="button"
                    onClick={() => applyPreset(pr)}
                    className="px-2 py-0.5 bg-white hover:bg-blue-50 border border-blue-300 text-blue-800 rounded text-[10px] font-semibold transition-colors flex items-center gap-1"
                  >
                    <Compass size={10} />
                    {pr.nombre.split("(")[0].trim()}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-gray-700 font-medium block">Nombre / Dirección del Campus:</label>
              <input
                type="text"
                value={ubicacionNombre}
                onChange={(e) => setUbicacionNombre(e.target.value)}
                className="w-full p-1.5 border border-gray-300 rounded bg-white font-medium text-xs"
                placeholder="Av. Ejército Libertador 441, Santiago"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-gray-600 font-medium block">Latitud GPS:</label>
                <input
                  type="number"
                  step="0.0001"
                  value={ubicacionLat}
                  onChange={(e) => setUbicacionLat(parseFloat(e.target.value) || -33.4501)}
                  className="w-full p-1 border border-gray-300 rounded bg-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-600 font-medium block">Longitud GPS:</label>
                <input
                  type="number"
                  step="0.0001"
                  value={ubicacionLng}
                  onChange={(e) => setUbicacionLng(parseFloat(e.target.value) || -70.6622)}
                  className="w-full p-1 border border-gray-300 rounded bg-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-600 font-medium block" title="Margen de tolerancia para cuadrante Metro Toesca - Metro Los Héroes">
                  Margen de Error (metros):
                </label>
                <input
                  type="number"
                  min="50"
                  max="5000"
                  step="50"
                  value={radioMetros}
                  onChange={(e) => setRadioMetros(parseInt(e.target.value, 10) || 500)}
                  className="w-full p-1 border border-gray-300 rounded bg-white font-mono font-bold text-xs"
                />
              </div>
            </div>

            <div className="p-2 bg-white/70 border border-blue-100 rounded text-[11px] text-blue-900 leading-snug">
              ℹ️ <strong>Margen Toesca - Los Héroes:</strong> El radio de <strong>{radioMetros}m</strong> permite que los alumnos registren asistencia en cualquier sala o pabellón dentro del cuadrante universitario UDP.
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={requiereGeo}
                onChange={(e) => setRequiereGeo(e.target.checked)}
                className="rounded text-[#008EE2]"
              />
              <span className="font-semibold text-gray-700">
                Exigir validación GPS obligatoria al alumno al marcar
              </span>
            </label>
          </div>

          {/* Seguridad y PIN de Sala */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-[4px] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#2D3B45] flex items-center gap-1.5">
                <KeyRound size={14} className="text-amber-600" />
                3. PIN de Sala Dinámico:
              </span>
              <span className="text-[10px] text-gray-500 font-mono">Control de presencia</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-[11px] text-gray-600 block">PIN de 4 dígitos:</label>
                <input
                  type="text"
                  maxLength={4}
                  value={pinActivo}
                  onChange={(e) => setPinActivo(e.target.value)}
                  className="p-1.5 border border-gray-300 rounded bg-white font-mono text-center font-black text-sm tracking-widest w-28"
                />
              </div>

              <button
                type="button"
                onClick={handleRegeneratePin}
                className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 rounded text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition-colors self-end"
              >
                <RefreshCw size={12} />
                <span>Generar Nuevo PIN</span>
              </button>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={requierePin}
                onChange={(e) => setRequierePin(e.target.checked)}
                className="rounded text-[#008EE2]"
              />
              <span className="font-medium text-gray-700">
                Exigir ingreso de PIN proyectado en la sala
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-gray-300 rounded-[4px] text-xs font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#2D3B45] hover:bg-[#1E272E] text-white rounded-[4px] text-xs font-bold flex items-center gap-1.5"
            >
              <Save size={13} />
              <span>Guardar Configuración</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
