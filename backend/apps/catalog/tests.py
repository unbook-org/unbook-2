from catalog.models import Campus, Departamento, Materia
from django.test import Client, SimpleTestCase, TestCase

from apps.catalog.services import extrair_codigos_requisito


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
