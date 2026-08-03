import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const COOKIE = "visitor_id";

// Anonymous, non-identifying id used only to toggle likes idempotently
// (so clicking twice removes the like instead of double-counting).
export async function getVisitorId(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE)?.value ?? null;
}

export async function getOrCreateVisitorId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(COOKIE)?.value;
  if (existing) return existing;
  const id = randomUUID();
  store.set(COOKIE, id, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 365, path: "/" });
  return id;
}
