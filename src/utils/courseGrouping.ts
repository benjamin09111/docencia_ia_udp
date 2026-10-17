import { CanvasCourse } from "@/types";
import { CourseSection } from "@/types/attendance";
import { formatSectionSchedule, getCourseNameByCode, getSectionByCourseCode } from "@/services/attendanceStore";

export interface EnrichedCourseSection extends CanvasCourse {
  baseCode: string;
  sectionCode: string;
  sectionName: string;
  sectionDetails?: CourseSection;
  ayudantiaFormatted: string;
  catedraFormatted: string;
  salaFormatted: string;
  profesor: string;
  ayudante: string;
  agentName: string;
  isAutomated: boolean;
}

export interface SubjectCourseGroup {
  subjectCode: string;
  subjectName: string;
  agentName: string;
  totalStudents: number;
  sectionsCount: number;
  sections: EnrichedCourseSection[];
}

export function enrichCourseList(courses: CanvasCourse[], sections: CourseSection[]): EnrichedCourseSection[] {
  return courses.map((course) => {
    const sec = getSectionByCourseCode(course.code, sections);
    const sched = formatSectionSchedule(sec);

    const baseCode = course.code.includes("_") ? course.code.split("_")[0] : course.code;
    const rawSectionCode = course.code.includes("_") ? course.code.split("_")[1] : "CA01";

    let sectionName = sec?.nombre;
    if (!sectionName) {
      if (rawSectionCode.toUpperCase().startsWith("CA")) {
        const num = parseInt(rawSectionCode.replace(/\D/g, ""), 10);
        sectionName = `Sección ${isNaN(num) ? 1 : num}`;
      } else {
        sectionName = rawSectionCode;
      }
    }

    const agentName = course.code.includes("CIT3203")
      ? "Agente PMBOK + Ágil (CIT3203)"
      : course.code.includes("CIT3100")
      ? "Agente Arq Cloud (CIT3100)"
      : course.code.includes("CIT2206")
      ? "Agente Teoría Org (CIT2206)"
      : "Agente EIT Oficial";

    return {
      ...course,
      baseCode,
      sectionCode: rawSectionCode,
      sectionName,
      sectionDetails: sec,
      ayudantiaFormatted: sched.ayudantia,
      catedraFormatted: sched.catedra,
      salaFormatted: sched.ayudantiaSala || sched.catedraSala || "SALA X",
      profesor: sec?.profesor || "Profesor Titular",
      ayudante: sec?.ayudante || "Benjamín Morales Pizarro",
      agentName,
      isAutomated: course.is_automated !== false,
    };
  });
}

export function groupCoursesBySubject(enriched: EnrichedCourseSection[]): SubjectCourseGroup[] {
  const map = new Map<string, EnrichedCourseSection[]>();

  enriched.forEach((c) => {
    const group = map.get(c.baseCode) || [];
    group.push(c);
    map.set(c.baseCode, group);
  });

  const result: SubjectCourseGroup[] = [];

  map.forEach((sections, baseCode) => {
    // Sort sections by sectionCode
    sections.sort((a, b) => a.sectionCode.localeCompare(b.sectionCode));

    const totalStudents = sections.reduce((acc, curr) => acc + (curr.students_count || 0), 0);
    const first = sections[0];
    const cleanName = getCourseNameByCode(baseCode);

    result.push({
      subjectCode: baseCode,
      subjectName: cleanName || first.name.replace(/^\d{4,6}\s*[-–]\s*/i, "").trim(),
      agentName: first.agentName,
      totalStudents,
      sectionsCount: sections.length,
      sections,
    });
  });

  // Sort groups by subject code
  result.sort((a, b) => a.subjectCode.localeCompare(b.subjectCode));
  return result;
}
