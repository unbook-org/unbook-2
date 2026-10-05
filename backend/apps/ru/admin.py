from django.contrib import admin
from .models import CardapioRU, HorarioFuncionamentoRU


@admin.register(CardapioRU)
class CardapioRUAdmin(admin.ModelAdmin):
    list_display = ("campus", "data_refeicao", "turno", "prato_principal", "opcao_vegetariana_vegana")
    list_filter = ("campus", "turno", "data_refeicao")
    search_fields = ("prato_principal", "opcao_vegetariana_vegana", "guarnicao")


@admin.register(HorarioFuncionamentoRU)
class HorarioFuncionamentoRUAdmin(admin.ModelAdmin):
    list_display = ("campus", "turno", "dias_semana_texto", "horario_abertura", "horario_fechamento")
    list_filter = ("campus", "turno")
    search_fields = ("campus__sigla", "campus__nome")
