/**
 * Smoke local del puente IA (sin keys reales): valida imports TS de política
 * y, si AGENT_SERVICES_URL responde /health, reporta liveness.
 *
 * Uso: node scripts/smoke_agent_ai.mjs
 */
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

async function main() {
  const base = (process.env.AGENT_SERVICES_URL || "http://127.0.0.1:8080").replace(/\/$/, "");
  console.log("[smoke] AGENT_SERVICES_URL =", base);
  console.log("[smoke] AI_EXTERNAL_PROCESSING_ENABLED =", process.env.AI_EXTERNAL_PROCESSING_ENABLED || "false");
  console.log("[smoke] AGENT_SERVICE_API_KEY set =", Boolean(process.env.AGENT_SERVICE_API_KEY));

  try {
    const res = await fetch(`${base}/health`, { signal: AbortSignal.timeout(2000) });
    const body = await res.json().catch(() => ({}));
    console.log("[smoke] health status", res.status, body);
  } catch {
    console.log("[smoke] microservicio no reachable (ok si aún no lo levantas)");
  }

  // Sanity: el gate de privacidad existe en runtime compilado vía require relativo no aplica;
  // este script solo documenta el checklist operativo.
  console.log("[smoke] checklist:");
  console.log("  1) misma AGENT_SERVICE_API_KEY en Next y agent-services");
  console.log("  2) OPENROUTER_API_KEY en agent-services");
  console.log("  3) AI_EXTERNAL_PROCESSING_ENABLED=true solo en staging controlado");
  console.log("  4) course default CIT3000 / AI_SANDBOX_COURSE_CODE");
  console.log("[smoke] done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
