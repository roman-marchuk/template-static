# Design — Template Static

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

## Genre

modern-minimal

## Macrostructure family

- Marketing pages: Split Diptych (H2) — title left, proof right; features as tabular spec sheet (F3)
- App pages: Workbench — functional chrome, product carries the page; no enrichment
- Auth pages: Split panel — brand copy left, form right; typography only

## Theme

- `--color-paper` oklch(99% 0.003 280)
- `--color-paper-2` oklch(97% 0.004 280)
- `--color-ink` oklch(14% 0.015 280)
- `--color-ink-2` oklch(28% 0.018 280)
- `--color-rule` oklch(90% 0.006 280)
- `--color-accent` oklch(58% 0.16 285)
- `--color-focus` oklch(58% 0.16 285)

## Typography

- Display: Geist Sans, weight 600, normal
- Body: Geist Sans, weight 400
- Mono: Geist Mono, weight 400
- Display tracking: -0.035em
- Type scale anchor: `--text-display` = clamp(2.5rem, 5.5vw + 0.5rem, 5rem)

## Spacing

4-point named scale. Values live in `tokens.css`. Pages must use named tokens or Tailwind utilities mapped to them — never raw pixel values for section rhythm.

## Motion

- Easings: `--ease-out`, `--ease-in`, `--ease-in-out`
- Reveal pattern: none — pages are composed, not animated in
- Reduced-motion fallback: opacity-only, ≤ 150 ms

## Microinteractions stance

- Silent success for history saves; toasts only on errors
- Hover delay 800 ms on tooltips; focus delay 0 ms
- Transform + opacity only; no layout animation

## CTA voice

- Primary CTA: filled pill, ink background, white label, `→` suffix optional
- Secondary CTA: outline pill, hairline border, ink label

## Per-page allowances

- Marketing pages MAY use Tier-A CSS product previews (no fake browser chrome)
- App pages MUST NOT use enrichment — function carries the page
- Auth pages: typography only

## What pages MUST share

- Wordmark: "Template Static" in display face
- Accent violet on focus rings and sparing marks only (≤ 5% viewport)
- Geist display + body pairing
- Pill CTAs with 999px radius
- Hairline rules at `--color-rule`

## What pages MAY differ on

- Macrostructure within family (marketing split vs app workbench)
- Nav archetype: N5 floating pill (marketing), N9 edge-aligned minimal (app)
- Footer: Ft2 inline single line on marketing only

## Exports

See `tokens.css` at project root for the canonical token block. Shadcn variables in `globals.css` mirror these values for component compatibility.
