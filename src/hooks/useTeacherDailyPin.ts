import { useEffect, useState } from "react";

/** PIN del día para el docente: se pide a una ruta protegida (el secreto vive solo en el servidor). */
export function useTeacherDailyPin(sectionCode?: string, dateStr?: string): string | null {
  const [pin, setPin] = useState<string | null>(null);

  useEffect(() => {
    if (!sectionCode || !dateStr) return;
    let alive = true;
    setPin(null);
    fetch(`/api/teacher/pin?section=${encodeURIComponent(sectionCode)}&date=${encodeURIComponent(dateStr)}`, {
      cache: "no-store",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (alive) setPin(typeof data?.pin === "string" ? data.pin : null);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [sectionCode, dateStr]);

  return pin;
}
