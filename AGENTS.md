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

## 🧱 2. Principios de Código Limpio y Arquitectura
1. **Límite de tamaño**: Archivos modulares, máximo ~150-200 líneas. Si una vista tiene tabs o modales, se extraen en componentes separados.
2. **Cero código espagueti**:
   - `src/types/`: Interfaces y modelos de dominio TypeScript bien tipados.
   - `src/services/`: Toda comunicación externa (Canvas API, LLMs, Storage, Excel).
   - `src/components/canvas/`: Componentes del sistema de diseño (Sidebar, Navbar, Card, Table, Badge, Button, Modal).
   - `src/components/modules/`: Componentes de cada rol/módulo (Admin, Docente, Alumno).
3. **No romper la consistencia visual**: Cualquier nueva pantalla DEBE reusar los mismos componentes base de `src/components/canvas/`.

---

## ⚡ 3. Flujo de Trabajo y Eficiencia de Comandos
1. **Validaciones pesadas (`npm run build`, etc.)**: Comandos pesados como `npm run build` o verificaciones globales de compilación se ejecutan **SOLO antes de hacer el push final** o cuando el usuario lo solicite de forma explícita. No deben ejecutarse durante el desarrollo iterativo para mantener la máxima velocidad y eficiencia.

