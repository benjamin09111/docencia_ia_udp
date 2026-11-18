# Módulo 1 — Contrato de datos para el Módulo 2

Este documento explica cómo el **Módulo 2 (Actividades y Corrección)** se conecta con los datos del **Módulo 1 (Gestión y Calificaciones)**: cómo ligar una actividad a una evaluación y cómo escribir notas.

Migración: `supabase/migrations/20261118_modulo1_gestion_calificaciones.sql`
Tipos: `src/types/gestion.ts`

## Modelo

```
cursos 1──* evaluaciones 1──* notas *──1 alumnos *──1 cursos
```

| Tabla | Qué guarda | Claves importantes |
|-------|------------|--------------------|
| `cursos` | Curso del docente y su configuración de calificación (escala, examen, décimas, restricciones). | `owner_user_id` = `session.userId` del docente. |
| `evaluaciones` | Cada evaluación ponderada ("Solemne 1", "Tarea 2"). Es una columna de la tabla de notas. | `ponderacion` = % sobre la nota final. Todas las del curso, incluido el examen, suman 100. |
| `alumnos` | Nómina del curso. Un alumno pertenece a un solo curso. | `rut` normalizado `cuerpo-DV` sin puntos. `decimas` en puntos de nota (0.3 = 3 décimas). |
| `notas` | Nota 1.0–7.0 (un decimal) por evaluación y alumno. | `UNIQUE (evaluacion_id, alumno_id)`. Una nota vacía = la fila no existe. |

**La nota final nunca se guarda.** Se calcula siempre con el motor puro del Módulo 1, a partir de `notas`, `evaluaciones`, `alumnos.decimas` y la configuración del curso.

## Cómo ligar una actividad a una evaluación

En la tabla de actividades del Módulo 2:

```sql
evaluacion_id UUID NULL REFERENCES public.evaluaciones(id) ON DELETE SET NULL
```

Si el docente borra la evaluación, la actividad queda sin evaluación (no se borra).

## Cómo escribir notas (desde el servidor)

Usa las funciones de `src/services/gestion/notasRepository.ts`. Validan rango, decimales y que la evaluación y el alumno sean del mismo curso:

```ts
import { guardarNotas, listarEvaluaciones } from "@/services/gestion/notasRepository";
import { listarAlumnos } from "@/services/gestion/alumnosRepository";

await guardarNotas(
  cursoId,
  [{ evaluacion_id, alumno_id, valor: 5.8 }], // valor: null borra la nota
  { origen: "actividad", referencia_externa: actividadId, updated_by: session.userId }
);
```

- `origen`: usa siempre `'actividad'`. La tabla de notas usa `'manual'`.
- `referencia_externa`: id de tu actividad o entrega, para saber de dónde salió la nota.
- Si el docente edita la nota a mano después, la fila pasa a `origen = 'manual'` (la última escritura gana).
- Para convertir puntaje de rúbrica a nota, usa `calculateGradeFromScore()` de `src/utils/gradeScaleCalculator.ts` con la escala del curso (`nota_minima`, `nota_maxima`, `nota_aprobacion`, `exigencia_pct`). Redondea a un decimal antes de guardar.

Desde el navegador, el equivalente es `PUT /api/gestion/cursos/{cursoId}/notas` con el body validado por `guardarNotasSchema` (`src/utils/gestion/esquemasNotas.ts`).

## Permisos

- Las tablas solo se acceden con la clave `service_role` desde rutas de servidor (RLS activo, sin acceso para `anon` ni `authenticated`).
- Las rutas `/api/gestion/*` exigen sesión de docente o admin. El docente solo ve sus cursos; un curso ajeno responde 404. Ver `src/lib/server/gestionAcceso.ts`.

## Privacidad

RUT y correo de los alumnos **nunca** se envían a la IA. Si el Módulo 2 manda entregas a un modelo, debe pasar por las guardas existentes (`src/lib/server/aiPrivacy.ts`, `aiPseudonymize.ts`, `aiGuardrails.ts`).
