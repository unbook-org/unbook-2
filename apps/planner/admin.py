from django.contrib import admin
from .models import HorarioTurma, RascunhoGrade, ItemGrade


@admin.register(HorarioTurma)
class HorarioTurmaAdmin(admin.ModelAdmin):
    list_display = ("turma", "dia_semana", "turno", "slot_inicio", "slot_fim", "horario_inicio", "horario_fim")
    list_filter = ("dia_semana", "turno")
    search_fields = ("turma__materia__codigo_materia", "turma__codigo_turma")


@admin.register(RascunhoGrade)
class RascunhoGradeAdmin(admin.ModelAdmin):
    list_display = ("titulo", "perfil_estudante", "semestre", "esta_ativa", "total_creditos_planejados", "atualizado_em")
    list_filter = ("semestre", "esta_ativa")
    search_fields = ("titulo", "perfil_estudante__apelido_anonimo")


@admin.register(ItemGrade)
class ItemGradeAdmin(admin.ModelAdmin):
    list_display = ("rascunho_grade", "turma", "cor_hex", "esta_travada")
    list_filter = ("esta_travada",)
    search_fields = ("rascunho_grade__titulo", "turma__materia__codigo_materia")
