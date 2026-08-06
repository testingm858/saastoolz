// GET/POST /api/admin/ads — list and create ad slots. Admin-only.

import { NextResponse } from "next/server";
import { requireAdminEmail } from "@/lib/admin";
import { adSlotKey, isAdPage, isAdPosition } from "@/lib/adPlacements";
import prisma from "@/lib/prisma";

export async function GET() {
  if (!(await requireAdminEmail())) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }
  const slots = await prisma.adSlot.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json({ slots });
}

export async function POST(req: Request) {
  if (!(await requireAdminEmail())) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const body = await req.json();
  if (!isAdPage(body.page)) {
    return NextResponse.json({ error: "Invalid page" }, { status: 400 });
  }
  if (!isAdPosition(body.position)) {
    return NextResponse.json({ error: "Invalid position" }, { status: 400 });
  }

  const key = adSlotKey(body.page, body.position);
  const existing = await prisma.adSlot.findUnique({ where: { key } });
  if (existing) {
    return NextResponse.json({ error: "A slot already exists for that page and position — edit it instead" }, { status: 409 });
  }

  const code = typeof body.code === "string" ? body.code : null;
  const enabled = body.enabled === true;
  const slot = await prisma.adSlot.create({ data: { key, page: body.page, position: body.position, code, enabled } });

  return NextResponse.json({ slot }, { status: 201 });
}
