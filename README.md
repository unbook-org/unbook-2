# UnBook 2.0 (`unbook-2`)

> Repositório principal (monorepo) da aplicação **UnBook 2.0** — ecossistema acadêmico integrado da **Universidade de Brasília (UnB)**.

---

## Visão Geral

O **UnBook 2.0** é a plataforma comunitária e aberta projetada para apoiar os estudantes da UnB em suas decisões de matrícula, planejamento de semestres, descoberta de ementas e avaliação transparente de disciplinas e didática docente com preservação total de anonimato.

Este repositório é composto por:
- **`backend/`**: Backend unificado em Django + Django Ninja (Python), Pydantic v2, Django ORM e ASGI/Uvicorn, composto pelos módulos:
  - `catalog`: Catálogo curricular, ementas e grafos de pré-requisitos;
  - `search`: Motor de busca em tempo real com tolerância a apelidos da UnB;
  - `planner`: Simulador interativo de grade horária com validação de conflitos (ex: `24M12` vs `35T34`);
  - `ru`: Gestão do cardápio do RU multi-campi, acompanhamento de filas e avaliações;
  - `perfil`: Perfis anônimos, carteira de tokens e disciplinas salvas;
  - `review`: Voz anônima e avaliações de disciplinas/docentes;
  - `core`: Tratamento de exceções, paginação e segurança.
- **`frontend/`**: Aplicação mobile em React Native (Expo) + TypeScript;
- **`infra/`**: Scripts de inicialização e infraestrutura (PostgreSQL com pgvector);
- **`docs/`**: Documentação técnica e arquitetural completa mantida com Material for MkDocs.

O repositório parceiro de engenharia de dados e extração do SIGAA encontra-se em [`unbook-data-pipeline`](https://github.com/unbook-org/unbook-data-pipeline).

---

## Tech Stack Consolidada

- **Frontend:** React Native (Expo), TypeScript
- **Backend APIs:** Django + Django Ninja, Pydantic v2, Django ORM, ASGI/Uvicorn
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
