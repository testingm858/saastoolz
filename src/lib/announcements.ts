import prisma from "@/lib/prisma";

export interface ActiveAnnouncement {
  id: string;
  badge: string;
  title: string;
  message: string | null;
  linkUrl: string | null;
  linkText: string | null;
}

// Only the single most recently created enabled row is ever shown — admins
// can keep older announcements around (disabled) as a lightweight history
// instead of deleting them.
export async function getActiveAnnouncement(): Promise<ActiveAnnouncement | null> {
  const row = await prisma.announcement.findFirst({
    where: { enabled: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, badge: true, title: true, message: true, linkUrl: true, linkText: true },
  });
  return row;
}
