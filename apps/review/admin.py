from django.contrib import admin
from .models import (
    TagPadronizada,
    Avaliacao,
    AvaliacaoTagPivot,
    ReacaoAvaliacao,
    ResumoIADocente,
    NuvemPalavras,
)


class AvaliacaoTagInline(admin.TabularInline):
    model = AvaliacaoTagPivot
    extra = 1


@admin.register(TagPadronizada)
class TagPadronizadaAdmin(admin.ModelAdmin):
    list_display = ("nome", "categoria")
    list_filter = ("categoria",)
    search_fields = ("nome",)


@admin.register(Avaliacao)
class AvaliacaoAdmin(admin.ModelAdmin):
    list_display = (
        "professor",
        "materia",
        "turma",
        "status_moderacao",
        "nota_didatica",
        "nota_dificuldade",
        "status_aprovacao",
        "criado_em",
    )
    list_filter = ("status_moderacao", "status_aprovacao", "materia__departamento")
    search_fields = ("professor__nome_completo", "materia__codigo_materia", "hash_anonimo", "comentario")
    inlines = [AvaliacaoTagInline]


@admin.register(ReacaoAvaliacao)
class ReacaoAvaliacaoAdmin(admin.ModelAdmin):
    list_display = ("avaliacao", "tipo_reacao", "hash_reator")
    list_filter = ("tipo_reacao",)
    search_fields = ("hash_reator", "avaliacao__professor__nome_completo")


@admin.register(ResumoIADocente)
class ResumoIADocenteAdmin(admin.ModelAdmin):
    list_display = ("professor", "selo_padge", "atualizado_em")
    search_fields = ("professor__nome_completo", "resumo_executivo")


@admin.register(NuvemPalavras)
class NuvemPalavrasAdmin(admin.ModelAdmin):
    list_display = ("professor", "palavra", "frequencia")
    list_filter = ("professor",)
    search_fields = ("professor__nome_completo", "palavra")
