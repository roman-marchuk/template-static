"use server";

import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import type { CalculatorHistoryEntry } from "@/types/database";

const saveCalculationSchema = z.object({
  expression: z
    .string()
    .trim()
    .min(1, "Expression is required")
    .max(512, "Expression is too long"),
  result: z
    .string()
    .trim()
    .min(1, "Result is required")
    .max(128, "Result is too long"),
});

export type HistoryListItem = Pick<
  CalculatorHistoryEntry,
  "id" | "expression" | "result" | "created_at"
>;

async function getOptionalUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { supabase, user: null };
  }

  return { supabase, user };
}

async function requireUser() {
  const { supabase, user } = await getOptionalUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  return { supabase, user };
}

export async function saveCalculation(input: {
  expression: string;
  result: string;
}): Promise<void> {
  const parsed = saveCalculationSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const { supabase, user } = await requireUser();

  const { error } = await supabase.from("calculator_history").insert({
    user_id: user.id,
    expression: parsed.data.expression,
    result: parsed.data.result,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function listHistory(): Promise<HistoryListItem[]> {
  const { supabase, user } = await getOptionalUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("calculator_history")
    .select("id, expression, result, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[listHistory]", error.message);
    return [];
  }

  return data ?? [];
}

export async function clearHistory(): Promise<void> {
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("calculator_history")
    .delete()
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }
}
