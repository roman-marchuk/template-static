/** TODO(auth-core): Implement session refresh helper for middleware. */

import type { NextRequest, NextResponse } from "next/server";

export async function updateSession(
  _request: NextRequest,
  _response: NextResponse,
): Promise<NextResponse> {
  throw new Error("Not implemented — auth-core agent owns this file.");
}
