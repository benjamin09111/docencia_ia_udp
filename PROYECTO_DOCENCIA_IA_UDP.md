# 🎓 Ecosistema Docente Inteligente (Act-IA + PassLink) — UDP & Educación Superior
> **Documento Maestro de Visión, Filosofía, Arquitectura y Hoja de Ruta**  
> *Para agentes de desarrollo, investigadores, docentes y evaluadores institucionales.*

---

## 🌟 1. El Manifiesto y la Visión: ¿Hacia dónde apuntamos?

La educación superior en América Latina y el mundo enfrenta una encrucijada crítica: **el tiempo de los docentes y ayudantes se consume en burocracia administrativa en lugar de dedicarse a la mentoría y al aprendizaje real.**

### 🚨 La Realidad en las Aulas Universitarias:
1. **Los LMS (como Canvas) son repositorios estáticos**:
   Canvas es excelente para subir sílabos, publicar anuncios oficiales y almacenar archivos PDF, pero está desconectado de la vida viva del aula: ayudantías presenciales, talleres de resolución de problemas, entregas iterativas y dinámicas de interacción directa.
2. **Sobrecarga y desgaste del equipo docente**:
   Un profesor o ayudante a cargo de 40 a 100 estudiantes invierte hasta un **70% de su tiempo** en tareas manuales y repetitivas: pasar listas en papel, pasar notas a planillas Excel, responder las mismas dudas conceptuales decenas de veces, crear rúbricas desde cero y comparar manualmente versiones de avances para ver si los estudiantes aplicaron el feedback anterior.
3. **Disparidad e inconsistencia en las ayudantías**:
   En una misma facultad, distintos ayudantes enseñan y corrigen con criterios y niveles de rigor totalmente disparejos. No existe un estándar pedagógico unificado ni herramientas que apoyen a los ayudantes noveles a preparar controles o actividades de calidad previa a las solemnes.
4. **La "isla" del Excel vs. Canvas**:
   Al final del semestre, el docente enfrenta el caos de conciliar asistencias registradas en cuadernos, décimas acumuladas en correos sueltos y tareas de Canvas para consolidar la planilla oficial de notas de la universidad.

### 🎯 Nuestra Misión:
> **Democratizar la excelencia académica liberando al equipo docente de la fricción operativa mediante un ecosistema de agentes de IA especializados, transparentes y guiados por el profesor ("Human-in-the-Loop").**

No buscamos reemplazar al educador con una "IA mágica", sino **potenciarlo con un co-piloto experto que conoce el curso, sus cátedras, su pauta y su Excel oficial**, devolviéndole el tiempo para lo insustituible: **inspirar, acompañar y guiar humanamente a sus alumnos.**

---

## 🏛️ 2. Los Dos Pilares del Ecosistema

El proyecto integra dos soluciones interconectadas bajo una experiencia de usuario única:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ECOSISTEMA DOCENCIA IA (UDP / MULTI-U)                 │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
         ┌─────────────────────────────┴─────────────────────────────┐
         ▼                                                           ▼
┌──────────────────────────────────┐        ┌──────────────────────────────────┐
│      PILAR 1: ACT-IA             │        │    PILAR 2: PASSLINK / ASISTENCIA│
│ (Actividades, Rúbricas, Avances) │        │   (Control Presencial & Métricas)│
├──────────────────────────────────┤        ├──────────────────────────────────┤
│ • Agente "Mini-Yo" por Curso     │        │ • Marcaje con PIN dinámico / Geo │
│ • Comparador de Avances (V1→V2)  │        │ • Enlace público visual en vivo  │
│ • Generador de Rúbricas y Casos  │        │ • Acumulador auditado de Décimas │
│ • Pre-corrector con Citas a Pauta│        │ • Exportador de Excel oficial UDP│
│ • Sincronización oficial Canvas  │        │ • Alertas tempranas de reprobación│
└──────────────────────────────────┘        └──────────────────────────────────┘
```

---

## 🤖 3. Modelo de Agentes: Jerarquía Multi-Nivel (Multi-Tier Agent System)

A diferencia de un chatbot genérico (como ChatGPT), nuestro sistema implementa una **red jerárquica de agentes con memoria contextual, roles estrictos y salvaguardas pedagógicas**:

```
                               ┌──────────────────────────────────────────────┐
                               │         NIVEL 1: AGENTE FACULTAD / CREA      │
                               │      (Gobernanza Ética y Políticas UDP)      │
                               └──────────────────────┬───────────────────────┘
                                                      │ Hereda límites y ética institucional
                                                      ▼
                               ┌──────────────────────────────────────────────┐
                               │          NIVEL 2: AGENTE POR CURSO           │
                               │          ("El Mini-Yo del Profesor")         │
                               │  - Ingesta de Syllabus, Clases y Solemnes    │
                               │  - Perillas docentes: Rigor, Tono, Décimas   │
                               └──────────────────────┬───────────────────────┘
                                                      │ Coordina workers especializados
                      ┌───────────────────────────────┼───────────────────────────────┐
                      ▼                               ▼                               ▼
        ┌──────────────────────────┐    ┌──────────────────────────┐    ┌──────────────────────────┐
        │   WORKER: ACTIVIDADES    │    │    WORKER: EVALUADOR     │    │   WORKER: EXCEL ENGINE   │
        │     Y PREPARACIÓN        │    │    Y RETROALIMENTACIÓN   │    │     Y PONDERACIONES      │
        ├──────────────────────────┤    ├──────────────────────────┤    ├──────────────────────────┤
        │ - Diseña talleres y casos│    │ - Analiza entregas en PDF│    │ - Sincroniza fórmulas    │
        │ - Simula preguntas tipo  │    │ - Cita párrafos de pauta │    │ - Aplica décimas y topes │
        │ - Genera rúbrica analítica│   │ - Detecta omisión de     │    │ - Actualiza Canvas LMS y │
        │ - Valida ambigüedades    │    │   feedback anterior      │    │   la planilla .xlsx UDP  │
        └──────────────────────────┘    └──────────────────────────┘    └──────────────────────────┘
