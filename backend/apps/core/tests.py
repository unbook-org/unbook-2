import logging
import os
import uuid
from unittest import mock

from catalog.models import Campus
from django.contrib.auth.models import User
from django.test import Client, RequestFactory, SimpleTestCase, TestCase
from django.utils.functional import SimpleLazyObject
from perfil.models import PerfilEstudante

from apps.core.db import remover_acentos
from apps.core.log import RequestContextFilter, usuario_da_requisicao
from apps.core.security import _avisar_salt_ausente, generate_anonymous_hash


class ApiRoutesTestCase(TestCase):
    def setUp(self):
        self.client = Client()

    def test_api_docs_accessible(self):
        """Verifica se a documentação OpenAPI do Django Ninja é gerada."""
        response = self.client.get("/api/docs")
        self.assertEqual(response.status_code, 200)

    def test_catalog_health(self):
        response = self.client.get("/api/catalog/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok", "module": "catalog"})

    def test_perfil_health(self):
        response = self.client.get("/api/perfil/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok", "module": "perfil"})

    def test_planner_health(self):
        response = self.client.get("/api/planner/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok", "module": "planner"})

    def test_review_health(self):
        response = self.client.get("/api/reviews/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok", "module": "review"})

    def test_ru_health(self):
        response = self.client.get("/api/ru/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok", "module": "ru"})

    def test_search_health(self):
        response = self.client.get("/api/search/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok", "module": "search"})

    def test_admin_accessible(self):
        """Verifica se o Django Admin responde com redirect para login."""
        response = self.client.get("/admin/")
        self.assertEqual(response.status_code, 302)


class SecurityHelpersTestCase(TestCase):
    def test_anonymous_hash_deterministic_and_length(self):
        """Verifica se o hash Zero-Knowledge é determinístico e tem 64 caracteres hexadecimais."""
        h1 = generate_anonymous_hash("user-uuid-1234", salt="secret")
        h2 = generate_anonymous_hash("user-uuid-1234", salt="secret")
        h3 = generate_anonymous_hash("user-uuid-5678", salt="secret")

        self.assertEqual(h1, h2)
        self.assertNotEqual(h1, h3)
        self.assertEqual(len(h1), 64)


class RequestLogMiddlewareTestCase(TestCase):
    def setUp(self):
        self.client = Client()

    def test_loga_requisicao_com_metodo_rota_status_e_duracao(self):
        with self.assertLogs("apps.core.middleware", level="INFO") as captura:
            self.client.get("/api/catalog/health")

        self.assertEqual(len(captura.records), 1)
        registro = captura.records[0]
        self.assertEqual(registro.levelname, "INFO")
        self.assertRegex(
            registro.getMessage(), r"^GET /api/catalog/health -> 200 \(\d+\.\d ms\)$"
        )

    def test_status_de_erro_do_cliente_vira_warning(self):
        with self.assertLogs("apps.core.middleware", level="INFO") as captura:
            self.client.get("/api/rota-inexistente")

        self.assertEqual(captura.records[0].levelname, "WARNING")

    def test_gera_request_id_e_devolve_no_header(self):
        response = self.client.get("/api/catalog/health")

        self.assertRegex(response["X-Request-ID"], r"^[0-9a-f]{12}$")

    def test_reaproveita_request_id_valido_recebido(self):
        response = self.client.get(
            "/api/catalog/health", headers={"X-Request-ID": "front-abc-123"}
        )

        self.assertEqual(response["X-Request-ID"], "front-abc-123")

    def test_descarta_request_id_com_caracteres_invalidos(self):
        response = self.client.get(
            "/api/catalog/health", headers={"X-Request-ID": "abc\nFAKE LOG"}
        )

        self.assertNotIn("FAKE", response["X-Request-ID"])

    def test_logs_da_requisicao_carregam_o_mesmo_request_id(self):
        captura = CapturaContexto()
        for nome_logger in ("apps", "config"):
            logger_app = logging.getLogger(nome_logger)
            substituicao = mock.patch.object(logger_app, "handlers", [captura])
            substituicao.start()
            self.addCleanup(substituicao.stop)
            self.addCleanup(logger_app.setLevel, logger_app.level)
            logger_app.setLevel(logging.INFO)

        self.client.get(
            "/api/catalog/materia/XYZ0000", headers={"X-Request-ID": "req-teste"}
        )

        self.assertGreaterEqual(len(captura.request_ids), 2)
        self.assertEqual(set(captura.request_ids), {"req-teste"})


