import uuid

from catalog.models import (
    Campus,
    Departamento,
    Materia,
    Professor,
    Turma,
)
from django.test import Client, SimpleTestCase, TestCase
from review.models import Avaliacao, ResumoIADocente

from apps.catalog.services import extrair_codigos_requisito


# ---------------------------------------------------------------------------
# Testes de Professores (Docentes)
# ---------------------------------------------------------------------------


class ProfessorListApiTestCase(TestCase):
    def setUp(self):
        self.client = Client()

        self.campus = Campus.objects.create(
            sigla="DARCY",
            nome="Campus Darcy Ribeiro",
        )
        self.dep_cic = Departamento.objects.create(
            campus=self.campus,
            codigo="CIC",
            nome="Departamento de Ciência da Computação",
        )
        self.dep_mat = Departamento.objects.create(
            campus=self.campus,
            codigo="MAT",
            nome="Departamento de Matemática",
        )

        self.prof_john = Professor.objects.create(
            departamento=self.dep_cic,
            siape="1111111",
            nome_completo="John Doe",
            slug="john-doe",
            email_institucional="john.doe@unb.br",
            titulo_academico="Doutor",
        )
        self.prof_jane = Professor.objects.create(
            departamento=self.dep_mat,
            siape="2222222",
            nome_completo="Jane Smith",
            slug="jane-smith",
            email_institucional="jane.smith@unb.br",
            titulo_academico="Mestre",
        )
        self.prof_alan = Professor.objects.create(
            departamento=self.dep_cic,
            siape="3333333",
            nome_completo="Alan Turing",
            slug="alan-turing",
            email_institucional="alan.turing@unb.br",
            titulo_academico="Doutor",
        )

        self.materia = Materia.objects.create(
            departamento=self.dep_cic,
            codigo_materia="CIC0004",
            nome="Algoritmos e Programação de Computadores",
            slug="algoritmos-e-programacao-de-computadores",
            creditos=6,
            carga_horaria=90,
        )

        self.turma = Turma.objects.create(
            materia=self.materia,
            professor=self.prof_john,
            semestre="2026.1",
            codigo_turma="01",
            horario_bruto="24M12",
            local_sala="PAT AT 01",
            vagas_ofertadas=40,
            vagas_ocupadas=38,
        )

        self.avaliacao = Avaliacao.objects.create(
            materia=self.materia,
            professor=self.prof_john,
            turma=self.turma,
            hash_anonimo="hash-teste-john-1234",
            nota_didatica=5,
            nota_dificuldade=3,
            cobra_presenca=True,
            avaliacao_justa=True,
            status_moderacao=Avaliacao.StatusModeracao.PUBLICADA,
        )

    def test_list_professores_success(self):
        """Verifica a listagem padrão com retorno padronizado e paginação."""
        response = self.client.get("/api/catalog/professores")
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertIn("items", data)
        self.assertIn("meta", data)

        meta = data["meta"]
        self.assertEqual(meta["page"], 1)
        self.assertEqual(meta["page_size"], 20)
        self.assertEqual(meta["total_items"], 3)
        self.assertEqual(meta["total_pages"], 1)

        items = data["items"]
        self.assertEqual(len(items), 3)

        # Verifica dados de um professor específico na lista
        john_item = next(item for item in items if item["slug"] == "john-doe")
        self.assertEqual(john_item["nome_completo"], "John Doe")
        self.assertEqual(john_item["departamento"]["codigo"], "CIC")
        self.assertEqual(john_item["total_turmas"], 1)
        self.assertEqual(john_item["total_avaliacoes"], 1)
        self.assertEqual(john_item["media_didatica"], 5.0)

    def test_list_professores_alias_professors(self):
        """Verifica se o alias /professors também funciona corretamente."""
        response = self.client.get("/api/catalog/professors")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["meta"]["total_items"], 3)

    def test_list_professores_filter_by_nome(self):
        """Filtra professores pelo nome."""
        response = self.client.get("/api/catalog/professores?nome=Jane")
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data["meta"]["total_items"], 1)
        self.assertEqual(data["items"][0]["nome_completo"], "Jane Smith")

    def test_list_professores_filter_by_departamento_codigo(self):
        """Filtra professores pela sigla/código do departamento."""
        response = self.client.get("/api/catalog/professores?departamento=CIC")
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data["meta"]["total_items"], 2)
        slugs = {item["slug"] for item in data["items"]}
        self.assertEqual(slugs, {"john-doe", "alan-turing"})

    def test_list_professores_filter_by_departamento_nome(self):
        """Filtra professores pelo nome por extenso do departamento."""
        response = self.client.get("/api/catalog/professores?departamento=Matemática")
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data["meta"]["total_items"], 1)
        self.assertEqual(data["items"][0]["slug"], "jane-smith")

    def test_list_professores_filter_by_busca_general(self):
        """Busca global por termo em nome ou departamento."""
        response = self.client.get("/api/catalog/professores?busca=turing")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["meta"]["total_items"], 1)
        self.assertEqual(data["items"][0]["slug"], "alan-turing")

        response_search = self.client.get("/api/catalog/professores?search=MAT")
        self.assertEqual(response_search.status_code, 200)
        self.assertEqual(response_search.json()["meta"]["total_items"], 1)

    def test_list_professores_pagination(self):
        """Verifica a correta fragmentação de páginas na paginação."""
        response_page1 = self.client.get("/api/catalog/professores?page=1&page_size=2")
        self.assertEqual(response_page1.status_code, 200)
        data_p1 = response_page1.json()
        self.assertEqual(data_p1["meta"]["total_items"], 3)
        self.assertEqual(data_p1["meta"]["total_pages"], 2)
        self.assertEqual(len(data_p1["items"]), 2)

        response_page2 = self.client.get("/api/catalog/professores?page=2&page_size=2")
        self.assertEqual(response_page2.status_code, 200)
        data_p2 = response_page2.json()
        self.assertEqual(data_p2["meta"]["page"], 2)
        self.assertEqual(len(data_p2["items"]), 1)


