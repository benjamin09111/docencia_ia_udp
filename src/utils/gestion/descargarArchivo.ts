/** Descarga un archivo generado en el navegador (plantilla o acta Excel). */

export const MIME_XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export function descargarArchivo(contenido: ArrayBuffer | Blob, nombre: string, tipo = MIME_XLSX): void {
  const blob = contenido instanceof Blob ? contenido : new Blob([contenido], { type: tipo });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombre;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  // Dar tiempo al navegador para iniciar la descarga antes de liberar el objeto.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Nombre de archivo seguro: sin tildes, espacios ni caracteres especiales. */
export function nombreArchivoSeguro(...partes: Array<string | null | undefined>): string {
  return partes
    .filter((p): p is string => Boolean(p && p.trim()))
    .map((p) => p.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9-]+/g, "_").replace(/^_+|_+$/g, ""))
    .join("_");
}
