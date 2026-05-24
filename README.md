# Template Static

Reusable Next.js template with Supabase auth (email/password + Google), Postgres persistence, and Vercel deployment. Demo app: calculator with per-user history.

**Live demo:** [template-static.vercel.app](https://template-static.vercel.app) — reference deployment of this template (guest calculator works without sign-in; sign-in persists history to Supabase).

## What's included

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui
- **Supabase SSR auth** — email/password sign-up & sign-in, Google OAuth, session refresh middleware
- **Postgres + RLS** — `profiles` (auto-created on signup) and `calculator_history` tables
- **Server actions** — Zod-validated `saveCalculation`, `listHistory`, `clearHistory`
- **Demo calculator** — safe expression evaluator (no `eval()`), keypad UI, guest session history or per-user persistence when signed in
- **Landing + login pages** — ready to customize for new projects

## Clone for a new project

1. **Create a repo from this template** (GitHub “Use this template”) or clone and re-point remote:

   ```bash
   git clone https://github.com/YOUR_ORG/template-static.git my-new-app
   cd my-new-app
   rm -rf .git && git init
   git remote add origin git@github.com:YOUR_ORG/my-new-app.git
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment:**

   ```bash
   cp .env.example .env.local
   ```

   Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (see setup checklist below).

4. **Apply database migrations** (after Supabase project exists):

   ```bash
   npx supabase link --project-ref YOUR_PROJECT_REF
   npx supabase db push
   ```

5. **Run locally** (see [Local development](#local-development)), then customize pages, branding, and replace the calculator demo as needed.

## Human setup checklist

Complete these steps once per Supabase project and deployment target.

### Supabase

- [ ] Create a project at [supabase.com](https://supabase.com)
- [ ] Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Copy **Publishable key** (`sb_publishable_...`) → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`  
      (Settings → API Keys — use publishable, not legacy anon)
- [ ] Run migrations: `npx supabase db push` (creates `profiles` + `calculator_history` with RLS)
- [ ] **Authentication → URL configuration**
  - Site URL: `http://localhost:3000` (dev) and your production URL (e.g. `https://my-app.vercel.app`)
  - Redirect URLs: `http://localhost:3000/auth/callback`, `https://my-app.vercel.app/auth/callback`

### Auth providers (Supabase dashboard)

**Email** (enabled by default)

- [ ] **Authentication → Providers → Email** — leave enabled for native sign-up/sign-in
- [ ] Optional: **Authentication → Email** — disable “Confirm email” for instant access in dev, or keep it on and use the confirmation email flow

**Google**

- [ ] [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → OAuth 2.0 Client
- [ ] Authorized redirect URI: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
- [ ] Copy Client ID + Secret into Supabase → Authentication → Providers → Google

### Vercel

- [ ] Import GitHub repo at [vercel.com/new](https://vercel.com/new)
- [ ] Add environment variables (Production + Preview):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- [ ] Deploy, then add the Vercel URL to Supabase **Site URL** and **Redirect URLs** (see above)
- [ ] Re-test Google sign-in on the production URL

### Smoke test

- [ ] `npm run dev` → open `/calculator`, calculate `2+2` — guest history appears in the panel
- [ ] Sign in or create an account at `/login` — OAuth completes via `/auth/callback`
- [ ] Calculate again while signed in — entry persists in Supabase after refresh
- [ ] Sign out returns to `/`

## Local development

```bash
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

| Command | Purpose |
| ------- | ------- |
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build + typecheck |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

## Environment variables

| Variable | Required | Notes |
| -------- | -------- | ----- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Project API URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | `sb_publishable_...` — not legacy anon |
| `SUPABASE_SECRET_KEY` | No | Server-only admin jobs only |

## Project layout

```
src/
  app/
    (app)/calculator/         # Demo app (guest or signed-in)
    auth/callback/            # OAuth code exchange
    login/                    # Sign-in page
  components/
    auth/                     # Email + OAuth + sign-out
    calculator/               # Demo UI
    ui/                       # shadcn components
  lib/
    actions/                  # Server actions (auth, history)
    auth/session.ts           # User + profile helpers
    calculator/evaluate.ts    # Safe math evaluator
    supabase/                 # SSR clients + middleware helper
  middleware.ts               # Session refresh on each request
tokens.css                    # Spacing, color, motion tokens (project root)
supabase/
  migrations/                 # SQL schema + RLS
  apply-all.sql               # Optional single-file SQL for dashboard
```
