import Link from "next/link";

import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/** TODO(auth-ui): Polish login page and wire OAuth server actions. */
export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Template Static — Google and Apple via Supabase.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <OAuthButtons />
          <Link href="/">
            <Button variant="ghost">Back to home</Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
