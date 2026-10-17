import uuid
from django.db import models


class CardapioRU(models.Model):
    class TurnoRefeicao(models.TextChoices):
        ALMOCO = "almoco", "Almoço"
        JANTAR = "jantar", "Jantar"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    campus = models.ForeignKey(
        "catalog.Campus",
        on_delete=models.CASCADE,
        related_name="cardapios_ru"
    )
    data_refeicao = models.DateField(db_index=True)
    turno = models.CharField(max_length=10, choices=TurnoRefeicao.choices)
    prato_principal = models.CharField(max_length=200)
    opcao_vegetariana_vegana = models.CharField(max_length=200)
    guarnicao = models.CharField(max_length=200)
    salada = models.CharField(max_length=200)
    sobremesa = models.CharField(max_length=200)

    class Meta:
        db_table = "cardapios_ru"
        unique_together = ("campus", "data_refeicao", "turno")
        verbose_name = "Cardápio do RU"
        verbose_name_plural = "Cardápios do RU"

    def __str__(self):
        return f"{self.campus.sigla} - {self.data_refeicao} ({self.get_turno_display()})"


class HorarioFuncionamentoRU(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    campus = models.ForeignKey(
        "catalog.Campus",
        on_delete=models.CASCADE,
        related_name="horarios_ru"
    )
    turno = models.CharField(max_length=10, choices=CardapioRU.TurnoRefeicao.choices)
    dias_semana_texto = models.CharField(max_length=60, default="Segunda a Sexta")
    horario_abertura = models.TimeField()
    horario_fechamento = models.TimeField()

    class Meta:
        db_table = "horarios_funcionamento_ru"
        verbose_name = "Horário de Funcionamento do RU"
        verbose_name_plural = "Horários de Funcionamento do RU"

    def __str__(self):
        return f"{self.campus.sigla} - {self.turno}: {self.horario_abertura} às {self.horario_fechamento}"