import { CourseGroup, StudentGroupMember } from "@/types/groups";

const GROUPS_STORAGE_KEY = "udp_course_groups_v2026_8canvas_teams_v3";

const DEFAULT_GROUPS: CourseGroup[] = [
  {
    id: "grp_canvas_118801",
    courseCode: "CIT3203_CA01",
    sectionId: "sec_1",
    name: "4 Fantásticos",
    categoryName: "Equipos 2026 02 (Canvas)",
    color: "#008EE2",
    createdAt: new Date().toISOString(),
    members: [
      { canvas_id: 42009, nombres: "Diego Andrés", apellidos: "Escobar González" },
      { canvas_id: 41401, nombres: "Ignacio Andrés", apellidos: "Gutiérrez Mosqueira" },
      { canvas_id: 42253, nombres: "Bastián Alonso", apellidos: "Lobos Fernández" },
    ],
  },
  {
    id: "grp_canvas_118802",
    courseCode: "CIT3203_CA01",
    sectionId: "sec_1",
    name: "ATK",
    categoryName: "Equipos 2026 02 (Canvas)",
    color: "#2E7D32",
    createdAt: new Date().toISOString(),
    members: [
      { canvas_id: 41864, nombres: "Martín De Jesús", apellidos: "Aliaga Rojas" },
      { canvas_id: 29239, nombres: "Agustín Naim", apellidos: "Pizarro Arias" },
      { canvas_id: 1281, nombres: "Alonso", apellidos: "Vera Larach" },
    ],
  },
  {
    id: "grp_canvas_118796",
    courseCode: "CIT3203_CA01",
    sectionId: "sec_1",
    name: "GPT Bross",
    categoryName: "Equipos 2026 02 (Canvas)",
    color: "#C8102E",
    createdAt: new Date().toISOString(),
    members: [
      { canvas_id: 41882, nombres: "Jairo Bastián", apellidos: "Chacana Toribio" },
      { canvas_id: 41860, nombres: "Donovan Andrés", apellidos: "Iturra Valdivia" },
      { canvas_id: 29266, nombres: "Bastián Ignacio", apellidos: "Ortiz De Zárate Vergara" },
      { canvas_id: 3151, nombres: "Diego Andres", apellidos: "Peña y Lillo Ruiz" },
    ],
  },
  {
    id: "grp_canvas_118800",
    courseCode: "CIT3203_CA01",
    sectionId: "sec_1",
    name: "Inteligencia Artesanal",
    categoryName: "Equipos 2026 02 (Canvas)",
    color: "#7B1FA2",
    createdAt: new Date().toISOString(),
    members: [
      { canvas_id: 29309, nombres: "Diego Ignacio", apellidos: "Banda Gálvez" },
      { canvas_id: 29380, nombres: "Ignacio Alejandro", apellidos: "Orellana Arrué" },
      { canvas_id: 3188, nombres: "Diego Nicolás", apellidos: "Salazar Díaz" },
    ],
  },
  {
    id: "grp_canvas_118795",
    courseCode: "CIT3203_CA01",
    sectionId: "sec_1",
    name: "Los Jaivas",
    categoryName: "Equipos 2026 02 (Canvas)",
    color: "#D97706",
    createdAt: new Date().toISOString(),
    members: [
      { canvas_id: 42225, nombres: "Sebastián Ignacio", apellidos: "Alonzo Oyarzún" },
      { canvas_id: 10206, nombres: "Benjamín Andrés", apellidos: "Argüelles Martín" },
      { canvas_id: 41370, nombres: "Joaquín Ignacio", apellidos: "Silva Sánchez" },
    ],
  },
  {
    id: "grp_canvas_118798",
    courseCode: "CIT3203_CA01",
    sectionId: "sec_1",
    name: "Los mosqueteros",
    categoryName: "Equipos 2026 02 (Canvas)",
    color: "#0D9488",
    createdAt: new Date().toISOString(),
    members: [
      { canvas_id: 29290, nombres: "Eduardo Ariel", apellidos: "Escalona Lamig" },
      { canvas_id: 41991, nombres: "Álvaro Sebastián", apellidos: "Guerrero Hormazábal" },
      { canvas_id: 41992, nombres: "Alejandro Javier", apellidos: "Saldías Cisternas" },
      { canvas_id: 41993, nombres: "Matías Ignacio", apellidos: "Vásquez Poblete" },
    ],
  },
  {
    id: "grp_canvas_118797",
    courseCode: "CIT3203_CA01",
    sectionId: "sec_1",
    name: "Los Peluca",
    categoryName: "Equipos 2026 02 (Canvas)",
    color: "#EA580C",
    createdAt: new Date().toISOString(),
    members: [
      { canvas_id: 41994, nombres: "Vicente José", apellidos: "Castro De La Prida" },
      { canvas_id: 41995, nombres: "Sebastian", apellidos: "Gulfo Serna" },
      { canvas_id: 41996, nombres: "Ignacio Enrique", apellidos: "Martínez Vergara" },
      { canvas_id: 41997, nombres: "Matías Ignacio", apellidos: "Rivera Sáez" },
    ],
  },
  {
    id: "grp_canvas_118799",
    courseCode: "CIT3203_CA01",
    sectionId: "sec_1",
    name: "Zintra",
    categoryName: "Equipos 2026 02 (Canvas)",
    color: "#4338CA",
    createdAt: new Date().toISOString(),
    members: [
      { canvas_id: 41998, nombres: "Alex Ignacio", apellidos: "Marambio Leyton" },
      { canvas_id: 41999, nombres: "Diego Paulo", apellidos: "Pérez Carrasco" },
      { canvas_id: 42000, nombres: "Aaron Samuel", apellidos: "Pozas Oyarce" },
      { canvas_id: 42001, nombres: "Martín Gabriel", apellidos: "Ramos Molina" },
    ],
  },
  // Grupos Mock para Programación (CIT1010_CA01)
  {
    id: "grp_prog_101",
    courseCode: "CIT1010_CA01",
    sectionId: "sec_prog_1",
    name: "Grupo 1 - Algoritmos (Mock)",
    categoryName: "Equipos Programación 2026",
    color: "#008EE2",
    createdAt: new Date().toISOString(),
    members: [
      { canvas_id: 50001, nombres: "Mateo Ignacio", apellidos: "Silva Araya" },
      { canvas_id: 50002, nombres: "Valentina Paz", apellidos: "Vera Morales" },
    ],
  },
  {
    id: "grp_prog_102",
    courseCode: "CIT1010_CA01",
    sectionId: "sec_prog_1",
    name: "Grupo 2 - Estructuras de Datos (Mock)",
    categoryName: "Equipos Programación 2026",
    color: "#C8102E",
    createdAt: new Date().toISOString(),
    members: [
      { canvas_id: 50003, nombres: "Tomás Andrés", apellidos: "Araya Castro" },
      { canvas_id: 50004, nombres: "Sofía Isabel", apellidos: "Castro Paredes" },
      { canvas_id: 50005, nombres: "Lucas Benjamín", apellidos: "Morales Rojas" },
    ],
  },
];

