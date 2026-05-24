import Link from "next/link";

import { CalculatorPreview } from "@/components/calculator-preview";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { getCurrentUserWithProfile } from "@/lib/auth/session";

const specs = [
  {
    name: "Authentication",
    value: "Email + Google OAuth",
    note: "Server sessions; middleware refreshes cookies on each request",
  },
  {
    name: "Data layer",
    value: "Supabase + RLS",
    note: "Profiles and per-user calculator history",
  },
  {
    name: "Reference UI",
    value: "Calculator",
    note: "Expression evaluation with optional persistence",
  },
  {
    name: "Operations",
    value: "Vercel + migrations",
    note: "Env-driven config; SQL migrations in repo",
  },
] as const;

export default async function HomePage() {
  const { user } = await getCurrentUserWithProfile();

  return (
    <>
      <main className="flex flex-1 flex-col pt-[calc(var(--nav-pill-offset)+3.5rem)]">
        <section className="page-gutter pb-[var(--space-3xl)] pt-[var(--space-xl)]">
          <div className="page-max grid min-w-0 items-start gap-10 lg:grid-cols-[7fr_5fr] lg:gap-[var(--space-2xl)]">
            <div className="min-w-0 space-y-5">
              <p className="font-mono text-[0.65rem] uppercase tracking-[var(--tracking-label)] text-[var(--color-muted)]">
                Project overview
              </p>
              <h1 className="text-display font-display font-semibold text-balance text-[var(--color-ink)]">
                Next.js starter with Supabase auth
              </h1>
              <p className="max-w-[44ch] text-base leading-relaxed text-[var(--color-muted)] text-pretty">
                A reusable base for static and server-rendered apps that need
                sign-in, row-level access, and a small end-to-end example. The
                calculator is the reference surface—it exercises auth,
                evaluation, and history storage without extra product chrome.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {!user ? (
                  <Link href="/login">
                    <Button
                      size="lg"
                      className="h-10 rounded-[var(--radius-pill)] px-5"
                    >
                      Sign in
                    </Button>
                  </Link>
                ) : null}
                <Link href="/calculator">
                  <Button
                    variant={user ? "default" : "outline"}
                    size="lg"
                    className="h-10 rounded-[var(--radius-pill)] px-5"
                  >
                    Calculator
                  </Button>
                </Link>
              </div>
            </div>

            <CalculatorPreview />
          </div>
        </section>

        <section className="hairline-top bg-[var(--color-paper-2)] px-[var(--page-gutter)] py-[var(--space-2xl)]">
          <div className="page-max min-w-0">
            <p className="font-mono text-[0.65rem] uppercase tracking-[var(--tracking-label)] text-[var(--color-muted)]">
              Repository map
            </p>
            <h2 className="text-display-s mt-3 font-display font-semibold text-[var(--color-ink)]">
              What is included
            </h2>
            <p className="mt-3 max-w-xl text-sm text-[var(--color-muted)]">
              Main layers in this template and the role each one plays when you
              extend the project.
            </p>

            <div className="mt-8 overflow-x-auto">
              <table className="tnum w-full min-w-[20rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-rule)]">
                    <th className="pb-3 pr-6 font-medium text-[var(--color-ink)]">
                      Layer
                    </th>
                    <th className="pb-3 pr-6 font-medium text-[var(--color-ink)]">
                      Implementation
                    </th>
                    <th className="pb-3 font-medium text-[var(--color-muted)]">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {specs.map((row) => (
                    <tr
                      key={row.name}
                      className="border-b border-[var(--color-rule)] last:border-0"
                    >
                      <td className="py-4 pr-6 font-medium text-[var(--color-ink)]">
                        {row.name}
                      </td>
                      <td className="py-4 pr-6 text-[var(--color-ink-2)]">
                        {row.value}
                      </td>
                      <td className="py-4 text-[var(--color-muted)]">
                        {row.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
