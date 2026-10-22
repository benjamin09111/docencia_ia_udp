export type PrimaryRole = "admin" | "docente" | "estudiante";

export type AdminSubRole = "admin_general" | "admin_facultad" | "admin_escuela";
export type DocenteSubRole = "profesor_titular" | "ayudante";
export type EstudianteSubRole = "alumno_regular";

export type UserSubRole = AdminSubRole | DocenteSubRole | EstudianteSubRole;

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  primaryRole: PrimaryRole;
  subRole: UserSubRole;
  institutionId: string;
  facultyId?: string;
  careerId?: string;
  avatarUrl?: string;
}

export interface CourseStaffEnrollment {
  userId: string;
  courseCode: string;
  sectionCode: string;
  courseRole: DocenteSubRole;
  assignedAt: string;
}

export interface RolePermissions {
  canManageAiAgents: boolean;
  canConfigureCoursePerillas: boolean;
  canCreateActivities: boolean;
  canGradeWithAi: boolean;
  canFinalizeOfficialGrades: boolean;
  canManageAttendance: boolean;
}

export function getRolePermissions(primary: PrimaryRole, subRole: UserSubRole): RolePermissions {
  if (primary === "admin") {
    return {
      canManageAiAgents: true,
      canConfigureCoursePerillas: true,
      canCreateActivities: true,
      canGradeWithAi: true,
      canFinalizeOfficialGrades: true,
      canManageAttendance: true,
    };
  }
  if (primary === "docente") {
    const isTitular = subRole === "profesor_titular";
    return {
      canManageAiAgents: false,
      canConfigureCoursePerillas: isTitular,
      canCreateActivities: true,
      canGradeWithAi: true,
      canFinalizeOfficialGrades: isTitular, // El ayudante no puede cerrar actas oficiales
      canManageAttendance: true,
    };
  }
  // Estudiante
  return {
    canManageAiAgents: false,
    canConfigureCoursePerillas: false,
    canCreateActivities: false,
    canGradeWithAi: false,
    canFinalizeOfficialGrades: false,
    canManageAttendance: false,
  };
}
