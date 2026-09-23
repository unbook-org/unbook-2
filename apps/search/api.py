from ninja import Router

router = Router()
search_router = router


@router.get("/health")
def health_check(request):
    return {"status": "ok", "module": "search"}