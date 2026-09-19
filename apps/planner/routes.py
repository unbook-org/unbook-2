from ninja import Router

planner_router = Router()

@planner_router.get("/")
def funcao(request):
    return 0