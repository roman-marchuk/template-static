# Parallel agent handoff

Scaffold is complete. **Four agents can run in parallel** — each owns only the paths listed below. Do not edit another stream's files.

**Project root:** `/Users/rmarchuk/Library/Mobile Documents/com~apple~CloudDocs/Professional development/Projects/template-static`

**Env vars (both required):**

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (use `sb_publishable_...`, not legacy anon)

Copy `.env.example` → `.env.local` before testing auth.

---

## Stream ownership

| Stream | Owns |
| ------ | ---- |
| **auth-core** | `src/middleware.ts`, `src/lib/supabase/**`, `src/app/auth/callback/route.ts`, `supabase/migrations/00001_profiles.sql` |
| **auth-ui** | `src/app/login/page.tsx`, `src/app/page.tsx`, `src/components/auth/**` |
| **data** | `supabase/migrations/00002_calculator_history.sql`, `src/types/database.ts`, `src/lib/actions/history.ts` |
| **calculator** | `src/lib/calculator/**`, `src/components/calculator/**`, `src/app/(protected)/layout.tsx`, `src/app/(protected)/calculator/page.tsx` |

**Shared read-only:** `src/components/ui/**`, `src/lib/utils.ts`, `.env.example`

**After all four finish:** run a fifth **integration** agent (see bottom).

---

## auth-core

