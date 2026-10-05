import uuid
from django.db import models


class TagPadronizada(models.Model):
    class CategoriaTag(models.TextChoices):
        POSITIVA = "positiva", "Positiva"
        NEGATIVA = "negativa", "Negativa"
        NEUTRA = "neutra", "Neutra"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=60, unique=True)  # Ex: Cobra Presença, Prova Justa, Slides Ruins
    categoria = models.CharField(
        max_length=10,
        choices=CategoriaTag.choices,
        default=CategoriaTag.NEUTRA
    )

    class Meta:
        db_table = "tags_padronizadas"
        verbose_name = "Tag Padronizada"
        verbose_name_plural = "Tags Padronizadas"

    def __str__(self):
        return f"{self.nome} ({self.categoria})"


class Avaliacao(models.Model):
    class StatusModeracao(models.TextChoices):
        PUBLICADA = "publicada", "Publicada"
        EM_REVISAO = "em_revisao", "Em Revisão"
        DENUNCIADA = "denunciada", "Denunciada"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    materia = models.ForeignKey(
        "catalog.Materia",
        on_delete=models.CASCADE,
        related_name="avaliacoes"
    )
    professor = models.ForeignKey(
        "catalog.Professor",
        on_delete=models.CASCADE,
        related_name="avaliacoes"
    )
    turma = models.ForeignKey(
        "catalog.Turma",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="avaliacoes"
    )
    # Hash HMAC-SHA256 gerado no backend com salt secreto (garante Zero-Knowledge)
    hash_anonimo = models.CharField(max_length=64, db_index=True)
    nota_didatica = models.PositiveSmallIntegerField(help_text="Escala de 1 a 5")
    nota_dificuldade = models.PositiveSmallIntegerField(help_text="Escala de 1 a 5")
    mencao_obtida = models.CharField(max_length=5, blank=True, null=True)
    status_aprovacao = models.CharField(
        max_length=15,
        default="passei",
        help_text="passei | reprovei | tranquei"
    )
    emoji_vibe = models.CharField(max_length=10, default="😎")  # 🥱, 🤯, 😎, 😡, 🧐
    cobra_presenca = models.BooleanField(default=False)
    avaliacao_justa = models.BooleanField(default=True)
    possui_monitoria = models.BooleanField(default=False)
    comentario = models.TextField(blank=True, null=True)
    status_moderacao = models.CharField(
        max_length=15,
        choices=StatusModeracao.choices,
        default=StatusModeracao.PUBLICADA
    )
    tags = models.ManyToManyField(
        TagPadronizada,
        through="AvaliacaoTagPivot",
        related_name="avaliacoes"
    )
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "avaliacoes"
        unique_together = ("hash_anonimo", "materia", "professor")
        verbose_name = "Avaliação"
        verbose_name_plural = "Avaliações"

    def __str__(self):
        return f"Avaliação de {self.professor.nome_completo} em {self.materia.codigo_materia}"


class AvaliacaoTagPivot(models.Model):
    avaliacao = models.ForeignKey(Avaliacao, on_delete=models.CASCADE)
    tag = models.ForeignKey(TagPadronizada, on_delete=models.CASCADE)

    class Meta:
        db_table = "avaliacoes_tags_pivot"
        unique_together = ("avaliacao", "tag")

    def __str__(self):
        return f"{self.avaliacao_id} - {self.tag.nome}"


class ReacaoAvaliacao(models.Model):
    class TipoReacao(models.TextChoices):
        UPVOTE = "upvote", "Upvote"
        DOWNVOTE = "downvote", "Downvote"
        DENUNCIA = "denuncia", "Denúncia"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    avaliacao = models.ForeignKey(
        Avaliacao,
        on_delete=models.CASCADE,
        related_name="reacoes"
    )
    hash_reator = models.CharField(max_length=64, db_index=True)
    tipo_reacao = models.CharField(
        max_length=10,
        choices=TipoReacao.choices,
        default=TipoReacao.UPVOTE
    )

    class Meta:
        db_table = "reacoes_avaliacao"
        unique_together = ("avaliacao", "hash_reator")

    def __str__(self):
        return f"{self.tipo_reacao} em {self.avaliacao_id}"


class ResumoIADocente(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    professor = models.OneToOneField(
        "catalog.Professor",
        on_delete=models.CASCADE,
        related_name="resumo_ia"
    )
    resumo_executivo = models.TextField(help_text="Síntese de comentários gerada pelo modelo de IA")
    badges = models.JSONField(default=list, help_text="Ex: ['Provas Coerentes', 'Listas Valem Nota']")
    selo_padge = models.CharField(max_length=50, blank=True, null=True)  # Ex: PADGE: SONO, PADGE: PAU PURO
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "resumos_ia_docente"
        verbose_name = "Resumo de IA do Docente"
        verbose_name_plural = "Resumos de IA dos Docentes"

    def __str__(self):
        return f"Resumo IA: {self.professor.nome_completo}"


class NuvemPalavras(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    professor = models.ForeignKey(
        "catalog.Professor",
        on_delete=models.CASCADE,
        related_name="palavras_frequentes"
    )
    palavra = models.CharField(max_length=50)
    frequencia = models.PositiveIntegerField(default=1)

    class Meta:
        db_table = "nuvens_palavras"
        unique_together = ("professor", "palavra")
        verbose_name = "Nuvem de Palavras"
        verbose_name_plural = "Nuvens de Palavras"

    def __str__(self):
        return f"{self.palavra} ({self.frequencia}x) - {self.professor.nome_completo}"