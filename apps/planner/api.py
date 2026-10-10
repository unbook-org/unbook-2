from ninja import Router

router = Router()
planner_router = router


@router.get("/health")
def health_check(request):
    return {"status": "ok", "module": "planner"}