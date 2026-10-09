import json
import urllib.error
import urllib.request

from app.core.config import settings

REQUEST_TIMEOUT_SECONDS = 10


class PlannerError(Exception):
    """Fallo al consultar el backend de TEKO Planner."""


def list_staff_users() -> list[dict]:
    if not settings.PLANNER_API_KEY:
        raise PlannerError("Falta configurar PLANNER_API_KEY en el servidor")

    request = urllib.request.Request(
        url=f"{settings.PLANNER_API_URL.rstrip('/')}/integrations/staff-users",
        method="GET",
        headers={
            "Accept": "application/json",
            "X-Service-Key": settings.PLANNER_API_KEY,
            "User-Agent": "teko-backend/1.0",
        },
    )

    try:
        with urllib.request.urlopen(request, timeout=REQUEST_TIMEOUT_SECONDS) as response:
            payload = json.loads(response.read().decode("utf-8") or "{}")
    except urllib.error.HTTPError as error:
        raise PlannerError(f"El Planner respondió {error.code}") from error
    except (urllib.error.URLError, json.JSONDecodeError) as error:
        raise PlannerError("No fue posible conectar con el Planner") from error

    users = payload.get("data", payload) if isinstance(payload, dict) else payload
    return users if isinstance(users, list) else []
