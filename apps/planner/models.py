import uuid
from django.db import models

class HorarioTurma(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    turma = models.ForeignKey(
        "catalog.Turma",
        on_delete=models.CASCADE,
        related_name="slots_horario"
    )
    dia_semana = models.PositiveSmallIntegerField(
        help_text="2=Segunda, 3=Terça, 4=Quarta, 5=Quinta, 6=Sexta, 7=Sábado"
    )
    turno = models.CharField(
        max_length=1,
        help_text="M=Manhã, T=Tarde, N=Noite"
    )
    slot_inicio = models.PositiveSmallIntegerField(help_text="Bloco inicial (1 a 6)")
    slot_fim = models.PositiveSmallIntegerField(help_text="Bloco final (1 a 6)")
    horario_inicio = models.TimeField()
    horario_fim = models.TimeField()

    class Meta:
        db_table = "horarios_turma"
        verbose_name = "Horário de Turma"
        verbose_name_plural = "Horários de Turmas"
        indexes = [
            models.Index(fields=["dia_semana", "turno", "slot_inicio", "slot_fim"]),
        ]

    def __str__(self):
        return f"{self.turma} | Dia {self.dia_semana} {self.turno}{self.slot_inicio}{self.slot_fim}"


class RascunhoGrade(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    perfil_estudante = models.ForeignKey(
        "perfil.PerfilEstudante",
        on_delete=models.CASCADE,
        related_name="rascunhos_grade"
    )
    semestre = models.CharField(max_length=10, db_index=True)  # Ex: 2026.1
    titulo = models.CharField(max_length=100, default="Minha Grade")
    esta_ativa = models.BooleanField(
        default=True,
        help_text="Indica se é a grade principal do semestre em exibição"
    )
    total_creditos_planejados = models.PositiveIntegerField(default=0)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "rascunhos_grade"
        verbose_name = "Rascunho de Grade"
        verbose_name_plural = "Rascunhos de Grade"

    def __str__(self):
        return f"{self.titulo} ({self.semestre}) - {self.perfil_estudante.apelido_anonimo}"


class ItemGrade(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    rascunho_grade = models.ForeignKey(
        RascunhoGrade,
        on_delete=models.CASCADE,
        related_name="itens"
    )
    turma = models.ForeignKey(
        "catalog.Turma",
        on_delete=models.CASCADE,
        related_name="grades_adicionadas"
    )
    cor_hex = models.CharField(max_length=7, default="#3B82F6")
    esta_travada = models.BooleanField(
        default=False,
        help_text="Trava o slot visualmente no grid contra alterações acidentais"
    )

    class Meta:
        db_table = "itens_grade"
        unique_together = ("rascunho_grade", "turma")
        verbose_name = "Item da Grade"
        verbose_name_plural = "Itens da Grade"

    def __str__(self):
        return f"{self.turma.materia.codigo_materia} na grade '{self.rascunho_grade.titulo}'"