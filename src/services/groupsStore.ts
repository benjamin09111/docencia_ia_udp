import { CourseGroup, StudentGroupMember } from "@/types/groups";

const GROUPS_STORAGE_KEY = "udp_course_groups_v1";

const DEFAULT_GROUPS: CourseGroup[] = [
  {
    id: "grp_cit3203_1",
    courseCode: "CIT3203_CA01",
    sectionId: "sec_1",
    name: "Grupo 1 — Smart Monitoring",
    categoryName: "Proyecto Semestral",
    color: "#008EE2",
    createdAt: new Date().toISOString(),
    members: [
      { canvas_id: 101, nombres: "Sebastian", apellidos: "Alonzo" },
      { canvas_id: 102, nombres: "Benjamin", apellidos: "Argüelles" },
      { canvas_id: 103, nombres: "Diego", apellidos: "Banda" },
      { canvas_id: 104, nombres: "Vicente", apellidos: "Castro" },
    ],
  },
  {
    id: "grp_cit3203_2",
    courseCode: "CIT3203_CA01",
    sectionId: "sec_1",
    name: "Grupo 2 — EcoTrack UDP",
    categoryName: "Proyecto Semestral",
    color: "#2E7D32",
    createdAt: new Date().toISOString(),
    members: [
      { canvas_id: 105, nombres: "Jairo", apellidos: "Chacana" },
      { canvas_id: 106, nombres: "Diego", apellidos: "Escobar" },
      { canvas_id: 107, nombres: "Ignacio", apellidos: "Gutierrez" },
      { canvas_id: 108, nombres: "Donovan", apellidos: "Iturra" },
    ],
  },
  {
    id: "grp_cit3203_3",
    courseCode: "CIT3203_CA01",
    sectionId: "sec_1",
    name: "Grupo 3 — AI Attendance",
    categoryName: "Proyecto Semestral",
    color: "#C8102E",
    createdAt: new Date().toISOString(),
    members: [
      { canvas_id: 109, nombres: "Alex", apellidos: "Marambio" },
      { canvas_id: 110, nombres: "Ignacio", apellidos: "Orellana" },
      { canvas_id: 111, nombres: "Martín", apellidos: "Ramos" },
      { canvas_id: 112, nombres: "Matias", apellidos: "Rivera" },
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
      const matchCourse = g.courseCode === courseCode || courseCode.includes(g.courseCode);
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