```

### 🎛️ Las "Perillas" de Personalización Docente
Cada profesor configura su curso en 2 minutos mediante parámetros sencillos:
- **`Nivel de Exigencia`**: `Laxo` (formativo inicial) | `Moderado` | `Estricto` | `Nivel Solemne`.
- **`Estilo Pedagógico`**: `Socrático` (guía al alumno con contrapreguntas) | `Directo` (identifica error y entrega ruta de corrección).
- **`Política de Décimas`**: Reglas transparentes (ej: máximo 3 décimas por taller, tope 6 décimas en Solemne 1).
- **`Contexto de Cátedra`**: Restringe la base de conocimientos a las semanas ya cursadas para evitar evaluar contenidos futuros.

### 🛡️ Human-in-the-Loop Obligatorio
El agente **NUNCA asigna una calificación final de forma autónoma**. El agente actúa como un ayudante de primera línea: prepara la tabla comparativa, cita las fuentes, sugiere la observación y pre-calcula el puntaje preliminar. El profesor o ayudante aprueba, ajusta o corrige con **1 clic**, quedando registrada la auditoría completa.

---

## 📊 4. Pilar de Asistencia y Gestión en Vivo (PassLink)

El seguimiento de asistencia y participación es un factor determinante en la retención estudiantil, pero su captura suele ser lenta e ineficiente. PassLink resuelve esto de punta a punta:

1. **Marcaje en 10 segundos**:
   - El ayudante proyecta un PIN dinámico en la pizarra o comparte el enlace seguro.
   - El estudiante ingresa con su RUT o correo institucional, validado contra la nómina oficial de Canvas.
   - Seguridad mediante geolocalización opcional y tokens temporales anti-suplantación.
2. **Visualización Pública en Tiempo Real para Estudiantes (`/asistencia/[cursoId]/visual`)**:
   - Transparencia total sin fricción: el alumno ingresa al link y puede consultar su asistencia sesión a sesión, sus décimas acumuladas y sus talleres realizados.
   - **Buscador inteligente instantáneo**: Tolera mayúsculas, tildes y formatos de RUT.
   - **Diseño Ultra-Wide sin scroll horizontal**: Adaptado para notebooks y pantallas de alta resolución, manteniendo un scroll vertical ergonómico para listas extensas de estudiantes.
3. **Cálculo Preciso a la Fecha**:
   - El sistema calcula los porcentajes de asistencia y cumplimiento considerando estrictamente las clases realizadas hasta el día de hoy, sin proyecciones confusas sobre meses futuros.
4. **Respeto a la Planilla Excel Oficial**:
   - El motor de exportación genera el `.xlsx` con el diseño exacto, cabeceras y fórmulas matriciales de la UDP, listo para ser entregado a la secretaría de estudios.

---

## 🎨 5. Sistema de Diseño: Identidad UDP + Canvas Instructure

El ecosistema adopta un **diseño formal CRM/LMS de alta densidad**, garantizando que cualquier pantalla parezca una extensión nativa del portal de la universidad:

| Token Visual | Valor Hex | Propósito |
| :--- | :--- | :--- |
| **Canvas Primary Dark** | `#2D3B45` | Cabeceras principales, barras de navegación institucional |
| **Canvas Darker** | `#1E272E` | Estados activos, separadores oscuros, badges de ayudantía |
| **Canvas Blue** | `#008EE2` | Acciones principales, botones primarios, enlaces activos |
| **UDP Red** | `#C8102E` | Identidad institucional, íconos de facultad, acentos oficiales |
| **Canvas Background** | `#F5F6F8` | Fondo neutro general, suave y limpio para lectura prolongada |
| **Superficies** | `#FFFFFF` | Tarjetas de información y tablas |
| **Bordes** | `#E0E3E6` / `#C7CDD1` | Líneas sutiles de 1px, estética limpia sin sombras pesadas |

