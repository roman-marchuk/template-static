import Link from "next/link";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

function getInitials(
  name: string | null | undefined,
  email: string | null | undefined,
) {
  if (name) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  if (email) {
    return email.slice(0, 2).toUpperCase();
  }

  return "?";
}

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", user.id)
        .maybeSingle()
    : { data: null };

  const displayName =
    profile?.display_name ??
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    null;
  const avatarUrl =
    profile?.avatar_url ?? user?.user_metadata?.avatar_url ?? null;
  const email = user?.email ?? null;

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="hairline-bottom page-gutter py-4">
        <div className="page-max flex items-center justify-between gap-4">
          <Link
            href="/calculator"
            className="font-display text-sm font-semibold tracking-tight text-[var(--color-ink)]"
          >
            Template Static
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5">
                <Avatar size="sm">
                  {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
                  <AvatarFallback>
                    {getInitials(displayName, email)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-right sm:block">
                  {displayName ? (
                    <p className="text-sm font-medium leading-none text-[var(--color-ink)]">
                      {displayName}
                    </p>
                  ) : null}
                  {email ? (
                    <p className="text-xs text-[var(--color-muted)]">{email}</p>
                  ) : null}
                </div>
              </div>
              <SignOutButton />
            </div>
          ) : (
            <Link href="/login?next=/calculator">
              <Button
                variant="outline"
                size="sm"
                className="rounded-[var(--radius-pill)]"
              >
                Sign in
              </Button>
            </Link>
          )}
        </div>
      </header>

      <div className="page-max page-gutter flex w-full flex-1 flex-col py-[var(--space-lg)]">
        {children}
      </div>
    </div>
  );
}