class ProfessorProfileApiTestCase(TestCase):
    def setUp(self):
        self.client = Client()

        self.campus = Campus.objects.create(
            sigla="DARCY",
            nome="Campus Darcy Ribeiro",
        )
        self.dep_cic = Departamento.objects.create(
            campus=self.campus,
            codigo="CIC",
            nome="Departamento de Ciência da Computação",
        )

        self.prof = Professor.objects.create(
            departamento=self.dep_cic,
            siape="9876543",
            nome_completo="Ada Lovelace",
            slug="ada-lovelace",
            email_institucional="ada@unb.br",
            url_foto="https://exemplo.unb.br/ada.jpg",
            titulo_academico="Doutora",
            url_lattes="http://lattes.cnpq.br/0000000000000000",
            localizacao_gabinete="CIC - Sala 10",
        )

        self.materia = Materia.objects.create(
            departamento=self.dep_cic,
            codigo_materia="CIC0001",
            nome="Estruturas de Dados",
            slug="estruturas-de-dados",
            creditos=4,
            carga_horaria=60,
        )

        self.turma = Turma.objects.create(
            materia=self.materia,
            professor=self.prof,
            semestre="2026.1",
            codigo_turma="A",
            horario_bruto="35T12",
            local_sala="PJC BT 02",
            vagas_ofertadas=35,
            vagas_ocupadas=30,
        )

        self.avaliacao1 = Avaliacao.objects.create(
            materia=self.materia,
            professor=self.prof,
            turma=self.turma,
            hash_anonimo="hash-ada-1",
            nota_didatica=5,
            nota_dificuldade=4,
            cobra_presenca=True,
            avaliacao_justa=True,
            status_moderacao=Avaliacao.StatusModeracao.PUBLICADA,
        )
        self.avaliacao2 = Avaliacao.objects.create(
            materia=self.materia,
            professor=self.prof,
            turma=self.turma,
            hash_anonimo="hash-ada-2",
            nota_didatica=4,
            nota_dificuldade=2,
            cobra_presenca=False,
            avaliacao_justa=True,
            status_moderacao=Avaliacao.StatusModeracao.PUBLICADA,
        )

        self.resumo_ia = ResumoIADocente.objects.create(
            professor=self.prof,
            resumo_executivo="Professora extremamente clara e didática, com foco prático.",
            badges=["Provas Coerentes", "Excelente Didática"],
            selo_padge="PADGE: PROVA JUSTA",
        )

    def test_get_professor_by_id_success(self):
        """Busca o perfil completo do professor por UUID."""
        response = self.client.get(f"/api/catalog/professores/{self.prof.id}")
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data["id"], str(self.prof.id))
        self.assertEqual(data["nome_completo"], "Ada Lovelace")
        self.assertEqual(data["slug"], "ada-lovelace")
        self.assertEqual(data["siape"], "9876543")
        self.assertEqual(data["email_institucional"], "ada@unb.br")
        self.assertEqual(data["titulo_academico"], "Doutora")
        self.assertEqual(data["localizacao_gabinete"], "CIC - Sala 10")

        # Departamento e Campus
        self.assertIsNotNone(data["departamento"])
        self.assertEqual(data["departamento"]["codigo"], "CIC")
        self.assertEqual(data["departamento"]["campus"]["sigla"], "DARCY")

        # Turmas vinculadas
        self.assertEqual(len(data["turmas"]), 1)
        turma = data["turmas"][0]
        self.assertEqual(turma["codigo_turma"], "A")
        self.assertEqual(turma["semestre"], "2026.1")
        self.assertEqual(turma["materia"]["codigo_materia"], "CIC0001")

        # Matérias distintas ministradas
        self.assertEqual(len(data["materias"]), 1)
        self.assertEqual(data["materias"][0]["codigo_materia"], "CIC0001")

        # Resumo de Didática
        didatica = data["resumo_didatica"]
        self.assertEqual(didatica["total_avaliacoes"], 2)
        self.assertEqual(didatica["media_didatica"], 4.5)
        self.assertEqual(didatica["media_dificuldade"], 3.0)
        self.assertEqual(didatica["cobra_presenca_percentual"], 50.0)
        self.assertEqual(didatica["avaliacao_justa_percentual"], 100.0)
        self.assertEqual(
            didatica["resumo_executivo"],
            "Professora extremamente clara e didática, com foco prático.",
        )
        self.assertIn("Provas Coerentes", didatica["badges"])
        self.assertEqual(didatica["selo_padge"], "PADGE: PROVA JUSTA")

        # Resumo IA
        self.assertIsNotNone(data["resumo_ia"])
        self.assertEqual(data["resumo_ia"]["selo_padge"], "PADGE: PROVA JUSTA")

    def test_get_professor_by_slug_success(self):
        """Busca o perfil completo do professor por slug."""
        response = self.client.get("/api/catalog/professores/ada-lovelace")
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data["id"], str(self.prof.id))
        self.assertEqual(data["nome_completo"], "Ada Lovelace")

    def test_get_professor_by_slug_alias_professors(self):
        """Verifica se o endpoint em inglês /professors/{identifier} também funciona."""
        response = self.client.get("/api/catalog/professors/ada-lovelace")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["slug"], "ada-lovelace")

    def test_get_professor_profile_not_found_uuid(self):
        """Retorna 404 padronizado ao buscar por UUID inexistente."""
        fake_uuid = uuid.uuid4()
        response = self.client.get(f"/api/catalog/professores/{fake_uuid}")
        self.assertEqual(response.status_code, 404)

        data = response.json()
        self.assertEqual(data["status_code"], 404)
        self.assertEqual(data["error"], "Professor não encontrado.")

    def test_get_professor_profile_not_found_slug(self):
        """Retorna 404 padronizado ao buscar por slug inexistente."""
        response = self.client.get("/api/catalog/professores/professor-inexistente")
        self.assertEqual(response.status_code, 404)

        data = response.json()
        self.assertEqual(data["status_code"], 404)
        self.assertEqual(data["error"], "Professor não encontrado.")

    def test_professor_without_department_or_turmas_or_reviews(self):
        """Cenário de sucesso para professor sem departamento, turmas ou avaliações cadastradas."""
        prof_novo = Professor.objects.create(
            nome_completo="Professor Sem Dados",
            slug="professor-sem-dados",
        )
        response = self.client.get(f"/api/catalog/professores/{prof_novo.slug}")
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data["nome_completo"], "Professor Sem Dados")
        self.assertIsNone(data["departamento"])
        self.assertEqual(data["turmas"], [])
        self.assertEqual(data["materias"], [])
        self.assertEqual(data["resumo_didatica"]["total_avaliacoes"], 0)
        self.assertIsNone(data["resumo_didatica"]["media_didatica"])
        self.assertIsNone(data["resumo_ia"])


