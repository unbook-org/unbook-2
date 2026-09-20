from ninja import NinjaAPI
from apps.search.routes import search_router
from apps.portal.routes import portal_router
from apps.ru.routes import ru_router
from apps.catalog.routes import catalog_router
from apps.planner.routes import planner_router

api = NinjaAPI(
    title="UnBook 2.0 - Core API",
    version="1.0.0",
    description="API Gateway Unificado do UnBook com Django Ninja"
)


api.add_router("//", portal_router, tags=["LandingPage"])
api.add_router("/ru/", ru_router, tags=["Cardapio"])
api.add_router("/catalog/", catalog_router, tags=["Catalogo"])
api.add_router("/search/", search_router, tags=["Busca"])
api.add_router("/planner/", planner_router, tags=["Grade"])