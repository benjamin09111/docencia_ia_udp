# 🗺️ Roadmap Técnico del Ecosistema de Agentes de IA UDP (`agent-services`)

> **Proyecto:** Act-IA / PassLink — Fondo Talento IA UDP  
> **Unidad Responsable:** Escuela de Informática y Telecomunicaciones & CREA UDP  
> **Arquitectura:** Microservicio agéntico en Python (FastAPI + Pydantic + Google GenAI + MCP + A2A)  
> **Cliente Principal:** Frontend WebApp Next.js (Clon Canvas Instructure + LTI 1.3)

---

## 🧭 1. Visión y Propósito del Microservicio

El microservicio `/agent-services` es el **núcleo cognitivo autónomo** del proyecto. Se diseñó de forma **100% desacoplada** de la aplicación web tradicional para garantizar:
1. **Aislamiento de Cómputo:** Los bucles de razonamiento (*Think -> Act -> Observe*) no bloquean las operaciones transaccionales del servidor web ni sufren por límites de timeout serverless.
2. **Modelo Jerárquico en Árbol:** En lugar de un chatbot plano con riesgo de alucinación y pérdida de contexto (*context rot*), el sistema modela la organización universitaria como un árbol de herencia de políticas en cascada:
   - **Nivel 1 (Raíz):** Vicerrectoría Académica / CREA UDP (Reglamento de docencia, escala 1.0-7.0, 75% asistencia RI, Human-in-the-Loop irrestricto).
   - **Nivel 2 (Facultad):** Facultad de Ingeniería y Ciencias (Rigor analítico, proyectos Capstone, acreditación ABET).
   - **Nivel 3 (Escuela):** Informática y Telecomunicaciones (Clean Architecture, trade-offs de diseño, Git, pruebas automatizadas).
   - **Nivel 4 (Curso / Docente):** "El Mini-Yo del Profesor" (Syllabus, solemnes pasadas, perillas de rigor y estilo pedagógico).
   - **Nivel 5 (Workers):** Especialistas hiper-enfocados con 2 a 4 herramientas (Diseñador de Actividades, Evaluador de Entregas, Motor de Excel).
3. **Interoperabilidad Estándar:** Expone capacidades mediante **A2A** (`.well-known/agent-card.json`) y **MCP** (Model Context Protocol), listo para ser integrado en Canvas LMS, apps móviles o servicios multi-universidad.

---

## 🚀 2. Guía de Onboarding para Desarrolladores

Si te estás sumando al proyecto o vas a continuar desarrollando un módulo agéntico, sigue estos pasos para dejar tu entorno listo en menos de 5 minutos:

### Paso 1: Requisitos Previos
- Python 3.12 o 3.13 instalado.
- Terminal PowerShell (Windows) o Bash (Mac/Linux).

### Paso 2: Crear y Activar Entorno Virtual
Desde la raíz del repositorio, entra a la carpeta del microservicio:
```bash
cd agent-services
python -m venv venv

# En Windows (PowerShell):
.\venv\Scripts\Activate.ps1

# En Linux / Mac:
source venv/bin/activate
```

### Paso 3: Configurar Variables de Entorno
Copia la plantilla de entorno:
```bash
cp .env.example .env
```
*(Opcional: Si tienes una `GEMINI_API_KEY`, agrégala a `.env`. Si no la configuras, el microservicio cuenta con un motor determinista contextual y de herramientas para desarrollo offline).*

### Paso 4: Instalar Dependencias
```bash
pip install -r requirements.txt
```

### Paso 5: Levantar el Servidor en Desarrollo
```bash
uvicorn main:app --host 0.0.0.0 --port 8080 --reload
```
Abre en tu navegador:
- Estado del servicio: `http://localhost:8080/health`
- Árbol jerárquico activo: `http://localhost:8080/api/v1/tree/hierarchy`
- Manifiesto A2A: `http://localhost:8080/.well-known/agent-card.json`
- Documentación interactiva Swagger: `http://localhost:8080/docs`

### Paso 6: Ejecutar la Suite de Pruebas de Calidad
```bash
python evals/run_evals.py
```
*(Debe reportar 100% de casos aprobados).*

---

## 📂 3. Estructura de Directorios: ¿Dónde Tocar Qué?

