# Observabilidade & Logs

O backend registra o que acontece na aplicação com a biblioteca padrão `logging` do Python. A infraestrutura fica em `backend/apps/core/` e vale para todos os apps de `backend/apps/`.

---

## Formato

Saída no console (aparece no `docker logs`), em texto legível:

```text
2026-10-12 14:03:21 INFO [apps.core.signals] [req=b883742d5f30 user=yuri] catalog.Materia atualizado: MAT0025 - Cálculo I (id=7b82…) | nome: 'Cálculo 1' → 'Cálculo I'; creditos: 4 → 6
2026-10-12 14:03:21 INFO [apps.core.middleware] [req=b883742d5f30 user=yuri] POST /admin/catalog/materia/7b82…/change/ -> 302 (27.8 ms)
```

| Campo | Significado |
| :--- | :--- |
| `req` | Identificador da requisição. Liga todas as linhas de uma mesma chamada e volta no header `X-Request-ID`. Se o cliente mandar um `X-Request-ID` válido (`[A-Za-z0-9_-]{1,64}`), ele é reaproveitado. |
| `user` | Usuário logado, `anônimo` (sem login), `oculto` (rota ou dado sensível), `?` (sessão ainda não carregada) ou `-` (fora de requisição: scripts e comandos). |

O nível é definido por `LOG_LEVEL` no `backend/.env` (`DEBUG`, `INFO`, `WARNING`, `ERROR`). Nos testes, o log fica desligado.

---

## O que é registrado

| Evento | Onde | Nível |
| :--- | :--- | :--- |
| Toda requisição HTTP: método, rota, status e duração | `core/middleware.py` | INFO (2xx/3xx), WARNING (4xx), ERROR (5xx) |
| Erros de negócio (`UnBookException`) com a mensagem | `config/api.py` | WARNING (ERROR se 5xx) |
| Erros inesperados (500) com traceback | Django (`django.request`) | ERROR |
| Criação, atualização (antes → depois) e remoção em models dos apps | `core/signals.py` | INFO |
| Login, logout e falha de login (só o usuário, nunca a senha) | `core/signals.py` | INFO / WARNING |
| `ANONYMOUS_SALT` ausente (uma vez por processo) | `core/security.py` | WARNING |
| Buscas de matérias e requisitos não cadastrados | `catalog/services.py` | INFO / WARNING |

Models internos do Django (`auth.User`, `sessions.Session` etc.) ficam de fora. Leituras (SELECT) não são registradas.

!!! warning "Operações em lote não aparecem"
    `bulk_create`, `bulk_update`, `QuerySet.update()`, `QuerySet.delete()` e SQL direto não disparam signals do Django. Comandos de ingestão que usam essas operações devem registrar um resumo próprio.

---

## Privacidade e anonimato

Os apps `perfil` e `review` guardam dados anônimos de estudantes. Para não ligar um usuário a uma avaliação:

- Nas rotas `/api/reviews/`, `/api/perfil/`, `/admin/review/` e `/admin/perfil/`, o usuário sai como `oculto` na requisição inteira.
- Em mudanças nesses models, o log mostra só o id e os **nomes** dos campos alterados, sem valores e sem o nome do registro.

---

## Como usar em um módulo novo

```python
import logging

logger = logging.getLogger(__name__)

logger.info("Grade %s salva com %d matérias", rascunho.id, total)
```

Importe o módulo pelo caminho `apps.<app>...` (padrão dos `api.py` e `services.py`) para o logger herdar a configuração. Use `%s` em vez de f-string nas mensagens de log, para a formatação só acontecer quando o nível estiver ativo.
