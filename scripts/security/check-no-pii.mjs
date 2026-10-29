import { execFileSync } from "node:child_process";

const args = process.argv.slice(2);
const baseIndex = args.indexOf("--base");
const range = baseIndex >= 0 && args[baseIndex + 1] ? `${args[baseIndex + 1]}...HEAD` : "--cached";

const rules = [
  { label: "RUT", pattern: /\b\d{1,2}(?:\.\d{3}){2}-?[\dKk]\b|\b\d{7,8}-?[\dKk]\b/ },
  { label: "correo institucional", pattern: /\b[A-Z0-9._%+-]+@(?:mail\.)?udp\.cl\b/i },
  { label: "clave privada", pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { label: "token de proveedor IA", pattern: /\b(?:sk-[A-Za-z0-9_-]{16,}|AIza[A-Za-z0-9_-]{20,})\b/ },
  { label: "token de Supabase", pattern: /\bsb_(?:secret|publishable)_[A-Za-z0-9_-]{16,}\b/ },
  { label: "token de GitHub", pattern: /\bgh[ps]_[A-Za-z0-9_]{20,}\b/ },
  { label: "contraseña embebida", pattern: /\b(?:rawPass|demoPass)\s*[:=]\s*["'][^"']{4,}["']/i },
];

let diff;
try {
  diff = execFileSync("git", ["diff", "--no-color", "--unified=0", range], { encoding: "utf8" });
} catch {
  console.error(`No se pudo inspeccionar cambios con el rango ${range}.`);
  process.exit(2);
}

const findings = [];
let currentFile = "archivo desconocido";
for (const line of diff.split(/\r?\n/)) {
  if (line.startsWith("+++ b/")) {
    currentFile = line.slice(6);
    continue;
  }
  if (!line.startsWith("+") || line.startsWith("+++")) continue;

  for (const rule of rules) {
    if (rule.pattern.test(line.slice(1))) findings.push(`${currentFile}: ${rule.label}`);
  }
}

if (findings.length) {
  console.error("El cambio agrega posibles datos personales o secretos:");
  for (const finding of [...new Set(findings)]) console.error(`- ${finding}`);
  console.error("Elimina el dato, usa variables de entorno o solicita una excepción de seguridad revisada.");
  process.exit(1);
}

console.log(`Escaneo de cambios aprobado (${range}).`);