Implement Supabase SSR per [official guide](https://supabase.com/docs/guides/auth/server-side/creating-a-client):

1. `src/lib/supabase/client.ts` — browser client via `createBrowserClient`, publishable key env var
2. `src/lib/supabase/server.ts` — server client via `createServerClient` + cookies
3. `src/lib/supabase/middleware.ts` — `updateSession` helper
4. `src/middleware.ts` — refresh session; redirect unauthenticated users away from `/(protected)/*` to `/login`; allow `/`, `/login`, `/auth/callback`
5. `src/app/auth/callback/route.ts` — exchange OAuth code; redirect to `/calculator`
6. `supabase/migrations/00001_profiles.sql` — `profiles` table, insert trigger on `auth.users`, RLS (select/update own row)

Do **not** touch UI, calculator, or `00002_calculator_history.sql`.

---

## auth-ui

1. `src/components/auth/oauth-buttons.tsx` — Google sign-in button
2. Server actions in `src/components/auth/` or `src/lib/actions/auth.ts` (if you add it — **only auth-ui may create auth actions file**) calling `signInWithOAuth` with `redirectTo: ${origin}/auth/callback`
3. `src/components/auth/sign-out-button.tsx` — calls `supabase.auth.signOut()`, redirects to `/`
4. `src/app/login/page.tsx` — polished card UI using shadcn
5. `src/app/page.tsx` — landing hero explaining the template

Import server Supabase client from `@/lib/supabase/server` (implemented by auth-core). If auth-core isn't done yet, implement against that import path anyway.

Do **not** touch middleware, migrations, calculator.

---

## data

1. `supabase/migrations/00002_calculator_history.sql` — table + RLS (`user_id = auth.uid()` for SELECT/INSERT/DELETE)
2. `src/types/database.ts` — align types with migrations
3. `src/lib/actions/history.ts` — `saveCalculation`, `listHistory`, `clearHistory` with Zod validation; use `@/lib/supabase/server`

Columns: `id`, `user_id`, `expression`, `result`, `created_at`.

Do **not** touch auth middleware or calculator UI.

---

## calculator

1. `src/lib/calculator/evaluate.ts` — safe evaluator (tokenizer + shunting-yard or similar), **no `eval()`**
2. `src/components/calculator/calculator-app.tsx` — display, keypad, `=`, clear, backspace; history panel
3. `src/app/(protected)/calculator/page.tsx` — compose calculator
4. `src/app/(protected)/layout.tsx` — header with user email/avatar (`profiles` + auth metadata) and `SignOutButton`

Wire successful calculations to `saveCalculation`; load via `listHistory`; clear via `clearHistory`.

Do **not** touch supabase client files or migrations.

---

## integration (run last, alone)

After all four streams merge to `main`:

1. Resolve import/type conflicts
2. `npm run build` must pass
3. Complete `README.md` (clone guide, platform setup checklist, local dev)
4. Optional: `supabase/config.toml` for CLI users

Human then: `supabase db push`, fill `.env.local`, test OAuth, push to GitHub, redeploy Vercel.

---

## Copy-paste prompts

Open **four separate Cursor chats** (or cloud agents), each with workspace root:

`/Users/rmarchuk/Library/Mobile Documents/com~apple~CloudDocs/Professional development/Projects/template-static`

### Prompt: auth-core

```
You are the auth-core agent for template-static at /Users/rmarchuk/Library/Mobile Documents/com~apple~CloudDocs/Professional development/Projects/template-static.

Read PARALLEL.md. Implement ONLY your owned paths:
- src/middleware.ts
- src/lib/supabase/client.ts, server.ts, middleware.ts
- src/app/auth/callback/route.ts
- supabase/migrations/00001_profiles.sql

Use NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (not legacy anon).
Follow Supabase Next.js SSR docs. Protect /(protected)/* routes. OAuth callback redirects to /calculator.

Do not edit auth UI, calculator, data migrations, or history actions. Do not edit PARALLEL.md or the plan file.
When done, summarize what you changed and any env/setup notes.
```

### Prompt: auth-ui

```
You are the auth-ui agent for template-static at /Users/rmarchuk/Library/Mobile Documents/com~apple~CloudDocs/Professional development/Projects/template-static.

Read PARALLEL.md. Implement ONLY your owned paths:
- src/app/login/page.tsx
- src/app/page.tsx
- src/components/auth/oauth-buttons.tsx
- src/components/auth/sign-out-button.tsx

Build Google OAuth via Supabase signInWithOAuth (redirectTo: ${origin}/auth/callback).
Use shadcn components already in src/components/ui. Import createClient from @/lib/supabase/server in server actions.

Do not edit middleware, supabase lib (except consuming it), migrations, calculator, or history actions.
When done, summarize what you changed.
```

### Prompt: data

```
You are the data agent for template-static at /Users/rmarchuk/Library/Mobile Documents/com~apple~CloudDocs/Professional development/Projects/template-static.

Read PARALLEL.md. Implement ONLY your owned paths:
- supabase/migrations/00002_calculator_history.sql
- src/types/database.ts
- src/lib/actions/history.ts

Table calculator_history with RLS (users access own rows). Server actions: saveCalculation, listHistory, clearHistory with Zod validation. Use @/lib/supabase/server.

Do not edit auth middleware, auth UI, or calculator UI.
When done, summarize migration SQL and action signatures.
```

### Prompt: calculator

```
You are the calculator agent for template-static at /Users/rmarchuk/Library/Mobile Documents/com~apple~CloudDocs/Professional development/Projects/template-static.

Read PARALLEL.md. Implement ONLY your owned paths:
- src/lib/calculator/evaluate.ts (safe math, no eval())
- src/components/calculator/calculator-app.tsx
- src/app/(protected)/calculator/page.tsx
- src/app/(protected)/layout.tsx (header with user info + SignOutButton)

Wire to saveCalculation, listHistory, clearHistory from @/lib/actions/history. Use shadcn UI.

Do not edit supabase clients, middleware, migrations, or auth components (except importing SignOutButton).
When done, summarize features implemented.
```

### Prompt: integration (after the four above)

```
You are the integration agent for template-static at /Users/rmarchuk/Library/Mobile Documents/com~apple~CloudDocs/Professional development/Projects/template-static.

All four parallel streams (auth-core, auth-ui, data, calculator) should be complete. Merge/fix any conflicts. Run npm run build and fix errors. Complete README.md with: what the template includes, how to clone for new projects, human Supabase/Vercel/OAuth setup checklist, and npm run dev instructions.

Do not edit PARALLEL.md or the plan file. Report build status and remaining human steps.
```
