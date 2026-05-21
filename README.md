# Template Static

Reusable Next.js template with Supabase auth (Google + Apple), Postgres persistence, and Vercel deployment. Demo app: calculator with per-user history.

## Status

**Scaffold complete** — parallel agents should implement features next. See [`PARALLEL.md`](./PARALLEL.md) for stream ownership and copy-paste agent prompts.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui (base-nova)
- Supabase (`@supabase/ssr`) — publishable key + project URL
- Zod (server action validation)

## Local development

```bash
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Notes |
| -------- | -------- | ----- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Project API URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | `sb_publishable_...` — not legacy anon |
| `SUPABASE_SECRET_KEY` | No | Server-only admin jobs only |

## Project layout

See [`PARALLEL.md`](./PARALLEL.md) for the full directory contract.

## Next steps

1. Run four parallel agents (prompts in `PARALLEL.md`)
2. Run integration agent
3. Apply migrations: `npx supabase db push`
4. Push to GitHub and deploy on Vercel with the same env vars
