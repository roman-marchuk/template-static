import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type SiteNavProps = {
  signedIn?: boolean;
  trailing?: ReactNode;
};

export function SiteNav({ signedIn = false, trailing }: SiteNavProps) {
  return (
    <nav
      className="nav-pill-surface fixed inset-x-0 top-[var(--nav-pill-offset)] z-[300] mx-auto flex w-fit max-w-[calc(100%-2rem)] items-center gap-4 rounded-[var(--radius-pill)] px-3.5 py-2 sm:gap-6 sm:px-4"
      aria-label="Primary"
    >
      <Link
        href="/"
        className="font-display shrink-0 text-sm font-semibold tracking-tight"
      >
        Template Static
      </Link>

      <div className="hidden h-4 w-px bg-[var(--color-rule)] sm:block" aria-hidden />

      <ul className="hidden items-center gap-5 sm:flex">
        <li>
          <Link
            href="/calculator"
            className="text-sm text-[var(--color-muted)] transition-colors duration-[var(--dur-short)] ease-[var(--ease-out)] hover:text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            Calculator
          </Link>
        </li>
      </ul>

      <div className="ml-auto flex items-center gap-2">
        {trailing ??
          (signedIn ? null : (
            <Link href="/login">
              <Button size="sm" className="rounded-[var(--radius-pill)]">
                Sign in
              </Button>
            </Link>
          ))}
      </div>
    </nav>
  );
}
