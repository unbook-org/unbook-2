# UnBook 2.0 (`unbook-2`)

> Repositório principal (monorepo) da aplicação **UnBook 2.0** — ecossistema acadêmico integrado da **Universidade de Brasília (UnB)**.

---

## Visão Geral

O **UnBook 2.0** é a plataforma comunitária e aberta projetada para apoiar os estudantes da UnB em suas decisões de matrícula, planejamento de semestres, descoberta de ementas e avaliação transparente de disciplinas e didática docente com preservação total de anonimato.

Este repositório é um **monorepo** composto por:
- **`services/portal`**: Frontend web em Next.js (React 19) + Tailwind CSS + Zustand (*Mobile-First* PWA);
- **`services/search`**: Motor de busca em tempo real com Django Ninja + Meilisearch (latência <15ms e tolerância a apelidos da UnB);
- **`services/catalog`**: Catálogo curricular, ementas, grafos de pré-requisitos (`TB_RELACAO_MATERIA`) e síntese inteligente da "Análise UnBook" via Google Gemini API;
- **`services/planner`**: Simulador interativo de grade horária com validação matricial de conflitos (ex: `24M12` vs `35T34`) e exportação `.ics`;
- **`services/menu`**: Gestão do cardápio do RU multi-campi, acompanhamento de filas e avaliações gastronômicas;
- **`docs/`**: Documentação técnica e arquitetural completa mantida com Material for MkDocs.

O repositório parceiro de engenharia de dados e extração do SIGAA encontra-se em [`unbook-data-pipeline`](https://github.com/unbook-org/unbook-data-pipeline).

---

## Tech Stack Consolidada

- **Frontend:** Next.js 19, Tailwind CSS, Radix UI, Zustand, TanStack Query
- **Backend APIs:** Django 5 + Django Ninja (Python 3.12), Pydantic v2, Django ORM, ASGI
- **Bancos de Dados & Cache:** PostgreSQL 16 + `pgvector`, Redis 7
- **Search Engine:** Meilisearch
- **Inteligência Artificial:** Google Gemini API (via Instructor e LiteLLM)
- **Documentação:** Material for MkDocs

---

## Documentação Técnica (MkDocs)

Toda a arquitetura, contratos de dados, diretrizes de segurança e guias de contribuição estão documentados na pasta `docs/`.

### Como rodar a documentação localmente:

```bash
# 1. Crie e ative o ambiente virtual
python3 -m venv venv
source venv/bin/activate

# 2. Instale as dependências de documentação
pip install mkdocs-material

# 3. Inicie o servidor do MkDocs com live-reload (use outra porta se a 8000 estiver ocupada)
mkdocs serve -a localhost:8008
```

Acesse em seu navegador: **[`http://localhost:8008/unbook-2/`](http://localhost:8008/unbook-2/)**.

O deploy da documentação é feito automaticamente no GitHub Pages a cada push na branch `main` através do workflow [`.github/workflows/docs.yml`](.github/workflows/docs.yml).

---

## Como Executar o Ecossistema com Docker

Para subir a infraestrutura completa (PostgreSQL 16 com `pgvector`, Redis 7 e Meilisearch):

```bash
docker compose up -d
```

Consulte o guia completo em [docs/contributing/local-setup.md](docs/contributing/local-setup.md).

---

## Como Contribuir

Antes de abrir um Pull Request, leia as diretrizes das squads e padrões de código em [CONTRIBUTING.md](CONTRIBUTING.md) e [docs/contributing/standards.md](docs/contributing/standards.md).

---

## Mantenedores & Comunidade

UnBook 2.0 — Mantido com dedicação pela comunidade de estudantes da **Universidade de Brasília (UnB)**.
