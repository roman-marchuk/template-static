"use client";

import { Equal, History, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  clearHistory,
  listHistory,
  saveCalculation,
  type HistoryListItem,
} from "@/lib/actions/history";
import { evaluateExpression } from "@/lib/calculator/evaluate";
import { cn } from "@/lib/utils";

type CalculatorAppProps = {
  initialHistory: HistoryListItem[];
  canPersist?: boolean;
};

const GUEST_HISTORY_KEY = "calculator-guest-history";

function readGuestHistory(): HistoryListItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = sessionStorage.getItem(GUEST_HISTORY_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as HistoryListItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeGuestHistory(items: HistoryListItem[]) {
  sessionStorage.setItem(GUEST_HISTORY_KEY, JSON.stringify(items));
}

function appendGuestHistory(
  expression: string,
  result: string,
): HistoryListItem[] {
  const entry: HistoryListItem = {
    id: crypto.randomUUID(),
    expression,
    result,
    created_at: new Date().toISOString(),
  };
  const next = [entry, ...readGuestHistory()];
  writeGuestHistory(next);
  return next;
}

const KEYPAD: Array<{ label: string; value: string; className?: string; variant?: "default" | "operator" | "destructive" }> = [
  { label: "C", value: "clear", variant: "destructive" },
  { label: "⌫", value: "backspace" },
  { label: "(", value: "(" },
  { label: ")", value: ")" },
  { label: "7", value: "7" },
  { label: "8", value: "8" },
  { label: "9", value: "9" },
  { label: "÷", value: "/", variant: "operator" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
  { label: "×", value: "*", variant: "operator" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "−", value: "-", variant: "operator" },
  { label: "0", value: "0", className: "col-span-2" },
  { label: ".", value: "." },
  { label: "+", value: "+", variant: "operator" },
];

function formatHistoryDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function CalculatorApp({
  initialHistory,
  canPersist = true,
}: CalculatorAppProps) {
  const [expression, setExpression] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState(initialHistory);
  const [isPending, startTransition] = useTransition();
  const [guestReady, setGuestReady] = useState(canPersist);

  useEffect(() => {
    if (canPersist) {
      return;
    }

    setHistory(readGuestHistory());
    setGuestReady(true);
  }, [canPersist]);

  const displayValue = error ?? preview ?? (expression || "0");

  const append = useCallback((value: string) => {
    setError(null);
    setPreview(null);
    setExpression((prev) => prev + value);
  }, []);

  const handleClear = useCallback(() => {
    setExpression("");
    setPreview(null);
    setError(null);
  }, []);

  const handleBackspace = useCallback(() => {
    setError(null);
    setPreview(null);
    setExpression((prev) => prev.slice(0, -1));
  }, []);

  const handleEquals = useCallback(() => {
    const trimmed = expression.trim();
    if (!trimmed) {
      setError("Enter an expression");
      return;
    }

    try {
      const result = evaluateExpression(trimmed);
      setPreview(result);
      setError(null);

      startTransition(async () => {
        if (!canPersist) {
          const next = appendGuestHistory(trimmed, result);
          setHistory(next);
          setGuestReady(true);
          return;
        }

        try {
          await saveCalculation({ expression: trimmed, result });
          const next = await listHistory();
          setHistory(next);
        } catch (err) {
          toast.error(
            err instanceof Error ? err.message : "Failed to save calculation",
          );
        }
      });
    } catch (err) {
      setPreview(null);
      setError(err instanceof Error ? err.message : "Invalid expression");
    }
  }, [canPersist, expression]);

  const handleKey = useCallback(
    (value: string) => {
      if (value === "clear") {
        handleClear();
        return;
      }
      if (value === "backspace") {
        handleBackspace();
        return;
      }
      if (value === "=") {
        handleEquals();
        return;
      }
      append(value);
    },
    [append, handleBackspace, handleClear, handleEquals],
  );

  const handleHistorySelect = useCallback((item: HistoryListItem) => {
    setExpression(item.expression);
    setPreview(item.result);
    setError(null);
  }, []);

  const handleClearHistory = useCallback(() => {
    startTransition(async () => {
      if (!canPersist) {
        sessionStorage.removeItem(GUEST_HISTORY_KEY);
        setHistory([]);
        return;
      }

      try {
        await clearHistory();
        setHistory([]);
        toast.success("History cleared");
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to clear history",
        );
      }
    });
  }, [canPersist]);

  return (
    <div className="grid min-w-0 flex-1 gap-6 lg:grid-cols-[minmax(0,22rem)_1fr]">
      <section className="rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper)] p-5">
        <p className="font-mono text-[0.65rem] uppercase tracking-[var(--tracking-label)] text-[var(--color-muted)]">
          Input
        </p>

        <div
          className={cn(
            "tnum mt-3 rounded-md border border-[var(--color-rule)] bg-[var(--color-paper-2)] px-4 py-3 text-right font-mono text-2xl tracking-tight",
            error && "border-[var(--color-destructive)] text-[var(--color-destructive)]",
          )}
          aria-live="polite"
          aria-label="Calculator display"
        >
          <p className="truncate">{displayValue}</p>
          {expression && preview && !error ? (
            <p className="truncate text-xs text-[var(--color-muted)]">
              {expression}
            </p>
          ) : null}
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {KEYPAD.map((key) => (
            <Button
              key={key.label}
              type="button"
              variant={
                key.variant === "destructive"
                  ? "destructive"
                  : key.variant === "operator"
                    ? "default"
                    : "secondary"
              }
              className={cn(
                "h-11 rounded-md font-mono text-base",
                key.variant === "operator" && "bg-[var(--color-ink)] text-[var(--color-accent-ink)] hover:bg-[var(--color-ink-2)]",
                key.className,
              )}
              disabled={isPending}
              onClick={() => handleKey(key.value)}
            >
              {key.label}
            </Button>
          ))}
          <Button
            type="button"
            className="col-span-4 h-11 rounded-[var(--radius-pill)] font-mono text-base"
            disabled={isPending || !expression.trim()}
            onClick={() => handleKey("=")}
          >
            <Equal />
            Calculate
          </Button>
        </div>
      </section>

      <section className="flex min-h-80 min-w-0 flex-col rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)]">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--color-rule)] p-5">
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--color-ink)]">
              <History className="size-4 shrink-0 text-[var(--color-accent)]" />
              History
            </h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              {canPersist
                ? "Tap a row to restore an expression"
                : "Session history — sign in to sync across devices"}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 rounded-[var(--radius-pill)]"
            disabled={isPending || history.length === 0}
            onClick={handleClearHistory}
          >
            <Trash2 />
            Clear
          </Button>
        </div>

        <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {!guestReady || history.length === 0 ? (
            <p className="px-2 py-6 text-sm text-[var(--color-muted)]">
              {canPersist
                ? "No calculations yet. Press Calculate to save results."
                : "No calculations yet. Press Calculate to add to this session."}
            </p>
          ) : (
            <ul className="flex flex-col">
              {history.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className="w-full border-b border-[var(--color-rule)] px-3 py-3 text-left transition-colors duration-[var(--dur-short)] ease-[var(--ease-out)] last:border-0 hover:bg-[var(--color-paper-3)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-focus)]"
                    onClick={() => handleHistorySelect(item)}
                  >
                    <p className="tnum font-mono text-sm">
                      <span className="text-[var(--color-muted)]">
                        {item.expression}
                      </span>{" "}
                      <span className="text-[var(--color-ink)]">
                        = {item.result}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-muted)]">
                      {formatHistoryDate(item.created_at)}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
