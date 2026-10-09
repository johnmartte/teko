import json
import urllib.error
import urllib.request

from app.core.config import settings


REQUEST_TIMEOUT_SECONDS = 15


class ResendError(Exception):
    """Error devuelto por la API de Resend o fallo de comunicación con ella."""


def _request(method: str, path: str, payload: dict | None = None) -> dict:
    if not settings.RESEND_API_KEY:
        raise ResendError("RESEND_API_KEY no está configurada en el servidor")

    body = json.dumps(payload).encode("utf-8") if payload is not None else None

    request = urllib.request.Request(
        url=f"{settings.RESEND_API_URL.rstrip('/')}{path}",
        data=body,
        method=method,
        headers={
            "Authorization": f"Bearer {settings.RESEND_API_KEY}",
            "Content-Type": "application/json",
            # Cloudflare (delante de Resend) rechaza el User-Agent por defecto de urllib con el error 1010.
            "User-Agent": "teko-backend/1.0",
        },
    )

    try:
        with urllib.request.urlopen(request, timeout=REQUEST_TIMEOUT_SECONDS) as response:
            raw = response.read().decode("utf-8")
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")
        try:
            parsed = json.loads(detail)
            message = parsed.get("message") or parsed.get("error") or detail
        except json.JSONDecodeError:
            message = detail
        raise ResendError(f"Resend respondió {error.code}: {message}") from error
    except urllib.error.URLError as error:
        raise ResendError(f"No fue posible conectar con Resend: {error.reason}") from error

    return json.loads(raw) if raw else {}


def send_email(
    *,
    sender: str,
    to: list[str],
    subject: str,
    html: str | None = None,
    text: str | None = None,
    cc: list[str] | None = None,
    bcc: list[str] | None = None,
    reply_to: str | None = None,
    headers: dict[str, str] | None = None,
) -> dict:
    payload: dict = {"from": sender, "to": to, "subject": subject}

    if headers:
        payload["headers"] = headers

    if html:
        payload["html"] = html
    if text:
        payload["text"] = text
    if cc:
        payload["cc"] = cc
    if bcc:
        payload["bcc"] = bcc
    if reply_to:
        payload["reply_to"] = reply_to

    return _request("POST", "/emails", payload)


def get_received_email(email_id: str) -> dict:
    """Recupera el contenido completo de un correo entrante.

    El webhook `email.received` solo trae metadatos; el cuerpo se pide aparte.
    """
    return _request("GET", f"/emails/receiving/{email_id}")
