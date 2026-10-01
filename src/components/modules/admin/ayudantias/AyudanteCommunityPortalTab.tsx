"use client";

import React, { useState } from "react";
import { CanvasButton } from "@/components/canvas/CanvasButton";
import { CanvasBadge } from "@/components/canvas/CanvasBadge";
import {
  Network,
  Users,
  MessageSquare,
  Calendar,
  Sparkles,
  Plus,
  Clock,
  MapPin,
  Send,
  Heart,
  HelpCircle,
  ThumbsUp,
  Share2,
} from "lucide-react";

interface StudyGroup {
  id: string;
  titulo: string;
  curso: string;
  creador: string;
  rolCreador: "Ayudante" | "Estudiante" | "Docente";
  horario: string;
  modalidad: "Presencial" | "Virtual (Teams)";
  lugar: string;
  participantesActuales: number;
  cupoMaximo: number;
}

const MOCK_GROUPS: StudyGroup[] = [
  {
    id: "g1",
    titulo: "Taller Práctico de Story Points y WBS pre-Solemne 1",
    curso: "CIT3203 - Proy. Innovación",
    creador: "Matías Rojas (Ayudante)",
    rolCreador: "Ayudante",
    horario: "Jueves 16:30 - 18:00",
    modalidad: "Presencial",
    lugar: "Sala B-204 (Facultad de Ingeniería)",
    participantesActuales: 9,
    cupoMaximo: 15,
  },
  {
    id: "g2",
    titulo: "Resolución de dudas de Python y Estructuras de Datos",
    curso: "CIT1010 - Programación I",
    creador: "Lucas Navarrete (Ayudante)",
    rolCreador: "Ayudante",
    horario: "Viernes 17:00 - 18:30",
    modalidad: "Virtual (Teams)",
    lugar: "Canal de Ayudantías Teams UDP",
    participantesActuales: 14,
    cupoMaximo: 25,
  },
  {
    id: "g3",
    titulo: "Grupo de Estudio Autónomo: Microservicios en AWS",
    curso: "CIT3100 - Redes y Cloud",
    creador: "Camila Vega (Estudiante 4° Año)",
    rolCreador: "Estudiante",
    horario: "Sábado 10:30 - 12:00",
    modalidad: "Virtual (Teams)",
    lugar: "Discord Estudiantes UDP",
    participantesActuales: 6,
    cupoMaximo: 10,
  },
];

interface CommunityPost {
  id: string;
  autor: string;
  rol: "Docente" | "Ayudante" | "Estudiante";
  tiempo: string;
  curso: string;
  texto: string;
  likes: number;
  respuestas: number;
}

const MOCK_POSTS: CommunityPost[] = [
  {
    id: "post1",
    autor: "Jorge Esteban Cruz León",
    rol: "Docente",
    tiempo: "Hace 2 horas",
    curso: "CIT3203",
    texto: "Estimados/as: Ya coordinamos con los ayudantes Matías y Valentina una sesión especial de reforzamiento para el Avance 1. Los invitamos a sumarse a los grupos de estudio creados abajo para resolver dudas antes del hito.",
    likes: 12,
    respuestas: 4,
  },
  {
    id: "post2",
    autor: "Valentina Silva",
    rol: "Ayudante",
    tiempo: "Hace 4 horas",
    curso: "CIT3203",
    texto: "Subimos al portal un repositorio con ejemplos resueltos de matrices de riesgo para que puedan guiarse. Si alguien quiere juntarse en biblioteca mañana estaré disponible desde las 15:00 hrs.",
    likes: 8,
    respuestas: 3,
  },
];

