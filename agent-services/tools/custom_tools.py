from typing import Dict, Any, List
from pydantic import BaseModel, Field

class CalculateDecimasInput(BaseModel):
    nota_base: float = Field(..., description="Nota obtenida originalmente (1.0 a 7.0)")
    decimas_ganadas: float = Field(..., description="Décimas formativas acumuladas (ej: 0.4)")
    tope_maximo: float = Field(default=0.6, description="Tope reglamentario de décimas")

def calcular_decimas_nota_tool(nota_base: float, decimas_ganadas: float, tope_maximo: float = 0.6) -> Dict[str, Any]:
    """
    Herramienta determinista: Calcula la nota final con décimas asegurando tope reglamentario
    y que la nota no exceda 7.0.
    """
    decimas_aplicables = min(decimas_ganadas, tope_maximo)
    nota_con_decimas = min(round(nota_base + decimas_aplicables, 1), 7.0)
    return {
        "nota_original": nota_base,
        "decimas_aplicadas": decimas_aplicables,
        "decimas_descartadas": max(0.0, round(decimas_ganadas - decimas_aplicables, 2)),
        "nota_final": nota_con_decimas,
        "aprobado": nota_con_decimas >= 4.0
    }

def consultar_descriptor_asignatura_tool(codigo_curso: str) -> Dict[str, Any]:
    """
    Herramienta RAG/Descriptor: Consulta los objetivos y unidades vigentes del curso UDP.
    """
    catalogo = {
        "CIT3203": {
            "nombre": "Arquitectura de Software",
            "semestre": "6to Semestre",
            "creditos": 6,
            "unidades": [
                "Unidad 1: Atributos de calidad y escenarios tácticos (RTO, RPO, Latencia)",
                "Unidad 2: Patrones arquitectónicos (Microservicios, Hexagonal, Event-Driven)",
                "Unidad 3: Evaluación de arquitectura (Método ATAM y Trade-offs)"
            ],
            "asistencia_minima": "75% reglamentaria"
        }
    }
    return catalogo.get(codigo_curso.upper(), {
        "codigo": codigo_curso,
        "nombre": "Asignatura Registrada UDP",
        "unidades": ["Módulo General de Cátedra y Taller"],
        "asistencia_minima": "75%"
    })

def generar_rubrica_institucional_tool(titulo_actividad: str, escala_total: float = 100.0) -> Dict[str, Any]:
    """
    Herramienta de rúbricas: Genera la estructura oficial de 3 criterios con descriptores objetivos.
    """
    return {
        "titulo": titulo_actividad,
        "escala_total": escala_total,
        "criterios": [
            {
                "criterio": "Rigor Conceptual y Modelado",
                "ponderacion": 40.0,
                "descriptor_excelente": "Aplica conceptos con precisión, sin ambigüedad y justificando elecciones.",
                "descriptor_insuficiente": "Uso erróneo de términos o ausencia de modelo formal."
            },
            {
                "criterio": "Análisis de Restricciones y Trade-offs",
                "ponderacion": 35.0,
                "descriptor_excelente": "Identifica compromisos técnicos cuantitativos e impacto operacional.",
                "descriptor_insuficiente": "Propuesta ingenua sin considerar limitaciones de costo o red."
            },
            {
                "criterio": "Calidad del Entregable y Trazabilidad",
                "ponderacion": 25.0,
                "descriptor_excelente": "Claridad en diagramas, formato institucional y respuesta al feedback previo.",
                "descriptor_insuficiente": "Entrega desordenada o sin resolver observaciones anteriores."
            }
        ]
    }
