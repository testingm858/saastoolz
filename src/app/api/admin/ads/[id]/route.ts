// PATCH/DELETE /api/admin/ads/[id] — update (incl. enable toggle) and delete an ad slot. Admin-only.

import { NextResponse } from "next/server";
import { requireAdminEmail } from "@/lib/admin";
import { slugify } from "@/lib/utils";
import prisma from "@/lib/prisma";

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: Request, { params }: Props) {
  if (!(await requireAdminEmail())) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }
  const { id } = await params;

  const existing = await prisma.adSlot.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Ad slot not found" }, { status: 404 });
  }

  const body = await req.json();
  const data: { label?: string; key?: string; code?: string | null; enabled?: boolean } = {};

  if (typeof body.label === "string" && body.label.trim()) data.label = body.label.trim();
  if (typeof body.code === "string" || body.code === null) data.code = body.code;
  if (typeof body.enabled === "boolean") data.enabled = body.enabled;

  if (typeof body.key === "string" && body.key.trim()) {
    const nextKey = slugify(body.key);
    if (!nextKey) return NextResponse.json({ error: "Invalid key" }, { status: 400 });
    if (nextKey !== existing.key) {
      const clash = await prisma.adSlot.findUnique({ where: { key: nextKey } });
      if (clash) return NextResponse.json({ error: `Key "${nextKey}" is already in use` }, { status: 409 });
      data.key = nextKey;
    }
  }

  const slot = await prisma.adSlot.update({ where: { id }, data });
  return NextResponse.json({ slot });
}

export async function DELETE(_req: Request, { params }: Props) {
  if (!(await requireAdminEmail())) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }
  const { id } = await params;
  await prisma.adSlot.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
