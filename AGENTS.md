# 📌 Reglas de Desarrollo y Arquitectura — Ecosistema Docente IA (UDP)

## 🎨 1. Sistema de Diseño Estricto: Clon Fidedigno Canvas Instructure + Identidad UDP
Para evitar divergencias visuales, **TODO componente y vista debe ceñirse sin excepción a la interfaz exacta de Canvas Instructure (UDP)**, reflejada en el código fuente oficial (`code.md`):

### 🎨 Paleta y Atributos Oficiales (Extraídos de Canvas UDP)
- **Canvas Primary Global Nav (`#424242`)**: El fondo oficial del sidebar global Canvas UDP es `#424242` (`ic-brand-global-nav-bgd`).
- **Canvas Global Nav Activo**: Ítem activo con fondo blanco `#FFFFFF`, ícono rojo `#B71C1C` y texto en rojo `#B71C1C`.
- **Canvas Course Left-Side Menu (`#section-tabs`)**: Menú vertical secundario a la izquierda del contenido. Subtítulo `2026-2` en gris 12px. Links en rojo UDP `#B71C1C`. Ítem activo con texto `#2D3B45` en negrita y barra vertical lateral izquierda de 2px sólida (`border-l-2 border-[#2D3B45]`).
- **Canvas Top Bar (`#breadcrumbs`)**: Barra superior limpia con botón hamburguesa rojo UDP (`#B71C1C`), ruta breadcrumb limpia con separadores `>`, botón de acción "Ver como estudiante" (`.btn-top-nav`) a la derecha con anteojos. Prohibidos banners coloridos, gradientes o píldoras violetas/rosadas en el encabezado.
- **Canvas Content Toolbar**: Input de búsqueda con lupa y placeholder `Buscar...` a la izquierda; a la derecha botón secundario `+ Grupo` (gris `#F5F6F8`, borde `#C7CDD1`), botón primario `+ Tarea` / `+ Acción` (rojo UDP `#B71C1C`) y menú de tres puntos `⋮`.
- **Canvas Item Groups (`ig-list` / Módulos)**:
  - Cabecera de grupo: Fondo gris `#F5F6F8` con borde `#C7CDD1`, drag handle `⠿`, flecha colapsable `▾`, título semibold y botones `+` y `⋮`.
  - Filas de ítems: Fondo blanco, borde inferior `#E0E3E6`, hover suave, indicador verde vertical de 3px a la izquierda (`#2E7D32`), ícono temático, título interactivo, subtítulo en gris `#6B7780`, círculo verde con check de publicado `✔` y botón de tres puntos `⋮`.

---

## 🏛️ 2. Principios Inquebrantables de Ingeniería y Arquitectura Limpia

### Regla 1: Límite Estricto de 200 Líneas por Archivo
- Ningún archivo `.tsx` de componente o vista superará las **200 líneas**.
- Si un componente excede o se acerca al límite, dividir y extraer subcomponentes o custom hooks.

### Regla 2: Separación Estricta de 3 Capas
1. **Presentación (`src/components/`)**: Renderizado JSX limpio, estilos Canvas y eventos.
2. **Dominio (`src/types/` & `src/utils/`)**: Modelos TypeScript y lógica pura.
3. **Infraestructura (`src/services/` & `src/app/api/`)**: Canvas API, Supabase y orquestación LLM.

### Regla 3: Catálogo Canónico de UI (Pocos Componentes, Máxima Reutilización)
Prohibido crear componentes visuales ad-hoc o redundantes. La suite utiliza EXCLUSIVAMENTE este set canónico:
1. **Un solo contenedor de grupos/ítems Canvas (`CanvasItemGroup` / `CanvasItemRow`)**: Para todas las listas de cursos, secciones, agentes, tareas y entregables estilo Canvas.
2. **Una sola tabla canónica (`CanvasTable`)**: Para matrices numéricas y datos tabulares densos.
3. **Un solo modal de confirmación y formularios (`CanvasModal`)**: Con backdrop, tecla escape, header y footer estándar.
4. **Un solo input buscador / select (`CanvasSearchableSelect` y `CanvasInput`)**: Con icono de lupa y filtrado institucional.
5. **Un solo sistema de botones (`CanvasButton`)**: Con variantes primario Canvas/UDP, secundario y ghost.
6. **Un solo menú de acciones (`CanvasActionMenu`)**: Para los tres puntos verticales `⋮`.
7. **Un solo menú de navegación de curso (`CanvasCourseNav`)**: Menú vertical izquierdo idéntico a `#section-tabs` de Canvas.