```text
agent-services/
├── Dockerfile                  # Contenedor optimizado para Google Cloud Run y Railway
├── requirements.txt            # Dependencias Python (FastAPI, Pydantic, HTTPX, GenAI)
├── .env.example                # Plantilla de variables de entorno documentadas
├── config.py                   # Configuración central tipada con fallback resiliente
├── main.py                     # Entrypoint FastAPI con rutas REST, SSE y CORS
├── ROADMAP.md                  # Este documento de arquitectura y guía continua
│
├── core/                       # Núcleo del Bucle Agéntico y Modelos
│   ├── models.py               # Esquemas Pydantic: AgentNode, Settings, Evaluación
│   ├── hierarchy.py            # Árbol de herencia y compilador de prompts en cascada
│   └── engine.py               # Bucle ReAct (Think-Act-Observe), tool detection y Gemini
│
├── agents/                     # Definición de Nodos de la Jerarquía
│   ├── root.py                 # Nivel 1: Orquestador Institucional UDP / CREA
│   ├── supervisors/            # Nivel 2 a 4: Managers de Facultad, Escuela y Cursos
│   │   ├── faculty.py          # Supervisor Facultad de Ingeniería y Ciencias
│   │   ├── career.py           # Supervisor Escuela de Informática y Telecomunicaciones
│   │   └── course_teacher.py   # Agente Docente de Asignatura ("Mini-Yo del Profesor")
│   └── specialists/            # Nivel 5: Workers de Tareas Específicas
│       ├── activity_designer.py    # Diseñador de talleres y dinámicas de ayudantía
│       ├── submission_evaluator.py # Pre-corrección asistida de entregas con rúbricas
│       └── excel_engine.py         # Motor de cálculo y auditoría de notas y décimas
│
├── tools/                      # Herramientas Agénticas y Conectores
│   ├── custom_tools.py         # Herramientas deterministas de cálculo y descriptores
│   └── mcp_servers/            # Conectores bajo el protocolo MCP
│       ├── canvas_mcp.py       # Conector para Canvas LMS UDP (tareas, entregas)
│       └── supabase_mcp.py     # Conector para Supabase PostgreSQL y auditoría
│
├── rag/                        # Recuperación Aumentada con Generación de Cursos
│   ├── pdf_processor.py        # Chunker y procesador de documentos académicos
│   └── retriever.py            # Recuperador semántico contextual por asignatura
│
├── memory/                     # Context Engineering y Memoria
│   ├── session_manager.py      # Sesiones conversacionales con Sliding Window
│   ├── vector_store.py         # Adaptador para pgvector / índices vectoriales
│   └── memory_bank.py          # Pipeline ETL de memoria a largo plazo (hechos docentes)
│
├── protocols/                  # Protocolos Abiertos de Interoperabilidad
│   ├── agent_card.py           # Proveedor del manifiesto A2A
│   └── .well-known/agent-card.json # Manifiesto público normalizado
│
└── evals/                      # Calidad Continua y AgentOps
    ├── golden_dataset.py       # Dataset de casos dorados (Golden Set)
    ├── evaluators.py           # Evaluador de trayectoria (Glass Box)
    └── run_evals.py            # CLI ejecutable para verificación inmediata
```

---

## 🗺️ 4. Fases del Roadmap y Estado de Avance

### ✅ Fase 1: Arquitectura Base y Árbol Jerárquico (COMPLETADA)
- [x] Crear estructura modular de microservicio desacoplado en `/agent-services`.
- [x] Implementar modelos de datos estrictos en Pydantic (`core/models.py`).
- [x] Implementar administrador de jerarquía en árbol con herencia de directivas (`core/hierarchy.py`).
- [x] Implementar motor agéntico ReAct con tool detection y fallback determinista (`core/engine.py`).
- [x] Implementar agentes: Raíz Institucional, Facultad, Carrera y Docente de Curso.
- [x] Implementar workers especialistas: Diseñador de Actividades, Evaluador de Rúbricas y Motor de Excel.
- [x] Publicar manifiesto oficial **Agent2Agent (A2A)** (`protocols/`).
- [x] Conectar la ruta backend de Next.js (`src/app/api/ai/chat/route.ts`) como cliente transparente.
- [x] Crear suite de pruebas automáticas (`evals/run_evals.py`) con 100% de aprobación.

---

### 🟡 Fase 2: Conexión Real con Datos Académicos y RAG (EN CURSO)
*Objetivo: Alimentar el agente docente con el material real del curso (PDFs, cátedras y tareas de Canvas).*
- [x] Crear conectores base MCP para Canvas LMS (`tools/mcp_servers/canvas_mcp.py`).
- [x] Crear conector MCP para Supabase (`tools/mcp_servers/supabase_mcp.py`).
- [x] Crear chunker de documentos académicos (`rag/pdf_processor.py`).
- [x] Crear recuperador semántico de contexto por curso (`rag/retriever.py`).
- [ ] Conectar ingesta real de PDFs de cátedra subidos por el profesor desde la interfaz web.
- [ ] Almacenar vectores semánticos en la tabla `course_embeddings` de Supabase usando `pgvector`.
- [ ] Extraer rúbricas oficiales y pautas pasadas para el curso `CIT3203` (Arquitectura de Software).

