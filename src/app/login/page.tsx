import Link from "next/link";

import { EmailAuthForm } from "@/components/auth/email-auth-form";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type LoginPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

function safeNextPath(next: string | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/calculator";
  }
  return next;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = safeNextPath(params.next);

  return (
    <>
      <SiteNav />

      <main className="flex min-h-[calc(100vh-1rem)] flex-1 flex-col pt-[calc(var(--nav-pill-offset)+3.5rem)] lg:min-h-screen lg:flex-row lg:pt-0">
        <section className="page-gutter flex flex-1 flex-col justify-center border-[var(--color-rule)] py-10 lg:border-r lg:py-0">
          <div className="page-max mx-auto w-full max-w-md lg:max-w-lg">
            <p className="font-mono text-[0.65rem] uppercase tracking-[var(--tracking-label)] text-[var(--color-muted)]">
              Account access
            </p>
            <h1 className="text-display-s mt-3 font-display font-semibold text-balance text-[var(--color-ink)]">
              Sign in to save your work
            </h1>
            <p className="mt-4 max-w-[38ch] leading-relaxed text-[var(--color-muted)]">
              The calculator persists history per account. Use email or Google —
              sessions stay active across reloads.
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex text-sm text-[var(--color-muted)] underline-offset-4 transition-colors hover:text-[var(--color-ink)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            >
              ← Back to home
            </Link>
          </div>
        </section>

        <section className="page-gutter flex flex-1 items-center justify-center bg-[var(--color-paper-2)] py-10 lg:py-16">
          <div className="w-full max-w-md rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper)] p-6 sm:p-8">
            <div className="mb-6 space-y-1">
              <h2 className="text-lg font-semibold text-[var(--color-ink)]">
                Welcome
              </h2>
              <p className="text-sm text-[var(--color-muted)]">
                Sign in or create an account to use the calculator.
              </p>
            </div>

            <div className="space-y-6">
              <EmailAuthForm nextPath={nextPath} />
              <div className="relative">
                <Separator />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-paper)] px-2 text-xs text-[var(--color-muted)]">
                  or
                </span>
              </div>
              <OAuthButtons />
              {params.error === "auth_callback_failed" ? (
                <p
                  className="text-center text-sm text-[var(--color-destructive)]"
                  role="alert"
                >
                  Sign-in failed. Please try again.
                </p>
              ) : null}
            </div>

            <div className="mt-6 lg:hidden">
              <Link href="/" className="block w-full">
                <Button variant="ghost" className="w-full rounded-[var(--radius-pill)]">
                  Back to home
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
