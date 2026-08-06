// GET/POST /api/admin/ads — list and create ad slots. Admin-only.

import { NextResponse } from "next/server";
import { requireAdminEmail } from "@/lib/admin";
import { slugify } from "@/lib/utils";
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
  const label = typeof body.label === "string" ? body.label.trim() : "";
  if (!label) {
    return NextResponse.json({ error: "label is required" }, { status: 400 });
  }

  const requestedKey = typeof body.key === "string" && body.key.trim() ? slugify(body.key) : slugify(label);
  if (!requestedKey) {
    return NextResponse.json({ error: "Could not derive a valid key from the label" }, { status: 400 });
  }

  const existing = await prisma.adSlot.findUnique({ where: { key: requestedKey } });
  if (existing) {
    return NextResponse.json({ error: `Key "${requestedKey}" is already in use` }, { status: 409 });
  }

  const code = typeof body.code === "string" ? body.code : null;
  const enabled = body.enabled === true;
  const slot = await prisma.adSlot.create({ data: { key: requestedKey, label, code, enabled } });

  return NextResponse.json({ slot }, { status: 201 });
}
