# Setup Local com Docker

Este guia orienta a configuração e execução completa do ambiente de desenvolvimento do **UnBook 2.0** utilizando **Docker**, **Docker Compose** e as ferramentas do monorepo `unbook-2`.

---

## Pré-requisitos

Certifique-se de possuir instalado em seu ambiente:
- **Docker 24+** & **Docker Compose v2+**;
- **Node.js 20+** e gerenciador de pacotes (`npm` ou `pnpm`);
- **Python 3.12+** e gerenciador `venv`;
- **Git** e **Git LFS** (para arquivos de sementes e dumps brutos).

---

## 1. Subindo a Infraestrutura de Dados (Docker Compose)

O ecossistema depende de três serviços fundamentais em segundo plano:
- **PostgreSQL 16** com extensão `pgvector`;
- **Redis 7** para caching e rate limiting;
- **Meilisearch** para indexação em memória da busca instantânea.

Crie ou utilize o arquivo `docker-compose.yml` na raiz:

```yaml
version: '3.8'

services:
  postgres:
    image: pgvector/pgvector:pg16
    container_name: unbook-postgres
    environment:
      POSTGRES_DB: unbook_db
      POSTGRES_USER: unbook_user
      POSTGRES_PASSWORD: unbook_password_local
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: unbook-redis
    ports:
      - "6379:6379"

  meilisearch:
    image: getmeili/meilisearch:v1.7
    container_name: unbook-meilisearch
    environment:
      MEILI_MASTER_KEY: "unbook_master_key_local"
      MEILI_ENV: "development"
    ports:
      - "7700:7700"
    volumes:
      - meilidata:/meili_data

volumes:
  pgdata:
  meilidata:
```

Inicie os containers:

```bash
docker compose up -d
```

Verifique o status com `docker compose ps` para garantir que as portas `5432`, `6379` e `7700` estejam ativas.

---

## 2. Configuração de Variáveis de Ambiente

Copie o arquivo de exemplo para cada serviço de backend e frontend:

```bash
# Na raiz do monorepo unbook-2
cp .env.example .env
```

Configurações típicas para ambiente local:
```ini
# PostgreSQL
DATABASE_URL=postgres://unbook_user:unbook_password_local@localhost:5432/unbook_db

# Redis
REDIS_URL=redis://localhost:6379/0

# Meilisearch
MEILISEARCH_URL=http://localhost:7700
MEILISEARCH_KEY=unbook_master_key_local

# Google Gemini API (necessário para sintetizar a Análise UnBook no services/catalog)
GEMINI_API_KEY=sua_chave_aqui
```

---

## 2.1 Backend Conectado ao Supabase

O banco oficial do projeto é o **Supabase** (PostgreSQL 17). O backend se conecta pelo **Session pooler**, que funciona por IPv4 e se comporta como uma conexão direta.

| Modo do Supabase | Host / porta | Quando usar |
| :--- | :--- | :--- |
| Direct connection | `db.<ref>.supabase.co:5432` | Só com IPv6 (plano padrão). |
| **Session pooler** | `aws-0-<regiao>.pooler.supabase.com:5432` | **Backend Django (padrão do projeto)**, redes e containers só com IPv4. |
| Transaction pooler | mesmo host, porta `6543` | Serverless; exige `DISABLE_SERVER_SIDE_CURSORS = True` no Django. |

### Passo a passo

1. Copie `backend/.env.example` para `backend/.env` (o `.env` está no `.gitignore`).
2. No painel do Supabase, clique em **Connect → Connection String → Session pooler** e preencha:
    - `POSTGRES_USER=postgres.<project_ref>`
    - `POSTGRES_PASSWORD=<senha do banco>` (entre aspas se tiver `#`, `$` ou espaço)
    - `POSTGRES_HOST=aws-0-<regiao>.pooler.supabase.com`
3. Gere `SECRET_KEY` e `ANONYMOUS_SALT` com `python -c "import secrets; print(secrets.token_urlsafe(50))"`. **Nunca altere o `ANONYMOUS_SALT` depois**: os hashes de anonimato existentes deixariam de bater.
4. Ative a extensão `unaccent` no Supabase (**Database → Extensions**).

!!! note "As chaves `NEXT_PUBLIC_SUPABASE_*` não servem para o backend"
    A URL e a *publishable key* são da API REST do Supabase, para uso no navegador. O Django conversa direto com o Postgres e precisa da **senha do banco**.

### Regras importantes

- **Não rode `migrate` no Supabase.** As tabelas são criadas e populadas pelo `unbook-data-pipeline`, e o histórico de migrations do Supabase inclui arquivos que ainda não estão no repositório. Se precisar registrar migrations como aplicadas, use `--fake` e combine com o time.
- **Os testes nunca usam o Supabase.** Com `manage.py test` (ou pytest), o backend usa SQLite mesmo com o `.env` preenchido.
- `POSTGRES_CONN_MAX_AGE=0` (padrão): sob ASGI/Uvicorn, conexões persistentes vazam por thread e esgotam as vagas do pooler.
- Sem `POSTGRES_DB` no ambiente, o backend usa SQLite local (`backend/db.sqlite3`).

### Rodando backend e frontend juntos

```bash
# Backend (porta 8080, conectado ao Supabase pelo .env)
cd backend
python -m venv .venv
.venv/Scripts/pip install -r requirements.txt   # Linux/macOS: .venv/bin/pip
.venv/Scripts/python manage.py runserver 8080
# Swagger: http://localhost:8080/api/docs

# Frontend (porta 8081)
cd frontend
npm ci
npx expo start --web
# App: http://localhost:8081
```

---

## 3. Executando os Microsserviços

Em terminais separados (ou via script de orquestração):

### A. Portal Web (`services/portal`):
```bash
cd services/portal
npm install
npm run dev
# Disponível em: http://localhost:3000
```

### B. Motor de Busca (`services/search`):
```bash
cd services/search
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8001
# API Docs Swagger: http://localhost:8001/api/docs
```

### C. Catálogo & Análise UnBook (`services/catalog`):
```bash
cd services/catalog
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8002
# API Docs Swagger: http://localhost:8002/api/docs
# Painel Administrativo: http://localhost:8002/admin
```

### D. Simulador Planner (`services/planner`):
```bash
cd services/planner
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8003
# API Docs Swagger: http://localhost:8003/api/docs
```

### E. Cardápio do RU & Filas (`services/menu`):
```bash
cd services/menu
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8004
# API Docs Swagger: http://localhost:8004/api/docs
# Painel Administrativo: http://localhost:8004/admin
```

---

## 4. Visualizando a Documentação Localmente

Para rodar esta documentação com hot-reload local (utilize uma porta livre como a 8008 caso a porta 8000 já esteja ocupada por outra API):

```bash
# Na raiz de unbook-2
source venv/bin/activate
mkdocs serve -a localhost:8008
# Acesse no navegador: http://localhost:8008/unbook-2/
```