class CapturaContexto(logging.Handler):
    def __init__(self):
        super().__init__()
        self.addFilter(RequestContextFilter())
        self.request_ids = []
        self.usuarios = []
        self.mensagens = []

    def emit(self, record):
        self.request_ids.append(record.request_id)
        self.usuarios.append(record.usuario)
        self.mensagens.append(record.getMessage())


class UsuarioNoLogTestCase(TestCase):
    def setUp(self):
        self.captura = CapturaContexto()
        for nome_logger in ("apps", "config"):
            logger_app = logging.getLogger(nome_logger)
            substituicao = mock.patch.object(logger_app, "handlers", [self.captura])
            substituicao.start()
            self.addCleanup(substituicao.stop)
            self.addCleanup(logger_app.setLevel, logger_app.level)
            logger_app.setLevel(logging.INFO)

    def test_requisicao_sem_login_e_marcada_como_anonima(self):
        Client().get("/api/catalog/health")

        self.assertEqual(set(self.captura.usuarios), {"anônimo"})

    def test_alteracao_feita_no_admin_mostra_quem_fez(self):
        User.objects.create_superuser("yuri", "yuri@unb.br", "senha-forte-123")
        campus = Campus.objects.create(sigla="FUP", nome="Planaltina")
        cliente = Client()
        cliente.login(username="yuri", password="senha-forte-123")
        self.captura.mensagens.clear()
        self.captura.usuarios.clear()

        cliente.post(
            f"/admin/catalog/campus/{campus.pk}/change/",
            {"sigla": "FUP", "nome": "Faculdade UnB Planaltina"},
        )

        alteracoes = [
            usuario
            for mensagem, usuario in zip(
                self.captura.mensagens, self.captura.usuarios, strict=True
            )
            if mensagem.startswith("catalog.Campus atualizado")
        ]
        self.assertEqual(alteracoes, ["yuri"])

    def test_alteracao_em_app_sensivel_oculta_quem_fez(self):
        User.objects.create_superuser("yuri", "yuri@unb.br", "senha-forte-123")
        perfil = PerfilEstudante.objects.create(
            usuario_id=uuid.uuid4(),
            apelido_anonimo="@CapivaraDoDarcy_84",
            semestre_ingresso="2024.1",
        )
        cliente = Client()
        cliente.login(username="yuri", password="senha-forte-123")
        self.captura.mensagens.clear()
        self.captura.usuarios.clear()

        cliente.post(
            f"/admin/perfil/perfilestudante/{perfil.pk}/change/",
            {
                "usuario_id": perfil.usuario_id,
                "apelido_anonimo": "@LoboGuara_12",
                "sticker_avatar": "capivara_alfa",
                "semestre_ingresso": "2024.1",
                "ira_calculado": "0",
                "creditos_integralizados": "0",
            },
        )

        alteracoes = [
            usuario
            for mensagem, usuario in zip(
                self.captura.mensagens, self.captura.usuarios, strict=True
            )
            if mensagem.startswith("perfil.PerfilEstudante atualizado")
        ]
        self.assertEqual(alteracoes, ["oculto"])
        self.assertNotIn("yuri", self.captura.usuarios)

    def test_usuario_nao_carregado_nao_dispara_consulta(self):
        requisicao = RequestFactory().get("/")
        requisicao.COOKIES["sessionid"] = "sessao-qualquer"
        requisicao.user = SimpleLazyObject(
            lambda: self.fail("o log não deve carregar o usuário")
        )

        self.assertEqual(usuario_da_requisicao(requisicao), "?")

    def test_sem_cookie_de_sessao_e_anonimo_sem_carregar_usuario(self):
        requisicao = RequestFactory().get("/")
        requisicao.user = SimpleLazyObject(
            lambda: self.fail("o log não deve carregar o usuário")
        )

        self.assertEqual(usuario_da_requisicao(requisicao), "anônimo")

    def test_codigo_fora_de_requisicao_nao_tem_usuario(self):
        Campus.objects.create(sigla="DARCY", nome="Darcy Ribeiro")

        self.assertEqual(set(self.captura.usuarios), {"-"})


class UnBookExceptionLogTestCase(TestCase):
    def test_erro_de_negocio_e_logado_como_warning_com_a_mensagem(self):
        with self.assertLogs("config.api", level="WARNING") as captura:
            Client().get("/api/catalog/materia/XYZ0000")

        self.assertEqual(
            captura.records[0].getMessage(),
            "NotFoundException em GET /api/catalog/materia/XYZ0000: "
            "Matéria XYZ0000 não encontrada.",
        )


