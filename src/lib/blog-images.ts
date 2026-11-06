// Converts an admin-uploaded blog cover image from a base64 `data:` URL into
// a real file under /public/uploads/blog, so it ships as its own cacheable,
// next/image-optimizable asset instead of ~2MB of inline base64 bloating the
// DB row and every page load. Already-persisted paths and null pass through
// unchanged (the admin form resubmits the existing value on edits that don't
// touch the image).

import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "blog");
const PUBLIC_PREFIX = "/uploads/blog/";

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export async function persistCoverImage(value: string | null, slug: string): Promise<string | null> {
  if (!value || !value.startsWith("data:image/")) return value;

  const match = value.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return value;
  const [, mime, base64] = match;
  const ext = EXT_BY_MIME[mime] ?? "jpg";

  await mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${slug}-${Date.now()}.${ext}`;
  await writeFile(path.join(UPLOAD_DIR, filename), Buffer.from(base64, "base64"));
  return `${PUBLIC_PREFIX}${filename}`;
}

// Best-effort cleanup when a cover image is replaced or its post deleted —
// never let a missing/locked file fail the surrounding request.
export async function deleteCoverImageFile(coverImage: string | null | undefined): Promise<void> {
  if (!coverImage || !coverImage.startsWith(PUBLIC_PREFIX)) return;
  await unlink(path.join(UPLOAD_DIR, coverImage.slice(PUBLIC_PREFIX.length))).catch(() => {});
}
