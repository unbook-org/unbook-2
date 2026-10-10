from django.contrib import admin
from .models import (
    PerfilEstudante,
    CarteiraUsuario,
    TransacaoToken,
    ListaMateriasAluno,
)


@admin.register(PerfilEstudante)
class PerfilEstudanteAdmin(admin.ModelAdmin):
    list_display = ("apelido_anonimo", "usuario_id", "curso", "semestre_ingresso", "ira_calculado", "creditos_integralizados")
    list_filter = ("curso", "semestre_ingresso")
    search_fields = ("apelido_anonimo", "usuario_id")


@admin.register(CarteiraUsuario)
class CarteiraUsuarioAdmin(admin.ModelAdmin):
    list_display = ("usuario_id", "tokens_simulacao", "bonus_calouro_resgatado", "atualizado_em")
    list_filter = ("bonus_calouro_resgatado",)
    search_fields = ("usuario_id",)


@admin.register(TransacaoToken)
class TransacaoTokenAdmin(admin.ModelAdmin):
    list_display = ("carteira", "quantidade", "operacao", "descricao", "criada_em")
    list_filter = ("operacao", "criada_em")
    search_fields = ("carteira__usuario_id", "descricao")


@admin.register(ListaMateriasAluno)
class ListaMateriasAlunoAdmin(admin.ModelAdmin):
    list_display = ("perfil_estudante", "materia", "status", "mencao_obtida", "criado_em")
    list_filter = ("status", "mencao_obtida")
    search_fields = ("perfil_estudante__apelido_anonimo", "materia__codigo_materia")
