import uuid
from django.db import models


class Campus(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sigla = models.CharField(max_length=10, unique=True)  # DARCY, FGA, FCE, FAL
    nome = models.CharField(max_length=100)

    class Meta:
        db_table = "campi"
        verbose_name = "Campus"
        verbose_name_plural = "Campi"

    def __str__(self):
        return f"{self.sigla} - {self.nome}"


class Departamento(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    campus = models.ForeignKey(Campus, on_delete=models.CASCADE, related_name="departamentos")
    codigo = models.CharField(max_length=20, unique=True)  # CIC, MAT, IFD
    nome = models.CharField(max_length=150)

    class Meta:
        db_table = "departamentos"
        verbose_name = "Departamento"
        verbose_name_plural = "Departamentos"

    def __str__(self):
        return f"{self.codigo} - {self.nome}"


class CursoGraduacao(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    departamento = models.ForeignKey(Departamento, on_delete=models.CASCADE, related_name="cursos")
    codigo = models.CharField(max_length=20, unique=True)  # ENCSOFT, CC
    nome = models.CharField(max_length=150)
    total_creditos_obrigatorios = models.PositiveIntegerField(default=0)
    total_creditos_optativos = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "cursos_graduacao"
        verbose_name = "Curso de Graduação"
        verbose_name_plural = "Cursos de Graduação"

    def __str__(self):
        return f"{self.codigo} - {self.nome}"


class Materia(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    departamento = models.ForeignKey(Departamento, on_delete=models.CASCADE, related_name="materias")
    codigo_materia = models.CharField(max_length=20, unique=True, db_index=True)  # CIC0004
    nome = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    ementa = models.TextField(blank=True, null=True)
    creditos = models.PositiveIntegerField(default=4)
    carga_horaria = models.PositiveIntegerField(default=60)

    class Meta:
        db_table = "materias"
        verbose_name = "Matéria"
        verbose_name_plural = "Matérias"

    def __str__(self):
        return f"{self.codigo_materia} - {self.nome}"


class RequisitoMateria(models.Model):
    class TipoRelacao(models.TextChoices):
        PRE_REQUISITO = "pre_requisito", "Pré-Requisito"
        CO_REQUISITO = "co_requisito", "Co-Requisito"
        EQUIVALENCIA = "equivalencia", "Equivalência"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    materia = models.ForeignKey(Materia, on_delete=models.CASCADE, related_name="requisitos_origem")
    materia_requisito = models.ForeignKey(Materia, on_delete=models.CASCADE, related_name="requisitos_alvo")
    tipo_relacao = models.CharField(max_length=20, choices=TipoRelacao.choices, default=TipoRelacao.PRE_REQUISITO)

    class Meta:
        db_table = "requisitos_materia"
        unique_together = ("materia", "materia_requisito", "tipo_relacao")
        verbose_name = "Requisito de Matéria"
        verbose_name_plural = "Requisitos de Matérias"

    def __str__(self):
        return f"{self.materia.codigo_materia} -> {self.materia_requisito.codigo_materia} ({self.get_tipo_relacao_display()})"


class MatrizCurricular(models.Model):
    class NaturezaMateria(models.TextChoices):
        OBRIGATORIA = "obrigatoria", "Obrigatória"
        OPTATIVA = "optativa", "Optativa"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    curso = models.ForeignKey(CursoGraduacao, on_delete=models.CASCADE, related_name="matriz_curricular")
    materia = models.ForeignKey(Materia, on_delete=models.CASCADE, related_name="matrizes_curso")
    semestre_ideal = models.PositiveSmallIntegerField()  # 1 ao 10
    natureza = models.CharField(max_length=15, choices=NaturezaMateria.choices, default=NaturezaMateria.OBRIGATORIA)

    class Meta:
        db_table = "matrizes_curriculares"
        unique_together = ("curso", "materia")
        verbose_name = "Matriz Curricular"
        verbose_name_plural = "Matrizes Curriculares"

    def __str__(self):
        return f"{self.curso.codigo} - {self.materia.codigo_materia} ({self.semestre_ideal}º sem)"


class Professor(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    departamento = models.ForeignKey(Departamento, on_delete=models.SET_NULL, null=True, blank=True, related_name="professores")
    siape = models.CharField(max_length=20, unique=True, null=True, blank=True)
    nome_completo = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, db_index=True)
    email_institucional = models.EmailField(blank=True, null=True)
    url_foto = models.URLField(blank=True, null=True)
    titulo_academico = models.CharField(max_length=50, blank=True, null=True)
    url_lattes = models.URLField(blank=True, null=True)
    localizacao_gabinete = models.CharField(max_length=150, blank=True, null=True)

    class Meta:
        db_table = "professores"
        verbose_name = "Professor"
        verbose_name_plural = "Professores"

    def __str__(self):
        return self.nome_completo


class Turma(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    materia = models.ForeignKey(Materia, on_delete=models.CASCADE, related_name="turmas")
    professor = models.ForeignKey(Professor, on_delete=models.SET_NULL, null=True, blank=True, related_name="turmas")
    semestre = models.CharField(max_length=10, db_index=True)  # 2026.1
    codigo_turma = models.CharField(max_length=10)  # Turma A, 01
    horario_bruto = models.CharField(max_length=100)  # 24M12
    local_sala = models.CharField(max_length=150, blank=True, null=True)
    vagas_ofertadas = models.PositiveIntegerField(default=0)
    vagas_ocupadas = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "turmas"
        unique_together = ("materia", "semestre", "codigo_turma")
        verbose_name = "Turma"
        verbose_name_plural = "Turmas"

    def __str__(self):
        return f"{self.materia.codigo_materia} - Turma {self.codigo_turma} ({self.semestre})"