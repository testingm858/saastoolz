import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getOrCreateVisitorId } from "@/lib/visitor";
import { getToolById } from "@/lib/tools";
import { recordToolVisit } from "@/lib/analytics";

// Fired via navigator.sendBeacon by <ToolTimeTracker> when the visitor leaves
// a tool page — reports how long they had it open, for the Tools tab's
// "avg. time on tool" metric. Beacons can't wait for a response, so this
// always returns quickly and never blocks the unload.
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const toolId = typeof body.toolId === "string" ? body.toolId : "";
  const durationMs = typeof body.durationMs === "number" ? body.durationMs : undefined;
  if (!toolId || !getToolById(toolId) || durationMs == null) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  // Ignore noise: a near-zero duration (bounce) or an implausibly long one
  // (tab left open overnight) isn't a meaningful "time spent using the tool".
  if (durationMs < 1000 || durationMs > 1000 * 60 * 60 * 2) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const [session, visitorId] = await Promise.all([getServerSession(authOptions), getOrCreateVisitorId()]);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  await recordToolVisit({ toolId, visitorId, userId, durationMs });

  return NextResponse.json({ ok: true });
}