### Regla 4: Single Source of Truth (SSOT) para el Estado
- La información de cursos, notas y asistencia debe estar orquestada por stores/contextos reactivos unificados.
- Prohibido disparar eventos globales desarticulados con `window.dispatchEvent`.

### Regla 5: Capa Backend Real para Agentes e Inteligencia Artificial
- La lógica de LLMs corre en rutas API backend (`src/app/api/ai/`), nunca en temporizadores improvisados en frontend.

### Regla 6: Cero Datos Hardcodeados en Componentes de Vista
- Catálogos y metadatos se centralizan en `src/constants/` o se consultan vía API.

### Regla 7: Rendimiento y Memoización Preventiva
- Tablas grandes y matrices de asistencia deben usar `useMemo` y `useCallback` para evitar re-renderizados innecesarios al tipear en filtros de búsqueda.
- Evitar operaciones bloqueantes en el hilo principal del navegador.

---

## ⚡ 3. Flujo de Trabajo y Eficiencia de Comandos
1. **Validaciones pesadas (`npm run build`, etc.)**: Comandos pesados como `npm run build` o verificaciones globales de compilación se ejecutan **SOLO antes de hacer el push final** o cuando el usuario lo solicite de forma explícita. No deben ejecutarse durante el desarrollo iterativo para mantener la máxima velocidad y eficiencia.
2. **Estrategia de Ramas (Staging Oficial para Testing)**:
   - La rama por defecto para desarrollo, pruebas y despliegues preliminares es estrictamente **`staging`**.
   - Todo push iterativo irá hacia `staging`.
   - La rama `main` (producción) solo recibirá merges/pushes cuando una funcionalidad esté validada y el usuario solicite explícitamente pasar a producción.

---

## 🛡️ 4. Estándar de Seguridad y Buenas Prácticas (Auditoría Continua)

### Regla 8: Auditoría y Salud de Dependencias
- Realizar escaneo preventivo de vulnerabilidades (`npm audit`).
- Prohibido incorporar dependencias abandonadas o con alertas críticas conocidas en npm (ej. `xlsx`/SheetJS clásico v0.18 posee alertas altas de Prototype Pollution y ReDoS; se debe migrar a librerías seguras como `exceljs`).
- Mantener las dependencias del runtime limpias de paquetes huérfanos o no utilizados.

### Regla 9: Transporte Seguro, HTTPS y Cabeceras de Seguridad (HSTS)
- Toda comunicación sensible debe viajar estrictamente sobre HTTPS.
- El servidor y Next.js deben configurar cabeceras defensivas estándar:
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (HSTS).
  - `X-Content-Type-Options: nosniff`.
  - `X-Frame-Options: SAMEORIGIN` (o CSP `frame-ancestors` si se incrusta en iframe de Canvas).
  - `Referrer-Policy: strict-origin-when-cross-origin`.
- Prevenir contenido mixto (mixed content) en assets o llamadas a servicios externos.

### Regla 10: Gestión Segura de Sesiones y Cookies (Al implementar Auth)
- Al construir o conectar el módulo real de autenticación (Supabase Auth / SSO UDP / Canvas OAuth):
  - Todas las cookies de sesión deben tener los flags: `HttpOnly`, `Secure` (en prod) y `SameSite=Lax` o `Strict`.
  - Expiración estricta por inactividad tras **30 minutos**.
  - Destrucción total de sesión en servidor y revocación de tokens al cerrar sesión (`logout`).
  - Regeneración obligatoria del identificador de sesión inmediatamente tras el login (prevención de Session Fixation).

### Regla 11: Control de Acceso y Minimización de Datos en API Endpoints (`src/app/api/`)
- Ningún endpoint que realice mutaciones o exponga datos institucionales (Canvas/Supabase/IA) debe quedar abierto sin autenticación y autorización basada en roles (RBAC: Admin, Docente, Alumno).
- **Minimización de datos**: Filtrar y sanitizar las respuestas hacia el frontend; no reenviar objetos crudos de APIs de terceros que contengan datos no solicitados o sensibles.

