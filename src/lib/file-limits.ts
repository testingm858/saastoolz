// Vercel enforces a hard ~4.5MB request-body ceiling on serverless functions
// (FUNCTION_PAYLOAD_TOO_LARGE) — this is a platform limit, not something
// next.config.ts/vercel.json can raise. We stay under it with headroom for
// multipart boundaries and any other form fields in the same request.
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // 4MB
export const MAX_UPLOAD_MB = 4;

export function formatMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}
