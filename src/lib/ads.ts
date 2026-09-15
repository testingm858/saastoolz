import prisma from "@/lib/prisma";
import { adSlotKey, type AdPage, type AdPosition } from "@/lib/adPlacements";

// Batch-fetches the given placements for a page in one query, returning a
// key->code map with disabled/missing slots simply absent (so callers can
// do `codes["tools-top"] ?? null` without extra branching).
//
// Never serves live ad creative outside production — local dev and preview
// deployments would otherwise render/impression the same ads as the live
// site, which risks invalid-traffic flags from accidental self-clicks
// during development.
export async function getAdCodes(page: AdPage, positions: AdPosition[]): Promise<Record<string, string | null>> {
  if (process.env.NODE_ENV !== "production") return {};

  const keys = positions.map((p) => adSlotKey(page, p));
  const slots = await prisma.adSlot.findMany({ where: { key: { in: keys } } });
  const codes: Record<string, string | null> = {};
  for (const slot of slots) {
    codes[slot.key] = slot.enabled ? slot.code : null;
  }
  return codes;
}
