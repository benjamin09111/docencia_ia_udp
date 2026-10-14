import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ActividadFormativa } from "@/types/actividadesFormativas";
import { ACTIVIDADES_FORMATIVAS } from "@/constants/actividadesFormativasCatalog";
import { PedagogicalDeckCard } from "./PedagogicalDeckCard";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface PedagogicalCardDeckViewProps {
  initialActivityId?: string;
  onSelectActividad: (actividad: ActividadFormativa) => void;
}

const CATEGORIAS_FILTRO = [
  { id: "todas", label: "Todas (21)" },
  { id: "Inicio de clase", label: "Inicio (6)" },
  { id: "Desarrollo / Durante la clase", label: "Desarrollo (10)" },
  { id: "Cierre de clase", label: "Cierre (5)" },
];

export const PedagogicalCardDeckView: React.FC<PedagogicalCardDeckViewProps> = ({
  initialActivityId,
  onSelectActividad,
}) => {
  const [activeFiltro, setActiveFiltro] = useState("todas");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animatingDir, setAnimatingDir] = useState<"next" | "prev" | null>(null);

  const filteredActivities = useMemo(() => {
    if (activeFiltro === "todas") return ACTIVIDADES_FORMATIVAS;
    return ACTIVIDADES_FORMATIVAS.filter((a) => a.faseClase === activeFiltro);
  }, [activeFiltro]);

  useEffect(() => {
    if (initialActivityId) {
      const idx = filteredActivities.findIndex((a) => a.id === initialActivityId);
      if (idx !== -1) setCurrentIndex(idx);
    }
  }, [initialActivityId, filteredActivities]);

  const handleNext = useCallback(() => {
    if (animatingDir) return;
    setAnimatingDir("next");
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredActivities.length);
      setAnimatingDir(null);
    }, 300);
  }, [animatingDir, filteredActivities.length]);

  const handlePrev = useCallback(() => {
    if (animatingDir) return;
    setAnimatingDir("prev");
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + filteredActivities.length) % filteredActivities.length);
      setAnimatingDir(null);
    }, 300);
  }, [animatingDir, filteredActivities.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  const total = filteredActivities.length;
  const currentAct = filteredActivities[currentIndex] || filteredActivities[0];
  const nextAct1 = filteredActivities[(currentIndex + 1) % total];
  const nextAct2 = filteredActivities[(currentIndex + 2) % total];

  return (
    <div className="w-full h-full min-h-[520px] max-h-[620px] bg-[#EAECEF] rounded-2xl p-3 sm:p-4 flex flex-col justify-between items-center relative overflow-hidden select-none border border-[#C7CDD1] shadow-sm">
      {/* Barra Superior: Filtros y Contador X/Y */}
      <div className="relative z-20 flex items-center justify-between w-full max-w-[500px] mb-2 px-1 shrink-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          {CATEGORIAS_FILTRO.map((filtro) => (
            <button
              key={filtro.id}
              type="button"
              onClick={() => {
                setActiveFiltro(filtro.id);
                setCurrentIndex(0);
              }}
              className={`text-xs px-2.5 py-1 rounded-full transition-all cursor-pointer font-medium ${
                activeFiltro === filtro.id
                  ? "bg-[#B71C1C] text-white shadow-sm font-bold border border-[#B71C1C]"
                  : "bg-white text-[#2D3B45] hover:bg-gray-100 border border-[#C7CDD1] shadow-2xs"
              }`}
            >
              {filtro.label}
            </button>
          ))}
        </div>

        {/* Contador X/Y en el encabezado */}
        <span className="font-mono font-bold text-xs text-[#2D3B45] bg-white px-2.5 py-1 rounded-full border border-[#C7CDD1] shadow-2xs shrink-0">
          {currentIndex + 1}/{total}
        </span>
      </div>

      {/* Escenario 3D Central */}
      <div
        className="relative w-full max-w-[460px] flex-1 min-h-[480px] max-h-[510px] flex items-center justify-center my-1"
        style={{ perspective: "1400px" }}
      >
        {/* Carta 3 (Fondo Z = -90px) */}
        {total > 2 && nextAct2 && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              transform: "translate3d(36px, -24px, -90px) scale(0.90) rotate(5deg)",
              opacity: 0.75,
              filter: "brightness(0.94)",
              zIndex: 10,
            }}
          >
            <PedagogicalDeckCard actividad={nextAct2} index={(currentIndex + 2) % total} total={total} isFrontCard={false} onSelect={() => {}} />
          </div>
        )}

        {/* Carta 2 (Fondo Z = -45px) */}
        {total > 1 && nextAct1 && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              transform: "translate3d(18px, -12px, -45px) scale(0.95) rotate(2.5deg)",
              opacity: 0.90,
              filter: "brightness(0.97)",
              zIndex: 20,
            }}
          >
            <PedagogicalDeckCard actividad={nextAct1} index={(currentIndex + 1) % total} total={total} isFrontCard={false} onSelect={() => {}} />
          </div>
        )}

        {/* Carta 1 Activa */}
        {currentAct && (
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
              animatingDir === "next"
                ? "-translate-x-full rotate-[-18deg] opacity-0 scale-95"
                : animatingDir === "prev"
                ? "translate-x-full rotate-[18deg] opacity-0 scale-95"
                : "translate-x-0 rotate-0 opacity-100 scale-100"
            }`}
            style={{ zIndex: 30 }}
          >
            <PedagogicalDeckCard
              actividad={currentAct}
              index={currentIndex}
              total={total}
              isFrontCard={true}
              onSelect={() => onSelectActividad(currentAct)}
            />
          </div>
        )}

        {/* Flechas Flotantes en Blanco Canvas */}
        <button
          type="button"
          onClick={handlePrev}
          title="Carta anterior"
          className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-white hover:bg-[#F5F6F8] text-[#2D3B45] hover:text-[#B71C1C] border border-[#C7CDD1] shadow-md flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          type="button"
          onClick={handleNext}
          title="Siguiente carta"
          className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-white hover:bg-[#F5F6F8] text-[#2D3B45] hover:text-[#B71C1C] border border-[#C7CDD1] shadow-md flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Barra Inferior con Contador X/Y destacado */}
      <div className="relative z-20 flex items-center justify-between w-full max-w-[480px] pt-3 text-xs text-[#6B7780]">
        <span className="flex items-center gap-1.5 text-[11px] font-medium">
          <Sparkles size={13} className="text-[#B71C1C]" />
          Usa las flechas ◀ ▶ para explorar la baraja
        </span>
        <span className="font-mono font-bold text-sm text-[#2D3B45] bg-white px-3 py-1 rounded-full border border-[#C7CDD1] shadow-2xs">
          {currentIndex + 1}/{total}
        </span>
      </div>
    </div>
  );
};
