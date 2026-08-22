// PATCH/DELETE /api/admin/announcements/[id] — update (incl. enable toggle) and delete a notice. Admin-only.

import { NextResponse } from "next/server";
import { requireAdminEmail } from "@/lib/admin";
import prisma from "@/lib/prisma";

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: Request, { params }: Props) {
  if (!(await requireAdminEmail())) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }
  const { id } = await params;

  const existing = await prisma.announcement.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
  }

  const body = await req.json();
  const data: {
    title?: string; badge?: string; message?: string | null;
    linkUrl?: string | null; linkText?: string | null; enabled?: boolean;
  } = {};

  if (typeof body.title === "string" && body.title.trim()) data.title = body.title.trim();
  if (typeof body.badge === "string" && body.badge.trim()) data.badge = body.badge.trim();
  if (typeof body.message === "string" || body.message === null) data.message = body.message?.trim() || null;
  if (typeof body.linkUrl === "string" || body.linkUrl === null) data.linkUrl = body.linkUrl?.trim() || null;
  if (typeof body.linkText === "string" || body.linkText === null) data.linkText = body.linkText?.trim() || null;
  if (typeof body.enabled === "boolean") data.enabled = body.enabled;

  const announcement = await prisma.announcement.update({ where: { id }, data });
  return NextResponse.json({ announcement });
}

export async function DELETE(_req: Request, { params }: Props) {
  if (!(await requireAdminEmail())) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }
  const { id } = await params;
  await prisma.announcement.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
