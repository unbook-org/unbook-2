import functools
import hashlib
import hmac
import logging
import os

logger = logging.getLogger(__name__)


@functools.cache
def _avisar_salt_ausente():
    """Avisa, uma única vez por processo, que o hash está usando o salt padrão."""
    logger.warning(
        "ANONYMOUS_SALT não definido: o hash de anonimato está usando um salt padrão."
    )


def _resolver_salt(salt: str | None) -> str:
    """Usa o salt informado, depois ANONYMOUS_SALT e, em último caso, o salt padrão."""
    salt_escolhido = salt or os.getenv("ANONYMOUS_SALT")
    if salt_escolhido:
        return salt_escolhido
    _avisar_salt_ausente()
    return os.getenv("SECRET_KEY", "unbook-salt")


def generate_anonymous_hash(identifier: str, salt: str | None = None) -> str:
    """
    Gera um hash HMAC-SHA256 irreversível para garantir o anonimato
    de avaliações e reações de estudantes (Zero-Knowledge).
    """
    return hmac.new(
        _resolver_salt(salt).encode("utf-8"),
        identifier.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
