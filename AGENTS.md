# 📌 Reglas de Desarrollo y Arquitectura — Ecosistema Docente IA (UDP)

## 🎨 1. Sistema de Diseño Estricto: Clon Canvas Instructure + Identidad UDP
Para evitar que con el avance del desarrollo las páginas diverjan visualmente, **TODO componente y vista debe ceñirse sin excepción a esta guía de estilos**:

### 🎨 Paleta de Colores Oficial
- **Canvas Primary Dark (Sidebar Global)**: `#2D3B45` (Carbón institucional Instructure).
- **Canvas Sidebar Hover / Active**: `#1E272E` con borde izquierdo indicador blanco o rojo UDP.
- **UDP Institucional (Acentos y Brand)**: `#C8102E` (Rojo UDP) y `#008EE2` (Azul Canvas estándar para links y botones de acción).
- **Fondo General de la Aplicación**: `#F5F6F8` (Gris suave neutro de Canvas).
- **Tarjetas y Superficies**: `#FFFFFF`.
- **Bordes y Divisores**: `#E0E3E6` y `#C7CDD1` (Bordes sutiles de 1px sólidos, nunca sombras exageradas ni bordes redondeados infantiles).
- **Texto Principal**: `#2D3B45` (Gris muy oscuro, alto contraste).
- **Texto Secundario / Metadatos**: `#6B7780` o `#55636E`.
- **Estados y Badges**:
  - Éxito / Sincronizado: Verde tenue `#E8F5E9` texto `#2E7D32` borde `#C8E6C9`.
  - Pendiente / Preliminar: Amarillo suave `#FFF8E1` texto `#F57F17` borde `#FFE082`.
  - Advertencia / Riesgo: Rojo tenue `#FFEBEE` texto `#C62828` borde `#FFCDD2`.

### 🔤 Tipografía y Espaciado
- **Fuente**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `Roboto`, `sans-serif`.
- **Tamaños**: Títulos `20px` - `24px` semibold, subtítulos `14px` - `16px` medium, texto base `13px` - `14px` regular, metadatos `12px`.
- **Breadcrumbs**: Todas las vistas internas deben incluir breadcrumb estilo Canvas en el tope (`Cursos > Nombre del Curso > Sección`).
- **Look Profesional CRM**: Densidad de información limpia, tablas compactas con cabeceras en mayúsculas sutiles (`font-size: 11px; text-transform: uppercase; color: #6B7780;`), botones con bordes netos y radio de 4px (`rounded-[4px]`).

---

## 🏛️ 2. Principios Inquebrantables de Ingeniería y Arquitectura Limpia

### Regla 1: Límite Estricto de 200 Líneas por Archivo
- Ningún archivo `.tsx` de componente o vista superará las **200 líneas**.
- Si un componente excede o se acerca al límite:
  1. Extraer subcomponentes a carpetas dedicadas (ej. `src/components/modules/teacher/activities/`).
  2. Extraer lógica de estado compleja a Custom Hooks (`src/hooks/`).
  3. Extraer catálogos y datos mock a `src/constants/`.

### Regla 2: Separación Estricta de 3 Capas
1. **Presentación (`src/components/`)**: Únicamente renderizado JSX, estilos y despachar eventos. **Prohibido colocar cálculos matemáticos pesados o llamadas de persistencia en componentes de vista**.
2. **Dominio (`src/types/` & `src/utils/`)**: Modelos de datos TypeScript, fórmulas de cálculo de notas, ponderaciones, reglas de eximición y validadores puros (fáciles de testear).
3. **Infraestructura (`src/services/` & `src/app/api/`)**: Conexión a Canvas API, Supabase, generación de Excel y orquestación de LLMs.

### Regla 3: Design System Canvas Obligatorio (`src/components/canvas/`)
- Todo elemento recurrente de UI debe ser un componente reutilizable del design system:
  - `CanvasModal`: Modales accesibles con backdrop, escape y títulos estandarizados.
  - `CanvasInput`, `CanvasSelect`, `CanvasTextarea`: Inputs con estilos institucionales unificados.
  - `CanvasTabs`: Pestañas oficiales con indicador activo Canvas.
  - `CanvasTable`, `CanvasButton`, `CanvasBadge`, `CanvasActionMenu`.
- **Prohibido** crear modales ad-hoc en línea o reescribir manualmente clases Tailwind idénticas en 30 archivos.

### Regla 4: Single Source of Truth (SSOT) para el Estado
- La información de cursos, notas y asistencia debe estar orquestada por stores/contextos reactivos unificados.
- **Prohibido** crear eventos globales desarticulados con `window.dispatchEvent(new Event(...))` que fragmenten la sincronización entre componentes.

### Regla 5: Capa Backend Real para Agentes e Inteligencia Artificial
- La lógica de los agentes, prompts y comunicación con modelos de lenguaje corre en rutas de backend (`src/app/api/ai/`), nunca en `setTimeout` improvisados en componentes de interfaz.

### Regla 6: Cero Datos Hardcodeados en Componentes de Vista
- Catálogos de metodologías, rúbricas de 300 líneas y listas maestras se definen en `src/constants/` o se consultan desde base de datos/API, nunca embebidos en el archivo del componente.

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




