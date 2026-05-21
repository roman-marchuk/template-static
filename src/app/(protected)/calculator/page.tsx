import Link from "next/link";

import { CalculatorApp } from "@/components/calculator/calculator-app";
import { Button } from "@/components/ui/button";
import { listHistory } from "@/lib/actions/history";
import { createClient } from "@/lib/supabase/server";

export default async function CalculatorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const history = user ? await listHistory() : [];

  return (
    <main className="flex flex-1 flex-col">
      <div className="mb-[var(--space-lg)] min-w-0">
        <p className="font-mono text-[0.65rem] uppercase tracking-[var(--tracking-label)] text-[var(--color-muted)]">
          Workbench
        </p>
        <h1 className="text-display-s mt-2 font-display font-semibold text-[var(--color-ink)]">
          Calculator
        </h1>
        <p className="mt-2 max-w-[48ch] text-sm text-[var(--color-muted)]">
          {user
            ? "Expressions evaluate client-side; results can be saved and loaded from your history table."
            : "Expressions evaluate client-side. Sign in to write history to your account."}
        </p>
        {!user ? (
          <Link href="/login?next=/calculator" className="mt-4 inline-block">
            <Button
              variant="outline"
              size="sm"
              className="rounded-[var(--radius-pill)]"
            >
              Sign in
            </Button>
          </Link>
        ) : null}
      </div>

      <CalculatorApp initialHistory={history} canPersist={!!user} />
    </main>
  );
}
