// GET/POST /api/admin/announcements — list and create "what's new" notices. Admin-only.

import { NextResponse } from "next/server";
import { requireAdminEmail } from "@/lib/admin";
import prisma from "@/lib/prisma";

export async function GET() {
  if (!(await requireAdminEmail())) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }
  const announcements = await prisma.announcement.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ announcements });
}

export async function POST(req: Request) {
  if (!(await requireAdminEmail())) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const body = await req.json();
  if (typeof body.title !== "string" || !body.title.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const badge = typeof body.badge === "string" && body.badge.trim() ? body.badge.trim() : "UPDATE";
  const message = typeof body.message === "string" && body.message.trim() ? body.message.trim() : null;
  const linkUrl = typeof body.linkUrl === "string" && body.linkUrl.trim() ? body.linkUrl.trim() : null;
  const linkText = typeof body.linkText === "string" && body.linkText.trim() ? body.linkText.trim() : null;
  const enabled = body.enabled !== false;

  const announcement = await prisma.announcement.create({
    data: { title: body.title.trim(), badge, message, linkUrl, linkText, enabled },
  });

  return NextResponse.json({ announcement }, { status: 201 });
}
