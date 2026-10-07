import { GradeScaleConfig, DEFAULT_GRADE_SCALE_CONFIG } from "@/utils/gradeScaleCalculator";

const GRADE_SCALE_STORAGE_KEY = "udp_grade_scale_config_v1";

export function getGradeScaleConfig(): GradeScaleConfig {
  if (typeof window === "undefined") return DEFAULT_GRADE_SCALE_CONFIG;
  try {
    const raw = localStorage.getItem(GRADE_SCALE_STORAGE_KEY);
    return raw ? { ...DEFAULT_GRADE_SCALE_CONFIG, ...JSON.parse(raw) } : DEFAULT_GRADE_SCALE_CONFIG;
  } catch {
    return DEFAULT_GRADE_SCALE_CONFIG;
  }
}

export function saveGradeScaleConfig(config: Partial<GradeScaleConfig>): GradeScaleConfig {
  if (typeof window === "undefined") return DEFAULT_GRADE_SCALE_CONFIG;
  try {
    const current = getGradeScaleConfig();
    const updated: GradeScaleConfig = { ...current, ...config };
    localStorage.setItem(GRADE_SCALE_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("udp_grade_scale_updated", { detail: updated }));
    return updated;
  } catch {
    return DEFAULT_GRADE_SCALE_CONFIG;
  }
}
