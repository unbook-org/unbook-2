from django.test import TestCase, Client
from apps.core.security import generate_anonymous_hash


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