### Regla 12: Sanitización de Errores y Prevención de Fuga de Información (Information Leakage)
- **Cero fugas de información interna**: Prohibido retornar al frontend `error.message`, stack traces, rutas internas de archivos o errores crudos de bases de datos/Canvas en ambientes de producción.
- En bloques `catch`, registrar el detalle técnico en consola/telemetría del servidor (`console.error`) y responder al cliente con un mensaje genérico, claro y amigable (ej. `{ error: "No se pudo procesar la solicitud en este momento." }`).

---

## 🧭 5. Visión Arquitectural y Roadmap de Producto (Multi-Tenant & Modularidad)

El objetivo central es consolidar una **Suite Integral de Docencia Automatizada con Inteligencia Artificial** (SaaS EdTech B2B multi-institución):
- **Core del Producto**: Automatización integral de la carga docente mediante IA (Agentes tutores *Mini-Yo*, corrección y retroalimentación con rúbricas IA, generación de cronogramas, anuncios automatizados, gestión de entregables/solemnes y motor de reglas).
- **Módulo de Asistencia**: Es un componente operativo y funcional de alto valor diario que sirvió como punto de partida ágil por su facilidad de prueba y urgencia práctica, pero que forma parte de un ecosistema mucho más amplio y potente.

### 🎯 Principios del Roadmap:
1. **Monolito Modular con Feature Flags**:
   - Todo se construye en un único repositorio con arquitectura limpia y desacoplada.
   - Cada institución o docente puede habilitar los módulos que requiera mediante flags (`institution_settings` / `feature_flags`):
     - Módulo de Asistencia & Apelaciones (GPS + QR + Rules).
     - Módulo de Grupos & Automatizaciones / Rules Engine.
     - Módulo de Evaluaciones Formativas & Sumativas, Rúbricas IA y Gradebook Orchestrator.
     - Módulo de Bolsa de Décimas & Bonificaciones contextuales.
     - Módulo de Trazabilidad del Aprendizaje & Métricas de Rendimiento (Learning Analytics).
     - Módulo de Agente Copiloto Docente (*Teacher Copilot & Action Agent*): Asesor conversacional que ejecuta acciones directas sobre Canvas ("Quiero tener 20% en X", "Crea la rúbrica de Y") eliminando la fricción de uso.
     - Módulo de Agente IA Tutor para Estudiantes (*Mini-Yo*) y Materiales de Cátedra.
     - Módulo de Cronograma & Anuncios Automatizados.
2. **Orquestador de Evaluaciones & Canvas Gradebook (LTI 1.3 + Standalone SaaS)**:
   - **Canvas como Sistema de Registro**: Canvas Gradebook actúa como repositorio oficial final de notas.
   - **Agente Copiloto para Docentes (Action-Oriented)**: El profesor puede interactuar mediante lenguaje natural para consultar dudas pedagógicas o pedirle al agente que configure el curso (*"Reajusta la ponderación de la Solemne 1 al 20%"*, *"Diseña un taller de ayudantía de 30 minutos sobre microservicios"*). El agente ejecuta las llamadas API a Canvas y actualiza la estructura sin que el docente deba buscar menús.
   - **SpeedGrader Copilot & Auto-Evaluation Engine**: El docente NO necesita entrar manualmente a SpeedGrader ni hacer decenas de clics por alumno. El agente de IA descarga las entregas (PDFs, código, informes), evalúa contra cada criterio de la rúbrica Canvas, genera el puntaje y redacta feedback constructivo personalizado. El docente revisa en un panel por lotes y aprueba en 1 clic para inyectar a Canvas vía API (`submission[posted_grade]` y `rubric_assessment`).
   - **Propagación Inteligente de Notas Grupales (Fix Fallo Canvas)**: Soluciona el fallo crítico de Canvas donde en tareas grupales solo el líder que subió el archivo queda con nota en Gradebook o se desincronizan los integrantes. Nuestra plataforma propaga automáticamente la evaluación y retroalimentación a cada miembro del grupo en Canvas API con opción de bonificación/penalización individual.
   - **Evaluación Formativa vs. Sumativa**:
     - *Formativa (Trazabilidad y Aprendizaje continuo)*: Talleres cortos, checkpoints de proyecto, quizes de ayudantía y borradores evaluados por IA con feedback inmediato (sin ponderación destructiva o con bolsa de décimas).
     - *Sumativa (Certificación oficial)*: Solemnes, exámenes e hitos finales con ponderación curricular.
   - **Trazabilidad & Alertas Tempranas**: Detección de conceptos erróneos recurrentes antes de las evaluaciones sumativas críticas.
