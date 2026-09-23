# 📋 Sistema de Asistencia Universitaria Inteligente (PassLink / AsistLink)

## 📌 1. Visión General del Proyecto
Este proyecto nace de una necesidad crítica y real en la docencia universitaria y de ayudantías:
**Pasar asistencia en una hoja de papel es ineficiente, susceptible a fraudes y genera una carga administrativa enorme** (tener que transcribir manualmente cada firma a una planilla de Excel al final de la semana o semestre).

El objetivo de este sistema es permitir el registro de asistencia mediante un **Link Inteligente y Temporal**, donde:
- El alumno entra, visualiza su perfil y marca su asistencia con **un solo toque**.
- Se garantiza que **solo los alumnos presentes físicamente en la sala puedan marcar**, impidiendo que se pasen el link a alumnos que están fuera o en sus casas.
- El profesor/ayudante no realiza trabajo manual posterior: los datos se consolidan y **se sincronizan automáticamente con el formato de la planilla Excel oficial del curso**.
- El sistema es modular, integrable con plataformas externas de evaluación y compatible con **Canvas LMS (Instructure)**.

---

## 🎯 2. Objetivos Principales
1. **Cero transcripción manual**: El profesor sube el Excel oficial al inicio y descarga el mismo Excel actualizado con todas las asistencias, porcentajes y fechas.
2. **Anti-Fraude Riguroso (Imposible marcar por otro)**:
   - Evitar que un alumno presente en la sala marque por un compañero ausente en el mismo teléfono.
   - Evitar que un alumno ausente marque desde su casa recibiendo el link por chat.
3. **Mínimo esfuerzo del docente**: La única validación que realiza el profesor es un **conteo rápido visual de cabezas** comparado con el contador en tiempo real de su panel.
4. **Soporte Híbrido**: Soporta clases presenciales y ayudantías online (Zoom/Teams/Meet).
5. **Métricas y Alertas**: Detección temprana de alumnos en riesgo de reprobación por inasistencia.

---

## 🛡️ 3. Modelo de Seguridad y Prevención de Fraude (Anti-Suplantación)

### El Problema de las Soluciones Tradicionales:
- **Hojas de papel**: Un alumno firma por su amigo que no vino.
- **Códigos QR estáticos**: Le toman foto al QR, lo mandan al grupo de WhatsApp y marcan desde la cama.
- **Google Forms**: Cualquiera con el link marca a cualquier hora y con múltiples cuentas en modo incógnito.

### La Solución: Mecanismo de Validación en Capas

```
┌─────────────────────────────────────────────────────────────┐
│                       ALUMNO ACCEDE                         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
            ┌────────────────────────────────────┐
            │   1. Autenticación y Dispositivo   │
            │   - 1 sesión fija por alumno       │
            │   - 1 dispositivo = 1 asistencia   │
            └──────────────────┬─────────────────┘
                               │
                               ▼
            ┌────────────────────────────────────┐
            │   2. Ventana Temporal Activa       │
            │   - Abierta solo en horario clase  │
            │   - Duración breve (ej: 5-10 min)  │
            └──────────────────┬─────────────────┘
                               │
                               ▼
            ┌────────────────────────────────────┐
            │   3. Validación Presencial         │
            │   - Geocerca GPS (HTML5 API)       │
            │   - Detección de cambio de cuenta  │
            └──────────────────┬─────────────────┘
                               │
                               ▼
            ┌────────────────────────────────────┐
            │   4. Panel Docente en Vivo         │
            │   - Contador en tiempo real        │
            │   - Comparación visual de cabezas  │
            │   - Detección de anomalías         │
            └────────────────────────────────────┘
```

#### Regla A: Vinculación Estricta de Dispositivo y Cuenta (Device-to-Student Binding)
- Los alumnos inician sesión una única vez al comienzo del semestre en su propio teléfono o notebook.
- **Detección de Cambio de Cuenta / Multicuentas sospechosas**:
  - Si durante el horario de clase un dispositivo cierra sesión y abre otra cuenta distinta para marcar, el sistema lo identifica como **comportamiento anómalo** y:
    1. Bloquea el segundo registro (Regla: *Un dispositivo físico no puede registrar más de una asistencia en la misma sesión*).
    2. Registra una bandera de advertencia en el panel del profesor: *"⚠️ Dispositivo X intentó alternar entre las cuentas de Juan y Pedro"*.

