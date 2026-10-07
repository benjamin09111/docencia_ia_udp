from typing import Dict, List, Optional, Any
from core.models import AgentNode, AgentLevel, PedagogicalSettings, ExigencyLevel, PedagogicalStyle

class HierarchyTreeManager:
    """
    Administrador del Árbol Jerárquico de Agentes Docentes UDP.
    Permite herencia en cascada de políticas institucionales hacia facultades,
    carreras, cursos específicos y trabajadores especialistas.
    """
    def __init__(self):
        self._nodes: Dict[str, AgentNode] = {}
        self._initialize_default_tree()

    def _initialize_default_tree(self):
        # Nivel 1: Institucional
        self.register_node(AgentNode(
            id="institution:udp",
            name="Universidad Diego Portales - CREA & Vicerrectoría",
            level=AgentLevel.INSTITUTION,
            parent_id=None,
            description="Marco institucional de docencia, ética y estándares UDP.",
            directives=[
                "Cumplir con el Reglamento General de Docencia UDP (escala 1.0 a 7.0, 4.0 aprobatoria).",
                "Monitorear umbral de asistencia mínima del 75% para evitar causal RI (Reprobación por Inasistencia).",
                "Human-in-the-Loop irrestricto: La IA emite sugerencias formativas y retroalimentación preliminar; el docente o ayudante valida toda calificación definitiva.",
                "Fomentar evaluación auténtica y formativa mediante bonificación de décimas vinculadas al progreso."
            ]
        ))

        # Nivel 2: Facultad
        self.register_node(AgentNode(
            id="faculty:ingenieria",
            name="Facultad de Ingeniería y Ciencias UDP",
            level=AgentLevel.FACULTY,
            parent_id="institution:udp",
            description="Estándares de rigurosidad analítica y proyectos de ingeniería.",
            directives=[
                "Aplicar metodologías activas centradas en problemas complejos de ingeniería y proyectos capstone.",
                "Exigir modelado analítico riguroso, análisis de restricciones operacionales y métricas cuantitativas.",
                "Alinear actividades a criterios de acreditación de ingeniería (ABET)."
            ]
        ))

        # Nivel 3: Carrera / Escuela
        self.register_node(AgentNode(
            id="career:informatica",
            name="Escuela de Ingeniería Civil en Informática y Telecomunicaciones",
            level=AgentLevel.CAREER,
            parent_id="faculty:ingenieria",
            description="Buenas prácticas de ingeniería de software, arquitectura y sistemas.",
            directives=[
                "Promover estándares de Clean Architecture, Clean Code, patrones GoF y pruebas automatizadas.",
                "Exigir justificación explícita de trade-offs en diseño de sistemas (latencia vs consistencia, microservicios vs monolito).",
                "Validar uso de control de versiones Git, dockerización y especificaciones de interfaces robustas."
            ]
        ))

        # Nivel 4: Curso / Docente ("Mini-Yo del Profesor")
        self.register_node(AgentNode(
            id="course:cit3203",
            name="CIT3203 - Arquitectura de Software (Prof. Jorge Cruz / Ayudantía Benjamín)",
            level=AgentLevel.COURSE,
            parent_id="career:informatica",
            description="Asignatura de diseño y evaluación de atributos de calidad en sistemas distribuidos.",
            directives=[
                "Objetivo: Evaluar atributos de calidad (RTO, RPO, disponibilidad, escalabilidad) mediante escenarios tácticos.",
                "Ayudantías enfocadas en talleres prácticos preparatorios para Solemnes oficiales.",
                "Mantener trazabilidad estricta: comparar entregas progresivas con pautas anteriores y señalar feedback no abordado."
            ],
            default_settings=PedagogicalSettings(
                nivel_exigencia=ExigencyLevel.ESTRICTO,
                estilo_pedagogico=PedagogicalStyle.SOCRATICO,
                politica_decimas=0.6
            ),
            allowed_workers=["activity_designer", "submission_evaluator", "excel_engine"]
        ))

    def register_node(self, node: AgentNode):
        self._nodes[node.id] = node

    def get_node(self, node_id: str) -> Optional[AgentNode]:
        return self._nodes.get(node_id)

    def get_lineage(self, node_id: str) -> List[AgentNode]:
        """Recorre el árbol de abajo hacia arriba y retorna el linaje desde la Raíz."""
        lineage: List[AgentNode] = []
        current_id: Optional[str] = node_id

        while current_id and current_id in self._nodes:
            node = self._nodes[current_id]
            lineage.insert(0, node)
            current_id = node.parent_id

        return lineage

    def compile_system_prompt(
        self,
        node_id: str,
        custom_settings: Optional[PedagogicalSettings] = None,
        worker_role: Optional[str] = None
    ) -> str:
        """
        Compila el prompt del sistema heredando directivas de todos los ancestros
        para evitar desalineación pedagógica y 'context rot'.
        """
        lineage = self.get_lineage(node_id)
        if not lineage:
            # Fallback seguro
            lineage = [self._nodes["institution:udp"]]

        target_node = lineage[-1]
        settings = custom_settings or target_node.default_settings or PedagogicalSettings()

        prompt_lines = [
            f"=== ECOSISTEMA AGÉNTICO JERÁRQUICO UDP ===",
            f"Estás operando como agente activo en el nodo: [{target_node.name}].",
            f"Nivel en la jerarquía: {target_node.level.value.upper()}.",
            "",
            "--- DIRECTIVAS HEREDADAS (POLÍTICAS INSTITUCIONALES EN CASCADA) ---"
        ]

        for ancestor in lineage:
            prompt_lines.append(f"\n[Nivel {ancestor.level.value.upper()} - {ancestor.name}]:")
            for directive in ancestor.directives:
                prompt_lines.append(f"  • {directive}")

        prompt_lines.extend([
            "",
            "--- PERILLAS DOCENTES Y CONFIGURACIÓN PEDAGÓGICA ---",
            f"• Nivel de Exigencia: {settings.nivel_exigencia.value.upper()}",
            f"• Estilo Pedagógico: {settings.estilo_pedagogico.value.upper()}",
            f"• Política Máxima de Décimas: +{settings.politica_decimas} pts.",
        ])

        if worker_role:
            prompt_lines.extend([
                "",
                f"--- ESPECIALIZACIÓN DE TRABAJADOR: [{worker_role.upper()}] ---",
                "Tu ámbito de acción se restringe rigurosamente a este rol. No asumas tareas ajenas a tu función."
            ])

        return "\n".join(prompt_lines)

    def list_tree(self) -> List[Dict[str, Any]]:
        return [
            {
                "id": node.id,
                "name": node.name,
                "level": node.level.value,
                "parent_id": node.parent_id,
                "description": node.description,
                "allowed_workers": node.allowed_workers
            }
            for node in self._nodes.values()
        ]

hierarchy_manager = HierarchyTreeManager()
