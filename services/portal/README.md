# UnBook Portal (`services/portal`)

Frontend web do **UnBook 2.0**, construído com **Next.js (App Router)**, **TypeScript** e **Tailwind CSS**.

Documentação completa da arquitetura em [`docs/services/portal.md`](../../docs/services/portal.md).

## Executando localmente

```bash
# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local

# Inicie o servidor de desenvolvimento
npm run dev
# Disponível em http://localhost:3000
```

O frontend espera que o backend (Django Ninja) esteja disponível em `NEXT_PUBLIC_API_URL` (veja `.env.example`).

## Scripts

- `npm run dev` — inicia o servidor de desenvolvimento (Turbopack).
- `npm run build` — build de produção.
- `npm run lint` — ESLint.
- `npm run format` / `npm run format:check` — Prettier.
