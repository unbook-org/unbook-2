import unicodedata

from django.db.backends.signals import connection_created
from django.db.models import CharField, Func
from django.dispatch import receiver


def remover_acentos(texto: str | None) -> str | None:
    """Remove acentos e cedilha mantendo as letras base (ex.: 'Introdução' → 'Introducao')."""
    if texto is None:
        return None
    return "".join(
        caractere
        for caractere in unicodedata.normalize("NFKD", texto)
        if not unicodedata.combining(caractere)
    )


class SemAcento(Func):
    """Função de banco UNACCENT: tira os acentos de uma coluna ou valor dentro da query."""

    function = "UNACCENT"
    output_field = CharField()


@receiver(connection_created, dispatch_uid="registrar_unaccent_sqlite")
def registrar_unaccent_sqlite(sender, connection, **kwargs):
    """No SQLite, cria a função UNACCENT em Python para a busca funcionar como no Postgres."""
    if connection.vendor == "sqlite":
        connection.connection.create_function(
            "UNACCENT", 1, remover_acentos, deterministic=True
        )
