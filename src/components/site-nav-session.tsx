import { SignOutButton } from "@/components/auth/sign-out-button";
import { SiteNav } from "@/components/site-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCurrentUserWithProfile } from "@/lib/auth/session";

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

export async function SiteNavSession() {
  const { user, displayName, avatarUrl, email } =
    await getCurrentUserWithProfile();

  const accountChrome = user ? (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="flex items-center gap-2">
        <Avatar size="sm">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
          <AvatarFallback>{getInitials(displayName, email)}</AvatarFallback>
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
  ) : undefined;

  return <SiteNav signedIn={!!user} trailing={accountChrome} />;
}
