from ninja import Router
ru_router = Router()

@ru_router.get("/")
def ru_home(request):
    return {"status": "ok", "service": "ru"}