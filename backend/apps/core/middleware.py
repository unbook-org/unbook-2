import logging
import re
import time
import uuid

from django.utils.functional import SimpleLazyObject, empty

from apps.core.log import (
    ocultar_usuario_atual,
    request_id_atual,
    requisicao_atual,
)

logger = logging.getLogger(__name__)

HEADER_REQUEST_ID = "X-Request-ID"
PADRAO_REQUEST_ID = re.compile(r"^[\w-]{1,64}$")
ROTAS_SENSIVEIS = ("/api/reviews/", "/api/perfil/", "/admin/review/", "/admin/perfil/")


def _resolver_request_id(request) -> str:
    """Reaproveita o X-Request-ID recebido se for seguro; senão, gera um novo."""
    recebido = request.headers.get(HEADER_REQUEST_ID, "")
    if PADRAO_REQUEST_ID.match(recebido):
        return recebido
    return uuid.uuid4().hex[:12]


def _rota_sensivel(request) -> bool:
    """Indica se a rota é de perfil ou avaliação, onde o usuário não pode ir para o log."""
    return request.path.startswith(ROTAS_SENSIVEIS)


def _nivel_por_status(status_code: int) -> int:
    """Escolhe o nível do log pelo status: 5xx ERROR, 4xx WARNING, o resto INFO."""
    if status_code >= 500:
        return logging.ERROR
    if status_code >= 400:
        return logging.WARNING
    return logging.INFO


def _carregar_usuario(request) -> None:
    """Carrega o usuário da sessão uma única vez, sem deixar erro escapar para o log."""
    usuario = getattr(request, "user", None)
    if not isinstance(usuario, SimpleLazyObject) or usuario._wrapped is not empty:
        return
    try:
        usuario._setup()
    except Exception:  # noqa: BLE001
        logger.debug("Não foi possível identificar o usuário da requisição")


def _registrar_requisicao(request, response, duracao_ms: float) -> None:
    """Registra método, rota, status e duração da requisição."""
    _carregar_usuario(request)
    logger.log(
        _nivel_por_status(response.status_code),
        "%s %s -> %s (%.1f ms)",
        request.method,
        request.get_full_path(),
        response.status_code,
        duracao_ms,
    )


class RequestLogMiddleware:
    """Dá um request_id a cada requisição, expõe o contexto ao log e registra o resultado."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        """Processa a requisição com o contexto de log ativo e devolve o X-Request-ID."""
        request_id = _resolver_request_id(request)
        token_request_id = request_id_atual.set(request_id)
        token_requisicao = requisicao_atual.set(request)
        token_ocultar = ocultar_usuario_atual.set(_rota_sensivel(request))
        inicio = time.perf_counter()
        try:
            response = self.get_response(request)
            _registrar_requisicao(
                request, response, (time.perf_counter() - inicio) * 1000
            )
            response[HEADER_REQUEST_ID] = request_id
            return response
        finally:
            request_id_atual.reset(token_request_id)
            requisicao_atual.reset(token_requisicao)
            ocultar_usuario_atual.reset(token_ocultar)
