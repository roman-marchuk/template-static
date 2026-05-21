"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

async function getOrigin(): Promise<string> {
  const headersList = await headers();
  const origin = headersList.get("origin");
  if (origin) return origin;

  const host =
    headersList.get("x-forwarded-host") ?? headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  if (host) return `${protocol}://${host}`;

  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

const emailSchema = z.string().email("Enter a valid email address");
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password is too long");

export type EmailAuthState = {
  error?: string;
  success?: string;
};

function safeNextPath(next: FormDataEntryValue | null): string {
  const value = typeof next === "string" ? next : "";
  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/calculator";
  }
  return value;
}

function parseCredentials(formData: FormData) {
  const emailResult = emailSchema.safeParse(formData.get("email"));
  if (!emailResult.success) {
    return { error: emailResult.error.issues[0]?.message ?? "Invalid email" };
  }

  const passwordResult = passwordSchema.safeParse(formData.get("password"));
  if (!passwordResult.success) {
    return {
      error: passwordResult.error.issues[0]?.message ?? "Invalid password",
    };
  }

  return {
    email: emailResult.data,
    password: passwordResult.data,
    next: safeNextPath(formData.get("next")),
  };
}

export async function signInWithEmail(
  _prevState: EmailAuthState,
  formData: FormData,
): Promise<EmailAuthState> {
  const parsed = parseCredentials(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.email,
    password: parsed.password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect(parsed.next);
}

export async function signUpWithEmail(
  _prevState: EmailAuthState,
  formData: FormData,
): Promise<EmailAuthState> {
  const parsed = parseCredentials(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const supabase = await createClient();
  const origin = await getOrigin();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.email,
    password: parsed.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.session) {
    redirect(parsed.next);
  }

  return {
    success:
      "Account created. Check your email to confirm your address, then sign in.",
  };
}
