from ninja import Router
search_router = Router()

@search_router.get("/")
def funcao(request):
    return 0


@search_router.get(f"/query")
def query(request):
    return {"professor": "Cristiano"}