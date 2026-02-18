import { NextResponse } from "next/server";

/**
 * Health check endpoint for monitoring / load balancers.
 * GET or HEAD /api/health returns 200 when the app is up.
 */
export async function GET() {
  return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() }, { status: 200 });
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
