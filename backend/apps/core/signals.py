import logging
from pathlib import Path

from django.contrib.auth.signals import (
    user_logged_in,
    user_logged_out,
    user_login_failed,
)
from django.db.models.signals import post_delete, post_save, pre_save
from django.dispatch import receiver

from apps.core.log import APPS_SENSIVEIS, EXTRA_OCULTAR_USUARIO

logger = logging.getLogger(__name__)

PASTA_APPS = Path(__file__).resolve().parent.parent
TAMANHO_MAXIMO_VALOR = 80
ATRIBUTO_VALORES_ANTERIORES = "_valores_antes_de_salvar"


def _pertence_aos_apps(sender) -> bool:
    """Indica se o model é de um app do projeto (pasta apps/), e não interno do Django."""
    app_config = sender._meta.app_config
    return app_config is not None and Path(app_config.path).parent == PASTA_APPS


def _sensivel(sender) -> bool:
    """Indica se o model guarda dados anônimos de estudantes (perfil e review)."""
    return sender._meta.app_label in APPS_SENSIVEIS


def _extra_log(sender) -> dict | None:
    """Pede ao log para ocultar o usuário quando o model é sensível."""
    return EXTRA_OCULTAR_USUARIO if _sensivel(sender) else None


def _nomes_dos_campos(sender) -> list[str]:
    """Lista as colunas do model (com sufixo _id nas chaves estrangeiras)."""
    return [campo.attname for campo in sender._meta.concrete_fields]


def _identificar(sender, instance) -> str:
    """Descreve o registro pelo nome legível; em apps sensíveis, mostra só o id."""
    if _sensivel(sender):
        return f"(id={instance.pk})"
    try:
        return f"{instance} (id={instance.pk})"
    except Exception:  # noqa: BLE001
        return f"(id={instance.pk})"


def _formatar_valor(valor) -> str:
    """Mostra o valor como repr, cortado para não estourar a linha do log."""
    texto = repr(valor)
    if len(texto) > TAMANHO_MAXIMO_VALOR:
        return texto[: TAMANHO_MAXIMO_VALOR - 3] + "..."
    return texto


def _campos_alterados(sender, anteriores: dict, instance) -> list[str]:
    """Compara os valores anteriores com os atuais e devolve os campos que mudaram."""
    return [
        campo
        for campo in _nomes_dos_campos(sender)
        if anteriores.get(campo) != getattr(instance, campo)
    ]


def _descrever_alteracoes(sender, anteriores: dict, instance) -> str:
    """Descreve as mudanças: antes → depois, ou só os nomes dos campos em apps sensíveis."""
    alterados = _campos_alterados(sender, anteriores, instance)
    if not alterados:
        return "sem alterações"
    if _sensivel(sender):
        return "campos alterados: " + ", ".join(alterados)
    return "; ".join(
        f"{campo}: {_formatar_valor(anteriores.get(campo))} → "
        f"{_formatar_valor(getattr(instance, campo))}"
        for campo in alterados
    )


def _registrar_criacao(sender, instance) -> None:
    """Registra no log a criação de um registro."""
    logger.info(
        "%s criado: %s",
        sender._meta.label,
        _identificar(sender, instance),
        extra=_extra_log(sender),
    )


def _registrar_atualizacao(sender, instance) -> None:
    """Registra no log a atualização de um registro com o que mudou."""
    anteriores = instance.__dict__.pop(ATRIBUTO_VALORES_ANTERIORES, None)
    alteracoes = (
        _descrever_alteracoes(sender, anteriores, instance)
        if anteriores is not None
        else "valores anteriores indisponíveis"
    )
    logger.info(
        "%s atualizado: %s | %s",
        sender._meta.label,
        _identificar(sender, instance),
        alteracoes,
        extra=_extra_log(sender),
    )


@receiver(pre_save, dispatch_uid="guardar_valores_anteriores")
def guardar_valores_anteriores(sender, instance, raw=False, **kwargs):
    """Antes de um update, guarda os valores do banco para o log comparar depois."""
    if (
        raw
        or instance._state.adding
        or not logger.isEnabledFor(logging.INFO)
        or not _pertence_aos_apps(sender)
    ):
        return
    anteriores = (
        sender._default_manager.filter(pk=instance.pk)
        .values(*_nomes_dos_campos(sender))
        .first()
    )
    setattr(instance, ATRIBUTO_VALORES_ANTERIORES, anteriores)


@receiver(post_save, dispatch_uid="log_registro_salvo")
def log_registro_salvo(sender, instance, created, raw=False, **kwargs):
    """Depois de salvar um model dos apps, registra a criação ou a atualização."""
    if raw or not _pertence_aos_apps(sender):
        return
    if created:
        _registrar_criacao(sender, instance)
    else:
        _registrar_atualizacao(sender, instance)


@receiver(post_delete, dispatch_uid="log_registro_removido")
def log_registro_removido(sender, instance, **kwargs):
    """Depois de remover um model dos apps, registra a remoção."""
    if not _pertence_aos_apps(sender):
        return
    logger.info(
        "%s removido: %s",
        sender._meta.label,
        _identificar(sender, instance),
        extra=_extra_log(sender),
    )


@receiver(user_logged_in, dispatch_uid="log_login")
def log_login(sender, request, user, **kwargs):
    """Registra login bem-sucedido."""
    logger.info("Login realizado: %s", user.get_username())


@receiver(user_logged_out, dispatch_uid="log_logout")
def log_logout(sender, request, user, **kwargs):
    """Registra logout."""
    logger.info("Logout realizado: %s", user.get_username() if user else "anônimo")


@receiver(user_login_failed, dispatch_uid="log_login_falhou")
def log_login_falhou(sender, credentials, request=None, **kwargs):
    """Registra falha de login só com o usuário digitado, nunca a senha."""
    logger.warning("Falha de login para usuário %r", credentials.get("username"))
