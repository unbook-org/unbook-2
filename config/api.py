from ninja import NinjaAPI

from apps.catalog.api import router as catalog_router
from apps.core.exceptions import UnBookException
from apps.perfil.api import router as perfil_router
from apps.planner.api import router as planner_router
from apps.review.api import router as review_router
from apps.ru.api import router as ru_router
from apps.search.api import router as search_router

api = NinjaAPI(
    title="UnBook 2.0 API",
    version="2.0.0",
    description="Backend oficial do ecossistema acadêmico da UnB",
)

@api.exception_handler(UnBookException)
def unbook_exception_handler(request, exc: UnBookException):
    return api.create_response(
        request,
        {"error": exc.message, "status_code": exc.status_code},
        status=exc.status_code,
    )

api.add_router("/catalog", catalog_router, tags=["Catálogo & Matrizes Curriculares"])
api.add_router("/perfil", perfil_router, tags=["Perfil do Estudante & Gamificação"])
api.add_router("/planner", planner_router, tags=["Simulador de Grades & Horários"])
api.add_router("/reviews", review_router, tags=["Voz Anônima & Análise UnBook"])
api.add_router("/ru", ru_router, tags=["Restaurante Universitário"])
api.add_router("/search", search_router, tags=["Busca Instantânea"])