/** TODO(auth-core): Exchange OAuth code for session and redirect to /calculator. */

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "Not implemented — auth-core agent owns this route." },
    { status: 501 },
  );
}
