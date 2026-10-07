# Guía Técnica de Implementación: Servicio de Agentes de IA Reutilizable, Jerárquico y Escalable

Esta guía establece el estándar de arquitectura e ingeniería de software para desarrollar, desplegar y operar un servicio independiente de agentes de Inteligencia Artificial (`agent-services`). Su propósito es servir como el manual de referencia definitivo para agentes desarrolladores e ingenieros de sistemas que necesitan construir capacidades agénticas de producción: autónomas, jerárquicas, interoperables, monetizables de forma independiente y fácilmente integrables con cualquier aplicación cliente.

---

## 1. Arquitectura del Servicio de Agentes Desacoplado (`/agent-services`)

### Principio de Separación de Responsabilidades

Para construir un sistema agéntico escalable en entornos de producción, es fundamental abandonar el enfoque de monolito y adoptar una arquitectura desacoplada basada en tres componentes independientes. Esta separación garantiza que el procesamiento determinista del negocio no se vea afectado por la naturaleza estocástica y los tiempos de ejecución variables de los modelos de lenguaje.

La estructura recomendada se organiza en los siguientes módulos:

*   **`frontend/` (Capa de Interacción):** Desarrollado en frameworks como Next.js, React o Flutter. Su única responsabilidad es renderizar la interfaz de usuario, capturar entradas y gestionar respuestas en tiempo real mediante streaming (Server-Sent Events o WebSockets).
*   **`backend/` (Capa de Negocio Tradicional):** Desarrollado en Node.js, Go o FastAPI. Administra operaciones deterministas y síncronas de baja latencia: autenticación de usuarios (OAuth/JWT), pasarelas de pago, registros CRUD en bases de datos relacionales y lógica de dominio principal.
*   **`agent-services/` (Servicio Agéntico Autónomo):** Un microservicio dedicado, típicamente en Python, especializado en orquestación de modelos de lenguaje (LLMs), razonamiento estocástico en bucle, ejecución de herramientas (*tools*), gestión de estado conversacional y memoria a largo plazo.

### Ventajas del Desacoplamiento y Modelo Agent-as-a-Service

Esta arquitectura independiente proporciona beneficios significativos en términos de mantenimiento, costos e interoperabilidad empresarial:

*   **Aislamiento de Recursos y Tiempos de Ejecución:** Los bucles agénticos (*Think, Act, Observe*) requieren tiempos de procesamiento variables que pueden extenderse desde segundos hasta minutos u horas (cuando involucran intervención humana o tareas asíncronas). Aislar la capa de agentes evita bloqueos en el API Gateway o backend transaccional.
*   **Ecosistema Nativo de IA en Python:** Python es el estándar de facto para orquestadores agénticos (Google ADK, LangGraph, PydanticAI, OpenAI SDK), librerías de análisis de datos y motores RAG.
*   **Monetización y Reutilización (Agent-as-a-Service):** Al empaquetar el servicio de agentes con contratos de API estandarizados, este módulo puede exponerse como un servicio B2B independiente, integrarse simultáneamente en múltiples aplicaciones (web, móvil, bots de WhatsApp, extensiones) o venderse como un microservicio agéntico especializado.

### Estructura de Directorios Recomendada (Monorepo)

A continuación se detalla la disposición de archivos en el proyecto para mantener una clara separación de conceptos dentro de la carpeta del servicio de agentes:

```text
mi-aplicacion/
├── frontend/                 # Interfaz de usuario (Next.js / React)
├── backend/                  # API REST / GraphQL para usuarios, Auth y Pagos
└── agent-services/           # Microservicio autónomo de agentes en Python
    ├── Dockerfile            # Configuración de contenedor para producción
    ├── requirements.txt      # Dependencias (FastAPI, Google ADK, Pydantic, uvicorn)
    ├── main.py               # Servidor FastAPI y endpoints de entrada
    ├── config.py             # Variables de entorno y llaves securizadas
    ├── core/                 # Loop agéntico base y utilidades compartidas
    ├── agents/               # Definición de la jerarquía agéntica
    │   ├── root.py           # Orquestador Raíz (Clasificador de intención y presupuesto)
    │   ├── supervisors/      # Managers de equipo (ej. Nutrición, Evaluación Técnica)
    │   └── specialists/      # Workers orientados a tareas específicas (ej. Calculador, CVs)
    ├── tools/                # Conectores de herramientas y servidores MCP
    │   ├── mcp_servers/      # Clientes/Servidores MCP (Calendar, DB, Búsqueda)
    │   └── custom_tools.py   # Funciones python etiquetadas con esquemas estrictos
    ├── memory/               # Context Engineering (Sesiones, Vector DB y Memory Bank)
    ├── protocols/            # Definiciones de Agent Cards y endpoints A2A
    └── evals/                # Dataset 'Golden Set' y evaluadores de trayectoria
```

