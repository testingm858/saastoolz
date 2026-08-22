// PATCH/DELETE /api/admin/blog/[id] — update (incl. publish toggle) and delete a post. Admin-only.

import { NextResponse } from "next/server";
import { requireAdminEmail } from "@/lib/admin";
import { slugify } from "@/lib/utils";
import { validateCoverImage } from "@/lib/file-limits";
import prisma from "@/lib/prisma";

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: Request, { params }: Props) {
  if (!(await requireAdminEmail())) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }
  const { id } = await params;

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const body = await req.json();
  const data: {
    title?: string;
    slug?: string;
    excerpt?: string | null;
    coverImage?: string | null;
    content?: string;
    published?: boolean;
    publishedAt?: Date | null;
  } = {};

  if (typeof body.title === "string" && body.title.trim()) data.title = body.title.trim();
  if (typeof body.content === "string") data.content = body.content;
  if (typeof body.excerpt === "string" || body.excerpt === null) data.excerpt = body.excerpt?.trim() || null;

  if (body.coverImage !== undefined) {
    const coverImageResult = validateCoverImage(body.coverImage);
    if (!coverImageResult.ok) return NextResponse.json({ error: coverImageResult.error }, { status: 400 });
    data.coverImage = coverImageResult.value;
  }

  if (typeof body.slug === "string" && body.slug.trim()) {
    const nextSlug = slugify(body.slug);
    if (!nextSlug) return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    if (nextSlug !== existing.slug) {
      const clash = await prisma.blogPost.findUnique({ where: { slug: nextSlug } });
      if (clash) return NextResponse.json({ error: `Slug "${nextSlug}" is already in use` }, { status: 409 });
      data.slug = nextSlug;
    }
  }

  if (typeof body.published === "boolean" && body.published !== existing.published) {
    data.published = body.published;
    data.publishedAt = body.published ? new Date() : null;
  }

  const post = await prisma.blogPost.update({ where: { id }, data });
  return NextResponse.json({ post });
}

export async function DELETE(_req: Request, { params }: Props) {
  if (!(await requireAdminEmail())) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }
  const { id } = await params;
  await prisma.blogPost.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
