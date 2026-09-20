from ninja import Router
portal_router = Router()

@portal_router.get("/")
def search_home(request):
    return print("Router")