---

### ⚪ Fase 3: Perillas Dinámicas y Memoria Semestral (PRÓXIMA)
*Objetivo: Darle al profesor el control total de su "Mini-Yo" y asegurar consistencia temporal.*
- [x] Modelar perillas pedagógicas (`nivel_exigencia`, `estilo_pedagogico`, `politica_decimas`).
- [x] Crear adaptador de memoria a largo plazo (`memory/memory_bank.py`).
- [ ] Construir en el frontend un componente Canvas Clon para calibrar las perillas en tiempo real.
- [ ] Persistir las perillas en Supabase por curso y docente.
- [ ] Pipeline ETL de memoria: extraer hechos automáticos tras cada sesión de revisión (ej. *"El profesor exige que se mencione el Teorema CAP al evaluar la Solemne 1"*).
- [ ] Habilitar compactación de conversaciones mediante resúmenes recursivos asíncronos.

---

### ⚪ Fase 4: Flujo Asistido de Calificación y Sincronización Excel
*Objetivo: Ahorrarle horas de trabajo a ayudantes y profesores en la corrección de tareas y entrega de décimas.*
- [x] Endpoint de evaluación asistida `/api/v1/agent/evaluate` con cálculo de décimas.
- [x] Worker evaluador con citas textuales y contraste contra la rúbrica oficial.
- [ ] Integrar pre-corrección por lotes: Leer las 40 entregas del taller desde Canvas o ZIP y generar pre-evaluaciones en cola asíncrona.
- [ ] Interfaz de aprobación rápida docente: Modal donde el ayudante/profesor ve la cita textual, la sugerencia del agente y presiona *"Aprobar Nota"* o *"Ajustar Décimas"*.
- [ ] Inyección de décimas y notas finales en la planilla Excel oficial UDP sin romper las fórmulas institucionales.

---

### ⚪ Fase 5: AgentOps, Observabilidad y Calidad Continua
*Objetivo: Medir efectividad, latencia y robustez en producción.*
- [x] Golden Dataset inicial con 2 casos de prueba institucional.
- [x] Runner de evaluación CLI ejecutable.
- [ ] Expandir el Golden Set a 25 casos representativos (casos borde, inyecciones de prompt, entregas atípicas).
- [ ] Integrar instrumentación OpenTelemetry / Langfuse para registrar trazas completas (*Trace ID*, spans de llamada a LLM, llamadas a tools).
- [ ] Implementar evaluador *LLM-as-a-Judge* en CI/CD que compare respuestas contra rúbricas de alineación pedagógica.

---

### ⚪ Fase 6: Empaquetado y Despliegue en Producción
*Objetivo: Poner el microservicio en la nube con escalabilidad automática.*
- [x] Dockerfile de producción con Python 3.12-slim y configuración sin buffer.
- [ ] Configurar workflow de GitHub Actions para ejecución automática de `python evals/run_evals.py` en cada PR.
- [ ] Desplegar en **Google Cloud Run** o **Railway** con soporte de Server-Sent Events (SSE) y Scale-to-Zero.
- [ ] Configurar autenticación JWT / API Key entre el backend Next.js y `/agent-services`.

---

## 🛡️ 5. Principios Inquebrantables de Desarrollo

Todo desarrollador que trabaje en `/agent-services` debe seguir estas reglas:

1. **Human-in-the-Loop Irrestricto:** La IA propone pautas, talleres, retroalimentación preliminar y sugerencias de décimas; **nunca califica de forma definitiva** sin la aprobación explícita de un docente o ayudante humano.
2. **Separación de Responsabilidades:** Los agentes en `agents/` orquestan y razonan; nunca realizan llamadas directas de base de datos o APIs en su propio cuerpo. Todo acceso a datos debe pasar por herramientas en `tools/` o conectores MCP.
3. **Control Estricto de Presupuesto:** Todo bucle agéntico debe respetar `max_steps_per_turn` y límites de tokens para evitar llamadas infinitas o costos desmedidos.
4. **Sanitización de Errores (Cero Information Leakage):** Ningún endpoint debe exponer stack traces internos, credenciales ni mensajes de error crudos de bibliotecas externas al cliente.
5. **Tipado Estricto Pydantic:** Toda entrada y salida debe estar fuertemente tipada con esquemas Pydantic v2.

---

## 👥 6. Directorio de Contacto del Equipo

- **Líder de Proyecto y Desarrollo:** Benjamín Morales Pizarro (`benjamin.morales3@mail.udp.cl`)
- **Académico Guía:** Prof. Jorge Esteban Cruz León (`jorge.cruz1@mail.udp.cl`)
- **Unidad:** Facultad de Ingeniería y Ciencias — Escuela de Informática y Telecomunicaciones UDP.
