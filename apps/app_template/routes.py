from ninja import Router

{{ app_name }}_router = Router()

@{{ app_name }}_router.get("/")
def funcao(request):
    return 0