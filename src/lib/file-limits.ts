// Now running as a persistent Node process on Hostinger, not Vercel
// serverless functions — the old 4MB cap existed only to stay under
// Vercel's hard ~4.5MB FUNCTION_PAYLOAD_TOO_LARGE ceiling, which no longer
// applies. 100MB covers large scanned/OCR PDFs, multi-hundred-page reports
// and camera-original photos. Checked live: Hostinger's proxy accepts request
// bodies of at least 120MB, so the only ceiling is this constant. Worst-case
// memory per request grows with it, so don't raise it much further without
// checking the plan's RAM.
export const MAX_UPLOAD_BYTES = 100 * 1024 * 1024; // 100MB
export const MAX_UPLOAD_MB = 100;

// Per-request memory use grows several times over the upload size (a PDF is
// parsed, re-encoded and re-saved in memory), so what a visitor may upload
// depends on who they are. Only paying plans get the full 100MB ceiling;
// anonymous and free visitors stay well inside what the server can take
// concurrently without running out of memory.
export const ANON_UPLOAD_MB = 20;
export const FREE_UPLOAD_MB = 30;

export function uploadLimitMB(plan: "FREE" | "PRO" | "ENTERPRISE" | null): number {
  if (plan === "PRO" || plan === "ENTERPRISE") return MAX_UPLOAD_MB;
  if (plan === "FREE") return FREE_UPLOAD_MB;
  return ANON_UPLOAD_MB;
}

// Wording shared by the server error and the browser pre-check.
export function uploadLimitHint(limitMB: number): string {
  if (limitMB >= MAX_UPLOAD_MB) return "";
  return limitMB < FREE_UPLOAD_MB
    ? ` Sign in free for ${FREE_UPLOAD_MB}MB, or go Pro for ${MAX_UPLOAD_MB}MB.`
    : ` Upgrade to Pro for up to ${MAX_UPLOAD_MB}MB.`;
}

// Blog cover images are stored inline as base64 data: URLs (no external
// storage is wired up), which travel through the same Vercel body-limit
// admin API routes and inflate ~33% when base64-encoded — kept well under
// MAX_UPLOAD_BYTES so the encoded string plus the rest of the post JSON
// still clears the ~4.5MB ceiling above.
export const MAX_COVER_IMAGE_BYTES = 1.5 * 1024 * 1024; // 1.5MB
export const MAX_COVER_IMAGE_MB = 1.5;

export function formatMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}

// Shared server-side check for the blog cover-image field — accepts null
// (no image) or a same-origin-safe `data:image/...` URL under the size
// budget above. Used by both the create and update admin blog routes.
export function validateCoverImage(value: unknown): { ok: true; value: string | null } | { ok: false; error: string } {
  if (value === null || value === undefined) return { ok: true, value: null };
  if (typeof value !== "string") return { ok: false, error: "Invalid cover image" };
  if (!value.startsWith("data:image/")) return { ok: false, error: "Cover image must be an uploaded image file" };
  if (value.length > MAX_COVER_IMAGE_BYTES * 1.4) {
    return { ok: false, error: `Cover image exceeds the ${MAX_COVER_IMAGE_MB}MB limit` };
  }
  return { ok: true, value };
}
