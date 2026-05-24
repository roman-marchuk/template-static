"use client";

import dynamic from "next/dynamic";

import type { HistoryListItem } from "@/lib/actions/history";

const CalculatorApp = dynamic(
  () =>
    import("@/components/calculator/calculator-app").then(
      (module) => module.CalculatorApp,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        className="grid min-w-0 flex-1 gap-6 lg:grid-cols-[minmax(0,22rem)_1fr]"
        aria-hidden="true"
      >
        <div className="h-80 animate-pulse rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper)]" />
        <div className="min-h-80 animate-pulse rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)]" />
      </div>
    ),
  },
);

type CalculatorLoaderProps = {
  initialHistory: HistoryListItem[];
  canPersist: boolean;
};

export function CalculatorLoader({
  initialHistory,
  canPersist,
}: CalculatorLoaderProps) {
  return (
    <CalculatorApp initialHistory={initialHistory} canPersist={canPersist} />
  );
}
