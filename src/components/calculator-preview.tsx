function Key({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <div
      className={
        accent
          ? "flex h-9 items-center justify-center rounded-md bg-[var(--color-ink)] font-mono text-sm text-[var(--color-accent-ink)]"
          : "flex h-9 items-center justify-center rounded-md border border-[var(--color-rule)] bg-[var(--color-paper)] font-mono text-sm text-[var(--color-ink-2)]"
      }
    >
      {label}
    </div>
  );
}

export function CalculatorPreview() {
  return (
    <figure
      className="relative w-full min-w-0 overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-5"
      aria-label="Calculator preview"
    >
      <p className="mb-4 font-mono text-[0.65rem] uppercase tracking-[var(--tracking-label)] text-[var(--color-muted)]">
        Reference UI
      </p>

      <div className="mb-4 rounded-md border border-[var(--color-rule)] bg-[var(--color-paper)] px-4 py-3 text-right">
        <p className="tnum truncate font-mono text-2xl font-medium tracking-tight text-[var(--color-ink)]">
          42
        </p>
        <p className="tnum truncate font-mono text-xs text-[var(--color-muted)]">
          (6 + 4) × 3 + 12
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <Key label="C" />
        <Key label="⌫" />
        <Key label="(" />
        <Key label=")" />
        <Key label="7" />
        <Key label="8" />
        <Key label="9" />
        <Key label="÷" />
        <Key label="4" />
        <Key label="5" />
        <Key label="6" />
        <Key label="×" />
        <Key label="1" />
        <Key label="2" />
        <Key label="3" />
        <Key label="−" />
        <Key label="0" accent />
        <Key label="." />
        <Key label="+" accent />
        <Key label="=" accent />
      </div>

      <figcaption className="sr-only">
        Static preview of the built-in calculator interface
      </figcaption>
    </figure>
  );
}
