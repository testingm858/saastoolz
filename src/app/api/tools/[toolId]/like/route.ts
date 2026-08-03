import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getOrCreateVisitorId } from "@/lib/visitor";
import { getToolById } from "@/lib/tools";

interface Params {
  params: Promise<{ toolId: string }>;
}

export async function POST(_req: NextRequest, { params }: Params) {
  const { toolId } = await params;
  const tool = getToolById(toolId);
  if (!tool || tool.isPremium) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const visitorId = await getOrCreateVisitorId();
  const existing = await prisma.like.findUnique({
    where: { targetType_targetId_visitorId: { targetType: "tool", targetId: toolId, visitorId } },
  });

  let liked: boolean;
  if (existing) {
    await Promise.all([
      prisma.like.delete({ where: { id: existing.id } }),
      prisma.toolStats.upsert({
        where: { toolId },
        create: { toolId, likes: 0 },
        update: { likes: { decrement: 1 } },
      }),
    ]);
    liked = false;
  } else {
    await Promise.all([
      prisma.like.create({ data: { targetType: "tool", targetId: toolId, visitorId } }),
      prisma.toolStats.upsert({
        where: { toolId },
        create: { toolId, likes: 1 },
        update: { likes: { increment: 1 } },
      }),
    ]);
    liked = true;
  }

  const updated = await prisma.toolStats.findUnique({ where: { toolId }, select: { likes: true } });
  return NextResponse.json({ liked, likes: updated?.likes ?? 0 });
}
