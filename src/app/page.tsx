import Link from "next/link";

import { Button } from "@/components/ui/button";

/** TODO(auth-ui): Hero, branding, and CTAs for the template landing page. */
export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 p-6">
      <div className="max-w-2xl space-y-4 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">Template Static</h1>
        <p className="text-muted-foreground text-lg">
          A reusable Next.js starter with Supabase auth, data persistence, and
          Vercel deployment. The demo app is a calculator with saved history.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/login">
          <Button>Sign in</Button>
        </Link>
        <Link href="/calculator">
          <Button variant="outline">Open calculator</Button>
        </Link>
      </div>
    </main>
  );
}
