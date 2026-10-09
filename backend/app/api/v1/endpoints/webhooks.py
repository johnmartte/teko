import json

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from starlette.concurrency import run_in_threadpool

from app.core.config import settings
from app.db.session import get_db
from app.security.webhooks import verify_resend_signature
from app.services import email_service

router = APIRouter(
    prefix="/webhooks",
    tags=["Webhooks"],
)


@router.post("/resend")
async def receive_resend_webhook(
    request: Request,
    db: Session = Depends(get_db),
):
    if not settings.RESEND_WEBHOOK_SECRET:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Falta configurar RESEND_WEBHOOK_SECRET en el servidor",
        )

    payload = await request.body()

    signature_is_valid = verify_resend_signature(
        payload=payload,
        secret=settings.RESEND_WEBHOOK_SECRET,
        svix_id=request.headers.get("svix-id"),
        svix_timestamp=request.headers.get("svix-timestamp"),
        svix_signature=request.headers.get("svix-signature"),
    )

    if not signature_is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Firma del webhook inválida",
        )

    try:
        event = json.loads(payload)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El cuerpo del webhook no es JSON válido",
        ) from None

    result = await run_in_threadpool(email_service.handle_webhook_event, db, event)

    return {"success": True, "result": result}
