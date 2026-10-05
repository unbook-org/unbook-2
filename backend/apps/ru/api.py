from ninja import Router

router = Router()
ru_router = router


@router.get("/health")
def health_check(request):
    return {"status": "ok", "module": "ru"}