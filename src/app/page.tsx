import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CalculatorPreview } from "@/components/calculator-preview";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";

const specs = [
  {
    name: "Authentication",
    value: "Email + Google OAuth",
    note: "SSR sessions, protected routes",
  },
  {
    name: "Data layer",
    value: "Supabase + RLS",
    note: "Per-user calculator history",
  },
  {
    name: "Demo app",
    value: "Calculator",
    note: "Expression eval, auto-save",
  },
  {
    name: "Deploy target",
    value: "Vercel-ready",
    note: "Env vars + migrations included",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <SiteNav />

      <main className="flex flex-1 flex-col pt-[calc(var(--nav-pill-offset)+3.5rem)]">
        <section className="page-gutter pb-[var(--space-3xl)] pt-[var(--space-xl)]">
          <div className="page-max grid min-w-0 items-center gap-10 lg:grid-cols-[7fr_5fr] lg:gap-[var(--space-2xl)]">
            <div className="min-w-0 space-y-6">
              <h1 className="text-display font-display font-semibold text-balance text-[var(--color-ink)]">
                Ship Next.js apps with auth built in
              </h1>
              <p className="max-w-[42ch] text-lg leading-relaxed text-[var(--color-muted)] text-pretty">
                A reusable foundation for static and server-rendered projects.
                Connect Supabase, extend the calculator demo, and deploy — without
                rebuilding sign-in from scratch.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/login">
                  <Button
                    size="lg"
                    className="h-10 rounded-[var(--radius-pill)] px-5"
                  >
                    Sign in
                    <ArrowRight />
                  </Button>
                </Link>
                <Link href="/calculator">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-10 rounded-[var(--radius-pill)] px-5"
                  >
                    Open calculator
                  </Button>
                </Link>
              </div>
            </div>

            <CalculatorPreview />
          </div>
        </section>

        <section className="hairline-top bg-[var(--color-paper-2)] px-[var(--page-gutter)] py-[var(--space-2xl)]">
          <div className="page-max min-w-0">
            <div className="mb-8 max-w-xl">
              <h2 className="text-display-s font-display font-semibold text-[var(--color-ink)]">
                What you get out of the box
              </h2>
              <p className="mt-3 text-[var(--color-muted)]">
                Concrete pieces, not placeholder copy. Extend or replace any row.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="tnum w-full min-w-[20rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-rule)]">
                    <th className="pb-3 pr-6 font-medium text-[var(--color-ink)]">
                      Layer
                    </th>
                    <th className="pb-3 pr-6 font-medium text-[var(--color-ink)]">
                      Included
                    </th>
                    <th className="pb-3 font-medium text-[var(--color-muted)]">
                      Notes
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
