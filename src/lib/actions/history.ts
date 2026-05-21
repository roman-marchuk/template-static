"use server";

/** TODO(data): Persist a calculation for the authenticated user. */

export async function saveCalculation(_input: {
  expression: string;
  result: string;
}): Promise<void> {
  throw new Error("Not implemented — data agent owns this action.");
}

/** TODO(data): Return recent calculations for the authenticated user. */
export async function listHistory(): Promise<
  Array<{ id: string; expression: string; result: string; created_at: string }>
> {
  throw new Error("Not implemented — data agent owns this action.");
}

/** TODO(data): Delete all history for the authenticated user. */
export async function clearHistory(): Promise<void> {
  throw new Error("Not implemented — data agent owns this action.");
}