# ---------------------------------------------------------------------------
# Testes de Matérias e Departamentos
# ---------------------------------------------------------------------------


def criar_materia(
    departamento: Departamento, codigo: str, nome: str, **campos
) -> Materia:
    return Materia.objects.create(
        departamento=departamento,
        codigo_materia=codigo,
        nome=nome,
        slug=f"{codigo.lower()}-{nome.lower().replace(' ', '-')}",
        **campos,
    )


class CatalogoBaseTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        campus = Campus.objects.create(sigla="DARCY", nome="Campus Darcy Ribeiro")
        self.departamento_mat = Departamento.objects.create(
            campus=campus, codigo="MAT", nome="Departamento de Matemática"
        )
        self.departamento_cic = Departamento.objects.create(
            campus=campus, codigo="CIC", nome="Departamento de Ciência da Computação"
        )


class ExtrairCodigosRequisitoTestCase(SimpleTestCase):
    def test_arvore_vazia_retorna_lista_vazia(self):
        self.assertEqual(extrair_codigos_requisito(None), [])
        self.assertEqual(extrair_codigos_requisito({}), [])

    def test_requisito_unico(self):
        arvore = {"materia_id": None, "codigo": "MAT0025"}
        self.assertEqual(extrair_codigos_requisito(arvore), ["MAT0025"])

    def test_arvore_aninhada_preserva_ordem_e_remove_duplicados(self):
        arvore = {
            "relação": "OR",
            "condicao": [
                {
                    "relação": "AND",
                    "condicao": [
                        {"materia_id": None, "codigo": "MAT0025"},
                        {"materia_id": None, "codigo": "CIC0004"},
                    ],
                },
                {
                    "relação": "AND",
                    "condicao": [
                        {"materia_id": None, "codigo": "MAT0031"},
                        {"materia_id": None, "codigo": "CIC0004"},
                    ],
                },
            ],
        }
        self.assertEqual(
            extrair_codigos_requisito(arvore), ["MAT0025", "CIC0004", "MAT0031"]
        )

    def test_condicao_nula_nao_quebra(self):
        self.assertEqual(
            extrair_codigos_requisito({"relação": "AND", "condicao": None}), []
        )

    def test_requisitos_salvos_como_lista(self):
        arvore = [
            {"materia_id": None, "codigo": "MAT0025"},
            {"relação": "AND", "condicao": [{"materia_id": None, "codigo": "CIC0004"}]},
        ]
        self.assertEqual(extrair_codigos_requisito(arvore), ["MAT0025", "CIC0004"])


