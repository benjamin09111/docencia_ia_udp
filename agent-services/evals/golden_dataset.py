"""
Golden Dataset para evaluación de trayectoria (Glass Box) y regresión CI/CD
según la Sección 6 de la Guía de Implementación de Agentes IA.
"""

GOLDEN_TEST_CASES = [
    {
        "id": "eval-001",
        "input_message": "Necesito diseñar una actividad corta para la ayudantía de Arquitectura de Software",
        "expected_node": "course:cit3203",
        "expected_worker": "activity_designer",
        "expected_tool": "generar_rubrica_institucional_tool",
        "quality_criteria": [
            "Debe incluir división temporal recomendada",
            "Debe sugerir bonificación en décimas formativas",
            "No debe exceder carga cognitiva de 45-60 min"
        ]
    },
    {
        "id": "eval-002",
        "input_message": "¿Cuántas décimas le puedo dar a un alumno que obtuvo 5.2 en el taller?",
        "expected_node": "course:cit3203",
        "expected_worker": "excel_engine",
        "expected_tool": "calcular_decimas_nota_tool",
        "quality_criteria": [
            "Debe respetar el tope de la política del curso (+0.6)",
            "La nota final no debe superar 7.0",
            "Debe recordar que la nota definitiva es validada por el docente"
        ]
    }
]
