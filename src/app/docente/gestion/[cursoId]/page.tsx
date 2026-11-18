"use client";

import { use } from "react";
import { GestionCursoWorkspace } from "@/components/modules/teacher/gestion/GestionCursoWorkspace";

interface Props {
  params: Promise<{ cursoId: string }>;
}

export default function CursoGestionPage({ params }: Props) {
  const { cursoId } = use(params);
  return <GestionCursoWorkspace key={cursoId} cursoId={decodeURIComponent(cursoId)} />;
}
