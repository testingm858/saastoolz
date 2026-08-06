// PATCH/DELETE /api/admin/ads/[id] — update (incl. enable toggle) and delete an ad slot. Admin-only.

import { NextResponse } from "next/server";
import { requireAdminEmail } from "@/lib/admin";
import { adSlotKey, isAdPage, isAdPosition } from "@/lib/adPlacements";
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
  const data: { key?: string; page?: string; position?: string; code?: string | null; enabled?: boolean } = {};

  if (typeof body.code === "string" || body.code === null) data.code = body.code;
  if (typeof body.enabled === "boolean") data.enabled = body.enabled;

  const nextPage = body.page !== undefined ? body.page : existing.page;
  const nextPosition = body.position !== undefined ? body.position : existing.position;
  if (body.page !== undefined || body.position !== undefined) {
    if (!isAdPage(nextPage)) return NextResponse.json({ error: "Invalid page" }, { status: 400 });
    if (!isAdPosition(nextPosition)) return NextResponse.json({ error: "Invalid position" }, { status: 400 });
    const nextKey = adSlotKey(nextPage, nextPosition);
    if (nextKey !== existing.key) {
      const clash = await prisma.adSlot.findUnique({ where: { key: nextKey } });
      if (clash) return NextResponse.json({ error: "A slot already exists for that page and position" }, { status: 409 });
      data.key = nextKey;
      data.page = nextPage;
      data.position = nextPosition;
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