class MateriaDetalheApiTestCase(CatalogoBaseTestCase):
    def setUp(self):
        super().setUp()
        criar_materia(self.departamento_mat, "MAT0025", "Cálculo 1")
        criar_materia(
            self.departamento_cic, "CIC0004", "Algoritmos e Programação de Computadores"
        )
        self.materia = criar_materia(
            self.departamento_mat,
            "MAT0026",
            "Cálculo 2",
            ementa="Integrais, séries e equações diferenciais.",
            creditos=6,
            carga_horaria=90,
            nivel_de_ensino="GRADUAÇÃO",
            pre_requisito={
                "relação": "OR",
                "condicao": [
                    {"materia_id": None, "codigo": "MAT0025"},
                    {"materia_id": None, "codigo": "MAT9999"},
                ],
            },
            co_requisito={"materia_id": None, "codigo": "CIC0004"},
        )

    def test_retorna_todos_os_dados_da_materia(self):
        response = self.client.get("/api/catalog/materia/MAT0026")

        self.assertEqual(response.status_code, 200)
        dados = response.json()
        self.assertEqual(dados["id"], str(self.materia.id))
        self.assertEqual(dados["codigo_materia"], "MAT0026")
        self.assertEqual(dados["nome"], "Cálculo 2")
        self.assertEqual(dados["ementa"], "Integrais, séries e equações diferenciais.")
        self.assertEqual(dados["creditos"], 6)
        self.assertEqual(dados["carga_horaria"], 90)
        self.assertEqual(dados["nivel_de_ensino"], "GRADUAÇÃO")
        self.assertEqual(
            dados["departamento"],
            {"codigo": "MAT", "nome": "Departamento de Matemática"},
        )
        self.assertEqual(dados["turmas"], [])

    def test_retorna_turmas_da_materia_ordenadas_e_com_professor(self):
        prof = Professor.objects.create(
            nome_completo="Carlos Pereira",
            slug="carlos-pereira",
            departamento=self.departamento_mat,
        )
        turma_antiga = Turma.objects.create(
            materia=self.materia,
            professor=prof,
            semestre="2025.2",
            codigo_turma="01",
            horario_bruto="24M34",
            local_sala="PAT AT 01",
            vagas_ofertadas=40,
            vagas_ocupadas=38,
        )
        turma_recente_b = Turma.objects.create(
            materia=self.materia,
            professor=None,
            semestre="2026.1",
            codigo_turma="02",
            horario_bruto="35T12",
            local_sala=None,
            vagas_ofertadas=30,
            vagas_ocupadas=20,
        )
        turma_recente_a = Turma.objects.create(
            materia=self.materia,
            professor=prof,
            semestre="2026.1",
            codigo_turma="01",
            horario_bruto="24M12",
            local_sala="PAT AT 02",
            vagas_ofertadas=40,
            vagas_ocupadas=40,
        )

        dados = self.client.get("/api/catalog/materia/MAT0026").json()

        self.assertEqual(len(dados["turmas"]), 3)
        # Ordenado por -semestre e codigo_turma: 2026.1 turma 01, 2026.1 turma 02, 2025.2 turma 01
        self.assertEqual(dados["turmas"][0]["id"], str(turma_recente_a.id))
        self.assertEqual(dados["turmas"][0]["codigo_turma"], "01")
        self.assertEqual(dados["turmas"][0]["semestre"], "2026.1")
        self.assertEqual(dados["turmas"][0]["professor"]["nome_completo"], "Carlos Pereira")
        self.assertEqual(dados["turmas"][0]["professor"]["slug"], "carlos-pereira")

        self.assertEqual(dados["turmas"][1]["id"], str(turma_recente_b.id))
        self.assertEqual(dados["turmas"][1]["codigo_turma"], "02")
        self.assertIsNone(dados["turmas"][1]["professor"])

        self.assertEqual(dados["turmas"][2]["id"], str(turma_antiga.id))
        self.assertEqual(dados["turmas"][2]["semestre"], "2025.2")

    def test_parametro_nivel_opcional_aceito(self):
        response = self.client.get("/api/catalog/materia/MAT0026?nivel=graduacao")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["codigo_materia"], "MAT0026")

    def test_requisitos_trazem_codigo_e_nome_buscado_no_banco(self):
        dados = self.client.get("/api/catalog/materia/MAT0026").json()

        self.assertEqual(
            dados["pre_requisitos"],
            [
                {"codigo": "MAT0025", "nome": "Cálculo 1"},
                {"codigo": "MAT9999", "nome": None},
            ],
        )
        self.assertEqual(
            dados["co_requisitos"],
            [{"codigo": "CIC0004", "nome": "Algoritmos e Programação de Computadores"}],
        )
        self.assertEqual(dados["equivalencias"], [])

    def test_arvore_original_preserva_a_logica_e_ou(self):
        dados = self.client.get("/api/catalog/materia/MAT0026").json()

        self.assertEqual(dados["pre_requisito_arvore"]["relação"], "OR")
        self.assertEqual(
            [
                condicao["codigo"]
                for condicao in dados["pre_requisito_arvore"]["condicao"]
            ],
            ["MAT0025", "MAT9999"],
        )
        self.assertEqual(
            dados["co_requisito_arvore"], {"materia_id": None, "codigo": "CIC0004"}
        )
        self.assertIsNone(dados["equivalencia_arvore"])

    def test_codigo_em_minusculo_encontra_a_materia(self):
        response = self.client.get("/api/catalog/materia/mat0026")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["codigo_materia"], "MAT0026")

    def test_materia_inexistente_retorna_404(self):
        response = self.client.get("/api/catalog/materia/XYZ0000")

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()["error"], "Matéria XYZ0000 não encontrada.")


