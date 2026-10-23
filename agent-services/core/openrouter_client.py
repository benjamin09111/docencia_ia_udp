import json
import logging
from typing import Dict, Any, List, Optional
import httpx
from config import settings

logger = logging.getLogger("openrouter_client")

class OpenRouterClient:
    """
    Cliente oficial y tipado para OpenRouter API v1 (Guía Maestra).
    Soporta Auto Router, Cost Tiers, Session Stickiness y Tool Calling.
    """
    def __init__(self):
        self.api_key = settings.openrouter_api_key
        self.base_url = settings.openrouter_base_url.rstrip("/")
        self.site_url = settings.openrouter_site_url
        self.site_name = settings.openrouter_site_name

    def is_configured(self) -> bool:
        return bool(self.api_key and len(self.api_key) > 5)

    def chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        tools: Optional[List[Dict[str, Any]]] = None,
        cost_tier: Optional[str] = None,
        session_id: Optional[str] = None,
        temperature: float = 0.2,
        max_tokens: int = 2000,
        response_format: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Ejecuta una petición síncrona a OpenRouter /chat/completions.
        """
        if not self.is_configured():
            return {
                "error": "OPENROUTER_API_KEY no configurada",
                "content": "",
                "model_used": "none",
                "usage": {"total_tokens": 0}
            }

        target_model = model or settings.default_openrouter_model
        payload: Dict[str, Any] = {
            "model": target_model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }

        if session_id:
            payload["session_id"] = session_id

        if cost_tier and "auto" in target_model:
            payload["plugins"] = [{"id": "auto-router", "cost_tier": cost_tier}]

        if tools:
            payload["tools"] = tools

        if response_format:
            payload["response_format"] = response_format

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "HTTP-Referer": self.site_url,
            "X-OpenRouter-Title": self.site_name,
            "Content-Type": "application/json",
        }

        try:
            with httpx.Client(timeout=30.0) as client:
                res = client.post(
                    f"{self.base_url}/chat/completions",
                    headers=headers,
                    json=payload
                )

            if res.status_code != 200:
                logger.error(f"Error OpenRouter {res.status_code}: {res.text}")
                return {
                    "error": f"HTTP {res.status_code}",
                    "details": res.text,
                    "content": "",
                    "model_used": target_model,
                    "usage": {"total_tokens": 0}
                }

            data = res.json()
            choice = data.get("choices", [{}])[0]
            message = choice.get("message", {})

            return {
                "content": message.get("content", ""),
                "tool_calls": message.get("tool_calls", []),
                "model_used": data.get("model", target_model),
                "usage": data.get("usage", {"total_tokens": 0}),
            }
        except Exception as e:
            logger.error(f"Falla de conexión con OpenRouter: {e}")
            return {
                "error": str(e),
                "content": "",
                "model_used": target_model,
                "usage": {"total_tokens": 0}
            }

openrouter_client = OpenRouterClient()
