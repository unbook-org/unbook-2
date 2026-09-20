# Overview da Aplicação

## Como funciona?
O sistema atual é composto por duas frentes:
- FrontEnd em React Native
- Backend em Django-Ninja

---

### Motivo:


O React Native é capaz de rodar a própria aplicação local logo, a renderização por view do Django se torna redundante. 



Mas isso pode gerar a mesma dúvida que gerou pra mim: 

#### Por quê usar o Django se o FastAPI tem uma sintaxe tão ergonômica?

A resposta é o **Django Ninja**! Ele oferece a mesma experiência de desenvolvimento (DX), tipagem com Pydantic v2 e endpoints assíncronos inspirados no FastAPI, mas integrados nativamente com as "baterias incluídas" do Django: Django ORM, migrações determinísticas, Django Admin para moderação imediata e segurança consolidada.

Ao utilizar o Django Ninja, não precisamos manter dois frameworks diferentes em paralelo. O Django cuida dos modelos, regras e persistência, e o Django Ninja cuida do roteamento, validação e documentação OpenAPI automática.

---

## Como rodar com Docker Compose (Recomendado)

O projeto possui um ambiente multi-container completo com **Backend (Django Ninja + Uvicorn)**, **PostgreSQL 16 (com pgvector)**, **Redis 7** e **Meilisearch**.

1. Crie seu arquivo de variáveis de ambiente a partir do exemplo:
```bash
cp .env.example .env
```

2. Suba todos os containers em segundo plano:
```bash
docker compose up --build -d
```

3. Execute as migrações do banco de dados no container do backend:
```bash
docker compose exec backend python manage.py migrate
```

4. Acesse os serviços:
- **API Swagger / Documentação Interativa:** [http://localhost:8080/api/docs](http://localhost:8080/api/docs)
- **API Base:** [http://localhost:8080/api/](http://localhost:8080/api/)
- **PostgreSQL 16 + pgvector:** `localhost:5432`
- **Redis 7:** `localhost:6379`
- **Meilisearch:** `localhost:7700`

---

## Como rodar localmente sem Docker

1. Ativando o ambiente virtual:
```bash
# Linux / macOS
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

2. Instalando as dependências:
```bash
pip install -r requirements.txt
```

3. Aplicando as migrações:
```bash
python manage.py migrate
```

4. Inicializando o backend:
```bash
uvicorn config.asgi:application --reload --port 8080
```