class MateriaBuscaApiTestCase(CatalogoBaseTestCase):
    def setUp(self):
        super().setUp()
        criar_materia(self.departamento_mat, "MAT0025", "Cálculo 1")
        criar_materia(self.departamento_mat, "MAT0026", "Cálculo 2")
        criar_materia(self.departamento_mat, "MAT0031", "Introdução à Álgebra Linear")
        criar_materia(
            self.departamento_cic, "CIC0004", "Algoritmos e Programação de Computadores"
        )
        criar_materia(self.departamento_cic, "CIC0090", "Estruturas de Dados")

    def buscar(self, **parametros):
        return self.client.get("/api/catalog/materia/busca", parametros)

    def test_termo_com_menos_de_tres_caracteres_retorna_400(self):
        response = self.buscar(termo=" ca ")

        self.assertEqual(response.status_code, 400)
        self.assertIn("3 caracteres", response.json()["error"])

    def test_busca_ignora_acentos_e_maiusculas(self):
        dados = self.buscar(termo="CALCULO").json()

        codigos = [item["codigo_materia"] for item in dados["items"]]
        self.assertEqual(codigos, ["MAT0025", "MAT0026"])
        self.assertEqual(
            dados["items"][0]["departamento"],
            {"codigo": "MAT", "nome": "Departamento de Matemática"},
        )

    def test_termo_com_acento_encontra_nome_sem_acento(self):
        criar_materia(self.departamento_cic, "CIC0201", "Programacao Concorrente")

        dados = self.buscar(termo="programação").json()

        codigos = [item["codigo_materia"] for item in dados["items"]]
        self.assertEqual(codigos, ["CIC0201", "CIC0004"])

    def test_busca_por_codigo(self):
        dados = self.buscar(termo="cic").json()

        codigos = [item["codigo_materia"] for item in dados["items"]]
        self.assertEqual(codigos, ["CIC0004", "CIC0090"])

    def test_inicio_do_nome_aparece_antes_de_trecho_no_meio(self):
        criar_materia(self.departamento_cic, "CIC0199", "Teoria dos Grafos")
        criar_materia(self.departamento_cic, "CIC0200", "Grafos e Redes")

        dados = self.buscar(termo="grafos").json()

        codigos = [item["codigo_materia"] for item in dados["items"]]
        self.assertEqual(codigos, ["CIC0200", "CIC0199"])

    def test_paginacao(self):
        dados = self.buscar(termo="mat", page=2, page_size=2).json()

        self.assertEqual(
            dados["meta"],
            {"page": 2, "page_size": 2, "total_items": 3, "total_pages": 2},
        )
        self.assertEqual(len(dados["items"]), 1)


