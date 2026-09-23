from django.contrib import admin
from .models import (
    Campus,
    Departamento,
    CursoGraduacao,
    Materia,
    RequisitoMateria,
    MatrizCurricular,
    Professor,
    Turma,
)


@admin.register(Campus)
class CampusAdmin(admin.ModelAdmin):
    list_display = ("sigla", "nome")
    search_fields = ("sigla", "nome")


@admin.register(Departamento)
class DepartamentoAdmin(admin.ModelAdmin):
    list_display = ("codigo", "nome", "campus")
    list_filter = ("campus",)
    search_fields = ("codigo", "nome")


@admin.register(CursoGraduacao)
class CursoGraduacaoAdmin(admin.ModelAdmin):
    list_display = ("codigo", "nome", "departamento")
    list_filter = ("departamento__campus", "departamento")
    search_fields = ("codigo", "nome")


@admin.register(Materia)
class MateriaAdmin(admin.ModelAdmin):
    list_display = ("codigo_materia", "nome", "departamento", "creditos", "carga_horaria")
    list_filter = ("departamento__campus", "departamento")
    search_fields = ("codigo_materia", "nome", "slug")
    prepopulated_fields = {"slug": ("nome",)}


@admin.register(RequisitoMateria)
class RequisitoMateriaAdmin(admin.ModelAdmin):
    list_display = ("materia", "materia_requisito", "tipo_relacao")
    list_filter = ("tipo_relacao",)
    search_fields = ("materia__codigo_materia", "materia_requisito__codigo_materia")


@admin.register(MatrizCurricular)
class MatrizCurricularAdmin(admin.ModelAdmin):
    list_display = ("curso", "materia", "semestre_ideal", "natureza")
    list_filter = ("natureza", "semestre_ideal", "curso")
    search_fields = ("curso__codigo", "materia__codigo_materia")


@admin.register(Professor)
class ProfessorAdmin(admin.ModelAdmin):
    list_display = ("nome_completo", "siape", "departamento", "titulo_academico", "email_institucional")
    list_filter = ("departamento__campus", "departamento")
    search_fields = ("nome_completo", "siape", "email_institucional")
    prepopulated_fields = {"slug": ("nome_completo",)}


@admin.register(Turma)
class TurmaAdmin(admin.ModelAdmin):
    list_display = ("materia", "codigo_turma", "professor", "semestre", "horario_bruto", "vagas_ofertadas", "vagas_ocupadas")
    list_filter = ("semestre", "materia__departamento")
    search_fields = ("materia__codigo_materia", "materia__nome", "codigo_turma", "professor__nome_completo")
