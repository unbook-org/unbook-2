import io
from django.core.management import call_command
from ninja import Router

from .schemas import SigaaSyncRequest, SigaaSyncResponse

router = Router()
catalog_router = router


@router.get("/health")
def health_check(request):
    return {"status": "ok", "module": "catalog"}


@router.post(
    "/sync-sigaa",
    response=SigaaSyncResponse,
    summary="Dispara a ingestão dos dados processados do SIGAA no banco",
)
def sync_sigaa(request, payload: SigaaSyncRequest):
    """
    Executa a carga e ingestão dos dados do SIGAA (Campi, Departamentos, Professores, Matérias e Turmas).
    Suporta simulação via dry_run e limitação de registros para testes.
    """
    buffer = io.StringIO()
    kwargs = {
        "semester": payload.semester,
        "dry_run": payload.dry_run,
        "skip_professors": payload.skip_professors,
        "skip_classes": payload.skip_classes,
        "stdout": buffer,
    }
    if payload.limit:
        kwargs["limit"] = payload.limit

    call_command("load_sigaa", **kwargs)

    return {
        "status": "success",
        "message": "Ingestão executada com sucesso.",
        "output": buffer.getvalue(),
    }