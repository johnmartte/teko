import json
import urllib.error
import urllib.parse
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


def enabled() -> bool:
    """Con PLANNER_API_KEY el login y los accesos del CMS los decide el Planner (cuenta única)."""
    return bool(settings.PLANNER_API_KEY)


def _call(method: str, path: str, payload: dict | None = None) -> tuple[int, dict]:
    request = urllib.request.Request(
        url=f"{settings.PLANNER_API_URL.rstrip('/')}{path}",
        method=method,
        data=json.dumps(payload).encode("utf-8") if payload is not None else None,
        headers={
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-Service-Key": settings.PLANNER_API_KEY,
            "User-Agent": "teko-backend/1.0",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=REQUEST_TIMEOUT_SECONDS) as response:
            return response.status, json.loads(response.read().decode("utf-8") or "{}")
    except urllib.error.HTTPError as error:
        # 401/403/422 son respuestas válidas del Planner (credenciales o acceso).
        if error.code in (401, 403, 422):
            return error.code, {}
        raise PlannerError(f"El Planner respondió {error.code}") from error
    except (urllib.error.URLError, json.JSONDecodeError) as error:
        raise PlannerError("No fue posible conectar con el Planner") from error


def verify_login(email: str, password: str) -> tuple[str, dict]:
    """Devuelve ("ok", usuario) | ("invalid", {}) | ("forbidden", {})."""
    status, body = _call("POST", "/integrations/verify-login", {"email": email, "password": password, "system": "cms"})
    if status == 200:
        return "ok", body.get("data", {})
    return ("forbidden" if status == 403 else "invalid"), {}


def has_cms_access(email: str) -> bool:
    status, body = _call("GET", f"/integrations/access?email={urllib.parse.quote(email)}&system=cms")
    return status == 200 and bool(body.get("data", {}).get("allowed"))