export const AyudanteCommunityPortalTab: React.FC = () => {
  const [activeSection, setActiveSection] = useState<"grupos" | "comunidad">("grupos");
  const [newPostText, setNewPostText] = useState("");
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_POSTS);

  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    const newP: CommunityPost = {
      id: `p-${Date.now()}`,
      autor: "Administración Docente UDP",
      rol: "Docente",
      tiempo: "Recién",
      curso: "General Escuela",
      texto: newPostText,
      likes: 0,
      respuestas: 0,
    };
    setPosts([newP, ...posts]);
    setNewPostText("");
  };

  return (
    <div className="space-y-4">
      {/* Banner de Plataforma Bidireccional */}
      <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-[4px] text-xs text-emerald-900 space-y-1">
        <div className="flex items-center gap-2 font-bold text-emerald-950">
          <Network size={16} className="text-emerald-700" />
          <span>Plataforma Bidireccional: Red de Comunidad UDP</span>
        </div>
        <p className="text-[11px] leading-relaxed text-emerald-900">
          Espacio horizontal y seguro para conectar a <strong>docentes, ayudantes y estudiantes</strong>. Facilita la creación de grupos autónomos de estudio ("Juntarse a estudiar"), consultas entre pares, coordinación de ayudantías y levantamiento de opiniones y feedback en tiempo real.
        </p>
      </div>

      {/* Selector de Subsección */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveSection("grupos")}
            className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold transition-all ${
              activeSection === "grupos"
                ? "bg-[#2D3B45] text-white shadow-xs"
                : "bg-white text-[#2D3B45] border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Juntarse a Estudiar ({MOCK_GROUPS.length} Salas Activas)
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("comunidad")}
            className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold transition-all ${
              activeSection === "comunidad"
                ? "bg-[#2D3B45] text-white shadow-xs"
                : "bg-white text-[#2D3B45] border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Muro de Coordinación y Opinión
          </button>
        </div>

        <CanvasButton
          variant="outline"
          size="sm"
          icon={<Plus size={14} />}
          onClick={() => alert("Función para crear nueva sala de estudio o sesión de mentoría")}
        >
          Crear grupo de estudio
        </CanvasButton>
      </div>

      {/* SECCIÓN 1: Grupos de Estudio ("Juntarse a Estudiar") */}
      {activeSection === "grupos" && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {MOCK_GROUPS.map((grupo) => (
              <div
                key={grupo.id}
                className="bg-white border border-gray-200 rounded-[4px] p-4 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start gap-1">
                    <span className="text-[10px] font-mono text-gray-500 font-bold">
                      {grupo.curso}
                    </span>
                    <CanvasBadge variant={grupo.modalidad === "Presencial" ? "info" : "success"}>
                      {grupo.modalidad}
                    </CanvasBadge>
                  </div>
                  <h4 className="text-xs font-bold text-[#2D3B45] leading-snug">
                    {grupo.titulo}
                  </h4>
                  <div className="text-[11px] text-gray-500 flex items-center gap-1">
                    <Users size={12} className="text-gray-400" />
                    <span>Iniciativa de: <strong>{grupo.creador}</strong></span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100 text-[11px] text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-gray-400" />
                    <span>{grupo.horario}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} className="text-gray-400" />
                    <span className="truncate">{grupo.lugar}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[10px] text-gray-500">
                      {grupo.participantesActuales} de {grupo.cupoMaximo} cupos tomados
                    </span>
                    <button
                      type="button"
                      className="px-2.5 py-1 text-[11px] font-bold bg-[#008EE2] text-white rounded hover:bg-[#0077BE]"
                      onClick={() => alert(`Te has unido a: ${grupo.titulo}`)}
                    >
                      Sumarme
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECCIÓN 2: Muro de Coordinación y Opinión */}
      {activeSection === "comunidad" && (
        <div className="space-y-3">
          {/* Publicador de Mensajes */}
          <form onSubmit={handlePublishPost} className="p-3 bg-white border border-gray-200 rounded-[4px] shadow-xs space-y-2">
            <textarea
              rows={2}
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="Escribe una opinión, consulta a ayudantes o invitación a la comunidad docente..."
              className="w-full p-2 border border-gray-200 rounded text-xs focus:ring-1 focus:ring-[#008EE2] focus:outline-none"
            />
            <div className="flex justify-between items-center pt-1">
              <span className="text-[10px] text-gray-400">
                Publicación visible para toda la comunidad del curso
              </span>
              <CanvasButton variant="primary-canvas" size="sm" icon={<Send size={12} />}>
                Publicar en la Red
              </CanvasButton>
            </div>
          </form>

          {/* Posts */}
          <div className="space-y-2.5">
            {posts.map((post) => (
              <div key={post.id} className="p-3.5 bg-white border border-gray-200 rounded-[4px] shadow-xs space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-700 text-xs">
                      {post.autor.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#2D3B45]">{post.autor}</span>
                        <CanvasBadge variant={post.rol === "Docente" ? "danger" : post.rol === "Ayudante" ? "info" : "default"}>
                          {post.rol}
                        </CanvasBadge>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">{post.curso} • {post.tiempo}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 leading-normal pl-9">
                  {post.texto}
                </p>

                <div className="flex items-center gap-4 pl-9 text-[11px] text-gray-500 pt-1">
                  <button type="button" className="flex items-center gap-1 hover:text-[#008EE2]">
                    <ThumbsUp size={12} />
                    <span>{post.likes} Me sirve</span>
                  </button>
                  <button type="button" className="flex items-center gap-1 hover:text-[#008EE2]">
                    <MessageSquare size={12} />
                    <span>{post.respuestas} Respuestas</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