class FiltroDepartamentoApiTestCase(CatalogoBaseTestCase):
    def setUp(self):
        super().setUp()
        criar_materia(self.departamento_mat, "MAT0026", "Cálculo 2")
        criar_materia(self.departamento_mat, "MAT0025", "Cálculo 1")
        criar_materia(self.departamento_cic, "CIC0004", "Algoritmos e Programação")
        criar_materia(self.departamento_cic, "CIC0201", "Cálculo Numérico")
        self.departamento_vazio = Departamento.objects.create(
            campus=self.departamento_mat.campus,
            codigo="DEX",
            nome="Decanato de Extensão",
        )

    def buscar(self, **parametros):
        return self.client.get("/api/catalog/materia/busca", parametros)

    def test_lista_so_departamentos_com_materias_em_ordem_alfabetica(self):
        dados = self.client.get("/api/catalog/departamentos").json()

        self.assertEqual(
            dados,
            [
                {
                    "id": str(self.departamento_cic.id),
                    "codigo": "CIC",
                    "nome": "Departamento de Ciência da Computação",
                    "total_materias": 2,
                },
                {
                    "id": str(self.departamento_mat.id),
                    "codigo": "MAT",
                    "nome": "Departamento de Matemática",
                    "total_materias": 2,
                },
            ],
        )

    def test_departamento_sem_termo_lista_todas_as_materias_dele_por_nome(self):
        dados = self.buscar(departamento=str(self.departamento_mat.id)).json()

        self.assertEqual(
            [item["codigo_materia"] for item in dados["items"]], ["MAT0025", "MAT0026"]
        )
        self.assertEqual(dados["meta"]["total_items"], 2)

    def test_termo_e_departamento_combinados(self):
        dados = self.buscar(
            termo="calculo", departamento=str(self.departamento_cic.id)
        ).json()

        self.assertEqual(
            [item["codigo_materia"] for item in dados["items"]], ["CIC0201"]
        )

    def test_sem_termo_e_sem_departamento_retorna_400(self):
        response = self.buscar()

        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.json()["error"],
            "Informe um termo de busca ou escolha um departamento.",
        )

    def test_termo_curto_continua_invalido_mesmo_com_departamento(self):
        response = self.buscar(termo="ca", departamento=str(self.departamento_mat.id))

        self.assertEqual(response.status_code, 400)

    def test_departamento_com_id_invalido_retorna_422(self):
        response = self.buscar(departamento="nao-e-um-uuid")

        self.assertEqual(response.status_code, 422)