#### Regla B: Prevención de Marcaje Remoto (Desde la casa)
Para evitar que el alumno ausente marque desde su propio teléfono cuando un compañero le avisa que la asistencia está abierta:
- **Geocerca GPS por Navegador (Gratuita y Nativa)**: El navegador solicita permiso de ubicación solo al marcar. Si la distancia al campus o sala es superior a la tolerancia (ej: 150m), el botón se deshabilita con el mensaje: *"Debes encontrarte en la sala de clases para marcar asistencia"*.
- **Ventana de tiempo reducida (30% de la clase o ráfaga de 5-10 min)**: El profesor abre la sesión durante un momento dinámico de la clase, reduciendo la ventana de aviso por chat.

#### Regla C: Auditoría Visual Inmediata (Headcount Match)
- El panel del profesor muestra en pantalla gigante o en su teléfono:
  `24 alumnos presentes de 32 matriculados`.
- Si el profesor cuenta 20 personas en la sala y la pantalla dice 24, hay 4 inconsistencias.
- El panel lista los alumnos en orden cronológico con un botón rápido de un clic para **"Anular asistencia"** si se detecta que alguien no está presente.

---

## 👥 4. Experiencia de Usuario y Roles

### A. Rol Profesor / Ayudante
1. **Crear Curso y Cargar Nómina**:
   - Arrastra el archivo Excel oficial entregado por la universidad.
   - El sistema extrae automáticamente RUT, Nombre, Apellido y Correo.
2. **Gestión de la Sesión**:
   - Botón **"Iniciar Asistencia"** (con selector de duración: 5 min, 15 min, o hasta fin de bloque).
   - Vista en tiempo real (vía WebSockets) que actualiza la lista a medida que los estudiantes van marcando.
   - Posibilidad de marcar o desmarcar a un alumno manualmente ante cualquier eventualidad (ej. se le descargó el teléfono).
3. **Métricas y Análisis**:
   - Porcentaje global de asistencia del curso.
   - Listado de alumnos bajo el umbral mínimo (ej. < 75%).
4. **Exportar a Planilla Oficial**:
   - Descarga el Excel original con las columnas de fechas añadidas y fórmulas intactas.

### B. Rol Alumno
1. **Acceso al Enlace del Curso**:
   - El alumno accede a la URL fija del curso (ej: `asistencia.app/c/calculo-1`).
2. **Marcaje**:
   - Si la sesión no está activa: visualiza un contador con el próximo horario.
   - Si la sesión está activa: confirma su presencia con un botón central accesible.
   - La pantalla muestra confirmación inmediata con sello de tiempo.

---

## 💻 5. Arquitectura Técnica

- **Frontend**: Single Page Application / Progressive Web App (React / Next.js) optimizada para dispositivos móviles (responsive first).
- **Backend & Base de Datos**: PostgreSQL con soporte Realtime (Supabase / Node.js) para sincronización instantánea sin recarga de página.
- **Motor de Excel**: Librerías de manipulación de hojas de cálculo (`exceljs`) para leer y escribir sobre la plantilla original respetando cabeceras institucionales y formatos.
- **Seguridad**: JWT (JSON Web Tokens), `FingerprintJS` o identificador de hardware/navegador para device binding, geolocalización HTML5.

---

## 🔗 6. Integraciones Futuras

1. **Plataforma de Evaluaciones / Revisiones**:
   - Comunicación vía API o base de datos compartida usando el identificador único del estudiante (`RUT` o correo institucional).
   - Capacidad de restringir acceso a pruebas o entregas solo a estudiantes con asistencia validada en la sesión.
2. **Canvas LMS (Instructure)**:
   - Integración mediante estándar **LTI 1.3**.
   - Carga automática de la lista de alumnos desde Canvas API sin necesidad de subir archivos manuales.
   - Sincronización del estado de asistencia directamente al *Gradebook* de Canvas.
