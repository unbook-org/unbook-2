import uuid
from catalog.models import (
    Campus,
    Departamento,
    Materia,
    Professor,
    Turma,
)
from django.test import Client, TestCase
from review.models import Avaliacao, ResumoIADocente


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
