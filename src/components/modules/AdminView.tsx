"use client";

import React, { useState } from "react";
import { InstitutionalFaculty, InstitutionalCareer } from "@/constants/institutionalHierarchy";
import { AdminFacultySelector } from "@/components/modules/admin/hierarchy/AdminFacultySelector";
import { AdminCareerSelector } from "@/components/modules/admin/hierarchy/AdminCareerSelector";
import { AdminWorkspaceView } from "@/components/modules/admin/AdminWorkspaceView";

export const AdminView: React.FC = () => {
  // Estado de navegación jerárquica: Paso 1 (Facultad) -> Paso 2 (Carrera) -> Paso 3 (Espacio de Cursos y Agentes)
  const [selectedFaculty, setSelectedFaculty] = useState<InstitutionalFaculty | null>(null);
  const [selectedCareer, setSelectedCareer] = useState<InstitutionalCareer | null>(null);

  // Paso 1: Selección de Facultad
  if (!selectedFaculty) {
    return (
      <AdminFacultySelector
        onSelectFaculty={(fac) => {
          setSelectedFaculty(fac);
          setSelectedCareer(null);
        }}
        onQuickSelect={(faculty, career) => {
          setSelectedFaculty(faculty);
          setSelectedCareer(career);
        }}
      />
    );
  }

  // Paso 2: Selección de Carrera
  if (!selectedCareer) {
    return (
      <AdminCareerSelector
        faculty={selectedFaculty}
        onSelectCareer={(car) => setSelectedCareer(car)}
        onBack={() => setSelectedFaculty(null)}
      />
    );
  }

  // Paso 3: Espacio de Trabajo de Cursos, Secciones y Agentes
  return (
    <AdminWorkspaceView
      faculty={selectedFaculty}
      career={selectedCareer}
      onBackToCareers={() => setSelectedCareer(null)}
      onBackToFaculties={() => {
        setSelectedCareer(null);
        setSelectedFaculty(null);
      }}
    />
  );
};
