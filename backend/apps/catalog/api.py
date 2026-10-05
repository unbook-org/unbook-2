from ninja import Router

router = Router()
catalog_router = router


@router.get("/health")
def health_check(request):
    return {"status": "ok", "module": "catalog"}