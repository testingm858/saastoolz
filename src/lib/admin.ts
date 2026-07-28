// Lightweight admin gate — no separate role table, just an allowlist of
// emails from an env var. Fine for a solo-owner SaaS; revisit with a real
// User.role column if this ever needs multiple admins with different scopes.

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const allowlist = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowlist.includes(email.toLowerCase());
}
