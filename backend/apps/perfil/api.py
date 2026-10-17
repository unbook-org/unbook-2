from ninja import Router

router = Router()
perfil_router = router


@router.get("/health")
def health_check(request):
    return {"status": "ok", "module": "perfil"}
