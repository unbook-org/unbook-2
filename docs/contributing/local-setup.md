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
