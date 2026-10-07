export interface StudentGroupMember {
  canvas_id: number;
  nombres: string;
  apellidos: string;
  rut?: string;
  email?: string;
}

export interface CourseGroup {
  id: string;
  courseCode: string;
  sectionId?: string;
  name: string; // ej. "Grupo 1 - Smart Cities"
  categoryName?: string; // ej. "Proyecto Semestral"
  canvasGroupId?: number;
  members: StudentGroupMember[];
  color?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CanvasGroupDTO {
  id: number;
  name: string;
  description?: string;
  members_count?: number;
  group_category_id?: number;
}
