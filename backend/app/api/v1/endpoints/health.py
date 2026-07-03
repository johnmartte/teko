from fastapi import APIRouter

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("")
def health_check():
    return {
        "success": True,
        "message": "TEKO API saludable, ESTA VIVAAAAAAAAAAAAAAAAAAAAAAAA",
    }