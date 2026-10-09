import base64
import binascii
import hashlib
import hmac
import time


SIGNATURE_TOLERANCE_SECONDS = 300


def verify_resend_signature(
    *,
    payload: bytes,
    secret: str,
    svix_id: str | None,
    svix_timestamp: str | None,
    svix_signature: str | None,
) -> bool:
    """Valida la firma de un webhook de Resend (esquema Svix).

    La firma es HMAC-SHA256 en base64 sobre "{id}.{timestamp}.{cuerpo crudo}".
    El cuerpo debe ser el original sin re-serializar, o la firma no coincide.
    """
    if not secret or not svix_id or not svix_timestamp or not svix_signature:
        return False

    try:
        timestamp = int(svix_timestamp)
    except ValueError:
        return False

    if abs(time.time() - timestamp) > SIGNATURE_TOLERANCE_SECONDS:
        return False

    try:
        key = base64.b64decode(secret.removeprefix("whsec_"))
    except (binascii.Error, ValueError):
        return False

    signed_content = f"{svix_id}.{svix_timestamp}.".encode() + payload
    expected = base64.b64encode(
        hmac.new(key, signed_content, hashlib.sha256).digest()
    ).decode()

    for entry in svix_signature.split():
        version, _, signature = entry.partition(",")
        if version == "v1" and hmac.compare_digest(signature, expected):
            return True

    return False
