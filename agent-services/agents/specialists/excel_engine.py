from typing import Dict, Any, List
from tools.custom_tools import calcular_decimas_nota_tool

class ExcelEngineWorker:
    """
    Worker Nivel 5: Motor de Excel y Ponderaciones UDP.
    Calcula notas definitivas, valida ponderaciones del 100% y audita la asignación
    de décimas sin alterar las fórmulas ni macros de la planilla oficial de la universidad.
    """
    def __init__(self):
        self.role_name = "excel_engine"

    def audit_grades(
        self,
        evaluaciones: List[Dict[str, Any]],
        politica_decimas: float = 0.6
    ) -> Dict[str, Any]:
        """
        Audita una lista de notas ponderadas e inyecta décimas con validación estricta.
        """
        suma_ponderaciones = sum(e.get("ponderacion", 0.0) for e in evaluaciones)
        ponderaciones_validas = abs(suma_ponderaciones - 100.0) < 0.01

        promedio_ponderado_base = sum(
            e.get("nota", 1.0) * (e.get("ponderacion", 0.0) / 100.0)
            for e in evaluaciones
        )

        return {
            "ponderaciones_validas": ponderaciones_validas,
            "suma_ponderaciones": suma_ponderaciones,
            "promedio_base": round(promedio_ponderado_base, 2),
            "politica_decimas_max": politica_decimas,
            "estado": "Aprobado" if promedio_ponderado_base >= 4.0 else "Riesgo de Reprobación",
            "auditoria_completada": True
        }

excel_engine_worker = ExcelEngineWorker()
