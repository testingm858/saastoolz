// Lightweight admin gate — no separate role table, just an allowlist of
// emails from an env var. Fine for a solo-owner SaaS; revisit with a real
// User.role column if this ever needs multiple admins with different scopes.

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const allowlist = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowlist.includes(email.toLowerCase());
}

// Server-only helper for API routes/pages that need to gate on the signed-in
// admin — returns the email when authorized, null otherwise.
export async function requireAdminEmail(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  return isAdminEmail(email) ? email! : null;
}
