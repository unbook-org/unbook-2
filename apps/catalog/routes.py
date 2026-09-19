from ninja import Router

catalog_router = Router()

@catalog_router.get("/")
def funcao(request):
    return 0