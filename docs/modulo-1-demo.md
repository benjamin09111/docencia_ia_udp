# Módulo 1 — Guía de la demo (Gestión y Calificaciones)

Flujo de punta a punta: **crear un curso desde el PDF del programa (o a mano) → cargar alumnos por Excel → editar notas y ver la nota final recalculada → exportar el acta en Excel.**

Todos los datos de la demo son ficticios (`seed/modulo1/`).

## 1. Preparación (una vez)

1. **Variables** en `.env.local` (ver `.env.example`):
   - `SESSION_SECRET` (32+ caracteres).
   - `NEXT_PUBLIC_SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`. Sin Supabase, las rutas protegidas responden 401, porque la verificación de sesiones revocadas falla cerrada.
   - IA (opcional, para crear el curso desde el PDF): `AI_EXTERNAL_PROCESSING_ENABLED=true`, `AI_BASE_URL`, `AI_API_KEY` y `AI_MODEL`. Sin IA, el docente ve el formulario vacío con un aviso y puede crear el curso a mano.
2. **Migración**: ejecuta `supabase/migrations/20261118_modulo1_gestion_calificaciones.sql` en Supabase → SQL Editor. Crea `cursos`, `evaluaciones`, `alumnos` y `notas` aisladas de Asistencia.
3. **Seed** (opcional, para tener un curso con notas ya cargadas): `npm run seed:m1` (por defecto para el docente `usr_docente_1`; otro: `npm run seed:m1 -- usr_docente_2`).
4. `npm run dev` e ingresa con la cuenta docente de prueba **bmorales** (Prof. Benjamín Morales).

## 2. Archivos de la demo (`seed/modulo1/`)

| Archivo | Para qué |
|---------|----------|
| `programa-demo.pdf` | Programa ficticio de Arquitectura de Software, Sección 2. Dice "NF = 80% NP + 20% Examen" para mostrar que la IA lo convierte a ponderaciones sobre la nota final (25/25/10/10/10/20). Incluye un correo, que se tacha antes de enviar el texto a la IA. |
| `alumnos-demo.xlsx` | 10 alumnos ficticios con RUT válidos (la mitad con puntos, para mostrar la normalización). |
| `alumnos-con-errores.xlsx` | 6 filas: dígito verificador incorrecto, correo inválido, RUT duplicado (2 filas), nombre faltante y 1 válida. |
| `programa-demo.md`, `datos-demo.mjs` | Fuentes. Regenera los archivos con `npm run seed:m1:archivos`. |

## 3. Guion sugerido (≈ 6 minutos)

1. **Docencia → Gestión y calificaciones → + Curso → Desde el programa (PDF)**. Sube `programa-demo.pdf` y pulsa *Leer programa con IA*. El formulario aparece pre-rellenado. Muestra las evaluaciones expandidas (Tarea 1–3 al 10%), la eximición 5.5, las décimas 0.5 y la restricción "promedio de solemnes ≥ 4.0".
2. Cambia una ponderación para mostrar que el total se pone rojo y **Crear curso** se bloquea. Corrígela y crea el curso.
3. **Alumnos → Descargar plantilla** (muestra las columnas). Luego **Subir Excel** con `alumnos-con-errores.xlsx`: la vista previa marca cada error y solo carga la fila válida. Repite con `alumnos-demo.xlsx` (10 alumnos).
4. **Notas**: escribe notas. La nota final cambia mientras escribes, se guarda al salir de la celda y Enter baja a la fila siguiente. Prueba un 8 para mostrar que se rechaza.
5. Abre el curso del seed (**Sección 1**), que ya tiene notas. Muestra los casos:
   - *Catalina Fuentes* y *Diego Sepúlveda*: eximidos (NP ≥ 5.5).
   - *Valentina Muñoz*: nota final 5.0 pero **Reprobado** por el promedio de solemnes 3.5 (el motivo aparece bajo el estado).
   - *Josefa Vargas*: NP exacta 3.95 → **4.0**.
   - *Fernanda Morales*: +0.3 de décimas (4.1 → 4.4).
   - *Benjamín Contreras* y *Sebastián Carrasco*: **Pendiente** (faltan notas o el examen).
6. **Simular escenarios**: cambia notas sin guardar (celdas en amarillo). *Salir de simulación* vuelve a lo guardado.
7. **Exportar Excel**: abre el `.xlsx`. Trae el encabezado del curso, una columna por evaluación, la nota final y Aprobado/No aprobado.

## 4. Si algo falla

- **401 "Sesión requerida" en toda la app**: falta Supabase o la tabla `revoked_sessions` (migración existente `20261015_fase3b_checkin_atomico.sql`).
- **"El almacenamiento del módulo no está configurado"**: falta `SUPABASE_SERVICE_ROLE_KEY`.
- **Error al guardar un curso o alumnos**: revisa que la migración del Módulo 1 esté aplicada.
- **"La extracción con IA no está habilitada"**: revisa `AI_EXTERNAL_PROCESSING_ENABLED=true`, `AI_BASE_URL` y `AI_MODEL`. Si el modelo no soporta `response_format`, deja `AI_JSON_MODE=false`.
