import React, { useState } from "react";
import { ActividadFormativa } from "@/types/actividadesFormativas";
import { PedagogicalDeckCardFront } from "./PedagogicalDeckCardFront";
import { PedagogicalDeckCardBack } from "./PedagogicalDeckCardBack";

interface PedagogicalDeckCardProps {
  actividad: ActividadFormativa;
  index: number;
  total: number;
  isFrontCard: boolean;
  onSelect: () => void;
}

export const PedagogicalDeckCard: React.FC<PedagogicalDeckCardProps> = ({
  actividad,
  index,
  total,
  onSelect,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="w-full max-w-[440px] h-[480px] sm:h-[500px] relative"
      style={{
        perspective: "1200px",
      }}
    >
      {/* Contenedor 3D con preserve-3d sin movimiento al mover el mouse */}
      <div
        className="w-full h-full relative transition-transform duration-500 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* CARA FRONTAL (0deg) */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <PedagogicalDeckCardFront
            actividad={actividad}
            index={index}
            total={total}
            onFlip={() => setIsFlipped(true)}
            onSelect={onSelect}
          />
        </div>

        {/* CARA TRASERA / REVERSO (180deg) */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <PedagogicalDeckCardBack
            actividad={actividad}
            index={index}
            total={total}
            onFlip={() => setIsFlipped(false)}
            onSelect={onSelect}
          />
        </div>
      </div>
    </div>
  );
};
