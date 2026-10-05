from ninja import Router

router = Router()
review_router = router


@router.get("/health")
def health_check(request):
    return {"status": "ok", "module": "review"}
