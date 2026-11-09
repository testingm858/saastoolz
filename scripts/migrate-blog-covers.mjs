// One-off: move legacy base64 `data:` blog cover images out of the DB into
// real files under public/uploads/blog, and store the path instead.
// This is the root cause of the 25 MB /blog and 2 MB post pages — rows saved
// before commit 3c59e00 still hold the base64 inline.
//
// Run ON THE PRODUCTION HOST (files must land in its public/ dir):
//   node scripts/migrate-blog-covers.mjs          # dry run, lists what would change
//   node scripts/migrate-blog-covers.mjs --apply  # writes files, updates rows
import { PrismaClient } from "@prisma/client";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const apply = process.argv.includes("--apply");
const prisma = new PrismaClient();
const dir = path.join(process.cwd(), "public", "uploads", "blog");
const EXT = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "image/avif": "avif" };

const rows = await prisma.blogPost.findMany({ where: { coverImage: { startsWith: "data:image/" } }, select: { id: true, slug: true, coverImage: true } });
console.log(`${rows.length} post(s) with base64 covers${apply ? "" : " (dry run — pass --apply)"}`);
if (apply) await mkdir(dir, { recursive: true });
for (const r of rows) {
  const m = r.coverImage.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/s);
  if (!m) { console.log(`skip ${r.slug}: unparseable`); continue; }
  const file = `${r.slug}-${Date.now()}.${EXT[m[1]] ?? "jpg"}`;
  console.log(`${r.slug}: ${(m[2].length / 1048576).toFixed(2)} MB base64 -> /uploads/blog/${file}`);
  if (!apply) continue;
  await writeFile(path.join(dir, file), Buffer.from(m[2], "base64"));
  await prisma.blogPost.update({ where: { id: r.id }, data: { coverImage: `/uploads/blog/${file}` } });
}
await prisma.$disconnect();
