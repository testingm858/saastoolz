import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getOrCreateVisitorId } from "@/lib/visitor";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function POST(_req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug }, select: { id: true, published: true } });
  if (!post || !post.published) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const visitorId = await getOrCreateVisitorId();
  const existing = await prisma.like.findUnique({
    where: { targetType_targetId_visitorId: { targetType: "blog", targetId: slug, visitorId } },
  });

  let liked: boolean;
  if (existing) {
    await Promise.all([
      prisma.like.delete({ where: { id: existing.id } }),
      prisma.blogPost.update({ where: { id: post.id }, data: { likes: { decrement: 1 } } }),
    ]);
    liked = false;
  } else {
    await Promise.all([
      prisma.like.create({ data: { targetType: "blog", targetId: slug, visitorId } }),
      prisma.blogPost.update({ where: { id: post.id }, data: { likes: { increment: 1 } } }),
    ]);
    liked = true;
  }

  const updated = await prisma.blogPost.findUnique({ where: { id: post.id }, select: { likes: true } });
  return NextResponse.json({ liked, likes: updated?.likes ?? 0 });
}
