from ninja import Router
portal_router = Router()

@portal_router.get("/")
def portal_home(request):
    return {"status": "ok", "service": "portal"}