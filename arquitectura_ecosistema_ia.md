# 🏛️ Arquitectura Técnica y Ecosistema de Agentes Jerárquicos
## Suite Docente Inteligente (Act-IA + PassLink) — Nivel UDP & Multi-Universidad

---

## 🎯 1. Visión y Respuesta a la Validación CREA-UDP

La reunión con el **CREA UDP** confirmó el diagnóstico crítico de la educación superior:
1. **La brecha operativa**: Canvas resuelve el repositorio estático y los anuncios, pero no la vida dinámica del curso (ayudantías, creación de actividades, estandarización de pautas, control de presencia y consolidación de notas).
2. **La sobrecarga y disparidad de ayudantes**: Sin un estándar claro, los ayudantes improvisan materiales, corrigen con distintos niveles de rigor y no tienen herramientas para preparar adecuadamente las solemnes.
3. **Plataforma "Para Bebés"**: Cero curva de aprendizaje. El docente o ayudante no debe "aprender un software complejo", sino interactuar con un agente que ya conoce su curso y su Excel.

---

## 🏗️ 2. Arquitectura de Agentes Jerárquicos (Multi-Tier Agent System)

Para que el sistema sea configurable por autoridades, personalizable por docentes y ejecutable de forma consistente por ayudantes, los agentes no son un chatbot plano, sino una **jerarquía estricta de 3 niveles**:

```
                              ┌──────────────────────────────────────────────┐
                              │         NIVEL 1: AGENTE FACULTAD / CREA      │
                              │       (Políticas Globales y Estándares)      │
                              └──────────────────────┬───────────────────────┘
                                                     │ Hereda reglas institucionales
                                                     ▼
                              ┌──────────────────────────────────────────────┐
                              │          NIVEL 2: AGENTE POR CURSO           │
                              │          ("El Mini-Yo del Profesor")         │
                              │   - Syllabus, Cátedras, Solemnes pasadas     │
                              │   - "Perillas" docentes: rigor, tono, foco   │
                              └──────────────────────┬───────────────────────┘
                                                     │ Delega tareas operativas
                     ┌───────────────────────────────┼───────────────────────────────┐
                     ▼                               ▼                               ▼
       ┌──────────────────────────┐    ┌──────────────────────────┐    ┌──────────────────────────┐
       │   WORKER: ACTIVIDADES    │    │    WORKER: EVALUADOR     │    │   WORKER: EXCEL ENGINE   │
       │     Y PREPARACIÓN        │    │    Y RETROALIMENTACIÓN   │    │     Y PONDERACIONES      │
       ├──────────────────────────┤    ├──────────────────────────┤    ├──────────────────────────┤
       │ - Diseña talleres/casos  │    │ - Corrige según pauta    │    │ - Calcula notas finales  │
       │ - Ejercicios pre-solemne │    │ - Cita párrafos del PDF  │    │ - Asigna décimas         │
       │ - Genera la rúbrica      │    │ - Detecta regresiones    │    │ - Genera .xlsx oficial   │
       └──────────────────────────┘    └──────────────────────────┘    └──────────────────────────┘
```

### 🎛️ Las "Perillas" de Personalización (Settings JSONB)
Cada curso cuenta con un perfil de configuración que el profesor ajusta en 2 minutos:
- **`nivel_exigencia`**: `[Laxo | Moderado | Estricto | Solemne]`.
- **`estilo_pedagogico`**: `[Socrático (guía con preguntas) | Directo (muestra error y solución) | Rúbrica Pura]`.
- **`politica_decimas`**: Ponderación máxima permitida por actividad (ej: +0.2 hasta un tope de +0.6 en Solemne 1).
- **`contexto_activo`**: Módulos temáticos habilitados (ej: Semanas 1 a 4 para control 1).

---

## 🧩 3. Arquitectura del Software: Desacople Total (Headless & Modular)

Para garantizar que el software pueda:
1. Embeberse dentro de Canvas vía **LTI 1.3**.
2. Funcionar como **WebApp independiente (PWA)** en celular para asistencia rápida y en desktop para correcciones.
3. Venderse o licenciarse a **otras universidades (PUC, UChile, etc.)** sin modificar una sola línea de código fuente.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 CAPA DE CLIENTES / FRONTEND                            │
│   ┌──────────────────────────┐  ┌──────────────────────────┐  ┌─────────────────────┐  │
│   │ App Móvil Estudiantes    │  │ Dashboard Web Docente    │  │ Canvas LTI 1.3      │  │
│   │ (PassLink PWA 1-Tap)     │  │ (Desktop: Pautas/Excel)  │  │ (Embebido en Canvas)│  │
│   └─────────────┬────────────┘  └─────────────┬────────────┘  └──────────┬──────────┘  │
└─────────────────┼─────────────────────────────┼──────────────────────────┼─────────────┘
                  │                             │                          │
                  ▼                             ▼                          ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        API GATEWAY / BACKEND ORQUESTADOR                               │
