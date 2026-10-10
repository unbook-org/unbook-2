import uuid
from django.db import models


class PerfilEstudante(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # Relação 1:1 estrita com a tabela auth.users provida pelo Supabase
    usuario_id = models.UUIDField(unique=True, db_index=True)
    curso = models.ForeignKey(
        "catalog.CursoGraduacao",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="estudantes_matriculados"
    )
    apelido_anonimo = models.CharField(max_length=60)  # Ex: @CapivaraDoDarcy_84
    sticker_avatar = models.CharField(max_length=50, default="capivara_alfa")
    semestre_ingresso = models.CharField(max_length=10)  # Ex: 2024.1
    ira_calculado = models.DecimalField(max_digits=5, decimal_places=4, default=0.0)
    creditos_integralizados = models.PositiveIntegerField(default=0)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "perfis_estudante"
        verbose_name = "Perfil de Estudante"
        verbose_name_plural = "Perfis de Estudantes"

    def __str__(self):
        return f"{self.apelido_anonimo} ({self.semestre_ingresso})"


class CarteiraUsuario(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    usuario_id = models.UUIDField(unique=True, db_index=True)
    tokens_simulacao = models.PositiveIntegerField(default=10)
    bonus_calouro_resgatado = models.BooleanField(default=False)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "carteiras_usuario"
        verbose_name = "Carteira de Usuário"
        verbose_name_plural = "Carteiras de Usuários"

    def __str__(self):
        return f"Carteira {self.usuario_id} - Tokens: {self.tokens_simulacao}"


class TransacaoToken(models.Model):
    class OperacaoToken(models.TextChoices):
        CREDITO = "credito", "Crédito"
        DEBITO = "debito", "Débito"
        BONUS_CALOURO = "bonus_calouro", "Bônus de Calouro"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    carteira = models.ForeignKey(
        CarteiraUsuario,
        on_delete=models.CASCADE,
        related_name="transacoes"
    )
    quantidade = models.IntegerField()
    operacao = models.CharField(
        max_length=20,
        choices=OperacaoToken.choices,
        default=OperacaoToken.DEBITO
    )
    descricao = models.CharField(max_length=150, blank=True, null=True)
    criada_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "transacoes_tokens"
        verbose_name = "Transação de Token"
        verbose_name_plural = "Transações de Tokens"

    def __str__(self):
        return f"{self.operacao} ({self.quantidade}) - Carteira {self.carteira_id}"


class ListaMateriasAluno(models.Model):
    class StatusMateria(models.TextChoices):
        PLANEJADA = "planejada", "Planejada"
        CURSANDO = "cursando", "Cursando"
        CONCLUIDA = "concluida", "Concluída"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    perfil_estudante = models.ForeignKey(
        PerfilEstudante,
        on_delete=models.CASCADE,
        related_name="materias_salvas"
    )
    materia = models.ForeignKey(
        "catalog.Materia",
        on_delete=models.CASCADE,
        related_name="alunos_salvaram"
    )
    status = models.CharField(
        max_length=15,
        choices=StatusMateria.choices,
        default=StatusMateria.PLANEJADA
    )
    mencao_obtida = models.CharField(
        max_length=5,
        blank=True,
        null=True,
        help_text="Menção oficial: SS, MS, MM, MI, II, SR, TR"
    )
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "listas_materias_aluno"
        unique_together = ("perfil_estudante", "materia")
        verbose_name = "Matéria Salva pelo Aluno"
        verbose_name_plural = "Matérias Salvas pelos Alunos"

    def __str__(self):
        return f"{self.perfil_estudante.apelido_anonimo} - {self.materia.codigo_materia} ({self.status})"