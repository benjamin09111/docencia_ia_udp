import sys
import os

# Asegurar path de importación
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from evals.golden_dataset import GOLDEN_TEST_CASES
from evals.evaluators import trajectory_evaluator

def run_all_evaluations():
    """Ejecuta la suite completa de pruebas de trayectoria del Golden Set."""
    print("=" * 65)
    print("[EVAL] SUITE DE EVALUACION DE AGENTES UDP (GOLDEN DATASET RUNNER)")
    print("=" * 65)
    
    total = len(GOLDEN_TEST_CASES)
    passed_count = 0
    
    for case in GOLDEN_TEST_CASES:
        res = trajectory_evaluator.evaluate_test_case(case)
        status = "[PASS]" if res["passed"] else "[FAIL]"
        if res["passed"]:
            passed_count += 1
            
        print(f"{status} Test {res['test_id']}: Node Match={res['node_match']}, Tools={res['tools_executed']}")
        # Limpiar emojis o caracteres fuera de cp1252 para compatibilidad total en Windows
        snippet = res['reply_snippet'].encode('ascii', 'replace').decode('ascii')
        print(f"       Respuesta: {snippet}\n")
        
    print("-" * 65)
    print(f"Resultados finales: {passed_count}/{total} casos aprobados ({round(passed_count/total * 100, 1)}%)")
    print("=" * 65)
    return passed_count == total

if __name__ == "__main__":
    success = run_all_evaluations()
    sys.exit(0 if success else 1)