export function getSavedGroups(courseCode?: string, sectionId?: string): CourseGroup[] {
  if (typeof window === "undefined") return DEFAULT_GROUPS;
  try {
    const raw = localStorage.getItem(GROUPS_STORAGE_KEY);
    const list: CourseGroup[] = raw ? JSON.parse(raw) : DEFAULT_GROUPS;
    if (!courseCode) return list;
    return list.filter((g) => {
      const matchCourse = g.courseCode === courseCode || courseCode.includes(g.courseCode) || g.courseCode.includes(courseCode);
      if (!sectionId || sectionId === "all") return matchCourse;
      return matchCourse && (!g.sectionId || g.sectionId === sectionId || g.sectionId === "all");
    });
  } catch {
    return DEFAULT_GROUPS;
  }
}

export function saveGroups(groups: CourseGroup[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));
    window.dispatchEvent(new CustomEvent("udp_groups_updated", { detail: groups }));
    if ("BroadcastChannel" in window) {
      try {
        const ch = new BroadcastChannel("udp_groups_channel");
        ch.postMessage({ type: "GROUPS_SYNC", timestamp: Date.now() });
        ch.close();
      } catch {}
    }
  } catch (e) {
    console.error("Error saving groups to localStorage:", e);
  }
}

export function syncCourseGroups(courseCode: string, sectionId: string, newGroups: CourseGroup[]): void {
  const current = getSavedGroups(); // gets all groups from storage
  // Keep groups from other courses or sections
  const otherGroups = current.filter(
    (g) => !(g.courseCode === courseCode && (g.sectionId === sectionId || sectionId === "all"))
  );
  const updated = [...otherGroups, ...newGroups];
  saveGroups(updated);
}

export function createGroup(
  courseCode: string,
  data: { name: string; sectionId?: string; categoryName?: string; members?: StudentGroupMember[]; color?: string }
): CourseGroup {
  const current = getSavedGroups();
  const newGroup: CourseGroup = {
    id: `grp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    courseCode,
    sectionId: data.sectionId || "sec_1",
    name: data.name.trim(),
    categoryName: data.categoryName?.trim() || "General",
    color: data.color || "#008EE2",
    members: data.members || [],
    createdAt: new Date().toISOString(),
  };

  const updated = [newGroup, ...current];
  saveGroups(updated);
  return newGroup;
}

export function updateGroup(groupId: string, data: Partial<CourseGroup>): CourseGroup | null {
  const current = getSavedGroups();
  let found: CourseGroup | null = null;
  const updated = current.map((g) => {
    if (g.id === groupId) {
      found = { ...g, ...data, updatedAt: new Date().toISOString() };
      return found;
    }
    return g;
  });
  if (found) saveGroups(updated);
  return found;
}

export function deleteGroup(groupId: string): boolean {
  const current = getSavedGroups();
  const filtered = current.filter((g) => g.id !== groupId);
  if (filtered.length !== current.length) {
    saveGroups(filtered);
    return true;
  }
  return false;
}

export function addMemberToGroup(groupId: string, member: StudentGroupMember): boolean {
  const current = getSavedGroups();
  let modified = false;
  const updated = current.map((g) => {
    if (g.id === groupId) {
      const exists = g.members.some((m) => m.canvas_id === member.canvas_id);
      if (!exists) {
        modified = true;
        return { ...g, members: [...g.members, member], updatedAt: new Date().toISOString() };
      }
    }
    return g;
  });
  if (modified) saveGroups(updated);
  return modified;
}

export function removeMemberFromGroup(groupId: string, canvasId: number): boolean {
  const current = getSavedGroups();
  let modified = false;
  const updated = current.map((g) => {
    if (g.id === groupId) {
      const filteredMembers = g.members.filter((m) => m.canvas_id !== canvasId);
      if (filteredMembers.length !== g.members.length) {
        modified = true;
        return { ...g, members: filteredMembers, updatedAt: new Date().toISOString() };
      }
    }
    return g;
  });
  if (modified) saveGroups(updated);
  return modified;
}
