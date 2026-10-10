[ unbook-data-pipeline ] (Scrapy / Playwright / LLM)
            │
            ├─► SIGAA (Docentes, Turmas, Disciplinas)
            ├─► Social (Dumps Facebook/Telegram limpos e anonimizados)
            └─► Síntese IA (Análise UnBook via Gemini)
                           │
                           ▼ (Dumps JSON estruturados)
  =============================================================
  [ unbook-2 ] (Monorepo Modular: Next.js + Django Ninja + PostgreSQL)
            │
            ├── config/api.py (Ponto de agregação NinjaAPI em /api/v1/)
            │
            ├── apps/
            │    ├── core/           # Schemas globais, base exception handler e paginação
            │    ├── authentication/ # Validação @aluno, sessões, perfil anônimo e carteira de tokens
            │    ├── catalog/        # Docentes, Matérias, Turmas + Ingestão Seeder
            │    ├── reviews/        # Avaliações anônimas (HMAC), badges e denúncias
            │    ├── search/         # Hero Search, auto-complete e integração Meilisearch
            │    ├── planner/        # Matriz de choque de horários (24M12)
            │    └── ru/             # Cardápios dos campi e horários
            │
            └── services/portal/     # Next.js (Landing, Sobre, FAQ, Doações, Design System)


---

unbook-2/
├── config/
│   ├── settings/
│   │   ├── base.py
│   │   ├── local.py
│   │   └── production.py
│   ├── api.py                # NinjaAPI principal: conecta os routers de cada app
│   ├── asgi.py
│   ├── wsgi.py
│   └── urls.py               # path("api/v1/", api.urls)
│
├── apps/                     # <-- Cada subpasta É um app do Django E um serviço
│   ├── core/                 # Fundação transversal do sistema
│   │   ├── apps.py           # CoreConfig
│   │   ├── exceptions.py     # Tratamento global de erros HTTP
│   │   ├── pagination.py     # Paginação padrão Pydantic/Ninja
│   │   └── security.py       # Validador de Token / Cookie de Sessão
│   │
│   ├── authentication/       # Identidade, Anonimato, Perfil e Carteira
│   │   ├── apps.py
│   │   ├── models.py         # User (AbstractUser), StudentProfile, TokenWallet, Session
│   │   ├── api.py            # Routers: /auth/login, /auth/me, /profile/edit, /profile/wallet
│   │   ├── schemas.py        # LoginIn, RegisterIn, ProfileOut, WalletOut
│   │   └── services.py       # HMAC service, gerador de codinome anônimo, bônus calouro
│   │
│   ├── catalog/              # Ementas, Departamentos, Turmas e Ingestão
│   │   ├── apps.py
│   │   ├── models.py         # Department, Subject, Professor, Class, Semester
│   │   ├── api.py            # Routers: /catalog/subjects, /catalog/professors, /catalog/flow
│   │   ├── schemas.py        # SubjectOut, ProfessorOut, ClassScheduleOut
│   │   ├── services.py       # Consultas de grafos de pré-requisito e histórico
│   │   └── management/
│   │       └── commands/
│   │           └── seed_sigaa.py  # Script de carga a partir dos dados do pipeline
│   │
│   ├── reviews/              # Feedbacks e Análise UnBook
│   │   ├── apps.py
│   │   ├── models.py         # Review, ReviewBadge, CourseMetricsSummary
│   │   ├── api.py            # Routers: /reviews/submit, /reviews/subject/{code}
│   │   ├── schemas.py        # ReviewCreateIn, AnaliseUnBookOut
│   │   └── services.py       # Persistência com anonymous_hash e cálculo de reputação
│   │
│   ├── search/               # Busca em Tempo Real (Hero Search)
│   │   ├── apps.py
│   │   ├── api.py            # Router: GET /search?q=...
│   │   ├── schemas.py        # SearchResultOut, SuggestionOut
│   │   └── services.py       # Interface Meilisearch + fallback no PostgreSQL
│   │
│   ├── ru/                   # Restaurante Universitário
│   │   ├── apps.py
│   │   ├── models.py         # RUMenu, RUCampus, RUSchedule
│   │   ├── api.py            # Routers: /ru/today, /ru/week, /ru/schedules
│   │   ├── schemas.py        # MenuDayOut, CampusOut
│   │   └── services.py       # Cache em Redis e parser do cardápio oficial
│   │
│   └── planner/              # Montador de Grades
│       ├── apps.py
│       ├── models.py         # ScheduleDraft, ScheduleItem
│       ├── api.py            # Routers: /planner/validate, /planner/drafts
│       ├── schemas.py        # TimeSlotIn, ConflictValidationOut
│       └── services.py       # Parser matricial de choque (24M12, 35T34) e exportação .ics
│
├── services/
│   └── portal/               # Web Shell Next.js (SSR / PWA)
│       ├── app/
│       │   ├── page.tsx      # Landing Page (Hero Search, Métricas, Pilares)
│       │   ├── sobre/        # Página Sobre / Princípios
│       │   ├── faq/          # Perguntas frequentes e canal de dúvidas
│       │   ├── doacoes/      # Cards de Apoio (Balinha, RU, Mecenas, PIX)
│       │   └── perfil/       # Painel do Estudante (Meu Perfil, Minha Carteira)
│       └── components/       # Design System unificado
│
├── packages/
│   └── contracts/            # Schemas tipados compartilhados (JSON / Pydantic)
│
├── infra/
│   ├── docker-compose.yml    # Postgres 16 (pgvector), Meilisearch e Redis
│   └── postgres/
│       └── init.sql          # Extensões e inicialização do banco
│
├── docs/                     # Documentação técnica completa via MkDocs
├── mkdocs.yml
├── manage.py
└── requirements.txt