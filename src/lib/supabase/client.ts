/** TODO(auth-core): Implement Supabase browser client with @supabase/ssr. */

export function createClient(): never {
  throw new Error("Not implemented — auth-core agent owns this file.");
}

export type SupabaseBrowserClient = ReturnType<typeof createClient>;