---

## 2. Anatomía del Agente y Patrón Jerárquico de 3 Niveles

### Los Tres Componentes Fundamentales de un Agente

Todo agente de IA se compone de tres elementos interconectados que determinan su capacidad operativa:

*   **El Modelo (El "Cerebro"):** El modelo de lenguaje fundamental que procesa contexto, evalúa opciones y toma decisiones. La selección del modelo condiciona la velocidad, costo y capacidad cognitiva del sistema.
*   **Las Herramientas (Las "Manos"):** Mecanismos que conectan el razonamiento del modelo con el mundo exterior para recuperar datos factuales (bases de datos, RAG) o ejecutar acciones (APIs, envíos, cálculos).
*   **La Capa de Orquestación (El "Sistema Nervioso"):** El motor que ejecuta el bucle `Think -> Act -> Observe`, gestiona la memoria, mantiene el estado conversacional y aplica técnicas de razonamiento estructurado (como ReAct, Chain-of-Thought o Plan-and-Solve).

### Estrategia de Enrutamiento de Modelos (Model Routing)

Para optimizar costos y latencia en producciones masivas, se recomienda adoptar una estrategia heterogénea de modelos según la complejidad del rol asignado dentro de la jerarquía:

| Nivel de Agente | Tipo de Modelo Recomendado | Ejemplos de Modelos | Función Principal |
| :--- | :--- | :--- | :--- |
| **Orquestador Raíz** | Modelo Frontier (Capacidad avanzada) | Gemini 3.2 Pro | Planificación estratégica, descomposición de metas complejas y enrutamiento inicial. |
| **Supervisores** | Modelo Intermedio | Gemini 3.2 Pro / Gemini 2.5 Flash | Coordinación de sub-agentes, revisión de calidad de respuestas y síntesis. |
| **Especialistas (Workers)** | Modelo Rápido / Especializado | Gemini 2.5 Flash / Gemma 4 | Extracción de datos, clasificación, llamadas a herramientas específicas y formato estructurado. |

### Diseño de la Jerarquía Multi-Agente (3 Niveles)

Construir un agente único monolítico ("super-agente") degrada el rendimiento debido a la saturación de herramientas y la pérdida de atención en el contexto (*context rot*). El patrón recomendado organiza el ecosistema en una estructura de máximo tres niveles:

#### Nivel 1: Orquestador Raíz (Root Orchestrator)
El Orquestador Raíz actúa como el punto de entrada unificado al servicio agéntico. Recibe la misión global del usuario, autentica la petición, asigna un presupuesto máximo de tokens, pasos y tiempo para el subárbol, y clasifica la intención para derivarla al equipo adecuado. No ejecuta herramientas directas de bajo nivel; delega misiones a los Supervisores mediante contratos estructurados.

#### Nivel 2: Supervisores de Equipo (Managers)
Cada supervisor gobierna un área de dominio específica (por ejemplo, *Supervisor de Nutrición* o *Supervisor de Evaluación Técnica*). Recibe el objetivo del Orquestador Raíz, genera un plan de sub-tareas, invoca a sus agentes especialistas subordinados como herramientas (`AgentTool`), valida los resultados devueltos y consolida la respuesta final. Mantiene el control del contexto de su equipo y actúa como filtro de calidad. Si un worker falla, el supervisor decide si reintentar, reasignar o escalar la falla.

#### Nivel 3: Agentes Especialistas (Workers)
Agentes enfocados en un único rol acotado que puede describirse en una sola frase (por ejemplo, *Agente Calculador de Calorías*, *Agente Extractor de CVs* o *Agente de Agenda*). Cada especialista cuenta únicamente con 2 a 5 herramientas estrictas y genera salidas estructuradas validadas con esquemas Pydantic o Zod. Los especialistas no se comunican directamente entre sí sin pasar por su supervisor, evitando redes desordenadas y bucles infinitos.

---

## 3. Protocolos Estándar de Interoperabilidad: MCP y A2A

Para evitar integraciones personalizadas frágiles ($N \times M$ conexiones ad-hoc), la arquitectura debe basarse en dos estándares abiertos complementarios que operan en diferentes ejes de la comunicación:

### Eje Vertical: Model Context Protocol (MCP)

El protocolo MCP es la norma estándar para conectar un agente con sus fuentes de datos, APIs y herramientas locales o remotas:

*   **Componentes Principales:**
    *   **MCP Host:** La aplicación agéntica que coordina y ejecuta clientes MCP.
    *   **MCP Client:** Mantiene la conexión, emite comandos y gestiona el ciclo de vida de la comunicación con el servidor.
    *   **MCP Server:** Expone capacidades estandarizadas (Tools, Resources, Prompts) mediante interfaces descubribles.
*   **Transporte Recomendado:** `Streamable HTTP` (soporta streaming SSE y servidores sin estado, superando la especificación heredada de `stdio` o `HTTP+SSE`).
*   **Mitigación de Riesgos en MCP:**
    *   **Context Window Bloat:** Limitar las herramientas expuestas a cada agente mediante filtrado en un API Gateway o cargado dinámico (RAG-MCP).
    *   **Tool Shadowing:** Validar nombres y descripciones de herramientas para evitar que herramientas maliciosas suplanten herramientas legítimas.
    *   **Confused Deputy Problem:** El servidor MCP nunca debe asumir que la petición del agente es autorizada; debe validar la identidad original del usuario (*Agent Identity* / tokens de acceso).

### Eje Horizontal: Agent2Agent Protocol (A2A)

El protocolo A2A es el estándar abierto para la comunicación y delegación entre agentes independientes, incluso cuando están construidos en diferentes frameworks, lenguajes o infraestructuras en la nube:

*   **Agent Card (`.well-known/agent-card.json`):** Manifiesto público en formato JSON que declara la identidad del agente, su versión, descripción funcional, capacidades, esquemas de autenticación (OAuth 2.0) y endpoints disponibles.
*   **Ciclo de Vida de Tareas en A2A:** A diferencia de las llamadas transaccionales de MCP, A2A gestiona misiones de larga duración como "tareas" asíncronas con estados explícitos: `submitted`, `working`, `requires_input`, `completed`, `failed`.
*   **Interoperabilidad Framework-Agnostic:** Permite que un supervisor en Google ADK delegue tareas a un especialista implementado en LangGraph o PydanticAI mediante mensajes JSON estructurados sin acoplar esquemas internos de sesión.

---

## 4. Context Engineering: Gestión de Estado, Sesiones y Memoria

Debido a que los modelos de lenguaje no poseen estado persistente por naturaleza, construir un agente inteligente requiere ensamblar dinámicamente el payload del contexto en cada turno conversacional.

### El Ciclo de Vida del Context Engineering

Cada interacción agéntica sigue una secuencia continua estructurada en cuatro pasos:

1.  **Fetch Context (Sincrónico):** Recupera datos de sesión, recuerdos del usuario y documentos RAG relevantes.
2.  **Prepare Context (Hot-Path, Bloqueante):** Construye el prompt exacto unificando instrucciones del sistema, historial de sesión, herramientas disponibles y recuerdos.
3.  **Invoke LLM & Tools (Iterativo):** Ejecuta el bucle *Think -> Act -> Observe* acumulando resultados intermedios.
4.  **Upload Context (Asincrónico, Background):** Almacena el historial conversacional y desencadena el pipeline de extracción y consolidación de memoria en segundo plano sin bloquear la respuesta al usuario.

### Gestión de Sesiones y Compactación Conversacional

La sesión representa el registro cronológico completo de una conversación. Para evitar la degradación del modelo (*context rot*) y mantener latencias reducidas, se deben aplicar estrategias de compactación:

*   **Sliding Window (Ventana Deslizante):** Conserva solo las últimas $N$ interacciones.
*   **Truncamiento por Tokens:** Incluye mensajes recientes hasta alcanzar un límite estricto de tokens.
*   **Resúmenes Recursivos (Recursive Summarization):** Condensa las conversaciones antiguas mediante llamadas asíncronas a un modelo económico, sustituyendo transcripciones extensas por resúmenes estructurados.

### Memoria a Largo Plazo: El Pipeline ETL de Memoria

Mientras que RAG provee información fáctica externa y estática (hace al agente experto en el mundo), la **Memoria a Largo Plazo** almacena contexto dinámico del usuario (hace al agente experto en el usuario).

El sistema de gestión de memoria (*Memory Manager*) opera como un pipeline ETL autónomo:

*   **Extracción (Extract):** Identifica hechos, preferencias o entidades clave de las conversaciones recientes.
*   **Consolidación (Consolidate):** Compara nuevos recuerdos con la base de conocimiento existente para fusionar duplicados, actualizar datos obsoletos o eliminar contradicciones (*memory relevance decay*).
*   **Proveniencia y Confianza (Provenance):** Rastrea el origen de cada recuerdo (fecha, fuente) para asignar puntuaciones de confianza en tiempo de inferencia.

### Ejecución Durable y Human-in-the-Loop (HITL)

Para tareas que toman horas o días (por ejemplo, esperar la aprobación de un reclutador o la confirmación de una cita médica), el microservicio agéntico debe utilizar motores de ejecución durable (como Temporal, Inngest o el runtime de ejecuciones duraderas de la plataforma). Esto permite que el agente guarde su punto de control (*checkpoint*), libere recursos de cómputo y se reanude de forma idempotente al recibir un webhook o evento externo.

---

## 5. Empaquetado y Despliegue en Producción (Railway y Google Cloud Run)

Para poner en producción la carpeta `/agent-services`, empaquetamos el proyecto en un contenedor Docker ligero optimizado para Python.

### Dockerfile Recomendado (`agent-services/Dockerfile`)

```dockerfile
FROM python:3.12-slim

# Evitar escritura de bytecode y forzar stdout sin buffer para logs en tiempo real
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /lib/apt/lists/*

# Copiar e instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código fuente de los agentes
COPY . .

# Exponer el puerto por defecto de servicios web
EXPOSE 8080

# Iniciar servidor FastAPI con Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
```

### Despliegue en Railway

Railway representa una excelente opción para entornos de desarrollo y servicios en la nube con soporte continuo de procesos:

1.  Conecta tu repositorio de GitHub a Railway.
2.  Selecciona como carpeta raíz del servicio el directorio `/agent-services`.
3.  Configura las variables de entorno en la interfaz de Railway (`GEMINI_API_KEY`, `DATABASE_URL`, `LOG_LEVEL=INFO`).
4.  Railway detectará el `Dockerfile`, construirá la imagen y expondrá un puerto HTTP público con soporte nativo para Server-Sent Events (SSE) sin timeouts estrictos de serverless tradicional.

### Despliegue en Google Cloud Run

Google Cloud Run es el estándar empresarial para ejecutar microservicios agénticos en contenedores serverless:

1.  **Construcción y Registro de la Imagen:**
    ```bash
    gcloud builds submit --tag gcr.io/tu-proyecto-gcp/agent-services:v1 ./agent-services
    ```
2.  **Despliegue del Contenedor:**
    ```bash
    gcloud run deploy agent-services \
        --image gcr.io/tu-proyecto-gcp/agent-services:v1 \
        --platform managed \
        --region us-central1 \
        --allow-unauthenticated \
        --timeout=3600 \
        --concurrency=80 \
        --min-instances=0 \
        --max-instances=10 \
        --set-env-vars GEMINI_API_KEY=tu_key,ENVIRONMENT=production
    ```
3.  **Beneficios en Cloud Run:**
    *   **Scale-to-Zero:** Si no hay peticiones, el costo de cómputo es cero.
    *   **Timeout Extendido:** Soporta solicitudes de hasta 60 minutos para flujos de razonamiento complejos o streaming prolongado.
    *   **Integración Nativa con Cloud Trace y Cloud Logging:** Permite inspeccionar las trazas distribuidas OpenTelemetry de cada paso agéntico.

---

## 6. AgentOps, Observabilidad y Seguridad (OWASP & Quality Flywheel)

### Los Cuatro Pilares de la Calidad Agéntica

El rendimiento y fiabilidad de un sistema agéntico debe evaluarse a través de cuatro dimensiones complementarias:

1.  **Efectividad (Effectiveness):** Tasa de éxito en la consecución del objetivo del usuario (*Task Success Rate*).
2.  **Eficiencia (Efficiency):** Costo operativo por interacción, consumo de tokens y latencia total del flujo.
3.  **Robustez (Robustness):** Tolerancia a errores de API externas, manejo de respuestas inesperadas y recuperación ante fallos.
4.  **Seguridad y Alineación (Safety & Alignment):** Cumplimiento de barreras éticas, prevención de fugas de PII y resistencia a inyecciones de prompt.

### Jerarquía de Evaluación "Outside-In" y Evaluación de Trayectoria

Evaluar solo el resultado final (*Black Box*) es insuficiente. Para garantizar calidad, se debe evaluar la **trayectoria completa de razonamiento (*Glass Box*)**:

*   **Métricas Automáticas CI/CD (Primera Barrera):** Evaluación de esquemas JSON, tasa de coincidencia exacta de herramientas y pruebas de regresión en cada Pull Request.
*   **Evaluación de Trayectoria:** Inspección de la secuencia de pasos (*in-order match*, *any-order match*, precisión en la elección de herramientas).
*   **LLM-as-a-Judge:** Utilizar un modelo frontier calibrado con un dataset dorado (*Golden Set*) y rúbricas explícitas para puntuar tono, veracidad y completitud.
*   **Human-in-the-Loop (HITL):** Revisiones humanas periódicas sobre casos borde recopilados en producción para alimentar continuamente la suite de pruebas (*Agent Quality Flywheel*).

### Los Tres Pilares de la Observabilidad

Para diagnosticar y supervisar el comportamiento agéntico en tiempo real, el sistema debe instrumentarse con tres componentes de telemetría:

*   **Logs (El Diario del Agente):** Eventos atómicos estructurados en JSON que registran decisiones, llamadas a herramientas e intenciones pre y post ejecución.
*   **Traces (Las Huellas del Agente):** Construidos sobre estándares **OpenTelemetry**. Cada interacción genera un `Trace ID` único que vincula todos los sub-spans (`call_llm`, `execute_tool`, `a2a_delegation`), permitiendo visualizar el árbol causal de razonamiento.
*   **Metrics (El Reporte de Salud):** Agregaciones cuantitativas de latencia (P95/P99), costo acumulado por sesión, tasa de éxito por herramienta y frecuencia de errores.

### Marco de Seguridad y Guardrails (OWASP Top 10 for LLM)

El flujo de protección de datos e instrucciones debe implementarse mediante capas sucesivas de validación:

1.  **Entrada del Usuario:** Aplicación de guardrails de entrada para escaneo de inyecciones de prompt y redacción de información de identificación personal (PII).
2.  **Identidad del Agente:** Asignación de credenciales criptográficas únicas (basadas en SPIFFE) con autorización de mínimo privilegio.
3.  **Ejecución de Herramientas:** Validación determinista en el servidor y pausas obligatorias Human-in-the-Loop antes de ejecutar acciones de alto impacto (modificaciones de base de datos o transacciones).
4.  **Salida del Agente:** Filtro de guardrails de salida mediante Model Armor para verificar que la respuesta cumpla con políticas de contenido y esquemas de privacidad antes de enviarse al cliente.

---

## 7. Checklist y Secuencia Incremental de Implementación

A continuación se presenta el plan de acción estructurado para guiar el desarrollo paso a paso desde el prototipo inicial hasta el entorno de producción:

### Fase 1: El Agente Individual sin Framework
*   [ ] Escribir el loop agéntico ReAct básico en Python (`while step < max_steps`) gestionando manualmente la lista de mensajes `role` y `parts`.
*   [ ] Implementar 2 herramientas locales con validación Pydantic y documentación clara en sus docstrings.
*   [ ] Medir latencia, consumo de tokens y costo por ejecución.

### Fase 2: Protocolos y Microservicio
*   [ ] Estructurar la carpeta `/agent-services` e integrar el framework FastAPI.
*   [ ] Crear un servidor MCP sencillo (`Streamable HTTP`) para conectar la base de datos o herramientas externas.
*   [ ] Publicar la `Agent Card` (`.well-known/agent-card.json`) expuesta bajo el estándar A2A.

### Fase 3: Jerarquía y Context Engineering
*   [ ] Implementar la jerarquía de 3 niveles: Orquestador Raíz -> Supervisor de Equipo -> Workers Especialistas.
*   [ ] Configurar presupuestos explícitos de tokens y pasos por subárbol.
*   [ ] Configurar persistencia de sesiones en PostgreSQL y habilitar compactación por resumen recursivo.
*   [ ] Integrar el pipeline ETL de memoria en segundo plano.

### Fase 4: Contenerización y Despliegue
*   [ ] Crear el `Dockerfile` optimizado e probar la ejecución local mediante `docker run`.
*   [ ] Desplegar en Railway (para pruebas de desarrollo/prototipos) o en Google Cloud Run (para producción escalable).
*   [ ] Instrumentar trazabilidad OpenTelemetry para inspeccionar llamadas desde el panel de Cloud Trace / Langfuse.
*   [ ] Ejecutar el suite de pruebas en CI/CD antes de promover cambios a producción.