│                         (FastAPI / Python o Node.js REST/GraphQL)                      │
│   - Autenticación JWT / SSO Canvas OAuth2                                              │
│   - Control Multi-Tenant (Institución -> Facultad -> Curso -> Usuario)                │
│   - Endpoints Headless: `/api/v1/attendance`, `/api/v1/activities`, `/api/v1/grading` │
└───────────────────────────────────┬────────────────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        ▼                           ▼                           ▼
┌──────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│  MOTOR DE DATOS  │    │  ORQUESTADOR IA/RAG  │    │   MOTOR DE EXCEL     │
│  (Supabase / PG) │    │  (LangGraph / Lite)  │    │   (OpenPyXL/ExcelJS) │
│ - Tablas Tenant  │    │ - RAG de Cátedras    │    │ - Respeto de Fórmulas│
│ - pgvector (RAG) │    │ - Multi-LLM Fallback │    │ - Formato oficial UDP│
│ - Realtime WSS   │    │ - Citas y Filtro PII │    │ - Auditoría décimas  │
└──────────────────┘    └──────────────────────┘    └──────────────────────┘
```

---

## 🛠️ 4. Stack Tecnológico Recomendado y Justificación

| Capa | Tecnología Recomendada | ¿Por qué esta y no otra? |
| :--- | :--- | :--- |
| **Frontend** | **Next.js (App Router, React 19, TypeScript)** | Compatible con despliegue PWA (asistencia móvil en 1 tap) y compatible con iframe LTI 1.3 de Canvas. Renderizado SSR ultra veloz. |
| **Diseño / UI** | **Vanilla CSS Tokens + Radix UI / Tailwind** | Look premium, moderno y limpio ("para bebés"), sin saturar con menús engorrosos. |
| **Backend & IA Engine** | **Python (FastAPI + LangGraph / PydanticAI)** | Python es el estándar indiscutible para IA, extracción de PDFs (`pypdf`, `pymupdf`), embeddings vectoriales y orquestación multi-agente con validación de tipos estricta (`Pydantic`). |
| **Base de Datos & Auth** | **Supabase (PostgreSQL + pgvector)** | Ofrece Auth institucional, Row Level Security (RLS) nativo para aislar cursos/facultades, base de datos vectorial para los PDFs del curso y WebSockets en tiempo real para el contador de asistencia. |
| **Motor de Planillas** | **Python `openpyxl` / `openpyxl-templates`** | Permite clonar la plantilla Excel original de la UDP, inyectar columnas de asistencia y décimas, y recalcular fórmulas matriciales de notas sin romper las macros ni el formato de la universidad. |
| **Integración LMS** | **LTI 1.3 Advantage (Pylti1p3)** | Permite que el sistema aparezca en el menú lateral de Canvas, sincronice estudiantes sin subidas manuales y envíe notas al Gradebook oficial. |

---

## 🔒 5. Privacidad y Seguridad (Academic Data Integrity)

1. **Anonimización PII previa al LLM**:
   - Antes de enviar un trabajo de un alumno a la API de IA (Claude, GPT o Gemini), el sistema reemplaza el nombre y RUT del alumno por tokens anónimos (`estudiante_token_id`).
   - Al recibir la corrección estructurada, el backend re-asocia el feedback al estudiante en la base de datos local.
2. **Protección Intelectual Docente**:
   - Los materiales, pautas y solemnes subidos por los profesores se almacenan en un índice vectorial aislado por `curso_id` mediante RLS. Ningún curso puede consultar los datos de otro.
3. **Cero entrenamiento**:
   - Configuración contractual con APIs de grado empresarial (Zero Data Retention) para asegurar que el contenido académico de la UDP no se use para reentrenar modelos públicos.

---

## 📅 6. Propuesta de Fases para la Demo con Profesores del CREA

Para dejar a los profesores asombrados en la siguiente reunión:

### 🌟 Fase Demo MVP (Lo que verán funcionando):
1. **Paso 1: Creación del Curso en 30 Segundos**:
   - El profesor sube la lista oficial de alumnos (Excel UDP) o se simula sincronización con Canvas.
2. **Paso 2: Carga de Material y "Perillas" del Agente**:
   - Subida de un PDF (syllabus o cátedra) + ajuste de exigencia (ej: rigor 4/5, estilo constructivo).
3. **Paso 3: Generación Asistida de Actividad y Rúbrica**:
   - El ayudante pide: *"Genera una actividad práctica de 45 minutos para preparar la Solemne 1 sobre este tema"*.
   - El agente genera el enunciado, la pauta de solución y la rúbrica desglosada con puntajes y décimas.
4. **Paso 4: Simulación de Entrega y Pre-corrección con Citas**:
   - Se sube un informe de estudiante. El agente revisa, cita exactamente dónde está el error, propone una nota y décimas ganadas.
5. **Paso 5: El Excel Oficial Actualizado**:
   - En 1 clic, se descarga el Excel del curso con las décimas aplicadas automáticamente a la nota preliminar.
