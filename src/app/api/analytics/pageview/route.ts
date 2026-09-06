import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getOrCreateVisitorId } from "@/lib/visitor";
import { recordPageView } from "@/lib/analytics";

// Fired once per page load by <PageViewTracker> (see src/components/analytics).
// First-party, no third-party pixel — backs the Visitors tab in /admin.
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const path = typeof body.path === "string" ? body.path.slice(0, 500) : "";
  if (!path) return NextResponse.json({ error: "path is required" }, { status: 400 });

  const [session, visitorId] = await Promise.all([getServerSession(authOptions), getOrCreateVisitorId()]);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  await recordPageView({
    path,
    visitorId,
    userId,
    referrer: typeof body.referrer === "string" ? body.referrer.slice(0, 500) : undefined,
  });

  return NextResponse.json({ ok: true });
}
