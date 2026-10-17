from django.apps import AppConfig


class CoreConfig(AppConfig):
    """App de infraestrutura compartilhada: log, exceções, paginação e banco."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "core"

    def ready(self):
        """Conecta os signals de log e a função UNACCENT do SQLite ao iniciar."""
        from apps.core import db, signals  # noqa: F401