---

## 💻 6. Arquitectura Técnica y Stack de Desarrollo

Para garantizar que el software pueda operar en producción en la UDP y escalarse a múltiples universidades (UCH, PUC, UAI, etc.), la arquitectura está **100% desacoplada**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CAPA DE EXPERIENCIA (FRONTEND)                         │
│  - Next.js 15 (App Router, Server Actions, TypeScript)                      │
│  - Tailwind CSS + Tokens Canvas Instructure                                 │
│  - Lucide Icons (Look sobrio y profesional)                                │
│  - Compatible con Iframe LTI 1.3 de Canvas e interfaz PWA móvil             │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                   CAPA DE SERVICIOS Y ORQUESTACIÓN                          │
│  - Canvas REST API Client (/api/canvas/* con caching en memoria y disco)    │
│  - Excel Generation Engine (OpenPyXL / ExcelJS)                             │
│  - Auth & Realtime Store (Supabase PostgreSQL + WebSockets + LocalStorage)  │
│  - AI Service Adapter (Integración a modelos LLM con RAG sobre PDFs)       │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                   CAPA DE PERSISTENCIA Y SEGURIDAD                          │
│  - Base de datos relacional PostgreSQL (Supabase)                           │
│  - Row Level Security (RLS) por Facultad, Curso y Sección                   │
│  - Almacenamiento seguro de evidencias y entregas                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🗺️ 7. Guía Rápida para Agentes de IA que Trabajen en este Repositorio

Si eres un agente de IA que continuará desarrollando funcionalidades en este repositorio, **debes respetar sin excepción los siguientes principios**:

1. **No inventes componentes estrafalarios**: Mantén la estética Canvas (`#2D3B45`, `#F5F6F8`, `#008EE2`, `#C8102E`). Reutiliza los estilos compactos y profesionales.
2. **Prioriza la compatibilidad con Canvas**: Toda la nómina de estudiantes, códigos de sección y datos provienen o deben sincronizarse con la API de Canvas.
3. **Todo cambio en vivo debe persistirse**: Los registros de asistencia, décimas y trabajos deben soportar sincronización instantánea con Supabase y respaldo local seguro en cliente.
4. **Respeta las variables de entorno**: Nunca hardcodees dominios ni URLs (`localhost:3000`). Utiliza siempre `NEXT_PUBLIC_APP_URL` y las funciones centralizadas de [`urlHelper.ts`](file:///c:/Users/Benjamin/Desktop/docencia_ia_udp/src/utils/urlHelper.ts).
5. **Human-in-the-Loop en IA**: Todo componente de corrección asistida por IA debe presentar al docente una propuesta editable y un botón explícito de confirmación antes de impactar el historial del alumno.

---

## 🚀 8. Impacto Esperado en la Educación Universitaria

| Dimensión | Estado Tradicional | Con el Ecosistema Docente IA |
| :--- | :--- | :--- |
| **Tiempo de Corrección** | 1 a 2 semanas por entrega | **Pre-revisión en minutos**, docente enfocado en retroalimentación cualitativa |
| **Equidad en Evaluación** | Criterios dispares según el ayudante asignado | **Misma pauta y rigor algorítmico auditado** para el 100% de los estudiantes |
| **Trazabilidad de Feedback** | El estudiante olvida el feedback de la entrega anterior | **El agente detecta si los errores previos fueron o no subsanados** |
| **Asistencia y Décimas** | Anotaciones sueltas en papel o correos | **Panel visual en tiempo real para el estudiante y Excel consolidado automático** |
| **Preparación de Solemnes** | Ejercicios improvisados la noche anterior | **Banco de actividades estándar calibradas con los objetivos de aprendizaje** |

---
*Desarrollado en la Escuela de Informática y Telecomunicaciones — Universidad Diego Portales (UDP).*  
*Líder de Proyecto: Benjamín Morales Pizarro.*
