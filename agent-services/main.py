import secrets

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
import asyncio

from config import settings
from core.models import (
    AgentChatRequest,
    AgentChatResponse,
    SubmissionEvaluationRequest,
    SubmissionEvaluationResponse,
    ActivityDesignRequest,
    ActivityDesignResponse
)
from core.hierarchy import hierarchy_manager
from agents.root import root_agent
from agents.specialists.submission_evaluator import submission_evaluator_worker
from agents.specialists.activity_designer import activity_designer_worker
from protocols.agent_card import get_agent_card

app = FastAPI(
    title=settings.app_name,
    description="Microservicio agéntico jerárquico y desacoplado para docencia universitaria UDP",
    version="1.0.0"
)

# Configuración CORS permisiva en dev para Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.allowed_origins.split(",") if origin.strip()],
    allow_credentials=False,
    allow_methods=["POST"],
    allow_headers=["Content-Type", "X-Agent-Service-Key"],
)

def require_service_key(request: Request):
    """Evita que el microservicio sea invocado directamente desde Internet."""
    expected = settings.agent_service_api_key
    if not expected:
        raise HTTPException(status_code=503, detail="Servicio no disponible.")
    if not secrets.compare_digest(request.headers.get("X-Agent-Service-Key", ""), expected):
        raise HTTPException(status_code=401, detail="No autorizado.")

@app.get("/health")
def health_check():
    """Endpoint de monitoreo y liveness check para Railway y Cloud Run."""
    return {
        "status": "healthy",
        "service": settings.app_name,
        "environment": settings.environment,
    }

@app.get("/.well-known/agent-card.json")
def get_a2a_agent_card():
    """Descubrimiento de capacidades bajo el protocolo estándar A2A."""
    return get_agent_card()

@app.get("/api/v1/tree/hierarchy")
def get_hierarchy_tree(request: Request):
    """Retorna la estructura arbórea completa de agentes institucionalizados."""
    require_service_key(request)
    return {
        "tree": hierarchy_manager.list_tree(),
        "total_nodes": len(hierarchy_manager.list_tree())
    }

@app.post("/api/v1/agent/chat", response_model=AgentChatResponse)
def handle_agent_chat(request: AgentChatRequest, http_request: Request):
    """
    Punto de entrada principal para consultas agénticas jerárquicas.
    Resuelve el linaje del nodo en el árbol y compila las políticas institucionales.
    """
    require_service_key(http_request)
    try:
        response = root_agent.process_request(request)
        return response
    except Exception as e:
        # Sanitización de errores según Regla 12 de AGENTS.md
        return JSONResponse(
            status_code=500,
            content={"error": "No se pudo procesar la solicitud con el agente en este momento."}
        )

@app.post("/api/v1/agent/evaluate", response_model=SubmissionEvaluationResponse)
def handle_submission_evaluation(request: SubmissionEvaluationRequest, http_request: Request):
    """
    Endpoint especializado para corrección asistida y cálculo de décimas.
    """
    require_service_key(http_request)
    try:
        return submission_evaluator_worker.evaluate_submission(request)
    except Exception:
        return JSONResponse(
            status_code=500,
            content={"error": "Error interno al evaluar la entrega."}
        )

@app.post("/api/v1/agent/design-activity", response_model=ActivityDesignResponse)
def handle_activity_design(request: ActivityDesignRequest):
    """
    Agente 1: Diseñador de Actividades y Rúbricas (OpenRouter).
    Genera dinámicas de ayudantía, pauta de mediación y rúbrica sobre 100 puntos netos.
    """
    try:
        return activity_designer_worker.design_activity(request)
    except Exception:
        return JSONResponse(
            status_code=500,
            content={"error": "Error interno al diseñar la actividad con el Agente 1."}
        )

@app.post("/api/v1/agent/stream")
async def stream_agent_chat(request: AgentChatRequest, http_request: Request):
    """
    Streaming en tiempo real mediante Server-Sent Events (SSE).
    """
    require_service_key(http_request)

    async def event_generator():
        response = root_agent.process_request(request)
        chunks = response.reply.split(" ")
        for chunk in chunks:
            yield f"data: {chunk} \n\n"
            await asyncio.sleep(0.04)
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.host, port=settings.port, reload=True)