class CatalogoLogTestCase(CatalogoBaseTestCase):
    def test_avisa_quando_requisito_nao_esta_cadastrado(self):
        criar_materia(
            self.departamento_mat,
            "MAT0026",
            "Cálculo 2",
            pre_requisito={"materia_id": None, "codigo": "MAT9999"},
        )

        with self.assertLogs("apps.catalog.services", level="WARNING") as captura:
            self.client.get("/api/catalog/materia/MAT0026")

        self.assertEqual(
            captura.records[0].getMessage(),
            "Matéria MAT0026 referencia requisitos não cadastrados: MAT9999",
        )

    def test_busca_loga_termo_e_total_de_resultados(self):
        criar_materia(self.departamento_mat, "MAT0025", "Cálculo 1")
        criar_materia(self.departamento_mat, "MAT0026", "Cálculo 2")

        with self.assertLogs("apps.catalog.services", level="INFO") as captura:
            self.client.get("/api/catalog/materia/busca", {"termo": "calculo"})

        self.assertEqual(
            captura.records[0].getMessage(),
            "Busca de matérias termo='calculo': 2 resultados (página 1 de 1)",
        )

    def test_busca_sem_resultados_loga_nenhum_resultado(self):
        with self.assertLogs("apps.catalog.services", level="INFO") as captura:
            self.client.get("/api/catalog/materia/busca", {"termo": "xyzw"})

        self.assertEqual(
            captura.records[0].getMessage(),
            "Busca de matérias termo='xyzw': nenhum resultado",
        )