3. **Desacoplamiento Progresivo de Datos Institucionales**:
   - Evitar hardcodear coordenadas GPS, salas, calendarios y nombres de universidades en componentes y servicios.
   - Parametrizar estos datos por institución (`institutions`, `institution_settings`).
4. **Capa de Adaptadores de Fuente de Datos (Data Adapters)**:
   - Aislar la ingesta de estudiantes, notas y cursos mediante interfaces (`IDataSourceAdapter`):
     - Adaptador Canvas API / OAuth.
     - Adaptador LTI 1.3 (estándar para Canvas, Moodle, Blackboard).
     - Adaptador CSV / SIS escolar (Schoolnet, Syscol, Napsis).
5. **Seguridad y Aislamiento Multi-Tenant**:
   - Migración gradual hacia Supabase Auth con RBAC (Admin, Docente, Ayudante, Alumno).
   - Inclusión obligatoria de `institution_id` en esquemas y políticas RLS de Supabase.
   - Protección estricta de rutas API con tokens de sesión firmados.
6. **Plataforma Independiente Standalone & Web App Móvil PWA (Acciones Rápidas en 1-Clic)**:
   - La plataforma **SIEMPRE funcionará también como una Web App / PWA independiente instalable en el celular** del docente y ayudante (acceso directo en pantalla de inicio iOS/Android).
   - **Propósito & Caso de Uso Principal**: Permitir al profesor o ayudante ejecutar **acciones de alto impacto en 1 clic** desde su teléfono sin la fricción de ingresar a la interfaz pesada de Canvas Instructure (ej. *"Apretar 1 botón para suspender la clase de hoy y publicar automáticamente el anuncio de cancelación en Canvas"*, *"Regenerar el PIN del día"*, *"Aprobar apelaciones pendientes"*).
   - **Desarrollo Progresivo**: La construcción de esta plataforma independiente y sus funcionalidades móviles rápidas se realizará paso a paso ("de a poco"), manteniendo la interoperabilidad bidireccional mediante Canvas API REST / OAuth.

---

## 🔒 6. MÓDULO CONGELADO: Módulo de Asistencia & Apelaciones (GPS + QR + Rules)

> [!CAUTION]
> **ESTADO OFICIAL: DEFINITIVAMENTE CONCLUIDO, VALIDADO Y CONGELADO (ABSOLUTE FREEZE)**
> - Queda **estrictamente prohibido** volver a tocar o modificar nada referente a asistencia: arquitectura, esquemas de datos, planillas, archivos de constantes (`initialAttendanceData.ts`, `asistencias.txt`), flujos de marcaje GPS/PIN, reglas de quórum grupal, sincronización con Supabase o componentes del **Módulo de Asistencia** (`src/components/modules/public-attendance/`, `src/components/modules/teacher/attendance/`, `usePublicAttendanceCheckin.ts`, `attendanceStore.ts`, etc.).
> - Todo el desarrollo futuro se enfoca al 100% en los módulos restantes del ecosistema (Rúbricas e IA, Agente Copiloto Docente, Evaluaciones Formativas/Sumativas, Cronograma, Anuncios y Métricas).

---

## 🗄️ 7. Política Estricta de Doble Base de Datos (PROD vs DEV)

Para proteger de forma inquebrantable los datos reales de los alumnos y la estabilidad institucional:
1. **Base de Datos de Producción (`PROD`)**:
   - Variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_PASSWORD`.
   - Contiene la nómina oficial, configuraciones validadas y registros de asistencia auditables.
   - **Intocable durante el desarrollo diario**: no se ejecutan experimentos, seeds de prueba ni migraciones destructivas sobre esta base.
2. **Base de Datos de Desarrollo (`DEV`)**:
   - Variables: `NEXT_PUBLIC_SUPABASE_URL_DEV`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY_DEV`, `SUPABASE_PASSWORD_DEV`.
   - Entorno espejo donde clonamos la estructura y datos actuales.
   - **Todo nuevo desarrollo, nuevas tablas y pruebas de agentes o módulos corren exclusivamente aquí**.
3. **Flujo de Promoción y Migraciones Controladas**:
   - Nuevos modelos, tablas y funciones SQL se diseñan y prueban primero en la DB DEV.
   - Cuando una funcionalidad esté terminada y aprobada por el usuario, se genera un script de migración SQL limpio y versionado (`supabase/migrations/`) para aplicarse de forma controlada a la DB PROD.





