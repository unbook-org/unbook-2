import logging
from contextvars import ContextVar

from django.utils.functional import SimpleLazyObject, empty

FORMATO_LOG = (
    "%(asctime)s %(levelname)s [%(name)s] "
    "[req=%(request_id)s user=%(usuario)s] %(message)s"
)
FORMATO_DATA = "%Y-%m-%d %H:%M:%S"
SEM_REQUISICAO = "-"
USUARIO_ANONIMO = "anônimo"
USUARIO_NAO_CARREGADO = "?"
USUARIO_OCULTO = "oculto"
APPS_SENSIVEIS = {"perfil", "review"}
EXTRA_OCULTAR_USUARIO = {"ocultar_usuario": True}

request_id_atual: ContextVar[str] = ContextVar("request_id", default=SEM_REQUISICAO)
requisicao_atual: ContextVar = ContextVar("requisicao", default=None)
ocultar_usuario_atual: ContextVar[bool] = ContextVar("ocultar_usuario", default=False)


def usuario_da_requisicao(requisicao) -> str:
    """Identifica o usuário para o log sem consultar o banco: nome, 'anônimo', '?' ou '-'."""
    if requisicao is None:
        return SEM_REQUISICAO
    usuario = getattr(requisicao, "user", None)
    if usuario is None:
        return USUARIO_ANONIMO
    if isinstance(usuario, SimpleLazyObject) and usuario._wrapped is empty:
        from django.conf import settings

        if settings.SESSION_COOKIE_NAME not in requisicao.COOKIES:
            return USUARIO_ANONIMO
        return USUARIO_NAO_CARREGADO
    if not usuario.is_authenticated:
        return USUARIO_ANONIMO
    return usuario.get_username()


class RequestContextFilter(logging.Filter):
    """Coloca o request_id e o usuário da requisição atual em cada linha de log."""

    def filter(self, record: logging.LogRecord) -> bool:
        """Preenche request_id e usuario no registro; o usuário sai 'oculto' se pedido."""
        record.request_id = request_id_atual.get()
        if ocultar_usuario_atual.get() or getattr(record, "ocultar_usuario", False):
            record.usuario = USUARIO_OCULTO
        else:
            record.usuario = usuario_da_requisicao(requisicao_atual.get())
        return True


def build_logging_config(nivel: str) -> dict:
    """Monta a configuração de LOGGING do Django: console, texto legível e o nível pedido."""
    return {
        "version": 1,
        "disable_existing_loggers": False,
        "filters": {
            "contexto": {"()": "apps.core.log.RequestContextFilter"},
        },
        "formatters": {
            "texto": {"format": FORMATO_LOG, "datefmt": FORMATO_DATA},
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "formatter": "texto",
                "filters": ["contexto"],
            },
        },
        "root": {"handlers": ["console"], "level": "WARNING"},
        "loggers": {
            "apps": {"handlers": ["console"], "level": nivel, "propagate": False},
            "config": {"handlers": ["console"], "level": nivel, "propagate": False},
            "django": {"handlers": ["console"], "level": "INFO", "propagate": False},
            "django.request": {"level": "ERROR"},
        },
    }
