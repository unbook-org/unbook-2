import hashlib
import hmac
import os


def generate_anonymous_hash(identifier: str, salt: str | None = None) -> str:
    """
    Gera um hash HMAC-SHA256 irreversível para garantir o anonimato
    de avaliações e reações de estudantes (Zero-Knowledge).
    """
    secret_salt = salt or os.getenv("ANONYMOUS_SALT", os.getenv("SECRET_KEY", "unbook-salt"))
    return hmac.new(
        secret_salt.encode("utf-8"),
        identifier.encode("utf-8"),
        hashlib.sha256
    ).hexdigest()
