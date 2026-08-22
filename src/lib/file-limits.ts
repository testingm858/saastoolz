// Vercel enforces a hard ~4.5MB request-body ceiling on serverless functions
// (FUNCTION_PAYLOAD_TOO_LARGE) — this is a platform limit, not something
// next.config.ts/vercel.json can raise. We stay under it with headroom for
// multipart boundaries and any other form fields in the same request.
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // 4MB
export const MAX_UPLOAD_MB = 4;

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
