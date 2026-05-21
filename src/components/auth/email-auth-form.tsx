"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  signInWithEmail,
  signUpWithEmail,
  type EmailAuthState,
} from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

type EmailAuthFormProps = {
  nextPath: string;
};

const initialState: EmailAuthState = {};

export function EmailAuthForm({ nextPath }: EmailAuthFormProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [signInState, signInAction, signInPending] = useActionState(
    signInWithEmail,
    initialState,
  );
  const [signUpState, signUpAction, signUpPending] = useActionState(
    signUpWithEmail,
    initialState,
  );

  const state = mode === "signin" ? signInState : signUpState;
  const action = mode === "signin" ? signInAction : signUpAction;
  const pending = mode === "signin" ? signInPending : signUpPending;

  return (
    <div className="space-y-4">
      <div className="flex rounded-[var(--radius-pill)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-1">
        <button
          type="button"
          className={cn(
            "flex-1 rounded-[var(--radius-pill)] px-3 py-1.5 text-sm font-medium transition-colors duration-[var(--dur-short)] ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
            mode === "signin"
              ? "bg-[var(--color-paper)] text-[var(--color-ink)] shadow-sm"
              : "text-[var(--color-muted)] hover:text-[var(--color-ink)]",
          )}
          onClick={() => setMode("signin")}
        >
          Sign in
        </button>
        <button
          type="button"
          className={cn(
            "flex-1 rounded-[var(--radius-pill)] px-3 py-1.5 text-sm font-medium transition-colors duration-[var(--dur-short)] ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
            mode === "signup"
              ? "bg-[var(--color-paper)] text-[var(--color-ink)] shadow-sm"
              : "text-[var(--color-muted)] hover:text-[var(--color-ink)]",
          )}
          onClick={() => setMode("signup")}
        >
          Create account
        </button>
      </div>

      <form action={action} className="space-y-3">
        <input type="hidden" name="next" value={nextPath} />
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete={
              mode === "signin" ? "current-password" : "new-password"
            }
            placeholder={mode === "signin" ? "Your password" : "At least 8 characters"}
            minLength={8}
            required
          />
        </div>

        {state.error ? (
          <p className="text-destructive text-sm" role="alert">
            {state.error}
          </p>
        ) : null}
        {state.success ? (
          <p className="text-muted-foreground text-sm" role="status">
            {state.success}
          </p>
        ) : null}

        <Button type="submit" className="w-full rounded-[var(--radius-pill)]" disabled={pending}>
          {pending
            ? "Please wait…"
            : mode === "signin"
              ? "Sign in"
              : "Create account"}
        </Button>
      </form>
    </div>
  );
}
