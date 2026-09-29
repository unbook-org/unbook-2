import io
import json
from django.core.management import call_command
from django.test import Client, TestCase

from catalog.management.commands.load_sigaa import clean_schedule, infer_campus_sigla
from catalog.models import Campus, Departamento, Materia, Professor, Turma


class SigaaLoadCommandTestCase(TestCase):
    def test_clean_schedule_patterns(self):
        """Valida a extração de códigos de horário oficiais da UnB."""
        # Código simples
        self.assertEqual(clean_schedule("3M1234"), "3M1234")
        # Múltiplos turnos
        self.assertEqual(clean_schedule("3M12 3T23"), "3M12 3T23")
        # Horário com tooltip descritivo anexado
        verbose_tooltip = "2345N1234 6N12Segunda-feira 19:00 às 22:30Terça-feira 19:00 às 22:30"
        self.assertEqual(clean_schedule(verbose_tooltip), "2345N1234 6N12")
        # Vazio ou nulo
        self.assertEqual(clean_schedule(""), "A Definir")
        self.assertEqual(clean_schedule(None), "A Definir")

    def test_infer_campus_sigla(self):
        """Valida inferência de campus com base no nome do departamento."""
        self.assertEqual(infer_campus_sigla("CAMPUS UNB CEILÂNDIA: FACULDADE DE SAÚDE"), "FCE")
        self.assertEqual(infer_campus_sigla("CAMPUS UNB GAMA: FGA"), "FGA")
        self.assertEqual(infer_campus_sigla("FACULDADE DE PLANALTINA - FUP"), "FAL")
        self.assertEqual(infer_campus_sigla("DEPARTAMENTO DE CIÊNCIA DA COMPUTAÇÃO"), "DARCY")

    def test_command_dry_run_execution(self):
        """Executa o comando load_sigaa com dry-run e verifica integridade."""
        out = io.StringIO()
        call_command("load_sigaa", limit=10, dry_run=True, stdout=out)
        output = out.getvalue()

        self.assertIn("UNBOOK 2.0 - COMANDO DE INGESTÃO E CARGA DO SIGAA", output)
        self.assertIn("MODO DRY-RUN ATIVADO", output)
        self.assertIn("Ingestão finalizada", output)

    def test_command_actual_execution_limited(self):
        """Executa carga real limitada e valida criação no banco."""
        out = io.StringIO()
        call_command("load_sigaa", limit=5, dry_run=False, stdout=out)

        self.assertGreater(Campus.objects.count(), 0)
        self.assertGreater(Departamento.objects.count(), 0)
        self.assertGreater(Professor.objects.count(), 0)
        self.assertGreater(Materia.objects.count(), 0)
        self.assertGreater(Turma.objects.count(), 0)

    def test_api_sync_sigaa_endpoint(self):
        """Testa o endpoint de disparo da sincronização do SIGAA."""
        client = Client()
        response = client.post(
            "/api/catalog/sync-sigaa",
            data=json.dumps({"limit": 5, "dry_run": True, "semester": "2026.1"}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "success")
        self.assertIn("Ingestão finalizada", data["output"])