class SignalsLogTestCase(TestCase):
    def test_loga_criacao_alteracoes_e_remocao_com_registro_legivel(self):
        with self.assertLogs("apps.core.signals", level="INFO") as captura:
            campus = Campus.objects.create(sigla="FGA", nome="Campus Gama")
            campus.nome = "Faculdade do Gama"
            campus.save()
            campus_id = campus.pk
            campus.delete()

        self.assertEqual(
            [registro.getMessage() for registro in captura.records],
            [
                f"catalog.Campus criado: FGA - Campus Gama (id={campus_id})",
                (
                    f"catalog.Campus atualizado: FGA - Faculdade do Gama (id={campus_id}) "
                    "| nome: 'Campus Gama' → 'Faculdade do Gama'"
                ),
                f"catalog.Campus removido: FGA - Faculdade do Gama (id={campus_id})",
            ],
        )

    def test_salvar_sem_mudar_nada_informa_sem_alteracoes(self):
        campus = Campus.objects.create(sigla="FCE", nome="Ceilândia")

        with self.assertLogs("apps.core.signals", level="INFO") as captura:
            campus.save()

        self.assertTrue(captura.records[0].getMessage().endswith("| sem alterações"))

    def test_sem_log_de_info_nao_faz_consulta_extra_no_update(self):
        campus = Campus.objects.create(sigla="FCE", nome="Ceilândia")
        logger_signals = logging.getLogger("apps.core.signals")
        self.addCleanup(logger_signals.setLevel, logger_signals.level)
        logger_signals.setLevel(logging.WARNING)

        campus.nome = "Faculdade de Ceilândia"
        with self.assertNumQueries(1):
            campus.save()

    def test_apps_sensiveis_mostram_so_os_nomes_dos_campos(self):
        perfil = PerfilEstudante.objects.create(
            usuario_id=uuid.uuid4(),
            apelido_anonimo="@CapivaraDoDarcy_84",
            semestre_ingresso="2024.1",
        )

        with self.assertLogs("apps.core.signals", level="INFO") as captura:
            perfil.apelido_anonimo = "@LoboGuara_12"
            perfil.creditos_integralizados = 120
            perfil.save()

        mensagem = captura.records[0].getMessage()
        self.assertTrue(
            mensagem.startswith(f"perfil.PerfilEstudante atualizado: (id={perfil.pk})")
        )
        self.assertIn("apelido_anonimo", mensagem)
        self.assertIn("creditos_integralizados", mensagem)
        self.assertNotIn("Capivara", mensagem)
        self.assertNotIn("LoboGuara", mensagem)
        self.assertNotIn("120", mensagem)

    def test_nao_loga_models_internos_do_django(self):
        with self.assertNoLogs("apps.core.signals", level="INFO"):
            User.objects.create_user(username="admin", password="senha-forte-123")

    def test_falha_de_login_e_logada_sem_expor_a_senha(self):
        with self.assertLogs("apps.core.signals", level="WARNING") as captura:
            Client().login(username="intruso", password="senha-errada")

        mensagem = captura.records[0].getMessage()
        self.assertEqual(mensagem, "Falha de login para usuário 'intruso'")
        self.assertNotIn("senha-errada", mensagem)

    def test_login_bem_sucedido_e_logado(self):
        User.objects.create_user(username="admin", password="senha-forte-123")

        with self.assertLogs("apps.core.signals", level="INFO") as captura:
            Client().login(username="admin", password="senha-forte-123")

        self.assertIn("Login realizado: admin", captura.output[-1])


class SaltAnonimatoLogTestCase(TestCase):
    def setUp(self):
        _avisar_salt_ausente.cache_clear()
        self.addCleanup(_avisar_salt_ausente.cache_clear)

    def test_avisa_uma_vez_quando_anonymous_salt_nao_esta_definido(self):
        with mock.patch.dict(os.environ, {}, clear=False):
            os.environ.pop("ANONYMOUS_SALT", None)
            with self.assertLogs("apps.core.security", level="WARNING") as captura:
                generate_anonymous_hash("usuario-1")
                generate_anonymous_hash("usuario-2")

        self.assertEqual(len(captura.records), 1)

    def test_nao_avisa_com_salt_configurado(self):
        with (
            mock.patch.dict(os.environ, {"ANONYMOUS_SALT": "salt-do-ambiente"}),
            self.assertNoLogs("apps.core.security", level="WARNING"),
        ):
            generate_anonymous_hash("usuario-1")


class RemoverAcentosTestCase(SimpleTestCase):
    def test_remove_acentos_e_cedilha_mantendo_o_resto(self):
        self.assertEqual(
            remover_acentos("Introdução à Álgebra Linear 2"),
            "Introducao a Algebra Linear 2",
        )

    def test_none_continua_none(self):
        self.assertIsNone(remover_acentos(None))
