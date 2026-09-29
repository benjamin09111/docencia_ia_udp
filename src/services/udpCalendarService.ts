import { UDPHoliday } from "@/types/attendance";

// Calendario Académico Oficial UDP 2026 - Segundo Semestre
export const INITIAL_UDP_HOLIDAYS: UDPHoliday[] = [
  {
    id: "fer_1",
    fecha: "2026-08-15",
    descripcion: "Asunción de la Virgen (Feriado Nacional)",
    tipo: "feriado_nacional",
    afectaClases: true,
  },
  {
    id: "rec_udp_1",
    fecha: "2026-09-14",
    descripcion: "Inicio Semana Receso Académico UDP Fiestas Patrias",
    tipo: "receso_udp",
    afectaClases: true,
  },
  {
    id: "rec_udp_2",
    fecha: "2026-09-15",
    descripcion: "Receso Académico UDP Fiestas Patrias",
    tipo: "receso_udp",
    afectaClases: true,
  },
  {
    id: "rec_udp_3",
    fecha: "2026-09-16",
    descripcion: "Receso Académico UDP Fiestas Patrias",
    tipo: "receso_udp",
    afectaClases: true,
  },
  {
    id: "fer_2",
    fecha: "2026-09-17",
    descripcion: "Feriado Fiestas Patrias (Nacional)",
    tipo: "feriado_nacional",
    afectaClases: true,
  },
  {
    id: "fer_3",
    fecha: "2026-09-18",
    descripcion: "Independencia Nacional (Feriado Irrenunciable)",
    tipo: "feriado_nacional",
    afectaClases: true,
  },
  {
    id: "fer_4",
    fecha: "2026-09-19",
    descripcion: "Glorias del Ejército (Feriado Irrenunciable)",
    tipo: "feriado_nacional",
    afectaClases: true,
  },
  {
    id: "rec_udp_aniv_1",
    fecha: "2026-10-01",
    descripcion: "Suspensión de clases desde las 14:30 hrs por Aniversario UDP",
    tipo: "receso_udp",
    afectaClases: true,
  },
  {
    id: "rec_udp_aniv_2",
    fecha: "2026-10-02",
    descripcion: "Suspensión de actividades por Aniversario UDP",
    tipo: "receso_udp",
    afectaClases: true,
  },
  {
    id: "fer_5",
    fecha: "2026-10-12",
    descripcion: "Encuentro de Dos Mundos (Feriado Nacional)",
    tipo: "feriado_nacional",
    afectaClases: true,
  },
  {
    id: "fer_6",
    fecha: "2026-10-31",
    descripcion: "Día de las Iglesias Evangélicas y Protestantes",
    tipo: "feriado_nacional",
    afectaClases: true,
  },
  {
    id: "fer_7",
    fecha: "2026-11-01",
    descripcion: "Día de Todos los Santos (Feriado Nacional)",
    tipo: "feriado_nacional",
    afectaClases: true,
  },
  {
    id: "fer_8",
    fecha: "2026-12-08",
    descripcion: "Inmaculada Concepción (Feriado Nacional)",
    tipo: "feriado_nacional",
    afectaClases: true,
  },
];

export function isDateUDPHoliday(dateStr: string, holidays: UDPHoliday[] = INITIAL_UDP_HOLIDAYS): UDPHoliday | undefined {
  return holidays.find((h) => h.fecha === dateStr && h.afectaClases);
}

export const DIA_SEMANA_NOMBRES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

// Coordenadas oficiales de la Facultad de Ingeniería y Ciencias UDP (Av. Ejército Libertador 441, Santiago)
export const UDP_CAMPUS_LOCATION = {
  nombre: "Facultad de Ingeniería y Ciencias UDP",
  direccion: "Av. Ejército Libertador 441, 8370191 Santiago, Región Metropolitana",
  lat: -33.4501,
  lng: -70.6622,
  radioPermitidoMetros: 500, // Cobertura completa cuadrante Metro Toesca - Metro Los Héroes (Facultades UDP)
};

// Fórmula Haversine para calcular distancia en metros
export function calcularDistanciaMetros(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Radio de la Tierra en metros
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}
